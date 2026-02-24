/**
 * Composable de búsqueda MesadeNora.
 * Consume GET /api/v1/search y expone estado y método de búsqueda.
 */

import { ref, computed } from 'vue';
import { search as searchApi } from '@/api/endpoints/search';

export function useSearch() {
  const results = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const meta = ref({ page: 1, per_page: 12 });

  const hasResults = computed(() => results.value.length > 0);

  async function doSearch(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      const response = await searchApi({
        q: params.q ?? '',
        page: params.page ?? 1,
        per_page: params.per_page ?? 12,
        sort: params.sort ?? '-name',
        filters: params.filters ?? {},
      });
      // La API devuelve { data: [...], meta: { total, page, per_page } }
      results.value = response.data ?? [];
      total.value = response.meta?.total ?? 0;
      meta.value = response.meta ?? {};
      return response;
    } catch (e) {
      error.value = e.message || 'Error en la búsqueda';
      results.value = [];
      total.value = 0;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    results,
    total,
    loading,
    error,
    meta,
    hasResults,
    doSearch,
  };
}
