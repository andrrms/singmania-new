import { z } from 'zod';

const DB_NAME = 'singmania-db';
const DB_VERSION = 2;
/** Store for caching song metadata, lyrics and other song-related data. Should work as a local cache for Supabase songs */
const LIBRARY_STORE = 'library';
/** Store for application metadata */
const SCOREBOARD_STORE = 'scoreboards';

export const initDB = (): Promise<IDBDatabase> => {
	if (typeof indexedDB === 'undefined') {
		return Promise.reject(new Error('IndexedDB is not supported in this environment.'));
	}

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.addEventListener('error', (event) => {
			console.error('Erro ao abrir o IndexedDB:', event);
			reject(new Error('Failed to open IndexedDB'));
		});

		request.addEventListener('success', (event) => {
			resolve((event.target as IDBOpenDBRequest).result);
		});

		request.addEventListener('upgradeneeded', (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			const transaction = (event.target as IDBOpenDBRequest).transaction!;

			// LIBRARY STORE
			let libraryStore: IDBObjectStore;
			if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
				// id is the song id from Supabase
				libraryStore = db.createObjectStore(LIBRARY_STORE, { keyPath: 'id', autoIncrement: false });
				libraryStore.createIndex('id', 'id', { unique: true });
				libraryStore.createIndex('title', 'title', { unique: false });
				libraryStore.createIndex('artist', 'artist', { unique: false });
				libraryStore.createIndex('title_artist', ['title', 'artist'], { unique: false });
				libraryStore.createIndex('created_at', 'created_at', { unique: false });
				libraryStore.createIndex('language', 'language', { unique: false });
			} else {
				libraryStore = transaction.objectStore(LIBRARY_STORE);
				// Migration: createdAt -> created_at
				if (libraryStore.indexNames.contains('createdAt')) {
					libraryStore.deleteIndex('createdAt');
					libraryStore.createIndex('created_at', 'created_at', { unique: false });
				}
				// Ensure created_at exists if it wasn't there
				if (!libraryStore.indexNames.contains('created_at')) {
					libraryStore.createIndex('created_at', 'created_at', { unique: false });
				}
			}

			// SCOREBOARD STORE
			let scoreboardStore: IDBObjectStore;
			if (!db.objectStoreNames.contains(SCOREBOARD_STORE)) {
				// id is the scoreboard local id
				// song_id is the song id from Supabase
				scoreboardStore = db.createObjectStore(SCOREBOARD_STORE, { keyPath: 'id', autoIncrement: false });
				scoreboardStore.createIndex('id', 'id', { unique: true });
				scoreboardStore.createIndex('song_id', 'song_id', { unique: false });
				scoreboardStore.createIndex('created_at', 'created_at', { unique: false });
			} else {
				scoreboardStore = transaction.objectStore(SCOREBOARD_STORE);
				// Migration: songId -> song_id
				if (scoreboardStore.indexNames.contains('songId')) {
					scoreboardStore.deleteIndex('songId');
					scoreboardStore.createIndex('song_id', 'song_id', { unique: false });
				}
				// Migration: createdAt -> created_at
				if (scoreboardStore.indexNames.contains('createdAt')) {
					scoreboardStore.deleteIndex('createdAt');
					scoreboardStore.createIndex('created_at', 'created_at', { unique: false });
				}
			}
		});
	});
};

export const saveLibraryItem = async (item: SongRow): Promise<void> => {
	const validatedItem = SongSchema.parse(item);

	const db = await initDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(LIBRARY_STORE, 'readwrite');
		const store = transaction.objectStore(LIBRARY_STORE);

		const request = store.put(validatedItem);

		request.addEventListener('success', () => resolve());
		request.addEventListener('error', () => {
			reject(new Error('Failed to save library item to IndexedDB'));
		});
	});
};

export const getCachedLibraryItem = async (id: string): Promise<{ song: z.infer<typeof SongSchema> } | null> => {
	const db = await initDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(LIBRARY_STORE, 'readonly');
		const libraryStore = transaction.objectStore(LIBRARY_STORE);

		const request = libraryStore.get(id);

		request.addEventListener('success', (event) => {
			const result = (event.target as IDBRequest<z.infer<typeof SongSchema>>).result;
			if (result) {
				const validation = SongSchema.safeParse(result);
				if (!validation.success) {
					console.error('Cached library item failed validation:', validation.error);
					return resolve(null);
				}

				resolve({ song: validation.data });
			} else {
				resolve(null);
			}
		});

		request.addEventListener('error', () => {
			reject(new Error('Failed to retrieve library item from IndexedDB'));
		});
	});
};

export const searchCachedSongs = async (options: SongFilterOptions): Promise<{ data: SongSummary[], total: number }> => {
	const db = await initDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(LIBRARY_STORE, 'readonly');
		const store = transaction.objectStore(LIBRARY_STORE);
		const request = store.getAll();

		request.addEventListener('success', (event) => {
			const allSongs = (event.target as IDBRequest<SongRow[]>).result;
			
			// 1. Filtragem
			let filtered = allSongs.filter(song => {
				// Search (Title or Artist)
				if (options.search) {
					const searchLower = options.search.toLowerCase();
					const matchesTitle = song.title.toLowerCase().includes(searchLower);
					const matchesArtist = song.artist.toLowerCase().includes(searchLower);
					if (!matchesTitle && !matchesArtist) return false;
				}

				// Type
				if (options.type && options.type !== 'all') {
					// Implementar lógica de tipo se houver campo correspondente
					// Exemplo: if (options.type === 'duet' && !song.is_duet) return false;
				}

				// Language
				if (options.language && options.language !== 'all') {
					if (song.language !== options.language) return false;
				}

				return true;
			});

			// 2. Ordenação
			filtered.sort((a, b) => {
				let fieldA: string | number | null = '';
				let fieldB: string | number | null = '';

				const sortOption = options.sort || 'title';

				switch (sortOption) {
					case 'date':
						fieldA = a.created_at;
						fieldB = b.created_at;
						break;
					case 'artist':
						fieldA = a.artist;
						fieldB = b.artist;
						break;
					case 'title':
						fieldA = a.title;
						fieldB = b.title;
						break;
					default:
						// Fallback for duration or other fields not present in SongRow
						fieldA = a.title;
						fieldB = b.title;
				}
				
				if (fieldA === null) fieldA = '';
				if (fieldB === null) fieldB = '';

				if (fieldA < fieldB) return options.order === 'desc' ? 1 : -1;
				if (fieldA > fieldB) return options.order === 'desc' ? -1 : 1;
				return 0;
			});

			const total = filtered.length;

			// 3. Paginação
			const start = (options.page - 1) * options.limit;
			const end = start + options.limit;
			const paginated = filtered.slice(start, end);

			// 4. Remover conteúdo (lyrics) para economizar memória
			const summaries: SongSummary[] = paginated.map(({ content, ...rest }) => rest);

			resolve({ data: summaries, total });
		});

		request.addEventListener('error', () => {
			reject(new Error('Failed to search cached songs'));
		});
	});
};

