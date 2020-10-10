import Vue from "vue";
import VueRouter from "vue-router";

const routes = [
  {
    path: "/",
    component: import("../pages/index/index.vue")
  },
  {
    path: "/login",
    component: import("../pages/login/login.vue")
  },
  {
    path: "*",
    component: import("../pages/index/index.vue")
  }
];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  props: true,
  routes
});

export default router;
