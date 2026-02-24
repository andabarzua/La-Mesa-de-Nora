<script setup>
/**
 * Vista Sobre Nosotros — La Mesa de Nora.
 * Diseño con hero, bloques de texto y frase destacada.
 */
import SectionHeader from '@/components/catalog/SectionHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero con imagen de fondo -->
    <section class="relative min-h-[40vh] overflow-hidden bg-[#141642] md:min-h-[50vh]">
      <img
        src="/img/banners/banner-1.webp"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-40"
        aria-hidden="true"
      />
      <div class="relative flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center md:min-h-[50vh] md:py-24">
        <h1 class="text-3xl font-semibold tracking-wide text-white drop-shadow md:text-4xl lg:text-5xl">
          Sobre Nosotros
        </h1>
        <p class="mt-4 max-w-xl text-lg text-white/90 drop-shadow">
          Creamos escenarios para momentos especiales.
        </p>
      </div>
    </section>

    <!-- Contenido principal -->
    <div class="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <SectionHeader title="La Mesa de Nora" />

      <div class="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        <!-- Columna imagen -->
        <div class="order-2 md:order-1">
          <div class="overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            <img
              src="/img/colecciones/vajillas.webp"
              alt="Vajilla elegante - La Mesa de Nora"
              class="h-full w-full object-cover object-center"
            />
          </div>
        </div>

        <!-- Columna texto -->
        <div class="order-1 flex flex-col justify-center md:order-2">
          <p class="text-lg leading-relaxed text-gray-700">
            <strong class="font-semibold text-[#141642]">La Mesa De Nora</strong>
            nace con un solo objetivo: aportar estilo, encanto y facilidad a tus momentos más especiales. Ofrecemos una cuidada selección de productos en alquiler, ideales para eventos, reuniones y celebraciones de todo tipo.
          </p>
          <p class="mt-6 text-lg leading-relaxed text-gray-700">
            Desde vajillas elegantes y mobiliario con estilo hasta piezas únicas de decoración, nuestra colección está pensada para ayudarte a crear ambientes hermosos y memorables, sin complicaciones.
          </p>
        </div>
      </div>

      <!-- Bloque de texto ancho completo -->
      <div class="mt-14 border-l-4 border-[#254B86] bg-gray-50/80 px-6 py-6 md:mt-16 md:px-8 md:py-8">
        <p class="text-lg leading-relaxed text-gray-800 md:text-xl">
          Ya sea una cena íntima o una gran celebración, estamos aquí para ayudarte a hacer que tu mesa
          <span class="font-semibold text-[#141642]"> — La Mesa — </span>
          sea inolvidable.
        </p>
      </div>

      <!-- Frase de cierre destacada -->
      <div class="mt-14 rounded-2xl bg-[#141642] px-6 py-10 text-center md:mt-16 md:px-12 md:py-14">
        <p class="text-xl font-medium italic leading-relaxed text-white md:text-2xl">
          Creamos escenarios para momentos especiales.
        </p>
      </div>
    </div>
  </div>
</template>
