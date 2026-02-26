<script setup>
/**
 * Vista de detalle de producto — La Mesa de Nora.
 * 50% galería de imágenes | 50% información (nombre, referencia, precio, fechas, calendario disponibilidad).
 * Consume la API MesadeNora. Soporta productos con combinaciones (variantes: Color, Talla, etc.).
 */
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProduct } from '@/api/endpoints/products';
import { fetchProductBlockedDates } from '@/api/endpoints/availability';
import { useCartStore } from '@/stores/cart';
import ReservationDatePicker from '@/components/ReservationDatePicker.vue';

const route = useRoute();
const cartStore = useCartStore();

const product = ref({
  name: '',
  reference: '',
  price: 0,
  quantity: 0,
  currency: 'CLP',
  description: '',
  images: [],
  categories: [],
  combinations: [],
});
const loading = ref(false);
const loadError = ref('');

const selectedImageIndex = ref(0);
const quantity = ref(1);
const agregadoAlCarrito = ref(false);
const selectedAttributes = ref({}); // { "Color": "Rojo", "Talla": "M" }
const combinationQuantities = ref({}); // { combinationId: number }
const addingCombinationId = ref(null);
const reservationStartDate = ref('');
const reservationEndDate = ref('');

function checkHasReservationDates() {
  if (typeof localStorage === 'undefined') return false;
  return !!(localStorage.getItem('lmdn_reservation_start') && localStorage.getItem('lmdn_reservation_end'));
}
const hasReservationDates = ref(false);
const needReservationDates = computed(() => cartStore.items.length === 0 && !hasReservationDates.value);

/** Siempre mostramos todas las imágenes del producto; al seleccionar combinación solo cambiamos cuál está activa */
const displayImages = computed(() => product.value.images ?? []);

const mainImage = computed(() =>
  displayImages.value[selectedImageIndex.value] || displayImages.value[0]);
const totalImages = computed(() => displayImages.value.length);

/** Índice de la imagen que corresponde a la combinación seleccionada (para saltar a ella) */
const selectedCombinationImageIndex = computed(() => {
  const comb = selectedCombination.value;
  if (!comb?.images?.length) return 0;
  const combImg = comb.images[0];
  const idx = displayImages.value.findIndex((url) => url === combImg);
  return idx >= 0 ? idx : 0;
});

const combinations = computed(() => product.value.combinations ?? []);
const hasCombinations = computed(() => combinations.value.length > 0);

/** Nombre legible de una combinación (ej. "Base 33cm", "Principal 28 cm") */
function getCombinationLabel(comb) {
  const attrs = comb.attributes ?? [];
  if (attrs.length === 0) return comb.reference || `Variante #${comb.id}`;
  return attrs.map((a) => a.value).join(' · ');
}

/** Imagen de la combinación o fallback */
function getCombinationImage(comb) {
  const imgs = comb.images ?? [];
  if (imgs.length > 0 && imgs[0]) return imgs[0];
  return displayImages.value[0] || '/img/LMDN_Logo.webp';
}

function getCombinationQty(comb) {
  return combinationQuantities.value[comb.id] ?? 0;
}

function setCombinationQty(comb, qty) {
  const n = Math.max(0, Math.min(99, Number(qty) || 0));
  combinationQuantities.value = { ...combinationQuantities.value, [comb.id]: n };
}

function incCombinationQty(comb) {
  const max = Math.min(99, comb.quantity ?? 0);
  const cur = getCombinationQty(comb);
  setCombinationQty(comb, Math.min(cur + 1, max));
}

function decCombinationQty(comb) {
  const cur = getCombinationQty(comb);
  setCombinationQty(comb, Math.max(0, cur - 1));
}

async function addCombinationToCart(comb) {
  const qty = getCombinationQty(comb);
  if (qty <= 0 || (comb.quantity ?? 0) <= 0) return;
  if (needReservationDates.value && (!reservationStartDate.value || !reservationEndDate.value)) return;
  try {
    if (needReservationDates.value) {
      localStorage.setItem('lmdn_reservation_start', reservationStartDate.value);
      localStorage.setItem('lmdn_reservation_end', reservationEndDate.value);
      hasReservationDates.value = true;
    }
    addingCombinationId.value = comb.id;
    await cartStore.addProduct({
      productId: product.value.id,
      quantity: qty,
      combinationId: comb.id,
    });
    setCombinationQty(comb, 0);
    agregadoAlCarrito.value = true;
    setTimeout(() => { agregadoAlCarrito.value = false; }, 3000);
  } catch {
    // error silencioso
  } finally {
    addingCombinationId.value = null;
  }
}

