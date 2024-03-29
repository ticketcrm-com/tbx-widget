<svelte:options
  customElement={{
    tag: "tbx-modal",
    props: {
      widgetUrl: { reflect: true, type: "String", attribute: "widget-url" },
      eventHash: { reflect: true, type: "String", attribute: "event-hash" },
      abonementHash: {
        reflect: true,
        type: "String",
        attribute: "abonement-hash",
      },
      lang: { reflect: true, type: "String", attribute: "lang" },
      currency: { reflect: true, type: "String", attribute: "currency" },
      thanksUrl: { reflect: true, type: "String", attribute: "thanks-url" },
      thanksInvoiceUrl: {
        reflect: true,
        type: "String",
        attribute: "thanks-invoice-url",
      },
      sellerUrl: { reflect: true, type: "String", attribute: "seller-url" },
      homeUrl: { reflect: true, type: "String", attribute: "home-url" },
      homeLogoUrl: {
        reflect: true,
        type: "String",
        attribute: "home-logo-Url",
      },
      fullScreen: { reflect: true, type: "String", attribute: "full-screen" },
    },
  }}
/>

<script lang="ts">
  import { onMount, afterUpdate, onDestroy } from "svelte";
  import Loader from "./Loader.wc.svelte";

  export let widgetUrl: string | undefined;
  export let eventHash: string | undefined;
  export let abonementHash: string | undefined;
  export let lang: string | undefined;
  export let currency: string | undefined;
  export let thanksUrl: string | undefined;
  export let thanksInvoiceUrl: string | undefined;
  export let sellerUrl: string | undefined;
  export let homeUrl: string | undefined;
  export let homeLogoUrl: string | undefined;
  export let fullScreen: boolean | undefined;

  // below code required for webcomponent integration
  let ref: HTMLIFrameElement;

  let iframeUrl: string;
  let loaded: boolean;
  let opened: boolean;

  $: document.querySelector("body").style.overflow = opened ? "hidden" : "auto";

  const getLink = () => {
    try {
      const url = new URL(widgetUrl || "https://widget.ticketcrm.com/");
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = window.location.host.replace("www.", "");
      const add_params = {
        ...(eventHash && { widgetHash: eventHash }),
        ...(abonementHash && { seasonHash: abonementHash }),
        ...(lang && { lang }),
        ...(currency && { currency }),
        ...(thanksUrl && { thank: encodeURIComponent(thanksUrl) }),
        ...(thanksInvoiceUrl && {
          thankInvoice: encodeURIComponent(thanksInvoiceUrl),
        }),
        ...(sellerUrl && { sellerUrl: encodeURIComponent(sellerUrl) }),
        ...(fullScreen && { url: "modal" }),
        ...(homeUrl && { url: encodeURIComponent(homeUrl) }),
        ...(homeLogoUrl && { logo: encodeURIComponent(homeLogoUrl) }),

        ...(!utm_source.includes("ticketsbox") &&
          !urlParams.get("utm_source") && { utm_source }),
        ...(urlParams.get("utm_source") && {
          utm_source: urlParams.get("utm_source"),
        }),
        ...(urlParams.get("utm_medium") && {
          utm_medium: urlParams.get("utm_medium"),
        }),
        ...(urlParams.get("utm_campaign") && {
          utm_campaign: urlParams.get("utm_campaign"),
        }),
        ...(urlParams.get("utm_content") && {
          utm_content: urlParams.get("utm_content"),
        }),
        ...(urlParams.get("utm_source_campaign") && {
          utm_source_campaign: urlParams.get("utm_source_campaign"),
        }),
        ...(urlParams.get("utm_term") && {
          utm_term: urlParams.get("utm_term"),
        }),
        ...(urlParams.get("gad_source") && {
          gad_source: urlParams.get("gad_source"),
        }),
        ...(urlParams.get("gclid") && {
          gclid: urlParams.get("gclid"),
        }),
        ...(urlParams.get("dclid") && {
          dclid: urlParams.get("dclid"),
        }),
        ...(urlParams.get("fbclid") && {
          fbclid: urlParams.get("fbclid"),
        }),
      };
      const new_params = new URLSearchParams([
        ...Array.from(url.searchParams.entries()),
        ...Object.entries(add_params),
      ]).toString();
      const new_url = new URL(`${url.origin}${url.pathname}?${new_params}`);
      return new_url.href;
    } catch (error) {
      console.log(error);
    }
  };

  const onMessage = (e) => {
    try {
      if (e.data?.type === "loaded") {
        loaded = true;
      }
      if (e.data?.type === "destroy") {
        console.log("destroyed");
        opened = false;
      }
      if (e.data?.type === "ga") {
        const ids = e.data.data[1];
        if (ids && ids[0]) {
          const client_id = document.cookie
            .split("; ")
            .find((row) => row.startsWith("_ga="))
            ?.split("=")[1]
            .split(".")
            .splice(-2, 2)
            .join(".");
          const sessions_id = ids
            .map(
              (id) =>
                document.cookie
                  .split("; ")
                  .find((row) => row.startsWith(`_ga_${id.split("-")[1]}`))
                  ?.split("=")[1]
                  .split(".")
                  .filter((el) => el.length > 5)[0]
            )
            .filter((el) => el);
          if (client_id && sessions_id.length) {
            ref.contentWindow.postMessage(
              {
                type: "_ga",
                data: ids.map((id, iter) => ({
                  id,
                  client_id,
                  session_id: sessions_id[iter],
                })),
              },
              "*"
            );
            console.log("ga synchronized");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMount(() => {
    window.addEventListener("message", onMessage);
    iframeUrl = getLink();
  });

  afterUpdate(() => (iframeUrl = getLink()));

  onDestroy(() => {
    window.removeEventListener("message", onMessage);
  });
</script>

<div class="slot-container" on:click={() => (opened = true)}>
  <slot />
</div>

<div class="container" class:hidden={!opened}>
  {#if iframeUrl}
    <iframe
      loading="lazy"
      class:hidden={!loaded}
      class:fullScreen
      title="TBX widget"
      bind:this={ref}
      src={iframeUrl}
    />
  {/if}
  {#if !iframeUrl || !loaded}
    <div class="loader">
      <Loader />
    </div>
  {/if}
  {#if !fullScreen}
    <button
      class:transparent={!iframeUrl || !loaded}
      on:click={() => (opened = false)}
      class="close">&times;</button
    >
  {/if}
</div>

<style>
  .hidden {
    opacity: 0;
    visibility: hidden;
    transition: 0.2s ease 0.2s;
  }

  .slot-container {
    display: inline-block;
  }

  /* popup */
  .close {
    padding: 0;
    width: 40px;
    height: 35px;
    color: #273d71;
    background: white;
    font-size: 30px;
    border: none;
    border-radius: 100% 100% 0 0;
    position: absolute;
    top: calc(10% - 35px);
    opacity: 1;
    transition: opacity 0.3s ease 0.8s;
  }

  .transparent {
    padding: 0;
    width: 40px;
    height: 40px;
    font-size: 30px;
    color: white;
    background: transparent;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: end;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
  }

  .container.hidden iframe {
    opacity: 0;
    transform: perspective(600px) translate(0px, -100%) rotateX(45deg);
  }

  .container.hidden .close {
    opacity: 0;
  }

  iframe {
    margin: 0 auto;
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border: none;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    /*Shows iframe animation*/
    opacity: 1;
    transform: perspective(600px) translate(0px, 0%) rotateX(0deg);
    transition: all 0.8s ease;
  }

  iframe.fullScreen {
    height: 100%;
  }

  /* overlay popup with loader */
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  @media (min-width: 768px) {
    .close {
      padding: 0;
      width: 40px;
      height: 40px;
      font-size: 30px;
      color: white;
      background: transparent;
      border: none;
      position: absolute;
      top: 0;
      right: 0;
    }

    .container {
      align-items: center;
    }

    iframe {
      width: 95%;
      height: 95%;
      max-height: 500px;
      max-width: 800px;
      border: none;
      border-radius: 0;
      outline: none;
    }

    iframe.fullScreen {
      width: 100%;
      height: 100%;
      max-height: initial;
      max-width: inherit;
    }
  }
</style>
