import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/SIDEHome.vue';
import EventDetail from '../views/EventDetail.vue';
import RegistroForm from '../views/RegistroForm.vue';
import LoginForm from '../views/LoginForm.vue';
import RecuperarContrasena from '../views/RecuperarContrasena.vue';
import Cart from '../views/Cart.vue';
import testConexion from '@/views/testConexion.vue';
import CrearEventos from '@/views/CrearEventos.vue';
import Eventos from '@/views/EventCategories.vue';
import Admin from '../views/AdminUsuarios.vue';


// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;  // Verifica si el token está en localStorage
};

const routes = [
  { path: '/', component: Home },
  { path: '/detalle-evento/:id', component: EventDetail },
  { path: '/registro', component: RegistroForm },
  { path: '/login', component: LoginForm },
  { path: '/test', component: testConexion },
  { path: '/recuperar-contrasena', component: RecuperarContrasena },
  { path: '/cart', component: Cart, meta: { requiresAuth: true } },
  { path: '/crear-eventos', component: CrearEventos, meta: { requiresAuth: true } },
  { path: '/eventos', component: Eventos },
  { path: '/admin', component: Admin }
];


// Rutas protegidas
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige al login
    next('/login');
  } else {
    next();  // Si el usuario está autenticado o la ruta no requiere autenticación, sigue adelante
  }
});

export default router;
