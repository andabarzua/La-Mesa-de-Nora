<script setup>
/**
 * Resultados de búsqueda — La Mesa de Nora.
 * Grid de tarjetas con ProductGridCard. Estados vacío y carga.
 */
import { RouterLink } from 'vue-router';
import ProductGridCard from '@/components/catalog/ProductGridCard.vue';

const props = defineProps({
  results: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
  query: { type: String, default: '' },
  overlayMode: { type: Boolean, default: false },
  overlayPerPage: { type: Number, default: 8 },
});

defineEmits(['page-change']);

// Normalizar ítem de API (image_url, name, price, category, slug) a props de tarjeta
function toCardItem(item) {
  return {
    imageUrl: item.image_url ?? item.imageUrl ?? item.cover ?? '',
    title: item.name ?? item.title ?? '',
    price: item.price ?? 0,
    category: item.category ?? item.category_name ?? '',
    to: item.to ?? (item.slug ? `/product/${item.slug}` : '#'),
  };
}
</script>

<template>
  <div class="mt-10 md:mt-14">
    <!-- Cargando: skeletons -->
    <template v-if="loading">
      <div
        class="grid gap-4 sm:gap-5 md:gap-5 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
        >
          <div class="aspect-square w-full animate-pulse bg-gray-100" />
          <div class="space-y-2 p-4">
            <div class="h-2.5 w-16 animate-pulse rounded bg-gray-100" />
            <div class="h-4 w-full max-w-[85%] animate-pulse rounded bg-gray-100" />
            <div class="h-4 w-20 animate-pulse rounded bg-gray-100 pt-3" />
          </div>
        </div>
      </div>
    </template>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-red-100 bg-red-50/50 px-6 py-8 text-center"
    >
      <p class="text-red-700">{{ error }}</p>
      <p class="mt-2 text-sm text-red-600">Prueba de nuevo en un momento.</p>
    </div>

    <!-- Sin búsqueda aún: mensaje amable -->
    <div
      v-else-if="!query"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-16 text-center"
    >
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-[#141642]/10 text-[#141642]">
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <p class="mt-4 text-lg font-medium text-gray-700">¿Qué te gustaría encontrar?</p>
      <p class="mt-1 max-w-sm text-sm text-gray-500">
        Escribe en el buscador para ver productos, vajilla, decoración y más.
      </p>
    </div>

    <!-- Sin resultados -->
    <div
      v-else-if="total === 0"
      class="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50 px-6 py-16 text-center"
    >
      <span class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-gray-500">
        <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </span>
      <p class="mt-4 text-lg font-medium text-gray-700">No encontramos resultados</p>
      <p class="mt-1 max-w-sm text-sm text-gray-500">
        Para «{{ query }}» no hay coincidencias. Prueba con otras palabras o explora las colecciones.
      </p>
      <RouterLink
        to="/colecciones/vajilla"
        class="mt-6 inline-block rounded-lg bg-[#141642] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#141642]/90"
      >
        Ver colecciones
      </RouterLink>
    </div>

    <!-- Resultados -->
    <template v-else>
      <p v-if="!overlayMode" class="mb-6 text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ total }}</span>
        {{ total === 1 ? 'resultado' : 'resultados' }}
      </p>
      <ul
        class="grid gap-4 sm:gap-5 md:gap-5"
        :class="overlayMode ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4'"
      >
        <li v-for="(item, index) in results" :key="item.id ?? index">
          <ProductGridCard
            :title="toCardItem(item).title"
            :category="toCardItem(item).category"
            :price="Number(toCardItem(item).price)"
            :image-url="toCardItem(item).imageUrl"
            :image-alt="toCardItem(item).title"
            :to="toCardItem(item).to"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
