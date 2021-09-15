import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/setting', component: () => import('@/views/setting.vue') },
    { path: '/*', component: () => import('@/views/index.vue') },
  ]
})
export default router