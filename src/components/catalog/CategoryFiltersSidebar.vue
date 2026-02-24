<script setup>
/**
 * Sidebar de filtros para vista de categoría — Explorar, Ordenar por, Refinar.
 * Cierre: botón X y tecla ESC.
 */
import { computed, watch, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] },
  currentCategorySlug: { type: String, default: '' },
  sortBy: { type: String, default: '' },
  refinements: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue', 'update:sortBy', 'update:refinements']);

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const sortOptions = [
  { value: 'name-asc', label: 'Nombre A-Z' },
  { value: 'name-desc', label: 'Nombre Z-A' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

function close() {
  open.value = false;
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', onKeydown);
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
}, { immediate: true });

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});

function setSort(value) {
  emit('update:sortBy', value);
}

function toggleRefine(key) {
  const next = { ...props.refinements, [key]: !props.refinements[key] };
  emit('update:refinements', next);
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="modelValue"
      class="fixed inset-0 z-40 bg-black/30"
      aria-hidden="true"
      @click="$emit('update:modelValue', false)"
    />
  </Transition>
  <Transition
    enter-active-class="transition-transform duration-200 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <aside
      v-show="modelValue"
      class="fixed left-0 top-0 z-50 h-full w-full max-w-sm overflow-y-auto border-r border-gray-200 bg-white shadow-xl"
      aria-label="Filtros y orden"
    >
      <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <h2 class="text-lg font-semibold text-[#141642]">Filtros</h2>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
          aria-label="Cerrar (Esc)"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-4 py-6 space-y-8">
        <!-- Explorar: categorías -->
        <section>
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Explorar</h3>
          <nav class="mt-3 flex flex-col gap-1">
            <RouterLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="cat.to"
              class="rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-50 hover:text-[#141642]"
              :class="currentCategorySlug === cat.slug && 'bg-[#141642]/10 font-medium text-[#141642]'"
              @click="close"
            >
              {{ cat.title }}
            </RouterLink>
          </nav>
        </section>

        <!-- Ordenar por -->
        <section>
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Ordenar por</h3>
          <div class="mt-3 flex flex-col gap-1">
            <button
              v-for="opt in sortOptions"
              :key="opt.value"
              type="button"
              class="rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50 hover:text-[#141642]"
              :class="sortBy === opt.value && 'bg-[#141642]/10 font-medium text-[#141642]'"
              @click="setSort(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </section>

        <!-- Refinar -->
        <section>
          <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500">Refinar</h3>
          <div class="mt-3 space-y-2">
            <label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50">
              <input
                type="checkbox"
                :checked="refinements.inStock"
                class="h-4 w-4 rounded border-gray-300 text-[#141642] focus:ring-[#141642]/20"
                @change="toggleRefine('inStock')"
              />
              <span class="text-sm text-gray-700">En stock</span>
            </label>
            <label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50">
              <input
                type="checkbox"
                :checked="refinements.onSale"
                class="h-4 w-4 rounded border-gray-300 text-[#141642] focus:ring-[#141642]/20"
                @change="toggleRefine('onSale')"
              />
              <span class="text-sm text-gray-700">Ofertas</span>
            </label>
          </div>
        </section>
      </div>
    </aside>
  </Transition>
</template>
