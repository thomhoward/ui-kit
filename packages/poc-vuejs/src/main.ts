import Vue from 'vue';
import App from './App.vue';
import {CoveoHeadlessEngine} from 'coveo-headless-engine'

Vue.config.productionTip = false;

export const headlessEngine = new CoveoHeadlessEngine()

new Vue({
  render: h => h(App),
}).$mount('#app');
