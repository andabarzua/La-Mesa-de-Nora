<script setup>
/**
 * Página de retorno cuando el pago fue rechazado o hubo error en Mercado Pago.
 * El carrito se mantiene intacto para que el usuario pueda reintentar.
 */
import { useRoute, RouterLink } from 'vue-router';

const route = useRoute();
const externalReference = route.query.external_reference ?? '';
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="bg-[#141642] px-4 py-10 text-center md:py-14">
      <h1 class="text-2xl font-semibold tracking-wide text-white md:text-3xl">
        Pago no aprobado
      </h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-white/85 md:text-base">
        Tu pago no fue aprobado o cancelaste la operación.
      </p>
    </section>
    <div class="mx-auto max-w-lg px-4 py-12 text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p class="mt-4 text-base font-medium text-gray-800">
        Puedes intentar nuevamente tu pago con Mercado Pago o elegir transferencia bancaria.
      </p>
      <p class="mt-1 text-sm text-gray-500">
        Tu carrito está intacto para que puedas finalizar tu compra.
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <RouterLink
          to="/checkout"
          class="inline-block rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90"
        >
          Reintentar pago
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
