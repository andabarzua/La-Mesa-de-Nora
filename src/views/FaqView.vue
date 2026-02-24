<script setup>
/**
 * Vista Preguntas frecuentes — La Mesa de Nora.
 * Acordeón: cada pregunta se expande/colapsa al hacer clic.
 */
import { ref } from 'vue';

const faqs = [
  {
    question: '¿Qué tipo de artículos alquilan?',
    answer: 'Ofrecemos una selección curada de vajillas, mobiliario y decoración para eventos, ideal para bodas, cenas íntimas y celebraciones especiales.',
  },
  {
    question: '¿Cómo hago un pedido de alquiler?',
    answer: 'Puedes explorar nuestra colección en línea y enviarnos un mensaje con tu lista de deseos. Confirmaremos disponibilidad y te enviaremos una cotización.',
  },
  {
    question: '¿Cuál es el periodo de alquiler?',
    answer: 'El periodo estándar de alquiler es de 1 a 3 días. Si necesitas los artículos por más tiempo, avísanos y veremos cómo ayudarte.',
  },
  {
    question: '¿Ofrecen servicio de entrega y recogida?',
    answer: 'Sí, ofrecemos entrega y recogida con costo adicional. El precio varía según la ubicación y el tamaño del pedido.',
  },
  {
    question: '¿Puedo recoger los artículos por mi cuenta?',
    answer: 'Sí, la recogida personal está disponible para ciertos artículos. Te daremos los detalles al confirmar tu pedido.',
  },
  {
    question: '¿Qué pasa si algo se daña o se pierde?',
    answer: 'Solicitamos que los artículos se devuelvan en buen estado. En caso de daño o pérdida, se aplicará un cargo por reemplazo.',
  },
  {
    question: '¿Debo limpiar los artículos antes de devolverlos?',
    answer: 'No es necesario limpiarlos a fondo — solo retira restos grandes de comida o suciedad. Nosotros nos encargamos de la limpieza profesional.',
  },
  {
    question: '¿Con cuánta anticipación debo reservar?',
    answer: 'Recomendamos reservar con al menos 2 a 3 semanas de anticipación, especialmente en temporada alta. También aceptamos pedidos de último minuto según disponibilidad.',
  },
  {
    question: '¿Tienen un pedido mínimo?',
    answer: 'Sí, tenemos un monto mínimo de alquiler que se comparte al momento de la consulta.',
  },
  {
    question: '¿Pueden ayudarme a planear o decorar mi mesa?',
    answer: '¡Claro que sí! Nos encanta ayudarte a dar vida a tu idea. Cuéntanos tu concepto o inspiración y con gusto te asesoramos.',
  },
];

// Acordeón: array de booleanos (cada ítem puede estar abierto o cerrado)
const openIndexes = ref(new Set());

function toggle(index) {
  if (openIndexes.value.has(index)) {
    const next = new Set(openIndexes.value);
    next.delete(index);
    openIndexes.value = next;
  } else {
    openIndexes.value = new Set([...openIndexes.value, index]);
  }
}

function isOpen(index) {
  return openIndexes.value.has(index);
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-[#141642] px-4 py-12 text-center md:py-16">
      <h1 class="text-3xl font-semibold tracking-wide text-white md:text-4xl">
        Preguntas frecuentes
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-white/90">
        Resolvemos las dudas más comunes sobre alquiler y eventos.
      </p>
    </section>

    <!-- Lista FAQ con acordeón -->
    <div class="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-14">
      <div class="divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div v-for="(faq, index) in faqs" :key="index">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50 md:px-6 md:py-5"
            :aria-expanded="isOpen(index)"
            :aria-controls="`faq-answer-${index}`"
            :id="`faq-question-${index}`"
            @click="toggle(index)"
          >
            <span class="text-base font-semibold text-gray-900 md:text-lg">
              {{ index + 1 }}. {{ faq.question }}
            </span>
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#141642] text-white transition-transform duration-200"
              :class="isOpen(index) ? 'rotate-180' : ''"
              aria-hidden="true"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <div
            :id="`faq-answer-${index}`"
            :aria-labelledby="`faq-question-${index}`"
            class="overflow-hidden transition-all duration-200 ease-out"
            :class="isOpen(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <div class="border-t border-gray-100 bg-gray-50/80 px-5 py-4 md:px-6 md:py-5">
              <p class="text-gray-700 leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        ¿No encuentras tu respuesta? <router-link to="/contacto" class="font-medium text-[#254B86] hover:underline">Contáctanos</router-link>
      </p>
    </div>
  </div>
</template>
