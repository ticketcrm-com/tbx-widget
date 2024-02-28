<svelte:options
  customElement={{
    tag: "tbx-widget",
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

  let iframeUrl: string;
  let loaded: boolean;

  // below code required for webcomponent integration
  let ref: HTMLIFrameElement;

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

<div class="container">
  {#if iframeUrl}
    <iframe
      loading="lazy"
      title="TBX widget"
      class:hidden={!loaded}
      on:mouseover={() =>
        (document.querySelector("body").style.overflow = "hidden")}
      on:mouseleave={() =>
        (document.querySelector("body").style.overflow = "auto")}
      bind:this={ref}
      src={iframeUrl}
    />
  {/if}
  {#if !iframeUrl || !loaded}
    <div class="loader">
      <Loader />
    </div>
  {/if}
</div>

<style>
  .hidden {
    visibility: hidden;
  }

  /* overlay widget with loader */
  .container {
    width: 95vw;
    height: 95vh;
    max-height: 500px;
    max-width: 800px;
    position: relative;
  }

  iframe,
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  iframe {
    border: none;
    outline: none;
  }

  @media (max-width: 768px) {
    .container,
    iframe {
      width: 100vw;
      height: 100vh;
      max-height: 800px;
    }
  }
</style>
