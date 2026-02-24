<script setup>
/**
 * Sección de inspiración con imagen y hotspots sobre productos.
 * Cada punto muestra nombre, precio y link al producto al hacer hover/click.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Coordenadas en porcentaje respecto al contenedor (left/top)
const hotspots = [
  {
    id: 1,
    left: '15%',
    top: '14.5%',
    name: 'SERVILLETA ALGODÓN MOSTAZA',
    price: 1000,
    slug: 'algodon-mostaza',
  },
  {
    id: 2,
    left: '47.5%',
    top: '34%',
    name: 'EMA MINT',
    price: 1000,
    slug: 'ema-mint-base',
  },
  {
    id: 3,
    left: '75.25%',
    top: '88.5%',
    name: 'CUBIERTOS DORADOS',
    price: 1000,
    slug: 'set-dorado-blanco',
  },
];

const activeId = ref(null);

function goToProduct(slug) {
  if (!slug) return;
  router.push({ path: `/product/${slug}` });
}
</script>

<template>
  <section class="px-4 py-10 md:px-6 md:py-14">
    <div class="mx-auto max-w-7xl">
      <header class="mb-4 flex items-center justify-between md:mb-6">
        <h2 class="text-sm font-semibold uppercase tracking-[0.25em] text-[#141642] md:text-base">
          Inspiración
        </h2>
      </header>

      <!-- Contenedor más compacto para ver la imagen completa en pantalla -->
      <div class="relative mx-auto max-w-5xl overflow-hidden rounded-3xl">
        <!-- Imagen de inspiración -->
        <img
          src="/img/Inspiracion.webp"
          alt="Inspiración de mesa La Mesa de Nora"
          class="block w-full object-contain md:max-h-[720px] rounded-lg"
        />

        <!-- Hotspots -->
        <button
          v-for="hotspot in hotspots"
          :key="hotspot.id"
          type="button"
          class="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center min-h-[120px] pt-1"
          :style="{ left: hotspot.left, top: hotspot.top }"
          @mouseenter="activeId = hotspot.id"
          @mouseleave="activeId = activeId === hotspot.id ? null : activeId"
          @focus="activeId = hotspot.id"
          @blur="activeId = activeId === hotspot.id ? null : activeId"
        >
          <!-- Punto -->
          <span
            class="relative flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[#254B86]/20"
          >
            <span class="h-2 w-2 rounded-full bg-[#254B86]" />
          </span>

          <!-- Card flotante (posición absoluta para no empujar el punto) -->
          <div
            v-show="activeId === hotspot.id"
            class="pointer-events-auto absolute left-1/2 top-7 w-48 -translate-x-1/2 rounded-2xl bg-white px-3 py-3 text-left text-xs shadow-lg ring-1 ring-gray-200"
          >
            <p class="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#141642]/70">
              Producto
            </p>
            <p class="mt-1 line-clamp-2 text-[13px] font-semibold text-[#141642]">
              {{ hotspot.name }}
            </p>
            <p class="mt-1 text-sm font-semibold text-[#141642]">
              ${{ hotspot.price.toLocaleString('es-CL') }}
            </p>
            <button
              type="button"
              class="mt-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#254B86] hover:underline"
              @click.stop="goToProduct(hotspot.slug)"
            >
              Ver producto
            </button>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>
