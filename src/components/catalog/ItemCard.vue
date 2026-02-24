<script setup>
/**
 * Tarjeta reutilizable para carrusel — imagen arriba, texto abajo.
 * Usado en Colecciones, Productos y Servilletas.
 */
defineProps({
  title: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  to: { type: String, default: '' },
});

const emit = defineEmits(['click']);
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'div'"
    :to="to"
    class="group flex shrink-0 flex-col overflow-hidden rounded-xl bg-white transition-all duration-200 ease-out hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#254B86]/30"
    :class="to ? 'cursor-pointer' : 'cursor-default'"
    @click="!to && emit('click')"
  >
    <div class="aspect-square w-full overflow-hidden rounded-t-xl bg-gray-100">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="imageAlt || title"
        class="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:brightness-[0.98]"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400"
      >
        <span class="text-sm">Sin imagen</span>
      </div>
    </div>
    <p
      class="mt-3 text-center font-medium tracking-wide text-[#254B86] transition-colors duration-200 group-hover:text-[#254B86]/80"
    >
      {{ title }}
    </p>
  </component>
</template>
