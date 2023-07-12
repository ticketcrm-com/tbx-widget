/**
 *
 ***Params--->>>
 *
 *  Container
 *
 *    data-widget - hash события (например: c86c29dd3158560562dae05c329732084fe01104)
 *      * если hash события не указан то работать скрипт будет как 'Модальное окно' тоесть после клика в кнопку
 *      * если же будет указан то отрисуется в этом контейнере
 *
 *    data-type - тип продажи Абонемент или Билет ('Билет' по умолчанию)
 *      * для абонементов нужно указать data-type="season"
 *      * для билетов указывать не нужно
 *
 *    data-lang   - текущее значение языка (например: uk, en, ru)
 *
 *    data-thanx  - ссылка куда переадресовать пользователя после оплаты или отказа (например: https://ticketsbox.com/checkout_complete/{{hash события}} )
 *      * по умолчанию будет ссылка с примера
 *
 *
<div
  id="-tb-widget-"
  data-widget="c86c29dd3158560562dae05c329732084fe01104"
  data-lang="uk"
 data-thanx="https://ticketsbox.com/checkout_complete/c86c29dd3158560562dae05c329732084fe01104"
 ></div>
 *
 *
 *
 *  Buttons
 *
 *    <button
 *      data-hash="c86c29dd3158560562dae05c329732084fe01104">Event 1</button>
 *
 *    <button
 *      data-hash="c86c29dd3158560562dae05c329732084fe01104"><span>Event 1</span></button>
 *
 *    * Для кнопок с вложеностью типа <span>text</span> нужно добавить стилей CSS
 *
 *       [data-hash] {
 *         position: relative;
 *       }
 *       [data-hash]:after {
 *         content: '';
 *         display: block;
 *         position: absolute;
 *         top: 0;
 *         left: 0;
 *         width: 100%;
 *         height: 100%;
 *         z-index: 2;
 *       }
 *
 *
 * */