/** Grupos de atributos con sus valores únicos para el selector */
const attributeGroups = computed(() => {
  const groups = {};
  for (const c of combinations.value) {
    for (const a of c.attributes ?? []) {
      const g = a.group || 'Opción';
      if (!groups[g]) groups[g] = new Set();
      groups[g].add(a.value);
    }
  }
  return Object.fromEntries(
    Object.entries(groups).map(([k, v]) => [k, [...v]]),
  );
});

/** Combinación seleccionada según los atributos elegidos */
const selectedCombination = computed(() => {
  const sel = selectedAttributes.value;
  const groups = Object.keys(attributeGroups.value);
  if (groups.length === 0) return null;
  for (const g of groups) {
    if (!sel[g]) return null;
  }
  return combinations.value.find((c) => {
    const attrs = c.attributes ?? [];
    return groups.every((g) => attrs.some((a) => a.group === g && a.value === sel[g]));
  }) ?? null;
});

const displayPrice = computed(() => {
  if (selectedCombination.value) return (product.value.price ?? 0) + (selectedCombination.value.price_impact ?? 0);
  
  if (hasCombinations.value) {
    const prices = combinations.value.map(c => parseFloat(product.value.price || 0) + parseFloat(c.price_impact || 0));
    const min = Math.min(...prices);
    if (!isNaN(min)) return min;
  }
  
  return product.value.price ?? 0;
});

const priceRange = computed(() => {
  if (!hasCombinations.value) return null;
  const prices = combinations.value.map(c => parseFloat(product.value.price || 0) + parseFloat(c.price_impact || 0));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max || isNaN(min) || isNaN(max)) return null;
  return { min, max };
});

const displayReference = computed(() => {
  if (selectedCombination.value?.reference) return selectedCombination.value.reference;
  return product.value.reference ?? '';
});

const availableQuantity = computed(() => {
  if (selectedCombination.value) return selectedCombination.value.quantity ?? 0;
  return product.value.quantity ?? 0;
});

const minQuantity = 1;
const maxQuantity = computed(() => Math.min(99, Math.max(minQuantity, availableQuantity.value)));

const canAddToCart = computed(() => {
  if (hasCombinations.value && !selectedCombination.value) return false;
  if (availableQuantity.value <= 0) return false;
  if (needReservationDates.value) {
    return !!(reservationStartDate.value && reservationEndDate.value);
  }
  return true;
});

/** El producto padre no tiene stock (ni combinaciones con stock) */
const parentHasNoStock = computed(() => (product.value.quantity ?? 0) === 0);

const primaryCategory = computed(() => product.value.categories?.[0]?.name ?? '');
const primaryCategorySlug = computed(() => product.value.categories?.[0]?.slug ?? '');

function selectAttribute(group, value) {
  selectedAttributes.value = { ...selectedAttributes.value, [group]: value };
}

function prevImage() {
  if (totalImages.value === 0) return;
  selectedImageIndex.value = (selectedImageIndex.value - 1 + totalImages.value) % totalImages.value;
}

function nextImage() {
  if (totalImages.value === 0) return;
  selectedImageIndex.value = (selectedImageIndex.value + 1) % totalImages.value;
}

function restarCantidad() {
  if (quantity.value > minQuantity) quantity.value--;
}

function sumarCantidad() {
  if (quantity.value < maxQuantity.value) quantity.value++;
}

async function addToCart() {
  try {
    if (needReservationDates.value && reservationStartDate.value && reservationEndDate.value) {
      localStorage.setItem('lmdn_reservation_start', reservationStartDate.value);
      localStorage.setItem('lmdn_reservation_end', reservationEndDate.value);
      hasReservationDates.value = true;
    }
    await cartStore.addProduct({
      productId: product.value.id,
      quantity: quantity.value,
      combinationId: selectedCombination.value?.id ?? undefined,
    });
    agregadoAlCarrito.value = true;
    setTimeout(() => {
      agregadoAlCarrito.value = false;
    }, 3000);
  } catch (e) {
    // TODO: mostrar mensaje de error si es necesario
  }
}

