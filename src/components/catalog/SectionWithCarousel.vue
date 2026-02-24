<script setup>
/**
 * Sección reutilizable: título + separador + carrusel de tarjetas.
 * Usado para COLECCIONES, PRODUCTOS y SERVILLETAS.
 */
import SectionHeader from './SectionHeader.vue';
import ItemCarousel from './ItemCarousel.vue';

defineProps({
  title: { type: String, required: true },
  items: {
    type: Array,
    default: () => [],
    // [{ id, title, imageUrl, imageAlt?, to? }]
  },
  cardWidth: { type: String, default: '280px' },
  gap: { type: String, default: '1.5rem' },
  /** En desktop (lg+): mostrar N columnas (ej. 5 para colecciones). En móvil sigue el carrusel. */
  columnsOnDesktop: { type: Number, default: 0 },
  /** En móvil: mostrar N tarjetas por slide (ej. 2 para colecciones). */
  columnsOnMobile: { type: Number, default: 0 },
});
</script>

<template>
  <section class="w-full bg-white py-8 md:py-12 lg:py-14">
    <div class="container mx-auto px-4 md:px-6">
      <SectionHeader :title="title" />
      <div class="mt-6 md:mt-8">
        <ItemCarousel
          :items="items"
          :card-width="cardWidth"
          :gap="gap"
          :columns-on-desktop="columnsOnDesktop"
          :columns-on-mobile="columnsOnMobile"
        />
      </div>
    </div>
  </section>
</template>
