import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { App } from "vue";

export default function loadComponent(app: App<Element>): void {
  app.use(ElementPlus);
}
