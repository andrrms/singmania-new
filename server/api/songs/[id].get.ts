export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id') as string;

	if (!id) throw createError({
		statusCode: 400,
		statusMessage: 'Song id is required',
	});

	const content = await getSongContent(id);
	if (!content) throw createError({
		statusCode: 404,
		statusMessage: 'Song not found',
	});

	return content;
});
