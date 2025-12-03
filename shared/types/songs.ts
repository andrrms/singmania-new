import type { Tables } from "./database.types";

export type Languages = 'all' | 'English' | 'Portuguese (Brazil)';
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

export type SongRow = Tables<"songs">;

export type SongSummary = Omit<SongRow, 'content'>;

export type APISongsListResponse = {
	data: SongRow[];
	meta: {
		total: number;
	};
};
