<script setup>
/**
 * Vista Contacto — La Mesa de Nora.
 * Información de contacto y formulario.
 */
import { ref } from 'vue';

const form = ref({
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
});
const enviado = ref(false);
const enviando = ref(false);

function enviarFormulario() {
  enviando.value = true;
  // Simular envío (luego conectar con API o mailto/backend)
  setTimeout(() => {
    enviando.value = false;
    enviado.value = true;
    form.value = { nombre: '', email: '', asunto: '', mensaje: '' };
  }, 800);
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="bg-[#141642] px-4 py-12 text-center md:py-16">
      <h1 class="text-3xl font-semibold tracking-wide text-white md:text-4xl">
        Contacto
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-white/90">
        ¿Tienes dudas o quieres cotizar? Escríbenos.
      </p>
    </section>

    <!-- Contenido: info + formulario -->
    <div class="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
      <div class="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <!-- Columna izquierda: datos de contacto -->
        <div class="lg:col-span-2">
          <h2 class="text-xl font-semibold text-[#141642] md:text-2xl">
            Dónde estamos
          </h2>
          <p class="mt-3 text-gray-600">
            Estamos aquí para ayudarte con tu evento. Contáctanos por correo, teléfono o visítanos.
          </p>
          <div class="mt-8 space-y-6">
            <a
              href="mailto:hola@lamesadenora.com"
              class="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 transition hover:border-[#254B86]/40 hover:bg-[#141642]/5"
            >
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141642] text-white">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500">Correo</p>
                <p class="font-medium text-[#141642]">hola@lamesadenora.com</p>
              </div>
            </a>
            <a
              href="tel:+56953331228"
              class="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4 transition hover:border-[#254B86]/40 hover:bg-[#141642]/5"
            >
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141642] text-white">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500">Teléfono</p>
                <p class="font-medium text-[#141642]">+56 9 5333 1228</p>
              </div>
            </a>
            <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4">
              <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141642] text-white">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </span>
              <div>
                <p class="text-sm font-medium text-gray-500">Dirección</p>
                <p class="font-medium text-gray-800">Badajoz 87, Las Condes, Santiago</p>
              </div>
            </div>
          </div>
          <div class="mt-8">
            <p class="text-sm font-medium text-gray-500">Síguenos</p>
            <div class="mt-3 flex gap-3">
              <a href="https://www.facebook.com/lamesadenora" target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:border-[#141642] hover:bg-[#141642] hover:text-white" aria-label="Facebook">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://www.instagram.com/lamesadenora" target="_blank" rel="noopener noreferrer" class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:border-[#141642] hover:bg-[#141642] hover:text-white" aria-label="Instagram">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Columna derecha: formulario -->
        <div class="lg:col-span-3">
          <h2 class="text-xl font-semibold text-[#141642] md:text-2xl">
            Envíanos un mensaje
          </h2>
          <p class="mt-2 text-gray-600">
            Completa el formulario y te responderemos a la brevedad.
          </p>

          <div v-if="enviado" class="mt-8 rounded-xl border border-green-200 bg-green-50 px-5 py-5 text-green-800">
            <p class="font-medium">Mensaje enviado correctamente.</p>
            <p class="mt-1 text-sm">Te contactaremos pronto.</p>
          </div>

          <form
            v-else
            class="mt-8 space-y-5"
            @submit.prevent="enviarFormulario"
          >
            <div>
              <label for="contacto-nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                id="contacto-nombre"
                v-model="form.nombre"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label for="contacto-email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                id="contacto-email"
                v-model="form.email"
                type="email"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label for="contacto-asunto" class="block text-sm font-medium text-gray-700">Asunto</label>
              <input
                id="contacto-asunto"
                v-model="form.asunto"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Ej: cotización para evento"
              />
            </div>
            <div>
              <label for="contacto-mensaje" class="block text-sm font-medium text-gray-700">Mensaje</label>
              <textarea
                id="contacto-mensaje"
                v-model="form.mensaje"
                required
                rows="5"
                class="mt-1 w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
                placeholder="Cuéntanos en qué podemos ayudarte..."
              />
            </div>
            <button
              type="submit"
              :disabled="enviando"
              class="w-full rounded-lg bg-[#141642] px-6 py-3 font-medium text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:opacity-70 md:w-auto md:px-8"
            >
              {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
