/**
 * Store Pinia para el carrito — La Mesa de Nora.
 * Sincronizado con carrito de PrestaShop vía API headless.
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

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const token = ref(null);
  const loading = ref(false);
  const error = ref('');

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
  );

  const iva = computed(() => Math.round(subtotal.value * IVA_RATE));

  const total = computed(() => subtotal.value + iva.value);

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

  function openSidebar() {
    sidebarOpen.value = true;
  }

  function closeSidebar() {
    sidebarOpen.value = false;
  }

  return {
    items,
    token,
    loading,
    error,
    subtotal,
    iva,
    total,
    count,
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

