import ready from "domready";
import App from "./App";
import "../css/theme.scss";

ready(() => {
  window.app = new App();
  window.app.init();
});
