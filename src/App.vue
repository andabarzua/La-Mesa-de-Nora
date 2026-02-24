<script setup>
/**
 * App raíz — La Mesa de Nora.
 */
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';

onMounted(() => {
  useCartStore().loadCart();
});
</script>

<template>
  <RouterView />
</template>