watch(quantity, (val) => {
  const n = Number(val);
  if (Number.isNaN(n) || n < minQuantity) quantity.value = minQuantity;
  else if (n > maxQuantity.value) quantity.value = maxQuantity.value;
});

watch(combinations, (list) => {
  if (list.length > 0 && Object.keys(selectedAttributes.value).length === 0) {
    selectedAttributes.value = {};
  }
  combinationQuantities.value = {};
}, { immediate: true });

watch(selectedCombinationImageIndex, (idx) => {
  selectedImageIndex.value = idx;
});

function setPageTitle() {
  const name = product.value?.name;
  document.title = name ? `${name} | La Mesa de Nora` : 'La Mesa de Nora - EXCLUSIVE RENTAL';
}

watch(() => product.value?.name, setPageTitle, { immediate: true });

async function fetchProduct() {
  const slug = route.params.slug;
  if (!slug) return;

  loading.value = true;
  loadError.value = '';
  selectedAttributes.value = {};
  try {
    const response = await getProduct(slug);
    const p = response.data ?? {};
    const images = Array.isArray(p.images) && p.images.length
      ? p.images
      : (p.cover ? [p.cover] : ['/img/LMDN_Logo.webp']);
    product.value = {
      id: p.id ?? null,
      name: p.name ?? '',
      reference: p.reference ?? '',
      price: p.price ?? 0,
      quantity: p.quantity ?? 0,
      currency: 'CLP',
      description: p.description ?? '',
      images,
      categories: Array.isArray(p.categories) ? p.categories : [],
      combinations: Array.isArray(p.combinations) ? p.combinations : [],
    };
    selectedImageIndex.value = 0;
    quantity.value = 1;
    setPageTitle();
  } catch (e) {
    loadError.value = 'No se pudo cargar la información del producto.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  setPageTitle();
  fetchProduct();
  hasReservationDates.value = checkHasReservationDates();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <!-- Breadcrumb / árbol de navegación -->
      <nav class="mb-4 text-xs font-medium text-gray-500" aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1">
          <li>
            <RouterLink to="/" class="hover:text-[#141642]">
              {{ 'INICIO' }}
            </RouterLink>
          </li>
          <li class="text-gray-400">/</li>
          <li v-if="primaryCategorySlug">
            <RouterLink
              :to="`/colecciones/${primaryCategorySlug}`"
              class="hover:text-[#141642]"
            >
              {{ (primaryCategory || 'COLECCIÓN').toUpperCase() }}
            </RouterLink>
          </li>
          <li v-if="primaryCategorySlug" class="text-gray-400">/</li>
          <li class="text-gray-800">
            {{ (product.name || 'PRODUCTO').toUpperCase() }}
          </li>
        </ol>
      </nav>

      <p v-if="loadError" class="mb-6 text-center text-red-500">{{ loadError }}</p>

      <!-- Skeletons mientras carga el producto -->
      <div
        v-else-if="loading"
        class="grid min-h-[70vh] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <!-- Galería skeleton -->
        <div class="flex flex-col">
          <div class="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-100 md:min-h-[320px] md:aspect-square">
            <div class="h-full w-full animate-pulse bg-gray-200" />
          </div>
          <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
            <div
              v-for="n in 4"
              :key="n"
              class="h-20 w-20 shrink-0 rounded-lg border-2 border-transparent bg-gray-100 animate-pulse"
            />
          </div>
        </div>

        <!-- Info skeleton -->
        <div class="flex flex-col space-y-4">
          <div class="h-7 w-2/3 rounded bg-gray-100 animate-pulse" />
          <div class="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
          <div class="h-8 w-1/4 rounded bg-gray-100 animate-pulse" />
          <div class="h-24 w-full rounded-xl bg-gray-100 animate-pulse" />
          <div class="h-24 w-full rounded-xl bg-gray-100 animate-pulse" />
        </div>
      </div>

      <!-- Contenido real -->
      <div
        v-else
        class="grid min-h-[70vh] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
      >
        <!-- 50% Galería: contenedor cuadrado para que la imagen se vea completa (object-contain) -->
        <div class="flex flex-col">
          <div class="relative flex min-h-[280px] w-full items-center justify-center overflow-hidden rounded-2xl md:min-h-[320px] md:aspect-square">
            <img
              :src="mainImage"
              :alt="product.name"
              class="max-h-full max-w-full object-center"
              :class="mainImage === '/img/LMDN_Logo.webp' ? 'w-1/2 object-contain opacity-10 grayscale p-8' : 'object-contain'"
            />
            <button
              type="button"
              class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
              aria-label="Imagen anterior"
              @click="prevImage"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
              aria-label="Imagen siguiente"
              @click="nextImage"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(img, index) in displayImages"
              :key="`${index}-${img}`"
              type="button"
              class="h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-[#141642]"
              :class="selectedImageIndex === index ? 'border-[#141642]' : 'border-gray-200 hover:border-gray-300'"
              @click="selectedImageIndex = index"
            >
              <img :src="img" :alt="`${product.name} ${index + 1}`" :class="img === '/img/LMDN_Logo.webp' ? 'h-full w-full object-contain opacity-10 grayscale p-4' : 'h-full w-full object-cover'" />
            </button>
          </div>
        </div>

        <!-- 50% Información -->
        <div class="flex flex-col">
          <h1 class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
            {{ (product.name || '').toUpperCase() }}
          </h1>
          <p v-if="primaryCategory" class="mt-1 text-xs font-semibold uppercase tracking-widest text-[#141642]/70">
            {{ primaryCategory.toUpperCase() }}
          </p>
          <p class="mt-2 text-sm text-gray-500">
            Referencia: <span class="font-medium text-gray-700">{{ displayReference }}</span>
          </p>
          <p class="mt-4 text-2xl font-semibold text-[#141642]">
            <template v-if="hasCombinations && !selectedCombination && priceRange">
              ${{ priceRange.min.toLocaleString('es-CL') }} - ${{ priceRange.max.toLocaleString('es-CL') }}
            </template>
            <template v-else>
              ${{ displayPrice.toLocaleString('es-CL') }}
            </template>
          </p>

          <p v-if="parentHasNoStock" class="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Este producto no tiene stock disponible en este momento.
          </p>

          <!-- Selector de combinaciones (Color, Talla, etc.) -->
          <div v-if="hasCombinations" class="mt-4 space-y-3">
            <div
              v-for="(values, group) in attributeGroups"
              :key="group"
            >
              <label class="block text-sm font-medium text-gray-700">{{ group }}</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="val in values"
                  :key="val"
                  type="button"
                  class="rounded-lg border-2 px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
                  :class="selectedAttributes[group] === val
                    ? 'border-[#141642] bg-[#141642]/5 text-[#141642]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'"
                  @click="selectAttribute(group, val)"
                >
                  {{ val }}
                </button>
              </div>
            </div>
            <p v-if="availableQuantity <= 0 && selectedCombination" class="text-sm text-amber-600">
              Esta combinación no está disponible en stock.
            </p>
          </div>
          <div class="mt-5 rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-4">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-[#141642]">Descripcion</h2>
            <p class="mt-2 text-sm leading-relaxed text-gray-600">
              {{ product.description }}
            </p>
          </div>

          <!-- Cantidad y agregar al carrito -->
          <div class="mt-8">
            <label class="block text-sm font-medium text-gray-700">Cantidad</label>
            <div class="mt-2 flex items-center gap-3">
              <button
                type="button"
                :disabled="quantity <= minQuantity"
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-[#141642] transition hover:border-[#141642] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
                aria-label="Disminuir cantidad"
                @click="restarCantidad"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
              </button>
              <input
                v-model.number="quantity"
                type="number"
                :min="minQuantity"
                :max="maxQuantity"
                class="h-11 w-20 rounded-lg border-2 border-gray-200 text-center text-lg font-medium text-[#141642] focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                :disabled="quantity >= maxQuantity"
                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-[#141642] transition hover:border-[#141642] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
                aria-label="Aumentar cantidad"
                @click="sumarCantidad"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <p v-if="hasCombinations && !selectedCombination" class="mt-3 text-sm text-gray-500">
              Selecciona las opciones para continuar.
            </p>

            <!-- Fechas de reserva (solo al añadir el primer producto) -->
            <div
              v-if="needReservationDates"
              class="mt-6 rounded-xl border border-[#141642]/20 bg-[#141642]/5 px-4 py-4"
            >
              <p class="text-xs font-semibold uppercase tracking-wider text-[#141642]">
                Fechas de tu evento
              </p>
              <p class="mt-1 text-sm text-gray-600">
                Indica el rango de fechas para tu reserva. Solo se solicita una vez.
              </p>
              <div class="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-medium text-gray-700">Fecha inicio</label>
                  <input
                    v-model="reservationStartDate"
                    type="date"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                  />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700">Fecha término</label>
                  <input
                    v-model="reservationEndDate"
                    type="date"
                    class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              :disabled="!canAddToCart"
              class="mt-4 w-full rounded-lg bg-[#141642] px-6 py-3.5 font-semibold text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              @click="addToCart"
            >
              Agregar al carrito
            </button>

            <!-- Sección rápida: agregar variantes (solo si hay combinaciones) -->
            <div
              v-if="hasCombinations"
              class="mt-8 rounded-2xl border border-gray-200 bg-gray-50/50"
            >
              <div class="border-b border-gray-200 bg-white/80 px-4 py-3">
                <h3 class="text-sm font-semibold uppercase tracking-wider text-[#141642]">
                  Agregar variantes
                </h3>
                <p class="mt-0.5 text-xs text-gray-500">
                  Añade varias variantes a la vez
                </p>
              </div>
              <div class="divide-y divide-gray-200/80">
                <div
                  v-for="comb in combinations"
                  :key="comb.id"
                  class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/50"
                >
                  <div class="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
                    <img
                      :src="getCombinationImage(comb)"
                      :alt="getCombinationLabel(comb)"
                      :class="getCombinationImage(comb) === '/img/LMDN_Logo.webp' ? 'h-full w-full object-contain p-4 opacity-10 grayscale' : 'h-full w-full object-cover'"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-medium text-gray-900">
                      {{ product.name }} — {{ getCombinationLabel(comb) }}
                    </p>
                    <p class="text-sm font-semibold text-[#141642]">
                      ${{ ((product.price ?? 0) + (comb.price_impact ?? 0)).toLocaleString('es-CL') }}
                    </p>
                  </div>
                  <div class="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      :disabled="getCombinationQty(comb) <= 0"
                      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                      @click="decCombinationQty(comb)"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                    </button>
                    <input
                      :value="getCombinationQty(comb)"
                      type="number"
                      min="0"
                      :max="Math.min(99, comb.quantity ?? 0)"
                      class="h-9 w-14 rounded-lg border border-gray-200 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                      @input="setCombinationQty(comb, $event.target.value)"
                    />
                    <button
                      type="button"
                      :disabled="getCombinationQty(comb) >= Math.min(99, comb.quantity ?? 0)"
                      class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                      @click="incCombinationQty(comb)"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    :disabled="getCombinationQty(comb) <= 0 || (comb.quantity ?? 0) <= 0 || (needReservationDates && (!reservationStartDate || !reservationEndDate))"
                    class="shrink-0 rounded-lg bg-[#141642] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#141642]/90 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="addingCombinationId === comb.id ? 'opacity-70' : ''"
                    @click="addCombinationToCart(comb)"
                  >
                    {{ addingCombinationId === comb.id ? '...' : '+ Agregar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast: producto agregado al carrito (click para abrir carrito) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-x-full opacity-0"
        enter-to-class="translate-x-0 opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-x-0 opacity-100"
        leave-to-class="translate-x-full opacity-0"
      >
        <button
          v-if="agregadoAlCarrito"
          type="button"
          class="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl border border-[#141642]/20 bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2"
          @click="cartStore.openSidebar(); agregadoAlCarrito = false"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span class="text-left">
            <span class="block text-sm font-semibold text-gray-900">Producto agregado al carrito</span>
            <span class="text-xs text-gray-500">Haz clic para ver el carrito</span>
          </span>
          <svg class="h-5 w-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Transition>
    </Teleport>
  </div>
</template>
