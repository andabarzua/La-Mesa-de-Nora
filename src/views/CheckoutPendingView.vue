<script setup>
/**
 * Página de retorno cuando el pago quedó pendiente (ej. transferencia en proceso).
 */
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const externalReference = route.query.external_reference ?? '';
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="bg-[#141642] px-4 py-10 text-center md:py-14">
      <h1 class="text-2xl font-semibold tracking-wide text-white md:text-3xl">
        Pago pendiente
      </h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-white/85 md:text-base">
        Tu pago está en proceso. Te notificaremos cuando se acredite.
      </p>
    </section>
    <div class="mx-auto max-w-lg px-4 py-12 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          to="/checkout"
          class="inline-block rounded-lg border-2 border-[#141642] bg-white px-6 py-3 font-medium text-[#141642] transition hover:bg-[#141642]/5"
        >
          Ver checkout
        </RouterLink>
      </div>
    </div>
  </div>
</template>
