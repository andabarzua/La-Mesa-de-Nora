<script setup>
/**
 * Vista de categoría/colección — La Mesa de Nora.
 * Consume la API MesadeNora para listar productos por categoría
 * usando el SLUG de la categoría (link_rewrite de PrestaShop).
 */
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ProductGridCard from '@/components/catalog/ProductGridCard.vue';
import CategoryFiltersSidebar from '@/components/catalog/CategoryFiltersSidebar.vue';
import { listProducts } from '@/api/endpoints/products';

const route = useRoute();

// Imagen por defecto para categorías sin asset propio
const DEFAULT_CATEGORY_IMAGE = '/img/colecciones/decoracion.webp';

// Slugs de frontend y assets del hero (vista)
const categories = [
  { slug: 'vajilla', title: 'Vajilla', imageUrl: '/img/colecciones/vajillas.webp', to: '/colecciones/vajilla' },
  { slug: 'servilletas', title: 'Servilletas', imageUrl: '/img/colecciones/servilletas.webp', to: '/colecciones/servilletas' },
  { slug: 'decoracion', title: 'Elementos de decoración', imageUrl: '/img/colecciones/decoracion.webp', to: '/colecciones/decoracion' },
  { slug: 'elementos-de-decoracion', title: 'Elementos de decoración', imageUrl: '/img/colecciones/decoracion.webp', to: '/colecciones/elementos-de-decoracion' },
  { slug: 'cubiertos', title: 'Cubiertos', imageUrl: '/img/colecciones/cubiertos.webp', to: '/colecciones/cubiertos' },
  { slug: 'cristaleria', title: 'Cristalería', imageUrl: '/img/colecciones/cristaleria.webp', to: '/colecciones/cristaleria' },
  { slug: 'alturas', title: 'Alturas', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/alturas' },
  { slug: 'articulos-de-cocina', title: 'Artículos de cocina', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/articulos-de-cocina' },
  { slug: 'bar', title: 'Bar', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/bar' },
  { slug: 'floreros', title: 'Floreros', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/floreros' },
  { slug: 'shots', title: 'Shots', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/shots' },
  { slug: 'pocillos', title: 'Pocillos', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/pocillos' },
  { slug: 'madera', title: 'Madera', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/madera' },
  { slug: 'fuente', title: 'Fuente', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/fuente' },
  { slug: 'espejos', title: 'Espejos', imageUrl: DEFAULT_CATEGORY_IMAGE, to: '/colecciones/espejos' },
];

// Mapa slug (link_rewrite PrestaShop) → id_category
const CATEGORY_FILTERS = {
  vajilla: { categoryId: 17 },
  servilletas: { categoryId: 12 },
  decoracion: { categoryId: 11 },
  'elementos-de-decoracion': { categoryId: 11 },
  cubiertos: { categoryId: 18 },
  cristaleria: { categoryId: 10 },
  alturas: { categoryId: 13 },
  'articulos-de-cocina': { categoryId: 14 },
  bar: { categoryId: 15 },
  floreros: { categoryId: 16 },
  shots: { categoryId: 19 },
  pocillos: { categoryId: 20 },
  madera: { categoryId: 21 },
  fuente: { categoryId: 22 },
  espejos: { categoryId: 23 },
};

const sidebarOpen = ref(false);
const sortBy = ref('name-asc');
const refinements = ref({ inStock: false, onSale: false });

const slug = computed(() => (route.params.slug || 'vajilla').toLowerCase());
const category = computed(() => categories.find((c) => c.slug.toLowerCase() === slug.value) ?? categories[0]);
const categoryTitle = computed(() => category.value?.title || 'Colección');
const categoryImage = computed(() => category.value?.imageUrl || DEFAULT_CATEGORY_IMAGE);

const rawProducts = ref([]);
const total = ref(0);
const loading = ref(false);
const error = ref(null);

const products = computed(() => {
  let list = [...rawProducts.value];
  const s = sortBy.value;
  if (s === 'name-asc') list.sort((a, b) => a.title.localeCompare(b.title));
  else if (s === 'name-desc') list.sort((a, b) => b.title.localeCompare(a.title));
  else if (s === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (s === 'price-desc') list.sort((a, b) => b.price - a.price);
  return list;
});

function setPageTitle() {
  const title = categoryTitle.value || 'La Mesa de Nora';
  document.title = `${title} | La Mesa de Nora`;
}

async function fetchProducts() {
  loading.value = true;
  error.value = null;

  const filters = {};
  const cfg = CATEGORY_FILTERS[slug.value] || {};
  if (cfg.categoryId) {
    filters.category = cfg.categoryId;
  }

  try {
    const response = await listProducts({
      page: 1,
      per_page: 24,
      sort:
        sortBy.value === 'price-asc'
          ? 'price'
          : sortBy.value === 'price-desc'
            ? '-price'
            : sortBy.value === 'name-desc'
              ? '-name'
              : 'name',
      filters,
    });

    const currentCategoryId = cfg.categoryId ?? null;
    rawProducts.value = (response.data ?? []).map((p) => {
      const cats = p.categories ?? [];
      const displayCategory = currentCategoryId && cats.length
        ? (cats.find((c) => c.id === currentCategoryId)?.name ?? cats[0]?.name)
        : (cats[0]?.name ?? categoryTitle.value);
        
      return {
        id: p.id,
        title: p.name,
        category: displayCategory,
        price: p.price,
        priceRange: p.price_range || null,
        imageUrl: p.cover || '',
        imageAlt: p.name,
        to: p.slug ? `/product/${p.slug}` : '',
      };
    });
    total.value = response.total ?? rawProducts.value.length;
  } catch (e) {
    error.value = 'No se pudieron cargar los productos.';
    rawProducts.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function openSidebar() {
  sidebarOpen.value = true;
}

onMounted(() => {
  setPageTitle();
  fetchProducts();
});

watch([slug, sortBy], () => {
  setPageTitle();
  fetchProducts();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero categoría -->
    <section class="relative min-h-[40vh] overflow-hidden bg-gray-900 md:min-h-[50vh]">
      <img
        :src="categoryImage"
        :alt="categoryTitle"
        class="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div class="relative flex min-h-[40vh] items-end px-4 pb-8 md:min-h-[50vh] md:px-6 md:pb-10">
        <h1 class="text-3xl font-semibold tracking-wide text-white drop-shadow md:text-4xl lg:text-5xl">
          {{ categoryTitle }}
        </h1>
      </div>
    </section>

    <!-- Barra: EXPLORAR / ORDENAR POR / REFINAR (abren sidebar) -->
    <div class="border-b border-gray-200 bg-white px-4 py-3 md:px-6">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#141642] hover:bg-[#141642]/5 hover:text-[#141642] focus:outline-none focus:ring-2 focus:ring-[#141642]/20"
            @click="openSidebar"
          >
            EXPLORAR
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#141642] hover:bg-[#141642]/5 hover:text-[#141642] focus:outline-none focus:ring-2 focus:ring-[#141642]/20"
            @click="openSidebar"
          >
            ORDENAR POR
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#141642] hover:bg-[#141642]/5 hover:text-[#141642] focus:outline-none focus:ring-2 focus:ring-[#141642]/20"
            @click="openSidebar"
          >
            REFINAR
          </button>
        </div>
        <p class="text-sm text-gray-500">
          {{ products.length }} producto{{ products.length !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- Sidebar de filtros -->
    <CategoryFiltersSidebar
      v-model="sidebarOpen"
      :categories="categories"
      :current-category-slug="slug"
      v-model:sort-by="sortBy"
      v-model:refinements="refinements"
    />

    <!-- Grid de productos: 4 columnas -->
    <div class="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <!-- Skeletons mientras carga -->
      <div
        v-if="loading"
        class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        <div
          v-for="n in 8"
          :key="n"
          class="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 md:p-4"
        >
          <div class="mb-3 aspect-square w-full rounded-xl bg-gray-100 animate-pulse" />
          <div class="h-3 w-16 rounded bg-gray-100 mb-2 animate-pulse" />
          <div class="h-4 w-full rounded bg-gray-100 mb-3 animate-pulse" />
          <div class="h-4 w-20 rounded bg-gray-100 mt-auto animate-pulse" />
        </div>
      </div>

      <!-- Productos reales -->
      <div
        v-else
        class="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        <ProductGridCard
          v-for="product in products"
          :key="product.id"
          :title="product.title"
          :category="product.category"
          :price="product.price"
          :price-range="product.priceRange"
          :image-url="product.imageUrl"
          :image-alt="product.imageAlt"
          :to="product.to"
        />
      </div>

      <p v-if="!loading && products.length === 0" class="py-12 text-center text-gray-500">
        No hay productos en esta categoría.
      </p>
    </div>
  </div>
</template>
