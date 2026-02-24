<script setup>
/**
 * Selector de rango de fechas para reservas (inputs nativos type="date").
 */
import { computed } from 'vue';

const props = defineProps({
  inicio: { type: String, default: '' },
  fin: { type: String, default: '' },
  blockedDates: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:inicio', 'update:fin']);

function formatYmd(d) {
  if (!d) return '';
  const x = d instanceof Date ? d : new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const todayYmd = () => new Date().toISOString().slice(0, 10);

/** Mínimo para fecha término: no antes de hoy ni antes de la fecha de inicio. */
const minFechaFin = computed(() => {
  const today = todayYmd();
  if (!props.inicio) return today;
  return props.inicio >= today ? props.inicio : today;
});

const isDateDisabled = computed(() => {
  const blocked = new Set(props.blockedDates || []);
  return (date) => blocked.has(formatYmd(date));
});
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2">
    <div>
      <label class="block text-xs font-medium text-gray-700">Fecha Retiro</label>
      <input
        :value="inicio"
        type="date"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
        :min="todayYmd()"
        @input="$emit('update:inicio', ($event.target).value)"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-gray-700">Fecha Devolución</label>
      <input
        :value="fin"
        type="date"
        class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
        :min="minFechaFin"
        @input="$emit('update:fin', ($event.target).value)"
      />
    </div>
  </div>
</template>
