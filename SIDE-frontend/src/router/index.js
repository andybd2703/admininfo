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
import EditarEvento from '../views/EditarEvento.vue';
import OrganizardorHome from '@/views/OrganizardorHome.vue';
import Compra from '../views/CompraBoletas.vue';
import favoritos from '../views/Eventosfavoritos.vue';
import PerfilUsuario from '@/views/PerfilUsuario.vue';


// Función para verificar si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Función para obtener el rol del usuario
const getUserRole = () => {
  return localStorage.getItem('rol'); // debería ser 'admin' o 'user'
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
  { path: '/admin', component: Admin, meta: { requiresAdmin: true } },
  { path: '/editar-evento/:id', component: EditarEvento, meta: { requiresAuth: true } },
  { path: '/organizador-home', component: OrganizardorHome, meta: { requiresAuth: true } },
  { path: '/compra', component: Compra },
  { path: '/favoritos', component: favoritos },
  { path: '/perfil', component: PerfilUsuario }

];

// Rutas protegidas
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guard global de navegación
router.beforeEach((to, from, next) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (to.meta.requiresAuth && !isAuth) {
    next('/login'); // requiere autenticación
  } else if (to.meta.requiresAdmin) {
    if (!isAuth) {
      next('/login'); // no está logueado
    } else if (role !== 'admin') {
      next('/'); // está logueado pero no es admin
    } else {
      next(); // es admin, puede acceder
    }
  } else {
    next(); // ruta pública
  }
});

export default router;
