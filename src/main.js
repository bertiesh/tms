import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/index.css'
import './permission'; 
import i18n from './lang'
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
