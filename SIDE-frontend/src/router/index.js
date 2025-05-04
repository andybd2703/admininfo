import { createRouter, createWebHistory } from 'vue-router';
import EventCategories from '../components/EventCategories.vue';
import EventDetail from '../components/EventDetail.vue';
import RegistroForm from '../components/RegistroForm.vue';
import LoginForm from '../components/LoginForm.vue';
import testConexion from '@/views/testConexion.vue';


// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;  // Verifica si el token está en localStorage
};

const routes = [
  { path: '/', component: EventCategories },
  { path: '/evento/:id', component: EventDetail },
  { path: '/registro', component: RegistroForm },
  { path: '/login', component: LoginForm },
  { path: '/test', component: testConexion }
  //{ path: '/dashboard', component: Dashboard,meta: { requiresAuth: true }}
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
