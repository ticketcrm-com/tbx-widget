<svelte:options
  customElement={{
    tag: "tbx-button",
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
  import { onMount, afterUpdate } from "svelte";

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

  // below code required for webcomponent integration
  let ref: HTMLLinkElement;

  let iframeUrl: string;
  let ga: { id: string; session_id: string; client_id: string }[];

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
        ...(ga?.length && { ga: JSON.stringify(ga) }),

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

  $: ga,
    (iframeUrl = getLink()),
    ga?.length && console.log("ga synchronized"),
    ga?.length && console.log("ga, ", ga);

  const getGa = () => {
    try {
      const ids = document.cookie
        .split("; ")
        .filter((row) => row.startsWith("_ga_"))
        .map((el) => el.split("_ga_")[1].split("=")[0]);

      const client_id = document.cookie
        .split("; ")
        .find((row) => row.startsWith("_ga="))
        ?.split("=")[1]
        .split(".")
        .splice(-2, 2)
        .join(".");

      const sessions_id = ids.map(
        (id) =>
          document.cookie
            .split("; ")
            .find((row) => row.startsWith(`_ga_${id}`))
            ?.split("=")[1]
            .split(".")
            .filter((el) => el.length > 5)[0]
      );
      ga = ids.map((id, iter) => ({
        id: `G-${id}`,
        client_id,
        session_id: sessions_id[iter],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  onMount(() => {
    getGa();
    iframeUrl = getLink();
  });

  afterUpdate(() => (iframeUrl = getLink()));
</script>

<div
  class="slot-container"
  on:click={() => {
    location.href = iframeUrl;
  }}
  on:click={() => {
    location.href = iframeUrl;
  }}
>
  <slot />
</div>

<style>
  .slot-container {
    display: inline-block;
  }
</style>
