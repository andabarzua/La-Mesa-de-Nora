/**
 * Router — La Mesa de Nora (lamesadenora.cl)
 */
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'busqueda', name: 'search', component: SearchView },
      // Placeholders para rutas de colecciones/productos/servilletas
      {
        path: 'colecciones',
        name: 'colecciones',
        component: () => import('@/views/ColeccionesView.vue'),
        meta: { title: 'Colecciones' },
      },
      {
        path: 'colecciones/:slug',
        name: 'coleccion',
        component: () => import('@/views/CategoryView.vue'),
        meta: { title: 'Categoría' },
      },
      {
        path: 'product/:slug',
        name: 'producto',
        component: () => import('@/views/ProductDetailView.vue'),
        meta: { title: 'Producto' },
      },
      {
        path: 'servilletas/:slug',
        name: 'servilleta',
        component: () => import('@/views/PlaceholderView.vue'),
      },
      {
        path: 'nosotros',
        name: 'nosotros',
        component: () => import('@/views/AboutView.vue'),
        meta: { title: 'Sobre Nosotros' },
      },
      {
        path: 'politica-envio',
        name: 'politica-envio',
        component: () => import('@/views/ShippingPolicyView.vue'),
        meta: { title: 'Política de envío' },
      },
      {
        path: 'preguntas-frecuentes',
        name: 'preguntas-frecuentes',
        component: () => import('@/views/FaqView.vue'),
        meta: { title: 'Preguntas frecuentes' },
      },
      {
        path: 'terminos-condiciones',
        name: 'terminos-condiciones',
        component: () => import('@/views/TermsView.vue'),
        meta: { title: 'Política de privacidad' },
      },
      {
        path: 'contacto',
        name: 'contacto',
        component: () => import('@/views/ContactView.vue'),
        meta: { title: 'Contacto' },
      },
      {
        path: 'carrito',
        name: 'carrito',
        component: () => import('@/views/PlaceholderView.vue'),
      },
      {
        path: 'checkout',
        name: 'checkout',
        component: () => import('@/views/CheckoutView.vue'),
        meta: { title: 'Finalizar pedido' },
      },
      {
        path: 'checkout/success',
        name: 'checkout-success',
        component: () => import('@/views/CheckoutSuccessView.vue'),
        meta: { title: 'Pago exitoso' },
      },
      {
        path: 'checkout/failure',
        name: 'checkout-failure',
        component: () => import('@/views/CheckoutFailureView.vue'),
        meta: { title: 'Pago no realizado' },
      },
      {
        path: 'checkout/pending',
        name: 'checkout-pending',
        component: () => import('@/views/CheckoutPendingView.vue'),
        meta: { title: 'Pago pendiente' },
      },
      {
        path: 'login',
        name: 'login',
        redirect: { name: 'home' },
        meta: { title: 'Inicio', robots: 'noindex, nofollow' },
      },
      {
        path: 'registro',
        name: 'registro',
        redirect: { name: 'home' },
        meta: { title: 'Inicio', robots: 'noindex, nofollow' },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { title: 'Página no encontrada' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Siempre llevar al inicio de la página al cambiar de ruta
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

export default router;
