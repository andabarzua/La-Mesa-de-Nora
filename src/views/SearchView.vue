<script setup>
/**
 * Vista de búsqueda — La Mesa de Nora.
 * Hero minimalista con buscador centrado, resultados en grid de tarjetas.
 */
import { ref, onMounted, watch } from 'vue';
import { useSearchStore } from '@/stores/search';
import SearchBar from '@/components/search/SearchBar.vue';
import SearchResults from '@/components/search/SearchResults.vue';

const searchStore = useSearchStore();
const query = ref('');
const filters = ref({});

function onSearch(params) {
  searchStore.search({
    q: params.q ?? query.value,
    page: params.page ?? 1,
    per_page: 12,
    sort: params.sort,
    filters: params.filters ?? filters.value,
  });
}

onMounted(() => {
  const q = new URLSearchParams(window.location.search).get('q');
  if (q) {
    query.value = q;
    onSearch({ q });
  }
});

watch(query, (newQ) => {
  if (newQ && newQ.trim().length >= 2) {
    onSearch({ q: newQ.trim() });
  } else if (!newQ || !newQ.trim()) {
    searchStore.clear();
  }
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero de búsqueda: fondo suave, buscador centrado (compacto) -->
    <section class="border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white px-4 py-6 md:py-8 lg:py-10">
      <div class="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 class="text-xl font-semibold tracking-tight text-[#141642] md:text-2xl">
          Buscar productos
        </h1>
        <p class="mt-1 max-w-md text-sm text-gray-500">
          Encuentra vajilla, decoración y todo para tu evento.
        </p>
        <div class="mt-5 w-full md:mt-6">
          <SearchBar
            v-model="query"
            :loading="searchStore.loading"
            @search="() => onSearch({ q: query })"
          />
        </div>
      </div>
    </section>

    <!-- Resultados -->
    <div class="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <SearchResults
        :results="searchStore.results"
        :total="searchStore.total"
        :loading="searchStore.loading"
        :error="searchStore.error"
        :query="searchStore.lastQuery || query"
        @page-change="(page) => onSearch({ page })"
      />
    </div>
  </div>
</template>
