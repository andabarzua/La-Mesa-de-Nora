<script setup>
/**
 * Vista Checkout — La Mesa de Nora.
 * Formulario de datos de contacto/entrega + resumen del pedido. Diseño minimalista.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { checkout } from '@/api/endpoints/cart';
import { fetchCarriers } from '@/api/endpoints/carriers';

const router = useRouter();
const cartStore = useCartStore();

onMounted(async () => {
  try {
    const guardado = localStorage.getItem(CHECKOUT_CONTACTO_KEY);
    if (guardado) {
      const data = JSON.parse(guardado);
        if (data?.nombre || data?.email || data?.telefono || data?.direccion) {
        form.value = {
          nombre: data.nombre ?? '',
          email: data.email ?? '',
          telefono: data.telefono ?? '',
          direccion: data.direccion ?? '',
          comuna: data.comuna ?? '',
          comentarios: data.comentarios ?? '',
        };
        if (data.tipoDocumento) tipoDocumento.value = data.tipoDocumento;
        if (data.factura && tipoDocumento.value === 'factura') {
          factura.value = {
            rut: data.factura.rut ?? '',
            razonSocial: data.factura.razonSocial ?? '',
            giro: data.factura.giro ?? '',
            direccionTributaria: data.factura.direccionTributaria ?? '',
          };
        }
        const contactoOk = data.nombre && data.email && data.telefono && data.direccion;
        if (contactoOk) seccionContactoExpandida.value = false;
        const docOk = data.tipoDocumento === 'boleta' || (data.tipoDocumento === 'factura' && data.factura?.razonSocial);
        if (docOk) seccionDocumentoExpandida.value = false;
      }
    }
  } catch {
    // Ignorar si falla al cargar datos guardados
  }
  cartStore.loadCart();
  try {
    const { carriers } = await fetchCarriers();
    if (Array.isArray(carriers) && carriers.length > 0) {
      transportes.value = carriers.map((c) => ({ id: c.id, nombre: c.nombre || 'Entrega' }));
      if (transportes.value.length > 0 && !transportes.value.some((t) => t.id === transporteId.value)) {
        transporteId.value = transportes.value[0].id;
      }
    } else {
      transportes.value = [{ id: 4, nombre: 'Entrega' }];
    }
  } catch {
    transportes.value = [{ id: 4, nombre: 'Entrega' }];
  }
});

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  comuna: '',
  comentarios: '',
});

const tipoDocumento = ref('boleta');
const factura = ref({
  rut: '',
  razonSocial: '',
  giro: '',
  direccionTributaria: '',
});

const enviando = ref(false);
const confirmado = ref(false);
const resumenPedidoConfirmado = ref(null);
const errorMensaje = ref('');
const metodoPago = ref('transferencia');
const transporteId = ref(4);
const mostrarPopupDatos = ref(false);
const copiado = ref(false);

const transportes = ref([{ id: 4, nombre: 'Entrega' }]);
const CHECKOUT_CONTACTO_KEY = 'lmdn_checkout_contacto';
const seccionContactoExpandida = ref(true);
const formContactoRef = ref(null);
const seccionDocumentoExpandida = ref(true);
const formDocumentoRef = ref(null);

const datosTransferencia = {
  empresa: 'Nueva Consentido SPA',
  rut: '77.227.749-0',
  banco: 'Santander',
  tipoCuenta: 'Cuenta Corriente',
  numeroCuenta: '78271752',
};

const textoParaCopiar = computed(() =>
  `Empresa: ${datosTransferencia.empresa}\nRUT: ${datosTransferencia.rut}\nBanco: ${datosTransferencia.banco}\nTipo de cuenta: ${datosTransferencia.tipoCuenta}\nNúmero de cuenta: ${datosTransferencia.numeroCuenta}`,
);

function abrirPopupDatos() {
  mostrarPopupDatos.value = true;
  copiado.value = false;
}

function cerrarPopupDatos() {
  mostrarPopupDatos.value = false;
}

async function copiarDatos() {
  try {
    await navigator.clipboard.writeText(textoParaCopiar.value);
    copiado.value = true;
    setTimeout(() => { copiado.value = false; }, 2000);
  } catch {
    copiado.value = false;
  }
}

const formValido = computed(() => {
  const base =
    form.value.nombre?.trim() &&
    form.value.email?.trim() &&
    form.value.telefono?.trim() &&
    form.value.direccion?.trim();
  if (!base) return false;
  if (tipoDocumento.value === 'factura') {
    return (
      factura.value.rut?.trim() &&
      factura.value.razonSocial?.trim() &&
      factura.value.giro?.trim() &&
      factura.value.direccionTributaria?.trim()
    );
  }
  return true;
});

async function confirmarPedido() {
  if (!formValido.value || cartStore.items.length === 0) return;
  enviando.value = true;
  errorMensaje.value = '';
  try {
    const inicio = typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_start') : null;
    const fin = typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_end') : null;
    const res = await checkout({
      nombre: form.value.nombre,
      email: form.value.email,
      telefono: form.value.telefono,
      direccion: form.value.direccion,
      comuna: form.value.comuna,
      comentarios: form.value.comentarios,
      tipo_documento: tipoDocumento.value,
      fechas_reserva: inicio && fin ? { inicio, fin } : null,
      factura:
        tipoDocumento.value === 'factura'
          ? {
              rut: factura.value.rut,
              razon_social: factura.value.razonSocial,
              giro: factura.value.giro,
              direccion_tributaria: factura.value.direccionTributaria,
            }
          : null,
      metodo_pago: metodoPago.value,
    });
    if (res?.success) {
      if (metodoPago.value === 'mercado_pago' && res.mercado_pago?.init_point) {
        window.location.href = res.mercado_pago.init_point;
        return;
      }
      const transporteSeleccionado = transportes.value.find((t) => t.id === transporteId.value);
      const inicio = typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_start') : null;
      const fin = typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_end') : null;
      resumenPedidoConfirmado.value = {
        referencia: res.reference ?? '',
        total: cartStore.total,
        items: [...cartStore.items],
        transporte: transporteSeleccionado?.nombre ?? 'Entrega',
        tipoDocumento: tipoDocumento.value,
        factura: tipoDocumento.value === 'factura' ? { ...factura.value } : null,
        contacto: { ...form.value },
        fechasReserva: inicio && fin ? { inicio, fin } : null,
      };
      confirmado.value = true;
      cartStore.clear();
      try { localStorage.removeItem(CHECKOUT_CONTACTO_KEY); } catch { /* limpiar al confirmar */ }
    } else {
      errorMensaje.value = res?.message || 'No se pudo crear el pedido.';
    }
  } catch (e) {
    errorMensaje.value =
      e?.response?.data?.message ||
      e?.message ||
      'Error al procesar el pedido. Intenta de nuevo.';
  } finally {
    enviando.value = false;
  }
}

