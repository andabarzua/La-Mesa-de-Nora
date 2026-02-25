<script setup>
/**
 * Sidebar del carrito — La Mesa de Nora.
 * Muestra ítems (imagen redondeada, nombre, fechas, cantidad, precio) y totales (subtotal, IVA, total).
 * Cierre: botón X y tecla ESC.
 */
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { fetchCartBlockedDates } from '@/api/endpoints/availability';
import ReservationDatePicker from '@/components/ReservationDatePicker.vue';

const reservationStartDate = ref('');
const reservationEndDate = ref('');
const editDatesModalOpen = ref(false);
const editStartDate = ref('');
const editEndDate = ref('');
const blockedDates = ref([]);

function loadReservationDates() {
  reservationStartDate.value = localStorage.getItem('lmdn_reservation_start') ?? '';
  reservationEndDate.value = localStorage.getItem('lmdn_reservation_end') ?? '';
}

async function openEditDatesModal() {
  editStartDate.value = reservationStartDate.value || '';
  editEndDate.value = reservationEndDate.value || '';
  editDatesModalOpen.value = true;
  try {
    const res = await fetchCartBlockedDates();
    blockedDates.value = res?.blocked_dates ?? [];
  } catch {
    blockedDates.value = [];
  }
}

function saveEditedDates() {
  if (!editStartDate.value || !editEndDate.value) return;
  localStorage.setItem('lmdn_reservation_start', editStartDate.value);
  localStorage.setItem('lmdn_reservation_end', editEndDate.value);
  reservationStartDate.value = editStartDate.value;
  reservationEndDate.value = editEndDate.value;
  editDatesModalOpen.value = false;
}

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const cartStore = useCartStore();

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

function close() {
  open.value = false;
}

const todayYmd = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

const isReservationDateInPast = computed(() => {
  const start = reservationStartDate.value;
  const end = reservationEndDate.value;
  const today = todayYmd();
  if (start && start < today) return true;
  if (end && end < today) return true;
  return false;
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    loadReservationDates();
    document.addEventListener('keydown', onKeydown);
  } else {
    document.removeEventListener('keydown', onKeydown);
  }
}, { immediate: true });

onMounted(() => {
  loadReservationDates();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/30"
      aria-hidden="true"
      @click="close"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition
    enter-active-class="transition-transform duration-200 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-show="open"
      class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl"
      aria-label="Carrito de compras"
    >
      <!-- Cabecera -->
      <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
        <h2 class="text-lg font-semibold text-[#141642]">Carrito</h2>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
          aria-label="Cerrar carrito (Esc)"
          @click="close"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Fechas de reserva (al comienzo) -->
      <div
        v-if="reservationStartDate && reservationEndDate"
        class="shrink-0 border-b border-gray-200 bg-[#141642]/5 px-4 py-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Fechas solicitadas</p>
            <p v-if="isReservationDateInPast" class="mt-1 text-sm font-medium text-red-600">
              Fecha No Disponible
            </p>
            <p v-else class="mt-1 text-sm font-medium text-[#141642]">
              {{ formatDate(reservationStartDate) }} — {{ formatDate(reservationEndDate) }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-[#141642] transition hover:bg-[#141642]/10 focus:outline-none focus:ring-2 focus:ring-[#141642]/30"
            @click="openEditDatesModal"
          >
            Editar
          </button>
        </div>
      </div>
      <!-- Si no hay fechas, mostrar botón para agregarlas -->
      <div
        v-else
        class="shrink-0 border-b border-gray-200 bg-amber-50/80 px-4 py-3"
      >
        <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Fechas solicitadas</p>
        <button
          type="button"
          class="mt-1 text-sm font-medium text-[#141642] hover:underline focus:outline-none focus:ring-2 focus:ring-[#141642]/30 rounded"
          @click="openEditDatesModal"
        >
          Indica las fechas de tu evento
        </button>
      </div>

      <!-- Contenido: lista de ítems o vacío -->
      <div class="flex-1 overflow-y-auto px-4 py-4">
        <template v-if="cartStore.items.length === 0">
          <p class="py-8 text-center text-gray-500">Tu carrito está vacío.</p>
          <RouterLink
            to="/"
            class="block text-center text-[#254B86] font-medium hover:underline"
            @click="close"
          >
            Ver productos
          </RouterLink>
        </template>
        <template v-else>
          <ul class="space-y-4">
            <li
              v-for="item in cartStore.items"
              :key="`${item.product_id}_${item.combination_id ?? 0}`"
              class="flex gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-3"
            >
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img
                  :src="item.cover_url || '/img/colecciones/vajillas.webp'"
                  :alt="item.name"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-medium text-gray-900 line-clamp-2">{{ item.name }}</p>
                <p v-if="item.attributes?.length" class="mt-0.5 text-xs text-gray-500">
                  {{ item.attributes.map(a => `${a.group}: ${a.value}`).join(' · ') }}
                </p>
                <p v-else-if="item.reference" class="mt-0.5 text-xs text-gray-500">Ref: {{ item.reference }}</p>
                <p class="mt-1 text-sm font-medium text-[#141642]">
                  {{ item.quantity }} × ${{ (item.unit_price || 0).toLocaleString('es-CL') }}
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                aria-label="Quitar del carrito"
                @click="cartStore.removeProduct(item.product_id, item.combination_id)"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          </ul>
        </template>
      </div>

      <!-- Totales (solo si hay ítems) -->
      <div
        v-if="cartStore.items.length > 0"
        class="shrink-0 border-t border-gray-200 bg-white px-4 py-4"
      >
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${{ cartStore.subtotal.toLocaleString('es-CL') }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>IVA (19%)</span>
            <span>${{ cartStore.iva.toLocaleString('es-CL') }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Garantía (30%)</span>
            <span>${{ cartStore.garantia.toLocaleString('es-CL') }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-[#141642]">
            <span>Total a pagar</span>
            <span>${{ cartStore.total.toLocaleString('es-CL') }}</span>
          </div>
        </div>
        <RouterLink
          to="/checkout"
          class="mt-4 block w-full rounded-lg bg-[#141642] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2"
          @click="close"
        >
          Finalizar pedido
        </RouterLink>
      </div>

      <!-- Modal editar fechas -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="editDatesModalOpen"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            @click.self="editDatesModalOpen = false"
          >
            <div class="w-full max-w-sm rounded-2xl bg-white px-5 py-5 shadow-xl">
              <h3 class="text-base font-semibold tracking-tight text-[#141642]">
                Editar fechas de reserva
              </h3>
              <p class="mt-1 text-sm text-gray-600">
                Indica el rango de fechas para tu evento.
              </p>

              <form class="mt-4 space-y-3" @submit.prevent="saveEditedDates">
                <ReservationDatePicker
                  :inicio="editStartDate"
                  :fin="editEndDate"
                  :blocked-dates="blockedDates"
                  @update:inicio="editStartDate = $event"
                  @update:fin="editEndDate = $event"
                />

                <div class="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    @click="editDatesModalOpen = false"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    class="rounded-lg bg-[#141642] px-4 py-2 text-sm font-semibold text-white hover:bg-[#141642]/90"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
    </aside>
  </Transition>
</template>
