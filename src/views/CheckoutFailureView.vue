<script setup>
/**
 * Página de retorno cuando el pago fue rechazado o hubo error en Mercado Pago.
 */
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const externalReference = route.query.external_reference ?? '';
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="bg-[#141642] px-4 py-10 text-center md:py-14">
      <h1 class="text-2xl font-semibold tracking-wide text-white md:text-3xl">
        Pago no realizado
      </h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-white/85 md:text-base">
        El pago no pudo completarse. Puedes intentar de nuevo o elegir otro medio de pago.
      </p>
    </section>
    <div class="mx-auto max-w-lg px-4 py-12 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p v-if="externalReference" class="mt-4 text-sm text-gray-500">
        Referencia: <span class="font-medium text-[#141642]">{{ externalReference }}</span>
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          to="/checkout"
          class="inline-block rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90"
        >
          Volver al checkout
        </RouterLink>
        <RouterLink
          to="/"
          class="inline-block rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Ir al inicio
        </RouterLink>
      </div>
    </div>
  </div>
</template>
