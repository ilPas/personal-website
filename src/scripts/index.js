import ready from "domready";
import App from "./App";
import "../css/style.scss";

ready(() => {
  window.app = new App();
  window.app.init();
});
