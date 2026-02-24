<script setup>
/**
 * Vista Login — La Mesa de Nora.
 * 50% izquierdo: fondo azul con logo centrado. 50% derecho: formulario de login.
 */
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const form = ref({ email: '', password: '' });
const enviando = ref(false);
const error = ref('');

function submit() {
  error.value = '';
  if (!form.value.email?.trim() || !form.value.password) {
    error.value = 'Completa correo y contraseña.';
    return;
  }
  enviando.value = true;
  // TODO: conectar con API de auth
  setTimeout(() => {
    enviando.value = false;
    router.push('/');
  }, 800);
}
</script>

<template>
  <div class="flex min-h-screen flex-col pb-16 md:flex-row md:pb-24">
    <!-- 50% izquierdo: fondo azul + logo centrado -->
    <div class="flex min-h-[40vh] flex-1 items-center justify-center bg-[#141642] px-6 py-12 md:min-h-screen md:flex-none md:w-1/2">
      <RouterLink to="/" class="block" aria-label="La Mesa de Nora - Inicio">
        <img
          src="/img/LMDN_Logo.webp"
          alt="LA MESA DE NORA - EXCLUSIVE RENTAL"
          class="h-auto w-full max-w-[280px] object-contain brightness-0 invert md:max-w-[320px]"
        />
      </RouterLink>
    </div>

    <!-- 50% derecho: todo el login -->
    <div class="flex flex-1 flex-col justify-center px-6 py-10 md:w-1/2 md:px-12 md:py-16 lg:px-20">
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
        Iniciar sesión
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Accede a tu cuenta para gestionar tus reservas.
      </p>

      <form class="mt-8 max-w-sm" @submit.prevent="submit">
        <div class="space-y-5">
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              id="login-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="login-password"
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
              placeholder="••••••••"
            />
          </div>
        </div>
        <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
        <button
          type="submit"
          :disabled="enviando"
          class="mt-6 w-full rounded-lg bg-[#141642] px-4 py-3.5 font-semibold text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:opacity-70"
        >
          {{ enviando ? 'Entrando...' : 'Entrar' }}
        </button>
        <p class="mt-6 text-sm text-gray-600">
          ¿No tienes cuenta?
          <RouterLink to="/registro" class="font-medium text-[#141642] hover:underline">
            Regístrate
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
