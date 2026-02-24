import api from '../client';

/**
 * Obtiene los transportistas disponibles para el checkout.
 * @returns {Promise<{ carriers: Array<{ id: number, nombre: string }> }>}
 */
export async function fetchCarriers() {
  const { data } = await api.get('/carriers');
  return data;
}
