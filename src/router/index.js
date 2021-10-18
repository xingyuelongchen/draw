import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'hash',
  routes: [
    { path: '/canvas', component: () => import('@/views/canvas.vue') },
    { path: '/setting', component: () => import('@/views/setting.vue') },
    { path: '/*', component: () => import('@/views/index.vue') },
  ]
})
export default router