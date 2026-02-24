/**
 * API de disponibilidad de fechas para arriendos.
 */
import api from '../client';
import { getStoredCartToken } from './cart';

function withCartToken(config = {}) {
  const token = getStoredCartToken();
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...(token ? { 'X-Cart-Token': token } : {}),
    },
  };
}

/**
 * Obtiene las fechas bloqueadas para un producto.
 * @param {number} productId - ID del producto
 * @param {number|null} combinationId - ID de combinación (opcional)
 * @returns {Promise<{ blocked_dates: string[] }>}
 */
export async function fetchProductBlockedDates(productId, combinationId = null) {
  const params = {};
  if (combinationId != null && combinationId > 0) {
    params.combination_id = combinationId;
  }
  const { data } = await api.get(
    `/products/blocked-dates/${productId}`,
    { params },
  );
  return data;
}

/**
 * Obtiene las fechas bloqueadas para todos los productos del carrito.
 * @returns {Promise<{ blocked_dates: string[] }>}
 */
export async function fetchCartBlockedDates() {
  const { data } = await api.get('/cart/blocked-dates', withCartToken());
  return data;
}
