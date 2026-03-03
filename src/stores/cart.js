/**
 * Store Pinia para el carrito — La Mesa de Nora.
 * Sincronizado con carrito de PrestaShop vía API headless.
 * El subtotal se calcula como: precio_unitario × cantidad × días de arriendo.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from '@/api/endpoints/cart';

const IVA_RATE = 0.19;
const GARANTIA_RATE = 0.30;

/** Calcula la cantidad de días entre dos fechas YYYY-MM-DD (inclusivo en ambos extremos). */
function calcRentalDays(startStr, endStr) {
  if (!startStr || !endStr) return 1;
  const start = new Date(startStr + 'T12:00:00');
  const end = new Date(endStr + 'T12:00:00');
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff >= 1 ? diff + 1 : 1; // inclusivo: 10→12 = 3 días
}

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const token = ref(null);
  const loading = ref(false);
  const error = ref('');

  // ── Fechas de reserva reactivas ──────────────────────────────────────────
  // Se inicializan desde localStorage al crear el store (primera carga).
  const reservationStart = ref(
    typeof localStorage !== 'undefined' ? (localStorage.getItem('lmdn_reservation_start') ?? '') : '',
  );
  const reservationEnd = ref(
    typeof localStorage !== 'undefined' ? (localStorage.getItem('lmdn_reservation_end') ?? '') : '',
  );

  /**
   * Actualiza las fechas de reserva: persiste en localStorage Y dispara
   * la reactividad del store (rentalDays, subtotal, total se recalculan).
   */
  function setReservationDates(start, end) {
    reservationStart.value = start ?? '';
    reservationEnd.value = end ?? '';
    if (typeof localStorage !== 'undefined') {
      if (start) localStorage.setItem('lmdn_reservation_start', start);
      else localStorage.removeItem('lmdn_reservation_start');
      if (end) localStorage.setItem('lmdn_reservation_end', end);
      else localStorage.removeItem('lmdn_reservation_end');
    }
  }

  /** Días de arriendo — reactivos a reservationStart/End. */
  const rentalDays = computed(() =>
    calcRentalDays(reservationStart.value, reservationEnd.value),
  );

  /** Subtotal = precio_unitario × cantidad × días de arriendo */
  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) * rentalDays.value,
  );

  const iva = computed(() => Math.round(subtotal.value * IVA_RATE));
  const garantia = computed(() => Math.round(subtotal.value * GARANTIA_RATE));
  const total = computed(() => subtotal.value + iva.value + garantia.value);

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  function setFromApi(cart) {
    token.value = cart?.token ?? null;
    items.value = Array.isArray(cart?.items) ? cart.items : [];
  }

  async function loadCart() {
    loading.value = true;
    error.value = '';
    try {
      const cart = await fetchCart();
      setFromApi(cart);
    } catch (e) {
      error.value = 'No se pudo cargar el carrito.';
    } finally {
      loading.value = false;
    }
  }

  async function addProduct({ productId, quantity = 1, combinationId }) {
    loading.value = true;
    error.value = '';
    try {
      const cart = await addItemToCart({ productId, quantity, combinationId });
      setFromApi(cart);
    } catch (e) {
      error.value = 'No se pudo agregar el producto al carrito.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(productId, quantity, combinationId) {
    loading.value = true;
    error.value = '';
    try {
      const cart = await updateCartItem({ productId, quantity, combinationId });
      setFromApi(cart);
    } catch (e) {
      error.value = 'No se pudo actualizar la cantidad.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function removeProduct(productId, combinationId) {
    loading.value = true;
    error.value = '';
    try {
      const cart = await removeCartItem(productId, combinationId);
      setFromApi(cart);
    } catch (e) {
      error.value = 'No se pudo eliminar el producto del carrito.';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function clearLocal() {
    items.value = [];
    token.value = null;
  }

  const sidebarOpen = ref(false);
  function openSidebar() { sidebarOpen.value = true; }
  function closeSidebar() { sidebarOpen.value = false; }

  return {
    items,
    token,
    loading,
    error,
    reservationStart,
    reservationEnd,
    rentalDays,
    subtotal,
    iva,
    garantia,
    total,
    count,
    setReservationDates,
    loadCart,
    addProduct,
    updateQuantity,
    removeProduct,
    clearLocal,
    clear: clearLocal,
    sidebarOpen,
    openSidebar,
    closeSidebar,
  };
});
