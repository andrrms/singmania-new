export default defineEventHandler(async (event) => {
	const query = getQuery(event) as SongFilterOptions;
	const page = Number(query.page) || 1;
	const limit = Number(query.limit) || 25;
	const search = (query.search || '').toLocaleLowerCase();
	const sort = query.sort || 'title';
	const order = query.order === 'desc' ? 'desc' : 'asc';
	const type = query.type || 'all';
	const language = query.language || 'all';

	const { data, total } = await getSongs({
		page,
		limit,
		search,
		sort,
		order,
		type,
		language,
	});

	return {
		data,
		meta: {
			page,
			limit,
			total,
			totalPages: limit === -1 ? 1 : Math.ceil(total / limit),
		}
	}
});
