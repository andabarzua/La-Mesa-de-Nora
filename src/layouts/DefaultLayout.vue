<script setup>
/**
 * Layout principal — La Mesa de Nora.
 * Desktop: COLLECCIONES (dropdown), CONTACTO, logo, búsqueda, carrito.
 * Mobile: hamburger que abre menú con toda la navegación.
 */
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import AppFooter from '@/components/layout/AppFooter.vue';
import CartSidebar from '@/components/cart/CartSidebar.vue';
import SearchOverlay from '@/components/search/SearchOverlay.vue';

const cartStore = useCartStore();

// Todas las colecciones (desktop + móvil)
const colecciones = [
  { slug: 'vajilla', title: 'Vajilla' },
  { slug: 'servilletas', title: 'Servilletas' },
  { slug: 'decoracion', title: 'Elementos de decoración' },
  { slug: 'cubiertos', title: 'Cubiertos' },
  { slug: 'cristaleria', title: 'Cristalería' },
  { slug: 'alturas', title: 'Alturas' },
  { slug: 'articulos-de-cocina', title: 'Artículos de cocina' },
  { slug: 'bar', title: 'Bar' },
  { slug: 'floreros', title: 'Floreros' },
  { slug: 'shots', title: 'Shots' },
  { slug: 'pocillos', title: 'Pocillos' },
  { slug: 'madera', title: 'Madera' },
  { slug: 'fuente', title: 'Fuente' },
  { slug: 'espejos', title: 'Espejos' },
];

const menuColeccionesOpen = ref(false);
const menuMobileOpen = ref(false);
const searchOverlayOpen = ref(false);

const route = useRoute();
watch(() => route.path, () => {
  menuMobileOpen.value = false;
  menuColeccionesOpen.value = false;
  searchOverlayOpen.value = false;
});

function toggleMobileMenu() {
  menuMobileOpen.value = !menuMobileOpen.value;
  if (!menuMobileOpen.value) menuColeccionesOpen.value = false;
}

function closeMobileMenu() {
  menuMobileOpen.value = false;
  menuColeccionesOpen.value = false;
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    menuColeccionesOpen.value = false;
    menuMobileOpen.value = false;
    searchOverlayOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});