!(function () {
  function runGtag(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
    setTimeout(pushGa, 500);
  }

  function pushGa() {
    var _ga_ = getGa("_ga");
    if (!_ga_) {
      setTimeout(pushGa, 1000);
    } else {
      if (!tbw.widget) {
        setTimeout(pushGa, 1000);
      } else {
        tbw.widget.postMessage({ type: "_ga", data: _ga_ }, "*");
      }
    }
  }

  function getGa(name) {
    var matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  var tbw = {
    name: "-tb-widget-",
    iriStart: "http://localhost:4400",
    iri: "/",
    // iriStart: 'https://widget.'
    // iri: 'ticketcrm.com/',
    lang: "uk",
    type: "widget",
    time: 600,
    frame: null,
    el: document.querySelector("#-tb-widget-"),
    optionComplete: null,
    timer: 0,
    gtag: false,
    fbq: false,
    widget: null,
    message: [],
    init: function (hash, options) {
      if (!hash || hash === "") return;
      var src = this.getSrc(hash, options);
      src && this.createFrame(src);
    },
    destroy: function (hash, options) {
      tbw.el.innerHTML = "";
      tbw.el.removeAttribute("data-show");
      this.widget = null;
      clearInterval(tbw.timer);
      hash && this.init(hash, options);
      var page_message = document.querySelector(".-widget-fail-");
      page_message && page_message.removeAttribute("style");
    },
    createFrame: function (src) {
      tbw.frame = document.createElement("iframe");
      tbw.frame.name = this.name;
      tbw.frame.src = src;
      tbw.frame.style.width = "100%";
      tbw.frame.style.height = "100%";
      tbw.frame.style.border = "none";
      tbw.frame.style.outline = "none";
      tbw.frame.allow =
        "accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture";
      tbw.el.setAttribute("data-show", "");
      tbw.el.appendChild(tbw.frame);
      this.widget = tbw.frame.contentWindow;
    },
    getSrc: function (hash, added) {
      var newIri = "";
      newIri += this.iriStart;

      if (
        this.el.hasAttribute("data-test") &&
        this.el.getAttribute("data-test") !== ""
      ) {
        newIri += "" + this.el.getAttribute("data-test") + ".";
      }

      newIri += this.iri;

      if (
        this.el.hasAttribute("data-type") &&
        this.el.getAttribute("data-type") !== ""
      ) {
        newIri += "/?" + this.el.getAttribute("data-type") + "Hash=" + hash;
      } else {
        newIri += "/?" + this.type + "Hash=" + hash;
      }

      if (
        !this.el.hasAttribute("data-widget") ||
        this.el.getAttribute("data-widget") === ""
      ) {
        newIri += "&url=modal";
      } else {
        if (this.el.hasAttribute("data-url")) {
          newIri += "&url=" + this.el.getAttribute("data-url");
        }
      }

      if (
        this.el.hasAttribute("data-lang") &&
        this.el.getAttribute("data-lang") !== ""
      ) {
        newIri += "&lang=" + this.el.getAttribute("data-lang");
      } else {
        newIri += "&lang=" + this.lang;
      }

      if (added) {
        if (added.ticket) {
          newIri += "&ticket=" + added.ticket;
        }
        if (added.profile) {
          newIri += "&profile=" + added.profile;
        }
        if (added.promo) {
          newIri += "&promo=" + added.promo;
        }
      } else {
        if (
          this.el.hasAttribute("data-added") &&
          this.el.getAttribute("data-added") !== ""
        ) {
          var gAdd = this.el.getAttribute("data-added");
          var cAdd = JSON.parse(JSON.parse(gAdd));
          if (cAdd) {
            if (cAdd.ticket) {
              newIri += "&ticket=" + cAdd.ticket;
            }
            if (cAdd.profile) {
              newIri += "&profile=" + cAdd.profile;
            }
            if (cAdd.promo) {
              newIri += "&promo=" + cAdd.promo;
            }
          }
        }
      }

      if (
        this.el.hasAttribute("data-thank") &&
        this.el.getAttribute("data-thank") !== ""
      ) {
        newIri +=
          "&thank=" + encodeURIComponent(this.el.getAttribute("data-thank"));
      }

      if (this.optionComplete && this.optionComplete !== "") {
        newIri += "&opt=" + this.optionComplete;
      }

      newIri +=
        "&ref=" + encodeURIComponent(document.location.href.split("#")[0]);

      return newIri;
    },
    options: function () {
      var str = document.querySelector('meta[name="-tb-opt"]');
      var whash =
        this.el.hasAttribute("data-widget") &&
        this.el.getAttribute("data-widget") !== ""
          ? this.el.getAttribute("data-widget")
          : null;
      var opt =
        str && str.getAttribute("content") !== ""
          ? str.getAttribute("content")
          : null;

      this.optionComplete = opt ? opt : "";

      if (!whash) return;

      this.timer = setInterval(function () {
        if (tbw.time < 2) {
          clearInterval(tbw.timer);
          location.reload();
        }
        tbw.time = tbw.time - 2;
      }, 2000);

      if (!opt) {
        this.init(whash);
        return;
      }

      var config = atob(opt).split("|");

      var t = config[0] && config[0] !== "" ? parseFloat(config[0]) : 0;

      if (t === 0) {
        this.init(whash);
      } else {
        if (t > 100) {
          this.init(whash);
          var ot = parseFloat(config[0]),
            tt = 100;
          this.timer = setInterval(function () {
            if (ot > 10) {
              tt = ot - 10;
              ot = tt;
            } else {
              tbw.destroy();
              clearInterval(tbw.timer);
            }
          }, 10000);
        } else {
          this.destroy();
        }
      }
    },
    checkInitConfig: function (id) {
      var ccc = true;
      if (window["dataLayer"]) {
        window["dataLayer"].forEach(function (wd) {
          if (wd[0] === "config" && wd[1] === id) {
            ccc = false;
          }
        });
      }
      return ccc;
    },
  };

  if (!tbw.el) {
    console.error("Widget container not found");
    return;
  }

  if (!window["gtag"]) {
    runGtag(window, document, "script", "dataLayer", "GTM-NSG2B5W");
  }

  document.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-hash")) {
      var data = {};
      e.target.hasAttribute("data-profile") &&
        (data["profile"] = e.target.getAttribute("data-profile"));
      e.target.hasAttribute("data-ticket") &&
        (data["ticket"] = e.target.getAttribute("data-ticket"));
      e.target.hasAttribute("data-promo") &&
        (data["promo"] = e.target.getAttribute("data-promo"));
      if (!data.profile && !data.ticket && !data.promo) {
        data = null;
      }
      tbw.destroy(e.target.getAttribute("data-hash"), data);
    }
  });

  window.addEventListener("message", function (e) {
    if (e.data) {
      var pmType = e.data.type;
      if (pmType === "loaded") {
        tbw.widget.postMessage(
          {
            type: "_ref",
            data: encodeURIComponent(document.location.href.split("#")[0]),
          },
          "*"
        );
        pushGa();
      }
      if (pmType === "destroy") {
        tbw.destroy();
      }
      if (pmType === "sendToken") {
        var loca = location.host;
        if (loca.split("ticketsbox.com").length > 1) {
          var xhr = new XMLHttpRequest(),
            n =
              "refresh_token=" +
              encodeURIComponent(e.data.data.refresh_token) +
              "&access_token=" +
              encodeURIComponent(e.data.data.access_token);
          xhr.open(
            "POST",
            "https://ticketsbox.com/?route=account/authorization/remote",
            true
          );
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          xhr.send(n);
        }
      }
      if (pmType === "gtag" || pmType === "fbq") {
        if (tbw.el && tbw.el.hasAttribute("data-test")) return;

        var data = e.data.data;
        if (data[2]) {
          if (pmType === "gtag") {
            if (tbw.checkInitConfig(data[1])) {
              window[pmType](data[0], data[1], JSON.parse(data[2]));
            }
          } else {
            window[pmType](data[0], data[1], JSON.parse(data[2]));
          }
        } else {
          window[pmType](data[0], data[1]);
        }
      }
    }
  });

  tbw.options();
})();
