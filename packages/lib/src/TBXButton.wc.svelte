<svelte:options
  customElement={{
    tag: "tbx-button",
    props: {
      eventHash: { reflect: true, type: "String", attribute: "event-hash" },
      abonementHash: {
        reflect: true,
        type: "String",
        attribute: "abonement-hash",
      },
      lang: { reflect: true, type: "String", attribute: "lang" },
      currency: { reflect: true, type: "String", attribute: "currency" },
      thanksUrl: { reflect: true, type: "String", attribute: "thanks-url" },
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
  import { afterUpdate, onMount } from "svelte";

  export let eventHash: string | undefined;
  export let abonementHash: string | undefined;
  export let lang: string | undefined;
  export let currency: string | undefined;
  export let thanksUrl: string | undefined;
  export let sellerUrl: string | undefined;
  export let homeUrl: string | undefined;
  export let homeLogoUrl: string | undefined;

  // below code required for webcomponent integration
  let ref: HTMLLinkElement;

  let iframeUrl: string;
  let ga: { id: string; session_id: string; client_id: string }[];

  const getLink = () => {
    const url = new URL("https://widget.ticketcrm.com/");
    const urlParams = new URLSearchParams(window.location.search);
    const utm_source = window.location.host.replace("www.", "");
    const add_params = {
      ...(eventHash && { widgetHash: eventHash }),
      ...(abonementHash && { seasonHash: abonementHash }),
      ...(lang && { lang }),
      ...(currency && { currency }),
      ...(thanksUrl && { thank: encodeURIComponent(thanksUrl) }),
      ...(sellerUrl && { sellerUrl: encodeURIComponent(sellerUrl) }),
      ...(homeUrl && { url: encodeURIComponent(homeUrl) }),
      ...(homeLogoUrl && { logo: encodeURIComponent(homeLogoUrl) }),
      ...(ga && { ga: JSON.stringify(ga) }),

      ...(!utm_source.includes("ticketsbox") && { utm_source }),
      ...(urlParams.get("utm_source") && {
        utm_source: urlParams.get("utm_source"),
      }),
      ...(urlParams.get("utm_medium") && {
        utm_medium: urlParams.get("utm_medium"),
      }),
      ...(urlParams.get("utm_campaign") && {
        utm_source: urlParams.get("utm_campaign"),
      }),
      ...(urlParams.get("utm_content") && {
        utm_source: urlParams.get("utm_content"),
      }),
    };
    const new_params = new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...Object.entries(add_params),
    ]).toString();
    const new_url = new URL(`${url.origin}${url.pathname}?${new_params}`);
    return new_url.href;
  };

  $: ga, (iframeUrl = getLink()), console.log("ga, ", ga);

  const getGa = () => {
    window.addEventListener("message", function (e) {
      if (e.data?.type === "ga") {
        const ids: string[] = e.data.data[1];
        if (ids && ids[0]) {
          const metrics = [
            new Promise((resolve) => {
              gtag("get", ids[0], "client_id", resolve);
            }),
          ].concat(
            ids.map(
              (id) =>
                new Promise((resolve) => {
                  gtag("get", id, "session_id", resolve);
                })
            )
          );

          Promise.all(metrics).then(
            ([client_id, session_id, ...args]: string[]) => {
              ga = [{ id: ids[0], client_id, session_id }].concat(
                args.map((session_id, i) => ({
                  id: ids[i + 1],
                  client_id,
                  session_id,
                }))
              );
            }
          );
        }
      }
    });
  };

  onMount(() => {
    try {
      if (typeof gtag !== "undefined") {
        getGa();
      }
    } catch (e) {
      console.log(e);
    }
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
