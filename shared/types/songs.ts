import type { Database } from "./database.types";

export type Languages = 'all' | 'english' | 'portuguese' | 'brazilian-portuguese' | 'spanish' | 'french' | 'german';
export type SongSortOption = 'date' | 'artist' | 'duration' | 'title';
export type SongOrderOption = 'asc' | 'desc';
export type SongTypeFilter = 'all' | 'duet' | 'local' | 'youtube';

export interface SongFilterOptions {
	page: number;
	limit: number;
	search?: string;
	sort?: SongSortOption;
	order?: SongOrderOption;
	type?: SongTypeFilter;
	language?: Languages;
}

export type SongItem = Database['public']['Tables']['songs']['Row'];
