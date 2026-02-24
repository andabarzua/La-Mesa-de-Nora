/**
 * Endpoints de categorías MesadeNora.
 * - GET /categories        → listado
 * - GET /categories/{id}   → detalle por id
 */

import api from '../client';

/**
 * Listado de categorías.
 * @param {Object} params - parent_id, tree, etc.
 * @returns {Promise<{ data: Array }>}
 */
export async function listCategories(params = {}) {
  const { data } = await api.get('/categories', { params });
  return data;
}

/**
 * Detalle de categoría por id.
 * @param {number} id
 * @returns {Promise<{ data: Object }>}
 */
export async function getCategory(id) {
  const { data } = await api.get(`/categories/${id}`);
  return data;
}

