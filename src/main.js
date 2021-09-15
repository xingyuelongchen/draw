import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/animation.css'
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
