import WebGLView from "./webgl/WebGLView";
import GUIView from "./gui/GUIView";
import Glide from "@glidejs/glide";
import Zuck from "zuck.js";
import Cursor from "./gui/cursor";
import attachBanner from "@beyonk/gdpr-cookie-consent-banner";

export default class App {
  constructor() {}

  init() {
    var particelle = document.getElementById("particles");
    if (typeof particelle != "undefined" && particelle != null) {
      this.initWebGL();
      this.initGUI();
      this.addListeners();
      this.animate();
      this.resize();
    }
    var storie = document.getElementById("stories");
    if (typeof storie != "undefined" && storie != null) {
      this.initZuck();
    }
    this.initCookie();
    //this.initGlide();
    //this.initNoise();
    new Cursor();
  }

  initCookie() {
    const options = {
      /**
       * You must set the cookie name.
       **/
      cookieName: "ilpas_gdpr",

      /**
       * The cookie configuration, such as domain and path.
       **/
      cookieConfig: {
        domain: "erricopasquale.me",
        path: "/"
      },

      /**
       * These are the top two lines of text on the banner
       * The 'description' field can include html such as links
       **/
      heading: "GDPR Notice",
      description:
        'Sul mio sito utilizzo i cookie per offrire una migliore esperienza di navigazione e analizzare il traffico del sito. Consulta la nostra <a href="/privacy-cookie.html"> privacy & cookie policy </a>.<br />Facendo clic su Accetta, acconsenti alla nostra politica privacy & cookie policy.',

      /**
       * All the button labels
       **/
      acceptLabel: "Conferma",
      settingsLabel: "Preferenze",
      closeLabel: "Chiudi",

      /**
       * These are the default opt-ins and their descriptions.
       * When value is set to true, the option will automatically be checked on load.
       *
       * If you don't want to show a category, simply remove the specified key from this object.
       **/
      choices: {
        necessary: {
          label: "Cookie necessari",
          description:
            "Questi cookie non possono essere disattivati perché vengono utilizzati per controllare tutti gli altri.",
          value: true
        },
        analytics: {
          label: "Analytics",
          description:
            "Utilizzo Google Analytics anonimo per per analizzare le visite al mio sito.",
          value: true
        },
        tracking: false,
        marketing: false
      },

      /**
       * Show an icon to edit cookies later, when banner is closed.
       **/
      showEditIcon: true,

      /**
       * These are the functions which are run if a user opts-in to that category.
       * You should drop your cookies here (or set a variable to control the later dropping of cookies.
       *
       * If you are using svelte, you can use events instead - see the Svelte section below.
       **/
      categories: {
        analytics: function(w, d, s, l, i) {
          console.log("Google Tag Manager");
          (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
              "gtm.start": new Date().getTime(),
              event: "gtm.js"
            });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, "script", "dataLayer", "GTM-KXQLJ68");
        },
        tracking: function() {
          console.log("No tracking cookies specified");
        },
        marketing: function() {
          console.log("No marketing cookies specified");
        },
        necessary: function() {
          console.log("No necessary cookies specified");
        }
      }
    };
    GdprConsent.attachBanner(document.body, options);
  }

  initNoise() {
    let canvas, ctx;

    let wWidth, wHeight;

    let noiseData = [];
    let frame = 0;

    let loopTimeout;

    // Create Noise
    const createNoise = () => {
      const idata = ctx.createImageData(wWidth, wHeight);
      const buffer32 = new Uint32Array(idata.data.buffer);
      const len = buffer32.length;

      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.5) {
          buffer32[i] = 0xff222222;
        }
      }

      noiseData.push(idata);
    };

    // Play Noise
    const paintNoise = () => {
      if (frame === 9) {
        frame = 0;
      } else {
        frame++;
      }

      ctx.putImageData(noiseData[frame], 0, 0);
    };

    // Loop
    const loop = () => {
      paintNoise(frame);

      loopTimeout = window.setTimeout(() => {
        window.requestAnimationFrame(loop);
      }, 1000 / 25);
    };

    // Setup
    const setup = () => {
      wWidth = window.innerWidth;
      wHeight = window.innerHeight;

      canvas.width = wWidth;
      canvas.height = wHeight;

      for (let i = 0; i < 10; i++) {
        createNoise();
      }

      loop();
    };

    // Reset
    let resizeThrottle;
    const reset = () => {
      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(resizeThrottle);

          resizeThrottle = window.setTimeout(() => {
            window.clearTimeout(loopTimeout);
            setup();
          }, 200);
        },
        false
      );
    };

    // Init
    const init = (() => {
      canvas = document.getElementById("noise");
      ctx = canvas.getContext("2d");

      setup();
    })();
  }

  initGlide() {
    new Glide(".glide", {
      type: "slider",
      perView: 1,
      gap: 16
    }).mount();
  }

  initZuck() {
    var stories = new Zuck("stories", {
      backNative: true,
      previousTap: true,
      skin: "snapgram",
      autoFullScreen: false,
      avatars: true,
      list: false,
      cubeEffect: false,
      localStorage: true,
      stories: [
        Zuck.buildTimelineItem(
          "indigo",
          "images/works/indigo/1.jpg",
          "Indigo",
          "https://indigo.ai",
          "1569888000",
          [
            [
              "indigo-1",
              "photo",
              60,
              "images/works/indigo/2.jpg",
              "images/works/indigo/2.jpg",
              "https://fullstackish.io",
              "Scopri Fullstackish"
            ],
            [
              "indigo-2",
              "photo",
              10,
              "images/works/indigo/3.jpg",
              "images/works/indigo/3.jpg",
              "https://indigo.ai",
              "Scopri Indigo"
            ]
          ]
        ),
        Zuck.buildTimelineItem(
          "lanificio marilina",
          "images/works/marilina/1.jpg",
          "Lanificio Marilina",
          "https://maglificiomarilina.com/it/",
          "1530403200",
          [
            [
              "marilina-1",
              "photo",
              10,
              "images/works/marilina/2.jpg",
              "images/works/marilina/2.jpg",
              "https://www.instagram.com/corsdesign/",
              "Scopri Cors Design"
            ],
            [
              "marilina-2",
              "photo",
              10,
              "images/works/marilina/3.jpg",
              "images/works/marilina/3.jpg",
              "https://maglificiomarilina.com/it/",
              "Scopri Maglificio Marilina"
            ]
          ]
        ),
        Zuck.buildTimelineItem(
          "vari",
          "images/works/vari/1.jpg",
          "Vari",
          "",
          "1451606400",
          [
            [
              "pas-1",
              "photo",
              10,
              "images/works/vari/2.jpg",
              "images/works/vari/2.jpg",
              "",
              false
            ]
          ]
        )
      ]
    });
  }

  initWebGL() {
    this.webgl = new WebGLView(this);

    document
      .querySelector(".js-particles")
      .appendChild(this.webgl.renderer.domElement);
  }

  initGUI() {
    this.gui = new GUIView(this);
  }

  addListeners() {
    this.handlerAnimate = this.animate.bind(this);

    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("keyup", this.keyup.bind(this));

    const el = this.webgl.renderer.domElement;
    el.addEventListener("click", this.click.bind(this));
  }

  animate() {
    this.update();
    this.draw();

    this.raf = requestAnimationFrame(this.handlerAnimate);
  }

  // ---------------------------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------------------------

  update() {
    if (this.gui.stats) this.gui.stats.begin();
    if (this.webgl) this.webgl.update();
    if (this.gui) this.gui.update();
  }

  draw() {
    if (this.webgl) this.webgl.draw();
    if (this.gui.stats) this.gui.stats.end();
  }

  // ---------------------------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------------------------

  resize() {
    if (this.webgl) this.webgl.resize();
  }

  keyup(e) {
    // g
    if (e.keyCode == 71) {
      if (this.gui) this.gui.toggle();
    }
  }

  click(e) {
    this.webgl.next();
  }
}
