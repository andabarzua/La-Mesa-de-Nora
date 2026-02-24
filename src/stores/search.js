/**
 * Store Pinia para búsqueda MesadeNora.
 * Mantiene estado global de búsqueda y llama al endpoint /api/v1/search.
 * Si la API falla, usa productos de prueba para ver el diseño.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { search as searchApi } from '@/api/endpoints/search';

// Productos de prueba para ver el diseño cuando no hay API o falla
const MOCK_PRODUCTS = [
  { id: 1, name: 'Juego de vajilla Chevron dorado', category: 'Vajilla', price: 45000, image_url: '/img/colecciones/vajillas.webp', slug: 'juego-vajilla-chevron' },
  { id: 2, name: 'Platos azul y blanco', category: 'Vajilla', price: 32000, image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop', slug: 'platos-azul-blanco' },
  { id: 3, name: 'Platos negros borde dorado', category: 'Vajilla', price: 38000, image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=600&fit=crop', slug: 'platos-negros-dorado' },
  { id: 4, name: 'Copas de cristal', category: 'Cristalería', price: 18000, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=600&fit=crop', slug: 'copas-cristal' },
  { id: 5, name: 'Servilletas algodón pastel', category: 'Servilletas', price: 12000, image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', slug: 'servilletas-algodon-pastel' },
  { id: 6, name: 'Centro de mesa floral', category: 'Decoración', price: 22000, image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop', slug: 'centro-mesa-floral' },
  { id: 7, name: 'Mantel lino blanco', category: 'Vajilla', price: 15000, image_url: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600&h=600&fit=crop', slug: 'mantel-lino-blanco' },
  { id: 8, name: 'Cubiertos plata', category: 'Cubiertos', price: 25000, image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop', slug: 'cubiertos-plata' },
];

export const useSearchStore = defineStore('search', () => {
  const results = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const lastQuery = ref('');
  const meta = ref({ page: 1, per_page: 12 });

  const hasResults = computed(() => results.value.length > 0);

  async function search(params = {}) {
    loading.value = true;
    error.value = null;
    lastQuery.value = params.q ?? '';
    const q = (params.q ?? '').trim();
    try {
      const response = await searchApi({
        q: params.q ?? '',
        page: params.page ?? 1,
        per_page: params.per_page ?? 12,
        sort: params.sort ?? '-name',
        filters: params.filters ?? {},
      });
      // La API Laravel devuelve: { products, total, page, per_page }
      results.value = response.products ?? [];
      total.value = response.total ?? 0;
      meta.value = {
        page: response.page ?? params.page ?? 1,
        per_page: response.per_page ?? params.per_page ?? 12,
        total: response.total ?? 0,
      };
      return { data: results.value, meta: meta.value };
    } catch (e) {
      // Sin API o error: mostrar productos de prueba para ver el diseño
      if (q) {
        results.value = [...MOCK_PRODUCTS];
        total.value = MOCK_PRODUCTS.length;
        meta.value = { page: 1, per_page: 12, total: MOCK_PRODUCTS.length };
      } else {
        results.value = [];
        total.value = 0;
      }
      error.value = null;
      return { data: results.value, meta: meta.value };
    } finally {
      loading.value = false;
    }
  }

  function clear() {
    results.value = [];
    total.value = 0;
    lastQuery.value = '';
    error.value = null;
  }

  return {
    results,
    total,
    loading,
    error,
    lastQuery,
    meta,
    hasResults,
    search,
    clear,
  };
});
