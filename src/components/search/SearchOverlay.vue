<script setup>
/**
 * Overlay de búsqueda en tiempo real — La Mesa de Nora.
 * Se abre desde el header; muestra resultados mientras se escribe (debounced).
 */
import { ref, watch, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import SearchResults from '@/components/search/SearchResults.vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const searchStore = useSearchStore();
const query = ref('');
const inputRef = ref(null);
const DEBOUNCE_MS = 320;
const OVERLAY_PER_PAGE = 8;
let debounceTimer = null;

function close() {
  emit('update:modelValue', false);
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

function runSearch() {
  const q = (query.value ?? '').trim();
  if (q.length >= 2) {
    searchStore.search({
      q,
      page: 1,
      per_page: OVERLAY_PER_PAGE,
      sort: '-name',
    });
  } else {
    searchStore.clear();
  }
}

function onInput(e) {
  query.value = e.target.value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, DEBOUNCE_MS);
}

function goToFullSearch() {
  const q = (query.value ?? '').trim() || searchStore.lastQuery;
  close();
  if (q) router.push({ path: '/busqueda', query: { q } });
  else router.push('/busqueda');
}

// Al abrir: focus input; al cerrar: limpiar timer
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
      nextTick(() => {
        inputRef.value?.focus();
      });
    } else {
      document.body.style.overflow = '';
      clearTimeout(debounceTimer);
    }
  }
);
onUnmounted(() => {
  document.body.style.overflow = '';
  clearTimeout(debounceTimer);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Debajo del header (z-40 para que el header z-50 y sus dropdowns queden por encima) -->
      <div
        v-show="modelValue"
        class="fixed left-0 right-0 bottom-0 top-16 z-40 flex flex-col overflow-hidden border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:top-20 lg:top-32"
        aria-modal="true"
        aria-label="Buscar productos"
        role="dialog"
        @keydown="onKeydown"
      >
        <!-- Barra de búsqueda del overlay -->
        <header class="shrink-0 border-b border-gray-200 bg-gray-50/50">
          <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:h-20 md:px-6">
            <button
              type="button"
              class="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Cerrar búsqueda"
              @click="close"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div class="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2.5 focus-within:border-[#141642] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#141642]/10">
              <span class="flex shrink-0 text-gray-400" aria-hidden="true">
                <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                ref="inputRef"
                type="search"
                :value="query"
                autocomplete="off"
                placeholder="Buscar productos, vajilla, decoración..."
                class="min-w-0 flex-1 bg-transparent py-1 text-gray-900 placeholder-gray-400 focus:outline-none md:text-lg"
                @input="onInput"
              />
            </div>
          </div>
        </header>

        <!-- Contenido: misma anchura que el resto del sitio -->
        <div class="min-h-0 flex-1 overflow-y-auto">
          <div class="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
            <SearchResults
              :results="searchStore.results"
              :total="searchStore.total"
              :loading="searchStore.loading"
              :error="searchStore.error"
              :query="searchStore.lastQuery || query"
              :overlay-mode="true"
              :overlay-per-page="OVERLAY_PER_PAGE"
              @page-change="() => {}"
            />
            <!-- En overlay: enlace "Ver todos" cuando hay resultados -->
            <div
              v-if="!searchStore.loading && !searchStore.error && (searchStore.lastQuery || query) && searchStore.total > 0"
              class="mt-8 flex justify-center border-t border-gray-100 pt-6"
            >
              <button
                type="button"
                class="rounded-xl bg-[#141642] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#141642]/90"
                @click="goToFullSearch"
              >
                Ver todos los {{ searchStore.total }} resultados
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
