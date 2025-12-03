import { z } from "zod";
import type { Tables } from "../types/database.types";
import type { SongRow } from "../types/songs";

export const SongSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	artist: z.string(),
	content: z.string(),
	cover: z.string().nullable(),
	filename: z.string(),
	is_duet: z.boolean().nullable(),
	language: z.string().nullable(),
	youtube_id: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
}) satisfies z.ZodType<SongRow>;