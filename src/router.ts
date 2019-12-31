import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/space',
      name: 'space',
      component: () => import('./render/Space'),
    },
    {
      path: '/CubeGeoBuffer',
      name: 'cubeGeoBuffer',
      component: () => import('./render/CubeGeoBuffer'),
    },
    {
      path: '/Fractal',
      name: 'fractal',
      component: () => import('./render/Fractal'),
    },
    {
      path: '/Instancing',
      name: 'instancing',
      component: () => import('./render/Instancing'),
    },
    {
      path: '/Liquid',
      name: 'liquid',
      component: () => import('./render/Liquid'),
    },
    {
      path: '/Fire',
      name: 'fire',
      component: () => import('./render/Fire'),
    },
    {
      path: '/Terrain',
      name: 'terrain',
      component: () => import('./render/Terrain'),
    },
    {
      path: '/Wolf',
      name: 'wolf',
      component: () => import('./render/Wolf'),
    },
    {
      path: '/physics/Basis',
      name: 'physicsBasis',
      component: () => import('./render/physics/Basis'),
    },
    {
      path: '/physics/Spring',
      name: 'physicsSpring',
      component: () => import('./render/physics/Spring'),
    },
    {
      path: '/physics/ClothSystem',
      name: 'physicsClothSystem',
      component: () => import('./render/physics/ClothSystem'),
    },
    {
      path: '/Reflection',
      name: 'reflection',
      component: () => import('./render/Reflection'),
    },
    {
      path: '/Hdri',
      name: 'hdri',
      component: () => import('./render/Hdri'),
    },
  ],
});
