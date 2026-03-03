<script setup>
/**
 * Selector de rango de fechas para reservas.
 * Muestra un calendario mensual visual donde las fechas bloqueadas
 * (incluyendo 1 día antes y 1 día después de cada reserva) aparecen
 * deshabilitadas y no son seleccionables.
 */
import { ref, computed, watch } from 'vue';

const props = defineProps({
  inicio: { type: String, default: '' },
  fin: { type: String, default: '' },
  blockedDates: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:inicio', 'update:fin']);

// ─── utilidades de fecha ─────────────────────────────────────────────────────

function ymd(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date + 'T12:00:00');
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseYmd(str) {
  if (!str) return null;
  return new Date(str + 'T12:00:00');
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return ymd(a) === ymd(b);
}

const TODAY = ymd(new Date());

// ─── estado del calendario ────────────────────────────────────────────────────

const viewYear = ref(new Date().getFullYear());
const viewMonth = ref(new Date().getMonth()); // 0-indexed

// paso: 'start' = eligiendo inicio, 'end' = eligiendo fin
const step = ref(props.inicio ? 'end' : 'start');
// fecha sobre la que está el mouse (hover), para previsualizar el rango
const hoverDate = ref('');

// Set de fechas bloqueadas para lookup rápido
const blockedSet = computed(() => new Set(props.blockedDates || []));

// ─── días del mes actual en vista ────────────────────────────────────────────

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_NAMES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const calendarDays = computed(() => {
  const year = viewYear.value;
  const month = viewMonth.value;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // día de la semana del día 1 (0=Dom → necesitamos convertir a Lun=0)
  const startDow = (firstDay.getDay() + 6) % 7; // lunes = 0

  const days = [];
  // relleno inicial
  for (let i = 0; i < startDow; i++) {
    days.push(null);
  }
  // días del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // relleno final para completar filas de 7
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
});

// ─── helpers de estado de cada celda ─────────────────────────────────────────

function isBlocked(date) {
  if (!date) return false;
  return blockedSet.value.has(ymd(date));
}

function isPast(date) {
  if (!date) return false;
  return ymd(date) < TODAY;
}

function isDisabled(date) {
  if (!date) return true;
  return isPast(date) || isBlocked(date);
}

/** Verifica si el rango [startStr, endStr] contiene alguna fecha bloqueada */
function rangeHasBlocked(startStr, endStr) {
  if (!startStr || !endStr) return false;
  let d = parseYmd(startStr);
  const e = parseYmd(endStr);
  while (d <= e) {
    if (blockedSet.value.has(ymd(d))) return true;
    d = addDays(d, 1);
  }
  return false;
}

function isSelected(date) {
  if (!date) return false;
  const s = ymd(date);
  return s === props.inicio || s === props.fin;
}

function isInRange(date) {
  if (!date || !props.inicio || !props.fin) return false;
  const s = ymd(date);
  return s > props.inicio && s < props.fin;
}

/** Previsualización del rango mientras se hace hover en paso 'end' */
function isInHoverRange(date) {
  if (!date || step.value !== 'end' || !props.inicio || !hoverDate.value) return false;
  const s = ymd(date);
  const h = hoverDate.value;
  if (h < props.inicio) return false;
  return s > props.inicio && s < h;
}

function isHoverEnd(date) {
  if (!date || step.value !== 'end' || !hoverDate.value) return false;
  return ymd(date) === hoverDate.value;
}

// ─── interacción ─────────────────────────────────────────────────────────────

function selectDay(date) {
  if (isDisabled(date)) return;
  const s = ymd(date);

  if (step.value === 'start') {
    emit('update:inicio', s);
    emit('update:fin', '');
    step.value = 'end';
    hoverDate.value = '';
  } else {
    // paso 'end'
    if (s < props.inicio) {
      // si selecciona antes, reiniciar
      emit('update:inicio', s);
      emit('update:fin', '');
      step.value = 'end';
      hoverDate.value = '';
      return;
    }
    if (s === props.inicio) return; // misma fecha, ignorar
    // verificar que el rango no tenga fechas bloqueadas
    if (rangeHasBlocked(props.inicio, s)) return;
    emit('update:fin', s);
    step.value = 'start'; // listo, siguiente acción empieza nueva selección
    hoverDate.value = '';
  }
}

function onHover(date) {
  if (!date || step.value !== 'end') return;
  const s = ymd(date);
  if (s <= props.inicio) { hoverDate.value = ''; return; }
  // Solo mostrar hover si el rango no tiene bloqueados
  hoverDate.value = rangeHasBlocked(props.inicio, s) ? '' : s;
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}

function resetDates() {
  emit('update:inicio', '');
  emit('update:fin', '');
  step.value = 'start';
  hoverDate.value = '';
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

// cuando el padre cambia las fechas desde afuera, sincronizar el paso
watch(() => props.inicio, (val) => {
  if (!val) step.value = 'start';
  else if (!props.fin) step.value = 'end';
});

// Clases CSS para cada celda del calendario
function dayCellClass(date) {
  if (!date) return '';
  const s = ymd(date);
  const disabled = isDisabled(date);
  const inRange = isInRange(date) || isInHoverRange(date);
  const hoverEnd = isHoverEnd(date);
  const isStart = s === props.inicio;
  const isEnd = s === props.fin;

  let cls = 'relative flex h-9 w-9 items-center justify-center text-sm font-medium rounded-full select-none ';

  if (disabled) {
    cls += 'text-gray-300 cursor-not-allowed ';
    if (isBlocked(date)) cls += 'bg-red-50 line-through ';
    return cls;
  }

  if (isStart || isEnd) {
    cls += 'bg-[#141642] text-white cursor-pointer z-10 ';
    return cls;
  }

  if (hoverEnd && !disabled) {
    cls += 'bg-[#141642]/70 text-white cursor-pointer z-10 ';
    return cls;
  }

  if (inRange) {
    cls += 'text-[#141642] cursor-pointer ';
    return cls;
  }

  if (s === TODAY) {
    cls += 'text-[#141642] font-bold cursor-pointer hover:bg-[#141642]/10 ';
    return cls;
  }

  cls += 'text-gray-700 cursor-pointer hover:bg-gray-100 ';
  return cls;
}

function rangeHighlightClass(date) {
  if (!date) return '';
  const s = ymd(date);
  const inRange = isInRange(date) || isInHoverRange(date);
  const isStart = s === props.inicio;
  const isEnd = s === props.fin;
  const hoverEnd = isHoverEnd(date);
  const hasEnd = props.fin || hoverDate.value;

  if (!inRange && !isStart && !isEnd && !hoverEnd) return '';
  if (isDisabled(date)) return '';

  let cls = 'absolute inset-y-0 ';
  if (isStart && hasEnd) cls += 'left-1/2 right-0 bg-[#141642]/10 ';
  else if ((isEnd || hoverEnd) && props.inicio) cls += 'left-0 right-1/2 bg-[#141642]/10 ';
  else if (inRange) cls += 'inset-x-0 bg-[#141642]/10 ';
  else return '';
  return cls;
}
</script>

<template>
  <div class="w-full">
    <!-- Instrucción y reset -->
    <div class="mb-3 flex items-center justify-between">
      <p class="text-xs text-gray-500">
        <span v-if="step === 'start'">Selecciona la fecha de <strong>retiro</strong></span>
        <span v-else>Ahora selecciona la fecha de <strong>devolución</strong></span>
      </p>
      <button
        v-if="inicio || fin"
        type="button"
        class="text-xs text-gray-400 hover:text-red-500 transition"
        @click="resetDates"
      >
        Limpiar
      </button>
    </div>

    <!-- Fechas seleccionadas -->
    <div v-if="inicio || fin" class="mb-3 flex gap-3 text-sm">
      <div class="flex-1 rounded-lg border px-3 py-2" :class="step === 'start' ? 'border-[#141642] bg-[#141642]/5' : 'border-gray-200'">
        <p class="text-xs text-gray-400">Retiro</p>
        <p class="font-medium text-[#141642]">{{ formatDisplayDate(inicio) || '—' }}</p>
      </div>
      <div class="flex-1 rounded-lg border px-3 py-2" :class="step === 'end' ? 'border-[#141642] bg-[#141642]/5' : 'border-gray-200'">
        <p class="text-xs text-gray-400">Devolución</p>
        <p class="font-medium text-[#141642]">{{ formatDisplayDate(fin) || '—' }}</p>
      </div>
    </div>

    <!-- Cabecera del mes -->
    <div class="flex items-center justify-between mb-2">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
        @click="prevMonth"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-[#141642]">
        {{ MONTH_NAMES[viewMonth] }} {{ viewYear }}
      </span>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition"
        @click="nextMonth"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="grid grid-cols-7 mb-1">
      <div
        v-for="name in DAY_NAMES"
        :key="name"
        class="flex h-8 items-center justify-center text-xs font-medium text-gray-400"
      >
        {{ name }}
      </div>
    </div>

    <!-- Celdas del calendario -->
    <div class="grid grid-cols-7">
      <div
        v-for="(date, idx) in calendarDays"
        :key="idx"
        class="relative flex h-9 items-center justify-center"
        @mouseenter="onHover(date)"
        @mouseleave="hoverDate = ''"
      >
        <!-- Resalte de rango (fondo) -->
        <div v-if="date" :class="rangeHighlightClass(date)" />
        <!-- Celda del día -->
        <button
          v-if="date"
          type="button"
          :class="dayCellClass(date)"
          :disabled="isDisabled(date)"
          :title="isBlocked(date) ? 'Fecha no disponible' : ''"
          @click="selectDay(date)"
        >
          {{ date.getDate() }}
        </button>
      </div>
    </div>

    <!-- Leyenda -->
    <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-[#141642]" />
        Seleccionado
      </span>
      <span class="flex items-center gap-1">
        <span class="inline-block h-3 w-3 rounded-full bg-red-100" />
        No disponible
      </span>
    </div>
  </div>
</template>
