function parsePagination(req, defaults = { page: 1, limit: 20, sort: 'timestamp', order: 'DESC' }) {
  const { page, limit, sort, order } = req.query;
  return {
    page: Number(page) > 0 ? Number(page) : defaults.page,
    limit: Number(limit) > 0 && Number(limit) <= 100 ? Number(limit) : defaults.limit,
    sort: typeof sort === 'string' && sort ? sort : defaults.sort,
    order: typeof order === 'string' && order ? order : defaults.order,
  };
}

module.exports = { parsePagination };