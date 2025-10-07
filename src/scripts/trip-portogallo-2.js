import ready from "domready";
import App from "./Trip";
import "../css/theme.scss";

ready(() => {
  console.log('Trip');
  window.app = new App();
  window.app.init();
});
