import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/router";
// 调用全局注册的组件js
import "./basicService/componentReg";
import "./assets/css/default.styl";
import VueRouter from "vue-router";
Vue.config.productionTip = false;

Vue.use(VueRouter);

let newVue = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
