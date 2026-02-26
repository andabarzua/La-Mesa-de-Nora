<script setup>
/**
 * Página de inicio — La Mesa de Nora.
 * Secciones: Hero (banners), COLECCIONES, PRODUCTOS, SERVILLETAS.
 */
import { ref, onMounted, onUnmounted } from 'vue';
import SectionWithCarousel from '@/components/catalog/SectionWithCarousel.vue';
import InspirationHotspots from '@/components/catalog/InspirationHotspots.vue';
import { listProducts } from '@/api/endpoints/products';

// Banners del home (public/img/banners/)
const banners = [
  { id: 1, src: '/img/banners/banner-1.webp', alt: 'Banner 1 - La Mesa de Nora' },
  { id: 2, src: '/img/banners/banner-2.webp', alt: 'Banner 2 - La Mesa de Nora' },
  { id: 3, src: '/img/banners/banner-3.webp', alt: 'Banner 3 - La Mesa de Nora' },
];

const currentBanner = ref(0);
let autoplayTimer = null;
const swipeStartX = ref(null);
const swipePointerId = ref(null);

function goTo(index) {
  currentBanner.value = (index + banners.length) % banners.length;
  resetAutoplay();
}

function prev() {
  goTo(currentBanner.value - 1);
}

function next() {
  goTo(currentBanner.value + 1);
}

function resetAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = setInterval(next, 5000);
}

function onSwipeStart(event) {
  swipePointerId.value = event.pointerId;
  swipeStartX.value = event.clientX;
}

function onSwipeEnd(event) {
  if (swipePointerId.value !== event.pointerId || swipeStartX.value === null) {
    swipeStartX.value = null;
    swipePointerId.value = null;
    return;
  }
  const deltaX = event.clientX - swipeStartX.value;
  if (Math.abs(deltaX) >= 40) {
    if (deltaX > 0) {
      prev();
    } else {
      next();
    }
  }
  swipeStartX.value = null;
  swipePointerId.value = null;
}

function onSwipeCancel() {
  swipeStartX.value = null;
  swipePointerId.value = null;
}

// Productos destacados de cristalería (8 ítems desde API)
const featuredCristaleria = ref([]);
const featuredCristaleriaLoading = ref(false);

async function loadFeaturedCristaleria() {
  featuredCristaleriaLoading.value = true;
  try {
    const response = await listProducts({
      page: 1,
      per_page: 8,
      sort: 'name',
      filters: { category: 10 }, // id_category = 10 → Cristaleria
    });
    featuredCristaleria.value = (response.data ?? []).map((p) => {
      return {
        id: p.id,
        name: p.name,
        price: p.price ?? 0,
        priceRange: p.price_range || null,
        cover: p.cover || '/img/LMDN_Logo.webp',
        slug: p.slug,
      };
    });
  } catch {
    featuredCristaleria.value = [];
  } finally {
    featuredCristaleriaLoading.value = false;
  }
}

// Productos destacados de servilletas (8 ítems desde API)
const featuredServilletas = ref([]);
const featuredServilletasLoading = ref(false);

async function loadFeaturedServilletas() {
  featuredServilletasLoading.value = true;
  try {
    const response = await listProducts({
      page: 1,
      per_page: 8,
      sort: 'name',
      filters: { category: 12 }, // id_category = 12 → Servilletas
    });
    featuredServilletas.value = (response.data ?? []).map((p) => {
      return {
        id: p.id,
        name: p.name,
        price: p.price ?? 0,
        priceRange: p.price_range || null,
        cover: p.cover || '/img/LMDN_Logo.webp',
        slug: p.slug,
      };
    });
  } catch {
    featuredServilletas.value = [];
  } finally {
    featuredServilletasLoading.value = false;
  }
}

onMounted(() => {
  resetAutoplay();
  loadFeaturedCristaleria();
  loadFeaturedServilletas();
});

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer);
});

// Colecciones con imágenes locales (public/img/colecciones/)
const DEFAULT_CAT_IMAGE = '/img/colecciones/decoracion.webp';

