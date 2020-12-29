// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import 'ant-design-vue/dist/antd.less'
import Vue from 'vue'
import App from './App'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import cxtmenu from 'cytoscape-cxtmenu'
import cytoscape from 'cytoscape'
import edgehandles from 'cytoscape-edgehandles'
import $ from "jquery";
cytoscape.use(edgehandles)
Vue.prototype.$cytoscape = cytoscape
cytoscape.use(cxtmenu)

Vue.config.productionTip = false
Vue.use(Antd)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
