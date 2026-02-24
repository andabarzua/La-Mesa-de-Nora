<script setup>
/**
 * Vista Registro — La Mesa de Nora.
 * 50% izquierdo: fondo azul con logo centrado. 50% derecho: formulario de registro.
 */
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();
const form = ref({
  nombre: '',
  email: '',
  password: '',
  confirmarPassword: '',
});
const enviando = ref(false);
const error = ref('');

const passwordsCoinciden = computed(() =>
  form.value.password === form.value.confirmarPassword
);

function submit() {
  error.value = '';
  if (!form.value.nombre?.trim() || !form.value.email?.trim() || !form.value.password) {
    error.value = 'Completa todos los campos obligatorios.';
    return;
  }
  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }
  if (!passwordsCoinciden.value) {
    error.value = 'Las contraseñas no coinciden.';
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

    <!-- 50% derecho: todo el registro -->
    <div class="flex flex-1 flex-col justify-center px-6 py-10 md:w-1/2 md:px-12 md:py-16 lg:px-20">
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
        Crear cuenta
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        Regístrate para reservar y gestionar tus pedidos.
      </p>

      <form class="mt-8 max-w-sm" @submit.prevent="submit">
        <div class="space-y-5">
          <div>
            <label for="register-nombre" class="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input
              id="register-nombre"
              v-model="form.nombre"
              type="text"
              required
              autocomplete="name"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label for="register-email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              id="register-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label for="register-password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              id="register-password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              minlength="6"
              class="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#141642] focus:ring-2 focus:ring-[#141642]/20"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label for="register-confirmar" class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <input
              id="register-confirmar"
              v-model="form.confirmarPassword"
              type="password"
              required
              autocomplete="new-password"
              class="mt-1 w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#141642]/20"
              :class="form.confirmarPassword && !passwordsCoinciden ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[#141642]'"
              placeholder="Repite la contraseña"
            />
            <p v-if="form.confirmarPassword && !passwordsCoinciden" class="mt-1 text-sm text-red-600">
              Las contraseñas no coinciden.
            </p>
          </div>
        </div>
        <p v-if="error" class="mt-3 text-sm text-red-600">{{ error }}</p>
        <button
          type="submit"
          :disabled="enviando || !passwordsCoinciden"
          class="mt-6 w-full rounded-lg bg-[#141642] px-4 py-3.5 font-semibold text-white transition hover:bg-[#141642]/90 focus:outline-none focus:ring-2 focus:ring-[#141642] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ enviando ? 'Creando cuenta...' : 'Registrarse' }}
        </button>
        <p class="mt-6 text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="font-medium text-[#141642] hover:underline">
            Inicia sesión
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