const colecciones = [
  { id: 1, title: 'Vajilla', imageUrl: '/img/colecciones/vajillas.webp', imageAlt: 'Vajilla', to: '/colecciones/vajilla' },
  { id: 2, title: 'Servilletas', imageUrl: '/img/colecciones/servilletas.webp', imageAlt: 'Servilletas', to: '/colecciones/servilletas' },
  { id: 3, title: 'Elementos de decoración', imageUrl: '/img/colecciones/decoracion.webp', imageAlt: 'Elementos de decoración', to: '/colecciones/decoracion' },
  { id: 4, title: 'Cubiertos', imageUrl: '/img/colecciones/cubiertos.webp', imageAlt: 'Cubiertos', to: '/colecciones/cubiertos' },
  { id: 5, title: 'Cristalería', imageUrl: '/img/colecciones/cristaleria.webp', imageAlt: 'Cristalería', to: '/colecciones/cristaleria' },
  { id: 6, title: 'Alturas', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Alturas', to: '/colecciones/alturas' },
  { id: 7, title: 'Artículos de cocina', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Artículos de cocina', to: '/colecciones/articulos-de-cocina' },
  { id: 8, title: 'Bar', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Bar', to: '/colecciones/bar' },
  { id: 9, title: 'Floreros', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Floreros', to: '/colecciones/floreros' },
  { id: 10, title: 'Shots', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Shots', to: '/colecciones/shots' },
  { id: 11, title: 'Pocillos', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Pocillos', to: '/colecciones/pocillos' },
  { id: 12, title: 'Madera', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Madera', to: '/colecciones/madera' },
  { id: 13, title: 'Fuente', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Fuente', to: '/colecciones/fuente' },
  { id: 14, title: 'Espejos', imageUrl: DEFAULT_CAT_IMAGE, imageAlt: 'Espejos', to: '/colecciones/espejos' },
];

const productos = [
  {
    id: 1,
    title: 'Juego de platos Chevron',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&h=600&fit=crop',
    imageAlt: 'Platos',
    to: '/product/juego-platos-chevron',
  },
  {
    id: 2,
    title: 'Copas de cristal',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=600&fit=crop',
    imageAlt: 'Copas',
    to: '/product/copas-cristal',
  },
  {
    id: 3,
    title: 'Mantel lino blanco',
    imageUrl: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600&h=600&fit=crop',
    imageAlt: 'Mantel',
    to: '/product/mantel-lino-blanco',
  },
  {
    id: 4,
    title: 'Centro de mesa',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop',
    imageAlt: 'Centro de mesa',
    to: '/product/centro-mesa',
  },
];

const servilletas = [
  {
    id: 1,
    title: 'Servilletas algodón pastel',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    imageAlt: 'Servilletas pastel',
    to: '/servilletas/algodon-pastel',
  },
  {
    id: 2,
    title: 'Servilletas lino natural',
    imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop',
    imageAlt: 'Lino natural',
    to: '/servilletas/lino-natural',
  },
  {
    id: 3,
    title: 'Servilletas bordadas',
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=600&fit=crop',
    imageAlt: 'Bordadas',
    to: '/servilletas/bordadas',
  },
  {
    id: 4,
    title: 'Servilletas estampadas',
    imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=600&fit=crop',
    imageAlt: 'Estampadas',
    to: '/servilletas/estampadas',
  },
];

// Reseñas de clientes (testimonios)
const testimonials = [
  {
    id: 1,
    name: 'Alex A.',
    role: 'Cliente verificado',
    avatar: '/img/reseñas/reseña1.avif',
    text:
      'La Mesa de Nora hizo que nuestra recepción de boda fuera inolvidable. ¡Su vajilla estaba increíble—elegante, moderna y absolutamente perfecta para nuestra temática! ' +
      'El equipo fue muy amable, guiándonos en todo el proceso de renta y asegurándose de que todo llegara a tiempo y en perfectas condiciones. Nuestras invitadas no paraban ' +
      'de elogiar lo bonitas que estaban las mesas. Recomiendo muchísimo a La Mesa de Nora para cualquier evento.',
  },
  {
    id: 2,
    name: 'Emily R.',
    role: 'Cliente verificado',
    avatar: '/img/reseñas/reseña2.avif',
    text:
      'La Mesa de Nora fue clave para que nuestra cena de empresa se viera espectacular. La vajilla y cristalería elevaron todo el ambiente sin perder la calidez que queríamos transmitir. ' +
      'El servicio fue impecable: puntuales, ordenados y muy atentos a cada detalle. Sin duda volveremos a trabajar con ellos para futuros eventos.',
  },
  {
    id: 3,
    name: 'Jack R.',
    role: 'Cliente verificado',
    avatar: '/img/reseñas/reseña3.webp',
    text:
      'La Mesa de Nora fue la mejor elección para nuestro evento corporativo. La vajilla y los elementos de decoración le dieron un toque sofisticado y acogedor al mismo tiempo. ' +
      'El equipo estuvo siempre disponible para resolver dudas y se encargaron de cada detalle con mucho cuidado. Todo llegó impecable y listo para usar.',
  },
];
</script>

<template>
  <div class="bg-white">
    <!-- Hero: carrusel de banners (public/img/banners/) -->
    <section class="relative min-h-[50vh] md:min-h-[70vh] overflow-hidden bg-gray-900">
      <div
        class="relative h-full min-h-[50vh] w-full touch-pan-y md:min-h-[70vh]"
        @pointerdown="onSwipeStart"
        @pointerup="onSwipeEnd"
        @pointercancel="onSwipeCancel"
        @pointerleave="onSwipeCancel"
      >
        <template v-for="(banner, index) in banners" :key="banner.id">
          <div
            v-show="currentBanner === index"
            class="absolute inset-0 transition-opacity duration-500"
            :class="currentBanner === index ? 'z-0 opacity-100' : 'z-0 opacity-0'"
          >
            <img
              :src="banner.src"
              :alt="banner.alt"
              class="h-full w-full object-cover object-center"
            />
          </div>
        </template>
        <!-- Overlay y CTA -->
        <div class="absolute inset-0 z-10 flex items-center justify-start bg-black/20 px-4 md:px-8">
          <div class="max-w-2xl">
            <h1 class="text-3xl font-semibold tracking-tight text-white drop-shadow md:text-4xl lg:text-5xl">
              Eleve cada evento con una vajilla exquisita
            </h1>
            <p class="mt-4 text-lg text-white/90 drop-shadow">
              Eleve cada evento con una vajilla exquisita
            </p>
            <router-link
              to="/colecciones"
              class="mt-6 inline-block rounded-md bg-[#254B86] px-6 py-3 text-white transition-colors hover:bg-[#254B86]/90 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              MÁS INFORMACIÓN
            </router-link>
          </div>
        </div>
        <!-- Flecha anterior -->
        <button
          type="button"
          class="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/50 md:left-4"
          aria-label="Banner anterior"
          @click="prev"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <!-- Flecha siguiente -->
        <button
          type="button"
          class="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/50 md:right-4"
          aria-label="Banner siguiente"
          @click="next"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <!-- Paginación (círculos) -->
        <div class="absolute bottom-4 right-4 z-20 flex gap-2 md:bottom-6 md:right-8">
          <button
            v-for="(_, index) in banners"
            :key="index"
            type="button"
            class="h-2.5 w-2.5 rounded-full transition md:h-3 md:w-3"
            :class="currentBanner === index ? 'bg-white' : 'border-2 border-white bg-transparent'"
            :aria-label="`Ir al banner ${index + 1}`"
            @click="goTo(index)"
          />
        </div>
      </div>
    </section>

    <!-- COLECCIONES -->
    <SectionWithCarousel
      title="Rental"
      :items="colecciones"
      card-width="336px"
      gap="1rem"
      :columns-on-desktop="5"
      :columns-on-mobile="2"
    />

    <!-- Inspiración con hotspots sobre productos -->
    <InspirationHotspots />

    <!-- Cristalería destacada (8 productos, 4 filas x 2 columnas) -->
    <section class="px-4 py-10 md:px-6 md:py-12">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex items-baseline justify-between">
          <h2 class="text-xl font-semibold tracking-tight text-[#141642] md:text-2xl">
            Cristalería
          </h2>
          <router-link
            to="/colecciones/cristaleria"
            class="text-sm font-medium text-[#254B86] hover:underline"
          >
            Ver toda la cristalería
          </router-link>
        </div>

        <div v-if="featuredCristaleriaLoading" class="py-8 text-center text-sm text-gray-500">
          Cargando cristalería...
        </div>
        <div
          v-else
          class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          <router-link
            v-for="item in featuredCristaleria"
            :key="item.id"
            :to="item.slug ? `/product/${item.slug}` : ''"
            class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-md hover:shadow-gray-200/60"
          >
            <div class="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                :src="item.cover"
                :alt="item.name"
                :class="item.cover === '/img/LMDN_Logo.webp' ? 'h-full w-full object-contain opacity-10 grayscale p-8' : 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'"
              />
            </div>
            <div class="flex flex-1 flex-col p-3 md:p-4">
              <p class="text-[11px] font-semibold uppercase tracking-widest text-[#141642]/70">
                Cristalería
              </p>
              <h3 class="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-gray-900 group-hover:text-[#141642]">
                {{ item.name }}
              </h3>
              <p v-if="item.priceRange" class="mt-2 text-sm font-semibold text-[#141642]">
                ${{ item.priceRange.min.toLocaleString('es-CL') }} - ${{ item.priceRange.max.toLocaleString('es-CL') }}
              </p>
              <p v-else class="mt-2 text-sm font-semibold text-[#141642]">
                ${{ item.price.toLocaleString('es-CL') }}
              </p>
            </div>
          </router-link>
        </div>
        <p
          v-if="!featuredCristaleriaLoading && featuredCristaleria.length === 0"
          class="mt-6 text-center text-sm text-gray-500"
        >
          No hay productos de cristalería disponibles por el momento.
        </p>
      </div>
    </section>

    <!-- Servilletas destacadas (8 productos, misma estructura que Cristalería) -->
    <section class="px-4 py-10 md:px-6 md:py-12">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 flex items-baseline justify-between">
          <h2 class="text-xl font-semibold tracking-tight text-[#141642] md:text-2xl">
            Servilletas
          </h2>
          <router-link
            to="/colecciones/servilletas"
            class="text-sm font-medium text-[#254B86] hover:underline"
          >
            Ver todas las servilletas
          </router-link>
        </div>

        <div v-if="featuredServilletasLoading" class="py-8 text-center text-sm text-gray-500">
          Cargando servilletas...
        </div>
        <div
          v-else
          class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          <router-link
            v-for="item in featuredServilletas"
            :key="item.id"
            :to="item.slug ? `/product/${item.slug}` : ''"
            class="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 hover:shadow-md hover:shadow-gray-200/60"
          >
            <div class="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                :src="item.cover"
                :alt="item.name"
                :class="item.cover === '/img/LMDN_Logo.webp' ? 'h-full w-full object-contain opacity-10 grayscale p-8' : 'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'"
              />
            </div>
            <div class="flex flex-1 flex-col p-3 md:p-4">
              <p class="text-[11px] font-semibold uppercase tracking-widest text-[#141642]/70">
                Servilletas
              </p>
              <h3 class="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-gray-900 group-hover:text-[#141642]">
                {{ item.name }}
              </h3>
              <p v-if="item.priceRange" class="mt-2 text-sm font-semibold text-[#141642]">
                ${{ item.priceRange.min.toLocaleString('es-CL') }} - ${{ item.priceRange.max.toLocaleString('es-CL') }}
              </p>
              <p v-else class="mt-2 text-sm font-semibold text-[#141642]">
                ${{ item.price.toLocaleString('es-CL') }}
              </p>
            </div>
          </router-link>
        </div>
        <p
          v-if="!featuredServilletasLoading && featuredServilletas.length === 0"
          class="mt-6 text-center text-sm text-gray-500"
        >
          No hay productos de servilletas disponibles por el momento.
        </p>
      </div>
    </section>

    <!-- Reseñas de clientes -->
    <section class="bg-[#F5F7FB] px-4 py-10 md:px-6 md:py-14">
      <div class="mx-auto max-w-7xl">
        <h2 class="text-center text-xl font-semibold tracking-tight text-[#141642] md:text-2xl">
          Lo que dicen nuestros clientes
        </h2>
        <p class="mt-2 text-center text-sm text-gray-500 md:text-base">
          Experiencias reales de quienes ya confiaron en La Mesa de Nora.
        </p>

        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <article
            v-for="t in testimonials"
            :key="t.id"
            class="flex h-full flex-col rounded-2xl bg-white/95 px-6 py-6 shadow-sm ring-1 ring-gray-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-gray-200/70"
          >
            <div class="flex items-start gap-3">
              <!-- Icono de comillas -->
              <div class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#254B86] text-white shadow-sm">
                <span class="text-lg font-semibold leading-none">“</span>
              </div>
              <div class="flex flex-1 items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="t.avatar"
                    :alt="t.name"
                    class="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <div>
                    <p class="text-sm font-semibold text-[#141642]">{{ t.name }}</p>
                  </div>
                </div>
                <div class="inline-flex items-center gap-1 rounded-full bg-[#254B86]/5 px-2 py-1 text-[11px] font-medium text-[#254B86]">
                  <span class="inline-flex h-2 w-2 rounded-full bg-[#254B86]" />
                  <span>{{ t.role }}</span>
                </div>
              </div>
            </div>
            <p class="mt-4 text-sm leading-relaxed text-gray-600">
              {{ t.text }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Elfsight Instagram Feed -->
    <div class="elfsight-app-a17e91c3-7aae-4593-88d1-8b49baa0e503" data-elfsight-app-lazy></div>

    <!-- Elfsight Pinterest Feed -->
    <div class="elfsight-app-40d2425f-f8b8-40ac-b1c8-b50448664914" data-elfsight-app-lazy></div>
  </div>
</template>
