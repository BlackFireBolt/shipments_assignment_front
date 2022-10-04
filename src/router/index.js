import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/main/MainTemplate.vue"),
    children: [
      {
        alias: "",
        path: "home/",
        name: "HomePage",
        component: () => import("../views/main/Home.vue"),
      },
      {
        alias: "",
        path: "create/",
        name: "CreatePage",
        component:() => import("../views/main/Create.vue")
      },
      {
        path:"detail/:id/",
        name: "DetailPage",
        component: () => import("../views/main/Detail.vue")
      }
    ],
  },
  {
    path: "*/",
    component: () => import("../views/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
