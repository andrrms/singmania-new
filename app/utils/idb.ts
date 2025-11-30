const DB_NAME = 'singmania-db';
const DB_VERSION = 1;
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

			if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
				// id is the  song id from Supabase
				const store = db.createObjectStore(LIBRARY_STORE, { keyPath: 'id', autoIncrement: false });
				store.createIndex('id', 'id', { unique: true });
				store.createIndex('title', 'title', { unique: false });
				store.createIndex('artist', 'artist', { unique: false });
				store.createIndex('title_artist', ['title', 'artist'], { unique: false });
				store.createIndex('createdAt', 'createdAt', { unique: false });
				store.createIndex('language', 'language', { unique: false });
			}

			if (!db.objectStoreNames.contains(SCOREBOARD_STORE)) {
				// id is the scoreboard local id
				// songId is the song id from Supabase
				const store = db.createObjectStore(SCOREBOARD_STORE, { keyPath: 'id', autoIncrement: false });
				store.createIndex('id', 'id', { unique: true });
				store.createIndex('songId', 'songId', { unique: false });
				store.createIndex('createdAt', 'createdAt', { unique: false });
			}
		});
	});
};

export const getCachedLibraryItem = async (id: string): Promise<{ song: SongItem } | null> => {
	const db = await initDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(LIBRARY_STORE, 'readonly');
		const libraryStore = transaction.objectStore(LIBRARY_STORE);

		const request = libraryStore.get(id);

		request.addEventListener('success', (event) => {
			const result = (event.target as IDBRequest<SongItem>).result;
			if (result) {
				resolve({
					song: result,
				});
			} else {
				resolve(null);
			}
		});

		request.addEventListener('error', () => {
			reject(new Error('Failed to retrieve library item from IndexedDB'));
		});
	});
};
