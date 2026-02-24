/**
 * Endpoint de búsqueda MesadeNora.
 * GET /api/v1/search?q=...&page=1&per_page=12&sort=-price&filters[category]=5
 */

import api from '../client';

/**
 * @param {Object} params - q, page, per_page, sort, filters (objeto)
 * @returns {Promise<{ data: Array, meta: { total, page, per_page } }>}
 */
export async function search(params = {}) {
  const { data } = await api.get('/search', { params });
  return data;
}
