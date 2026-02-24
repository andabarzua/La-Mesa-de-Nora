<script setup>
/**
 * Vista placeholder para rutas aún no implementadas.
 */
import { useRoute } from 'vue-router';

const route = useRoute();
const title = route.meta?.title || route.name || route.path;
</script>

<template>
  <div class="container mx-auto px-4 py-16 text-center">
    <h1 class="text-2xl font-semibold text-[#1D4ED8]">{{ title }}</h1>
    <p class="mt-4 text-gray-600">Contenido en construcción.</p>
    <router-link
      to="/"
      class="mt-6 inline-block text-[#1D4ED8] underline hover:no-underline"
    >
      Volver al inicio
    </router-link>
  </div>
</template>
