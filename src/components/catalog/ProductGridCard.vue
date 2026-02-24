<script setup>
/**
 * Tarjeta de producto para grid — La Mesa de Nora.
 * Imagen con hover suave, categoría, nombre, precio. Diseño limpio y elegante.
 */
defineProps({
  title: { type: String, required: true },
  category: { type: String, default: '' },
  price: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  to: { type: String, default: '' },
});
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 ease-out hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#141642]/20 focus:ring-offset-2"
  >
    <!-- Imagen -->
    <div class="relative aspect-square w-full overflow-hidden bg-gray-50">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="imageAlt || title"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400"
      >
        <svg class="h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
        </svg>
      </div>
      <!-- Overlay sutil al hover -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <!-- Etiqueta "Ver" en hover -->
      <span
        class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-medium tracking-wide text-gray-800 shadow-sm opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
      >
        Ver producto
      </span>
    </div>

    <!-- Contenido -->
    <div class="flex flex-1 flex-col p-4">
      <p
        v-if="category"
        class="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#141642]/70"
      >
        {{ category }}
      </p>
      <h3 class="line-clamp-2 min-h-[2.5rem] font-medium leading-snug text-gray-900 transition-colors group-hover:text-[#141642]">
        {{ title }}
      </h3>
      <p class="mt-2 border-t border-gray-100 pt-3 text-base font-semibold text-[#141642]">
        ${{ price.toLocaleString('es-CL') }}
      </p>
    </div>
  </RouterLink>
</template>