</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <!-- Header fijo blanco -->
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div class="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center gap-2 px-3 md:h-20 md:gap-6 md:px-6 lg:h-32">
        <!-- Móvil: botón hamburguesa -->
        <div class="flex items-center md:hidden">
          <button
            type="button"
            class="p-2 text-gray-800 hover:text-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/50 rounded"
            aria-label="Abrir menú"
            aria-expanded="menuMobileOpen"
            @click="toggleMobileMenu"
          >
            <svg
              v-if="!menuMobileOpen"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Desktop: navegación izquierda -->
        <nav class="hidden min-w-0 items-center gap-2 md:flex md:gap-6">
          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-0.5 font-medium tracking-wide text-gray-800 hover:text-[#1D4ED8] focus:outline-none md:gap-1"
              :class="[menuColeccionesOpen && 'text-[#1D4ED8]', 'text-xs md:text-base']"
              aria-expanded="menuColeccionesOpen"
              aria-haspopup="true"
              @click="menuColeccionesOpen = !menuColeccionesOpen"
            >
              RENTAL
              <svg
                class="h-3 w-3 shrink-0 transition-transform md:h-4 md:w-4"
                :class="menuColeccionesOpen && 'rotate-180'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="menuColeccionesOpen"
              class="absolute left-0 top-full z-10 mt-1 max-h-[70vh] w-48 overflow-y-auto rounded-md border border-gray-200 bg-white py-2 shadow-lg"
            >
              <RouterLink
                to="/colecciones"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1D4ED8]"
                @click="menuColeccionesOpen = false"
              >
                Todas los Productos
              </RouterLink>
              <RouterLink
                v-for="c in colecciones"
                :key="c.slug"
                :to="`/colecciones/${c.slug}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1D4ED8]"
                @click="menuColeccionesOpen = false"
              >
                {{ c.title }}
              </RouterLink>
            </div>
          </div>
          <RouterLink
            to="/contacto"
            class="whitespace-nowrap font-medium tracking-wide text-gray-800 hover:text-[#1D4ED8] text-xs md:text-base"
          >
            CONTACTO
          </RouterLink>
        </nav>

        <!-- Logo central -->
        <RouterLink
          to="/"
          class="flex items-center justify-center px-1"
          aria-label="La Mesa de Nora - Inicio"
        >
          <img
            src="/img/LMDN_Logo.webp"
            alt="LA MESA DE NORA - EXCLUSIVE RENTAL"
            class="h-14 w-auto max-w-[220px] object-contain md:h-16 lg:h-28"
          />
        </RouterLink>

        <!-- Iconos derecha: búsqueda y carrito -->
        <div class="flex items-center justify-end gap-1 md:gap-4">
          <button
            type="button"
            class="p-2 text-gray-700 hover:text-[#1D4ED8]"
            aria-label="Buscar"
            @click="searchOverlayOpen = true"
          >
            <svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            type="button"
            class="relative p-2 text-gray-700 hover:text-[#1D4ED8]"
            aria-label="Abrir carrito"
            @click="cartStore.openSidebar()"
          >
            <svg class="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span
              v-if="cartStore.count > 0"
              class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#141642] px-1 text-[10px] font-bold text-white"
            >
              {{ cartStore.count > 99 ? '99+' : cartStore.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Sidebar del carrito -->
      <CartSidebar v-model="cartStore.sidebarOpen" />
      <!-- Overlay de búsqueda en tiempo real -->
      <SearchOverlay v-model="searchOverlayOpen" />

      <!-- Menú móvil (drawer): toda la navegación -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-show="menuMobileOpen"
          class="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-hidden="true"
          @click="closeMobileMenu"
        />
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-200 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <aside
          v-show="menuMobileOpen"
          class="fixed left-0 top-0 z-50 h-full w-72 max-w-[85vw] border-r border-gray-200 bg-white shadow-xl md:hidden"
          aria-label="Menú de navegación"
        >
          <div class="flex h-14 items-center justify-between border-b border-gray-200 px-4">
            <span class="font-semibold text-gray-800">Menú</span>
            <button
              type="button"
              class="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Cerrar menú"
              @click="closeMobileMenu"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="flex flex-col py-4" @click.stop>
            <button
              type="button"
              class="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 hover:text-[#254B86]"
              :class="menuColeccionesOpen && 'text-[#254B86] bg-gray-50'"
              @click="menuColeccionesOpen = !menuColeccionesOpen"
            >
              RENTAL
              <svg
                class="h-4 w-4 transition-transform"
                :class="menuColeccionesOpen && 'rotate-180'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="menuColeccionesOpen" class="max-h-[50vh] overflow-y-auto border-b border-gray-100 bg-gray-50/50 py-1">
              <RouterLink
                to="/colecciones"
                class="block px-6 py-2 text-sm text-gray-700 hover:text-[#254B86]"
                @click="closeMobileMenu"
              >
                Todas las colecciones
              </RouterLink>
              <RouterLink
                v-for="c in colecciones"
                :key="c.slug"
                :to="`/colecciones/${c.slug}`"
                class="block px-6 py-2 text-sm text-gray-700 hover:text-[#254B86]"
                @click="closeMobileMenu"
              >
                {{ c.title }}
              </RouterLink>
            </div>
            <RouterLink
              to="/contacto"
              class="px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 hover:text-[#254B86]"
              @click="closeMobileMenu"
            >
              CONTACTO
            </RouterLink>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 hover:text-[#254B86]"
              @click="searchOverlayOpen = true; closeMobileMenu()"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 hover:text-[#254B86]"
              @click="cartStore.openSidebar(); closeMobileMenu()"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Carrito
            </button>
          </nav>
        </aside>
      </Transition>
    </header>

    <!-- Contenido -->
    <main class="flex-1">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
