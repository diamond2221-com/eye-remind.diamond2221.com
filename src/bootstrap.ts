import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { loadAllPlugins } from "./plugins";

const app = createApp(App);
loadAllPlugins(app);

app.use(router).mount("#app");
app.config.globalProperties.$ELEMENT_PLUS_MAX = {
  scrollContainer: document.getElementsByClassName("app-layout-content")[0],
};