function volverInicio() {
  confirmado.value = false;
  resumenPedidoConfirmado.value = null;
  router.push('/');
}

const datosPrueba = {
  nombre: 'María González López',
  email: 'maria.gonzalez@ejemplo.cl',
  telefono: '+56 9 8765 4321',
  direccion: 'Av. Providencia 1234, Depto 501',
  comuna: 'Providencia',
  comentarios: 'Pedido de prueba para verificar en backoffice.',
};

const datosPruebaFactura = {
  rut: '12.345.678-9',
  razonSocial: 'Empresa Demo SpA',
  giro: 'Comercio al por menor',
  direccionTributaria: 'Av. Libertador 1000, Santiago',
};

function rellenarDatosPrueba() {
  form.value = { ...datosPrueba };
  if (tipoDocumento.value === 'factura') {
    factura.value = { ...datosPruebaFactura };
  }
}

const resumenContacto = computed(() => {
  if (!form.value.nombre?.trim() && !form.value.email?.trim()) return 'Datos de contacto';
  const partes = [];
  if (form.value.nombre?.trim()) partes.push(form.value.nombre.trim());
  if (form.value.email?.trim()) partes.push(form.value.email.trim());
  return partes.length > 0 ? partes.join(' · ') : 'Datos de contacto';
});

const contactoCompleto = computed(() =>
  form.value.nombre?.trim() &&
  form.value.email?.trim() &&
  form.value.telefono?.trim() &&
  form.value.direccion?.trim(),
);

function guardarDatosContacto() {
  if (!contactoCompleto.value) return;
  try {
    const data = {
      ...form.value,
      tipoDocumento: tipoDocumento.value,
      factura: tipoDocumento.value === 'factura' ? { ...factura.value } : null,
    };
    localStorage.setItem(CHECKOUT_CONTACTO_KEY, JSON.stringify(data));
  } catch {
    // Ignorar si falla al guardar
  }
}

