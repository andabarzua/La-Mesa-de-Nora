<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

onMounted(() => {
  document.title = 'Página no encontrada | La Mesa de Nora';
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 py-12 md:px-6">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[#141642]/60">
        La Mesa de Nora
      </p>

      <div class="mt-4 flex flex-col items-center gap-4 text-center md:mt-6">
        <span class="inline-flex items-center rounded-full bg-[#141642]/5 px-4 py-1 text-xs font-semibold tracking-wide text-[#141642]">
          Error 404
        </span>
        <h1 class="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          Esta página ya no está puesta en la mesa.
        </h1>
        <p class="max-w-xl text-sm leading-relaxed text-gray-600 md:text-base">
          El enlace que abriste no existe o fue movido. Vuelve al inicio para seguir descubriendo
          colecciones y piezas para tu evento.
        </p>
      </div>

      <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <RouterLink
          to="/"
          class="inline-flex w-full items-center justify-center rounded-lg bg-[#141642] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 sm:w-auto"
        >
          Volver al inicio
        </RouterLink>
        <RouterLink
          to="/contacto"
          class="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-800 transition hover:border-[#141642] hover:text-[#141642] sm:w-auto"
        >
          Hablar con el equipo
        </RouterLink>
      </div>

      <div class="mt-10 rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-5 text-center text-xs text-gray-500 md:mt-12 md:px-8">
        <p>
          Si crees que esto es un error, copia la URL y compártela con
          <RouterLink to="/contacto" class="font-medium text-[#141642] underline-offset-2 hover:underline">
            nuestro equipo
          </RouterLink>
          para que podamos revisarlo.
        </p>
      </div>
    </div>
  </div>
</template>
