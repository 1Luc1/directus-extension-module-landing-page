import ModuleComponent from "./module.vue";

export default {
  id: "landing-page",
  name: "Landing Page",
  icon: "rocket_launch",
  routes: [
    {
      name: "info",
      path: "",
      props: true,
      component: ModuleComponent,
    },
    {
      name: "page",
      path: ":page",
      props: true,
      component: ModuleComponent,
    },
  ],
};
