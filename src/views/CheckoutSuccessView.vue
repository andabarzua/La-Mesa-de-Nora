<script setup>
/**
 * Página de retorno tras pago aprobado con Mercado Pago.
 */
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const externalReference = route.query.external_reference ?? '';
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="bg-[#141642] px-4 py-10 text-center md:py-14">
      <h1 class="text-2xl font-semibold tracking-wide text-white md:text-3xl">
        Pago exitoso
      </h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-white/85 md:text-base">
        Tu pago fue aprobado. Te contactaremos a la brevedad para coordinar la entrega.
      </p>
    </section>
    <div class="mx-auto max-w-lg px-4 py-12 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p v-if="externalReference" class="mt-4 text-sm text-gray-500">
        Referencia: <span class="font-medium text-[#141642]">{{ externalReference }}</span>
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          to="/"
          class="inline-block rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90"
        >
          Volver al inicio
        </RouterLink>
        <RouterLink
          to="/colecciones"
          class="inline-block rounded-lg border-2 border-[#141642] bg-white px-6 py-3 font-medium text-[#141642] transition hover:bg-[#141642]/5"
        >
          Ver colecciones
        </RouterLink>
      </div>
    </div>
  </div>
</template>
