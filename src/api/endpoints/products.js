/**
 * Endpoints de productos MesadeNora.
 * - GET /products          → listado (page, per_page, q, sort, filters[category])
 * - GET /products/{slug}   → detalle por slug
 */

import api from '../client';

/**
 * Listado de productos.
 * @param {Object} params - q, page, per_page, sort, filters (objeto)
 * @returns {Promise<{ data: Array, total: number, page: number, per_page: number }>}
 */
export async function listProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data;
}

/**
 * Detalle de producto por slug.
 * @param {string} slug
 * @returns {Promise<{ data: Object }>}
 */
export async function getProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data;
}

