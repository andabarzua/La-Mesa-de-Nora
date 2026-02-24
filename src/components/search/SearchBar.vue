<script setup>
/**
 * Barra de búsqueda — La Mesa de Nora.
 * Diseño novedoso y minimalista: input amplio con icono, sombra suave, foco en azul.
 */
defineProps({
  modelValue: { type: String, default: '' },
  loading: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'search']);

function onInput(e) {
  emit('update:modelValue', e.target.value);
}
function onSubmit(e) {
  e.preventDefault();
  emit('search');
}
</script>

<template>
  <form class="w-full max-w-2xl" @submit="onSubmit">
    <div
      class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-[#141642] focus-within:ring-2 focus-within:ring-[#141642]/15 md:px-5 md:py-4"
    >
      <span class="flex shrink-0 text-gray-400" aria-hidden="true">
        <svg class="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="search"
        :value="modelValue"
        autocomplete="off"
        placeholder="Buscar productos, vajilla, decoración..."
        class="min-w-0 flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none md:text-lg"
        @input="onInput"
      />
      <button
        type="submit"
        :disabled="loading"
        class="shrink-0 rounded-xl bg-[#141642] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:opacity-70 md:px-5"
      >
        {{ loading ? 'Buscando...' : 'Buscar' }}
      </button>
    </div>
  </form>
</template>
