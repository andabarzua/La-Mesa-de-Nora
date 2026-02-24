<script setup>
/**
 * Vista de todas las colecciones — La Mesa de Nora.
 * Lista todas las categorías de la tienda con diseño minimalista.
 * Consume la API de categorías; fallback a lista local si falla.
 */
import { ref, computed, onMounted } from 'vue';
import { listCategories } from '@/api/endpoints/categories';

const DEFAULT_CAT_IMAGE = '/img/colecciones/decoracion.webp';

// Mapa slug → imagen local (public/img/colecciones/)
const SLUG_TO_IMAGE = {
  vajilla: '/img/colecciones/vajillas.webp',
  vajillas: '/img/colecciones/vajillas.webp',
  servilletas: '/img/colecciones/servilletas.webp',
  decoracion: '/img/colecciones/decoracion.webp',
  'elementos-de-decoracion': '/img/colecciones/decoracion.webp',
  cubiertos: '/img/colecciones/cubiertos.webp',
  cristaleria: '/img/colecciones/cristaleria.webp',
  alturas: DEFAULT_CAT_IMAGE,
  'articulos-de-cocina': DEFAULT_CAT_IMAGE,
  bar: DEFAULT_CAT_IMAGE,
  floreros: DEFAULT_CAT_IMAGE,
  shots: DEFAULT_CAT_IMAGE,
  pocillos: DEFAULT_CAT_IMAGE,
  madera: DEFAULT_CAT_IMAGE,
  fuente: DEFAULT_CAT_IMAGE,
  espejos: DEFAULT_CAT_IMAGE,
};

// Fallback si la API no responde
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Vajilla', slug: 'vajilla' },
  { id: 2, name: 'Servilletas', slug: 'servilletas' },
  { id: 3, name: 'Elementos de decoración', slug: 'decoracion' },
  { id: 4, name: 'Cubiertos', slug: 'cubiertos' },
  { id: 5, name: 'Cristalería', slug: 'cristaleria' },
];

const rawCategories = ref([]);
const loading = ref(true);

const categories = computed(() => {
  const list = rawCategories.value.length ? rawCategories.value : FALLBACK_CATEGORIES;
  return list.map((c) => {
    const slug = (c.slug || '').toLowerCase();
    const imageUrl = SLUG_TO_IMAGE[slug] || DEFAULT_CAT_IMAGE;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      imageUrl,
      to: `/colecciones/${c.slug}`,
    };
  });
});

async function loadCategories() {
  loading.value = true;
  try {
    // Obtener categorías hijas de Home (parent_id=2 en PrestaShop estándar)
    let response = await listCategories({ parent_id: 2 });
    let data = response?.data ?? [];
    if (!Array.isArray(data) || data.length === 0) {
      // Fallback: obtener todas y filtrar (para estructuras PrestaShop distintas)
      response = await listCategories();
      data = response?.data ?? [];
    }
    rawCategories.value = Array.isArray(data) ? data : [];
    rawCategories.value = rawCategories.value.filter(
      (c) => c.slug && c.id !== 2 && !['home', 'inicio'].includes((c.slug || '').toLowerCase()),
    );
  } catch {
    rawCategories.value = [];
  } finally {
    loading.value = false;
  }
}

function setPageTitle() {
  document.title = 'Colecciones | La Mesa de Nora';
}

onMounted(() => {
  setPageTitle();
  loadCategories();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero minimalista -->
    <section class="border-b border-gray-100 bg-gray-50/50 py-12 md:py-16">
      <div class="mx-auto max-w-7xl px-4 md:px-6">
        <h1 class="text-2xl font-semibold tracking-tight text-[#141642] md:text-3xl lg:text-4xl">
          Colecciones
        </h1>
        <p class="mt-2 text-sm text-gray-500 md:text-base">
          Explora nuestras categorías y encuentra lo que necesitas para tu evento.
        </p>
      </div>
    </section>

    <!-- Grid de categorías -->
    <section class="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <div
        v-if="loading"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 animate-pulse"
        />
      </div>

      <div
        v-else
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <RouterLink
          v-for="cat in categories"
          :key="cat.id"
          :to="cat.to"
          class="group relative block overflow-hidden rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2"
        >
          <div class="aspect-[4/5] w-full overflow-hidden">
            <img
              :src="cat.imageUrl"
              :alt="cat.name"
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </div>
          <div
            class="absolute inset-x-0 bottom-0 flex items-end p-5 text-white"
          >
            <span
              class="text-lg font-semibold tracking-wide drop-shadow md:text-xl"
            >
              {{ cat.name }}
            </span>
          </div>
          <div
            class="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
            aria-hidden="true"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </RouterLink>
      </div>

      <p
        v-if="!loading && categories.length === 0"
        class="py-16 text-center text-gray-500"
      >
        No hay colecciones disponibles en este momento.
      </p>
    </section>
  </div>
</template>
