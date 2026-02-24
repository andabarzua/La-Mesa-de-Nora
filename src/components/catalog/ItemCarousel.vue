<script setup>
/**
 * Carrusel horizontal con tarjetas y flecha de navegación.
 * Reutilizable para Colecciones, Productos y Servilletas.
 */
import { ref, computed } from 'vue';
import ItemCard from './ItemCard.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
    // Cada item: { id, title, imageUrl, imageAlt?, to? }
  },
  cardWidth: { type: String, default: '280px' },
  gap: { type: String, default: '1.5rem' },
  /** En desktop (lg+): mostrar N columnas en grid (ej. 5 para colecciones). En móvil sigue el carrusel. */
  columnsOnDesktop: { type: Number, default: 0 },
  /** En móvil: mostrar N tarjetas por “slide” (ej. 2 para colecciones). Solo aplica si columnsOnDesktop está definido. */
  columnsOnMobile: { type: Number, default: 0 },
});

const carouselRef = ref(null);

const scrollAmount = computed(() => {
  const card = parseInt(props.cardWidth, 10) || 280;
  const g = parseInt(props.gap, 10) || 24;
  return card + g;
});

function getScrollAmount() {
  if (!carouselRef.value) return scrollAmount.value;
  // En móvil con 2 por slide, avanzar/retroceder por el ancho visible (una “pantalla”)
  if (props.columnsOnDesktop) {
    return carouselRef.value.clientWidth;
  }
  return scrollAmount.value;
}

function scrollPrev() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  }
}

function scrollNext() {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  }
}
</script>

<template>
  <div
    class="w-full"
    :style="
      columnsOnDesktop
        ? {
            '--carousel-card-width': cardWidth,
            '--carousel-gap': gap,
          }
        : {}
    "
  >
    <!-- Layout: [←] [Carousel] [→] — flechas fuera del carrusel -->
    <div
      :class="[
        'flex items-center gap-2',
        columnsOnDesktop ? 'lg:gap-4' : 'gap-2',
      ]"
    >
      <!-- Botón anterior: fuera del carrusel, a la izquierda -->
      <button
        type="button"
        :class="[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50',
          columnsOnDesktop ? 'hidden lg:flex' : 'flex',
        ]"
        aria-label="Anterior"
        @click="scrollPrev"
      >
        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Carrusel (centro) -->
      <div
        ref="carouselRef"
        class="scrollbar-hide flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden scroll-smooth py-2 pb-4"
        :class="[
          columnsOnMobile && columnsOnDesktop ? 'pl-0 pr-0 lg:pl-0 lg:pr-0' : '',
          {
            'carousel-grid-desktop': columnsOnDesktop,
            'carousel-mobile-cols': columnsOnMobile && columnsOnDesktop,
          },
        ]"
        :style="{
          gap: gap,
          WebkitOverflowScrolling: 'touch',
          ...(columnsOnDesktop ? { '--carousel-cols': columnsOnDesktop } : {}),
          ...(columnsOnMobile && columnsOnDesktop ? { '--carousel-mobile-cols': columnsOnMobile } : {}),
        }"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="shrink-0"
          :class="{ 'carousel-grid-card': columnsOnDesktop }"
          :style="!columnsOnDesktop ? { minWidth: cardWidth, maxWidth: cardWidth } : {}"
        >
          <ItemCard
            :title="item.title"
            :image-url="item.imageUrl"
            :image-alt="item.imageAlt"
            :to="item.to"
          />
        </div>
      </div>

      <!-- Botón siguiente: fuera del carrusel, a la derecha -->
      <button
        type="button"
        :class="[
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50',
          columnsOnDesktop ? 'hidden lg:flex' : 'flex',
        ]"
        aria-label="Siguiente"
        @click="scrollNext"
      >
        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Botones debajo: solo en móvil para colecciones (columnsOnDesktop) -->
    <div
      v-if="columnsOnDesktop"
      class="mt-4 flex justify-center gap-4 lg:hidden"
    >
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#254B86]/50"
        aria-label="Anterior"
        @click="scrollPrev"
      >
        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#254B86]/50"
        aria-label="Siguiente"
        @click="scrollNext"
      >
        <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