watch(
  [form, tipoDocumento, factura],
  () => { guardarDatosContacto(); },
  { deep: true },
);

function onFormFocusOut() {
  if (!contactoCompleto.value) return;
  guardarDatosContacto();
  setTimeout(() => {
    const el = formContactoRef.value;
    if (!el) return;
    if (!el.contains(document.activeElement)) {
      seccionContactoExpandida.value = false;
    }
  }, 0);
}

const fechasReserva = computed(() => ({
  inicio: typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_start') : null,
  fin: typeof localStorage !== 'undefined' ? localStorage.getItem('lmdn_reservation_end') : null,
}));

function formatDateReserva(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
}

const resumenDocumento = computed(() => {
  if (tipoDocumento.value === 'boleta') return 'Boleta';
  if (factura.value.razonSocial?.trim()) return `Factura · ${factura.value.razonSocial.trim()}`;
  return 'Factura (completar datos)';
});

function onDocumentoFocusOut() {
  const docCompleto = tipoDocumento.value === 'boleta' ||
    (tipoDocumento.value === 'factura' && factura.value.rut?.trim() && factura.value.razonSocial?.trim() &&
      factura.value.giro?.trim() && factura.value.direccionTributaria?.trim());
  if (!docCompleto) return;
  setTimeout(() => {
    const el = formDocumentoRef.value;
    if (!el) return;
    if (!el.contains(document.activeElement)) {
      seccionDocumentoExpandida.value = false;
    }
  }, 50);
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-[#141642] px-4 py-10 text-center md:py-14">
      <h1 class="text-2xl font-semibold tracking-wide text-white md:text-3xl">
        Finalizar pedido
      </h1>
      <p class="mx-auto mt-2 max-w-md text-sm text-white/85 md:text-base">
        Revisa tu pedido y completa tus datos para confirmar.
      </p>
    </section>

    <!-- Carrito vacío -->
    <div
      v-if="cartStore.items.length === 0 && !confirmado"
      class="mx-auto max-w-lg px-4 py-16 text-center"
    >
      <p class="text-gray-600">Tu carrito está vacío.</p>
      <RouterLink
        to="/"
        class="mt-4 inline-block rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90"
      >
        Ver productos
      </RouterLink>
    </div>

    <!-- Confirmación enviada -->
    <div
      v-else-if="confirmado"
      class="mx-auto max-w-2xl px-4 py-12"
    >
      <div class="text-center">
        <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Pedido Solicitado</h2>
        <p class="mt-2 text-gray-600">
          Te contactaremos a la brevedad para confirmar fechas y forma de pago.
        </p>
      </div>

        <div v-if="resumenPedidoConfirmado" class="mt-10 rounded-2xl border border-gray-200 bg-gray-50/50 p-6 text-left">
        <div class="space-y-6">
          <div v-if="resumenPedidoConfirmado.fechasReserva">
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Fechas solicitadas</p>
            <p class="mt-1 text-gray-900">
              {{ formatDateReserva(resumenPedidoConfirmado.fechasReserva.inicio) }} — {{ formatDateReserva(resumenPedidoConfirmado.fechasReserva.fin) }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Referencia</p>
            <p class="mt-1 text-lg font-semibold text-[#141642]">{{ resumenPedidoConfirmado.referencia }}</p>
          </div>

          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Total a pagar</p>
            <p class="mt-1 text-xl font-bold text-[#141642]">${{ (resumenPedidoConfirmado.total || 0).toLocaleString('es-CL') }}</p>
            <p class="mt-1 text-xs text-gray-500">
              Incluye IVA (19%) y Garantía (30%)
            </p>
          </div>

          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Productos</p>
            <ul class="mt-2 space-y-2">
              <li
                v-for="item in resumenPedidoConfirmado.items"
                :key="`${item.product_id}_${item.combination_id ?? 0}`"
                class="flex justify-between gap-4 text-sm"
              >
                <span class="text-gray-700">
                  {{ item.name }}
                  <span v-if="item.attributes?.length" class="block text-xs text-gray-500">
                    {{ item.attributes.map(a => `${a.group}: ${a.value}`).join(' · ') }}
                  </span>
                  <span class="text-gray-500"> × {{ item.quantity }}</span>
                </span>
                <span class="shrink-0 font-medium">${{ (item.total ?? (item.unit_price || 0) * (item.quantity || 0)).toLocaleString('es-CL') }}</span>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Transporte seleccionado</p>
            <p class="mt-1 text-gray-900">{{ resumenPedidoConfirmado.transporte }}</p>
          </div>

          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Documento</p>
            <p class="mt-1 text-gray-900">
              {{ resumenPedidoConfirmado.tipoDocumento === 'factura' ? 'Factura' : 'Boleta' }}
              <template v-if="resumenPedidoConfirmado.tipoDocumento === 'factura' && resumenPedidoConfirmado.factura">
                — {{ resumenPedidoConfirmado.factura.razonSocial }} · RUT {{ resumenPedidoConfirmado.factura.rut }}
              </template>
            </p>
          </div>

          <div>
            <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Datos de contacto</p>
            <div class="mt-2 space-y-1 text-sm text-gray-700">
              <p>{{ resumenPedidoConfirmado.contacto?.nombre }}</p>
              <p>{{ resumenPedidoConfirmado.contacto?.email }}</p>
              <p>{{ resumenPedidoConfirmado.contacto?.telefono }}</p>
              <p>{{ resumenPedidoConfirmado.contacto?.direccion }}{{ resumenPedidoConfirmado.contacto?.comuna ? ', ' + resumenPedidoConfirmado.contacto.comuna : '' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center">
        <button
          type="button"
          class="rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90"
          @click="volverInicio"
        >
          Volver al inicio
        </button>
      </div>
    </div>

    <!-- Formulario + Resumen -->
    <div
      v-else
      class="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14"
    >
      <div class="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <!-- Columna izquierda: datos de contacto + tipo documento -->
        <div class="lg:col-span-3 space-y-8">
          <form
            id="checkout-form"
            @submit.prevent="confirmarPedido"
          >
        <!-- Bloque 1: datos de contacto y entrega (colapsable) -->
        <div ref="formContactoRef">
          <div
            class="cursor-pointer rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
            @click="seccionContactoExpandida = !seccionContactoExpandida"
          >
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141642]/10 text-[#141642]"
                >
                  <svg
                    class="h-5 w-5 transition-transform"
                    :class="{ 'rotate-180': seccionContactoExpandida }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-[#141642]">Datos de contacto y entrega</h2>
                  <p class="text-sm text-gray-500">{{ resumenContacto }}</p>
                </div>
              </div>
              <span
                v-if="contactoCompleto"
                class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Completo
              </span>
            </div>
          </div>

          <div
            v-show="seccionContactoExpandida"
            class="overflow-hidden transition-all"
          >
            <div class="border-x border-b border-gray-200 px-4 pb-6 pt-4">
              <p class="text-sm text-gray-500">Completa los datos para coordinar la entrega.</p>
              <button
                type="button"
                class="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                @click.stop="rellenarDatosPrueba"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Rellenar con datos de prueba
              </button>
              <div
                v-if="errorMensaje"
                class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {{ errorMensaje }}
              </div>
              <div class="mt-6 space-y-5" @focusout="onFormFocusOut">
            <div>
              <label for="checkout-nombre" class="block text-sm font-medium text-gray-700">Nombre completo *</label>
              <input
                id="checkout-nombre"
                v-model="form.nombre"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label for="checkout-email" class="block text-sm font-medium text-gray-700">Correo electrónico *</label>
              <input
                id="checkout-email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label for="checkout-telefono" class="block text-sm font-medium text-gray-700">Teléfono *</label>
              <input
                id="checkout-telefono"
                v-model="form.telefono"
                type="tel"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div>
              <label for="checkout-direccion" class="block text-sm font-medium text-gray-700">Dirección de entrega *</label>
              <input
                id="checkout-direccion"
                v-model="form.direccion"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Calle, número, depto"
              />
            </div>
            <div>
              <label for="checkout-comuna" class="block text-sm font-medium text-gray-700">Comuna</label>
              <input
                id="checkout-comuna"
                v-model="form.comuna"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Ej: Las Condes"
              />
            </div>
            <div>
              <label for="checkout-comentarios" class="block text-sm font-medium text-gray-700">Comentarios</label>
              <textarea
                id="checkout-comentarios"
                v-model="form.comentarios"
                rows="3"
                class="mt-1 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Indicaciones adicionales para la entrega..."
              />
            </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bloque 2: tipo de documento (colapsable) -->
        <div ref="formDocumentoRef" class="mt-2">
          <div
            class="cursor-pointer rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
            @click="seccionDocumentoExpandida = !seccionDocumentoExpandida"
          >
            <div class="flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141642]/10 text-[#141642]"
                >
                  <svg
                    class="h-5 w-5 transition-transform"
                    :class="{ 'rotate-180': seccionDocumentoExpandida }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-[#141642]">Tipo de documento</h2>
                  <p class="text-sm text-gray-500">{{ resumenDocumento }}</p>
                </div>
              </div>
              <span
                v-if="tipoDocumento === 'boleta' || (tipoDocumento === 'factura' && factura.rut && factura.razonSocial && factura.giro && factura.direccionTributaria)"
                class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Completo
              </span>
            </div>
          </div>

          <div
            v-show="seccionDocumentoExpandida"
            class="overflow-hidden transition-all"
          >
            <div class="rounded-b-xl border-x border-b border-gray-200 px-4 pb-6 pt-4" @focusout="onDocumentoFocusOut">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Tipo de documento *</label>
                  <div class="mt-2 flex gap-4">
                    <label class="flex cursor-pointer items-center gap-2">
                      <input
                        v-model="tipoDocumento"
                        type="radio"
                        value="boleta"
                        class="h-4 w-4 border-gray-300 text-[#141642] focus:ring-[#141642]"
                      />
                      <span class="text-sm font-medium text-gray-900">Boleta</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-2">
                      <input
                        v-model="tipoDocumento"
                        type="radio"
                        value="factura"
                        class="h-4 w-4 border-gray-300 text-[#141642] focus:ring-[#141642]"
                      />
                      <span class="text-sm font-medium text-gray-900">Factura</span>
                    </label>
                  </div>
                </div>

                <div v-if="tipoDocumento === 'factura'" class="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <h3 class="text-sm font-semibold text-[#141642]">Datos para facturar</h3>
                  <div>
                    <label for="checkout-rut" class="block text-sm font-medium text-gray-700">RUT *</label>
                    <input
                      id="checkout-rut"
                      v-model="factura.rut"
                      type="text"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                      placeholder="12.345.678-9"
                    />
                  </div>
                  <div>
                    <label for="checkout-razon-social" class="block text-sm font-medium text-gray-700">Razón social *</label>
                    <input
                      id="checkout-razon-social"
                      v-model="factura.razonSocial"
                      type="text"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                      placeholder="Nombre o razón social"
                    />
                  </div>
                  <div>
                    <label for="checkout-giro" class="block text-sm font-medium text-gray-700">Giro *</label>
                    <input
                      id="checkout-giro"
                      v-model="factura.giro"
                      type="text"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                      placeholder="Actividad económica"
                    />
                  </div>
                  <div>
                    <label for="checkout-direccion-tributaria" class="block text-sm font-medium text-gray-700">Dirección tributaria *</label>
                    <input
                      id="checkout-direccion-tributaria"
                      v-model="factura.direccionTributaria"
                      type="text"
                      class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                      placeholder="Dirección fiscal"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          </form>
        </div>

        <!-- Columna derecha: resumen del pedido -->
        <div class="lg:col-span-2">
          <div class="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 md:p-6">
            <h2 class="text-lg font-semibold text-[#141642]">Resumen del pedido</h2>
            <div
              v-if="fechasReserva.inicio && fechasReserva.fin"
              class="mt-4 rounded-xl border border-[#141642]/20 bg-[#141642]/5 px-4 py-3"
            >
              <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Fechas solicitadas</p>
              <p class="mt-1 text-sm font-medium text-[#141642]">
                {{ formatDateReserva(fechasReserva.inicio) }} — {{ formatDateReserva(fechasReserva.fin) }}
              </p>
            </div>
            <ul class="mt-4 space-y-3 max-h-64 overflow-y-auto">
              <li
                v-for="item in cartStore.items"
                :key="`${item.product_id}_${item.combination_id ?? 0}`"
                class="flex gap-3 rounded-xl border border-gray-100 bg-white p-3"
              >
                <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    :src="item.cover_url || '/img/colecciones/vajillas.webp'"
                    :alt="item.name"
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ item.name }}</p>
                  <p v-if="item.attributes?.length" class="mt-0.5 text-xs text-gray-500">
                    {{ item.attributes.map(a => `${a.group}: ${a.value}`).join(' · ') }}
                  </p>
                  <p v-else-if="item.reference" class="mt-0.5 text-xs text-gray-500">Ref: {{ item.reference }}</p>
                  <p class="text-sm font-medium text-[#141642]">
                    {{ item.quantity }} × ${{ (item.unit_price || 0).toLocaleString('es-CL') }}
                  </p>
                </div>
              </li>
            </ul>
            <div class="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
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
                <span>Total</span>
                <span>${{ cartStore.total.toLocaleString('es-CL') }}</span>
              </div>
            </div>

            <!-- Transporte -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <h3 class="text-sm font-semibold text-gray-900">Transporte</h3>
              <label
                v-for="t in transportes"
                :key="t.id"
                class="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50"
              >
                <input
                  v-model="transporteId"
                  type="radio"
                  :value="t.id"
                  class="h-4 w-4 border-gray-300 text-[#141642] focus:ring-[#141642]"
                />
                <span class="flex-1 font-medium text-gray-900">{{ t.nombre }}</span>
              </label>
            </div>

            <!-- Medio de pago -->
            <div class="mt-5 border-t border-gray-200 pt-5">
              <h3 class="text-sm font-semibold text-gray-900">Medio de pago</h3>
              <label class="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50">
                <input
                  v-model="metodoPago"
                  type="radio"
                  value="transferencia"
                  class="h-4 w-4 border-gray-300 text-[#141642] focus:ring-[#141642]"
                />
                <span class="flex-1 font-medium text-gray-900">Transferencia bancaria</span>
              </label>
              <label class="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50">
                <input
                  v-model="metodoPago"
                  type="radio"
                  value="mercado_pago"
                  class="h-4 w-4 border-gray-300 text-[#141642] focus:ring-[#141642]"
                />
                <span class="flex-1 font-medium text-gray-900">Tarjetas / Mercado Pago</span>
              </label>
              <button
                v-if="metodoPago === 'transferencia'"
                type="button"
                @click="abrirPopupDatos"
                class="mt-3 w-full rounded-lg border border-[#141642] bg-white py-2.5 text-sm font-medium text-[#141642] transition hover:bg-[#141642]/5"
              >
                Mostrar datos
              </button>
            </div>

            <button
              type="submit"
              form="checkout-form"
              :disabled="!formValido || enviando || cartStore.items.length === 0"
              class="mt-5 w-full rounded-lg py-3.5 font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              :class="formValido && !enviando && cartStore.items.length > 0 ? 'bg-[#141642] hover:bg-[#141642]/90' : 'bg-gray-400'"
            >
              {{ enviando ? 'Enviando...' : 'Confirmar pedido' }}
            </button>
            <RouterLink
              to="/"
              class="mt-3 block text-center text-sm text-[#254B86] hover:underline"
            >
              Seguir comprando
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Popup datos transferencia -->
    <Teleport to="body">
      <div
        v-if="mostrarPopupDatos"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="cerrarPopupDatos"
      >
        <div
          class="max-w-md w-full rounded-2xl bg-white p-6 shadow-xl"
          role="dialog"
          aria-labelledby="popup-titulo"
          aria-modal="true"
        >
          <div class="flex items-center justify-between">
            <h2 id="popup-titulo" class="text-lg font-semibold text-[#141642]">Datos para transferencia bancaria</h2>
            <button
              type="button"
              class="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              aria-label="Cerrar"
              @click="cerrarPopupDatos"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-4 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
            <p><span class="font-medium text-gray-600">Empresa:</span> {{ datosTransferencia.empresa }}</p>
            <p><span class="font-medium text-gray-600">RUT:</span> {{ datosTransferencia.rut }}</p>
            <p><span class="font-medium text-gray-600">Banco:</span> {{ datosTransferencia.banco }}</p>
            <p><span class="font-medium text-gray-600">Tipo de cuenta:</span> {{ datosTransferencia.tipoCuenta }}</p>
            <p><span class="font-medium text-gray-600">Número de cuenta:</span> {{ datosTransferencia.numeroCuenta }}</p>
          </div>
          <div class="mt-6 flex gap-3">
            <button
              type="button"
              class="flex-1 rounded-lg bg-[#141642] py-3 font-medium text-white transition hover:bg-[#141642]/90"
              @click="copiarDatos"
            >
              {{ copiado ? '¡Copiado!' : 'Copiar datos' }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              @click="cerrarPopupDatos"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
