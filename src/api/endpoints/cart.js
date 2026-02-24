import api from '../client';

const CART_TOKEN_KEY = 'lmdn_cart_token';

export function getStoredCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY) || null;
}

export function setStoredCartToken(token) {
  if (token) {
    localStorage.setItem(CART_TOKEN_KEY, token);
  }
}

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

export async function fetchCart() {
  const { data } = await api.get('/cart', withCartToken());
  if (data?.token) {
    setStoredCartToken(data.token);
  }
  return data;
}

export async function addItemToCart({ productId, quantity, combinationId }) {
  const body = { product_id: productId, quantity };
  if (combinationId != null && combinationId > 0) {
    body.combination_id = combinationId;
  }
  const { data } = await api.post(
    '/cart/items',
    body,
    withCartToken(),
  );
  if (data?.token) {
    setStoredCartToken(data.token);
  }
  return data;
}

export async function updateCartItem({ productId, quantity, combinationId }) {
  const body = { quantity };
  if (combinationId != null && combinationId > 0) {
    body.combination_id = combinationId;
  }
  const { data } = await api.put(
    `/cart/items/${productId}`,
    body,
    withCartToken(),
  );
  if (data?.token) {
    setStoredCartToken(data.token);
  }
  return data;
}

export async function removeCartItem(productId, combinationId) {
  const url =
    combinationId != null && combinationId > 0
      ? `/cart/items/${productId}?combination_id=${combinationId}`
      : `/cart/items/${productId}`;
  const { data } = await api.delete(url, withCartToken());
  if (data?.token) {
    setStoredCartToken(data.token);
  }
  return data;
}

/**
 * Confirmar pedido: convierte el carrito en orden en PrestaShop.
 * @param {object} formData - { nombre, email, telefono, direccion, comuna?, comentarios?, tipo_documento?, factura?, fechas_reserva? }
 * @returns {Promise<{ success: boolean, order_id?: number, reference?: string, message?: string }>}
 */
export async function checkout(formData) {
  const body = {
    cart_token: getStoredCartToken(),
    nombre: formData.nombre,
    email: formData.email,
    telefono: formData.telefono,
    direccion: formData.direccion,
    comuna: formData.comuna ?? '',
    comentarios: formData.comentarios ?? '',
    tipo_documento: formData.tipo_documento ?? 'boleta',
  };
  if (formData.metodo_pago) {
    body.metodo_pago = formData.metodo_pago;
  }
  if (formData.fechas_reserva?.inicio && formData.fechas_reserva?.fin) {
    body.fechas_reserva = {
      inicio: formData.fechas_reserva.inicio,
      fin: formData.fechas_reserva.fin,
    };
  }
  if (formData.factura) {
    body.rut = formData.factura.rut;
    body.razon_social = formData.factura.razon_social;
    body.giro = formData.factura.giro;
    body.direccion_tributaria = formData.factura.direccion_tributaria;
  }
  const { data } = await api.post('/checkout', body, withCartToken());
  return data;
}

