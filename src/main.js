// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import vuexI18n from 'vuex-i18n';
import ElementUI from 'element-ui'
import axios from 'axios'
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.prototype.$http = axios;
Vue.use(ElementUI);
Vue.use(quillEditor);
Vue.config.productionTip = false;
import layer from 'vue-layer'
Vue.prototype.$layer = layer(Vue);
import 'lib-flexible'
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    i18n: vuexI18n.store
  }
});
Vue.use(vuexI18n.plugin, store);
const translationsEn = {
  "content": "This is some {type} content"
};
Vue.i18n.add('en', translationsEn);
Vue.i18n.set('en');
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
