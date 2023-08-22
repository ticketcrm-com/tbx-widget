<svelte:options
  customElement={{
    tag: "tbx-modal",
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
  import { onMount } from "svelte";
  import Loader from "./Loader.wc.svelte";

  export let eventHash: string | undefined;
  export let abonementHash: string | undefined;
  export let lang: string | undefined;
  export let currency: string | undefined;
  export let thanksUrl: string | undefined;
  export let sellerUrl: string | undefined;
  export let homeUrl: string | undefined;
  export let homeLogoUrl: string | undefined;

  // below code required for webcomponent integration
  let ref: HTMLIFrameElement;

  let iframeUrl: string;
  let loaded: boolean;
  let opened: boolean;

  const getLink = () => {
    const url = new URL("https://widget.ticketcrm.com/");
    const add_params = {
      ...(eventHash && { widgetHash: eventHash }),
      ...(abonementHash && { seasonHash: abonementHash }),
      ...(lang && { lang }),
      ...(currency && { currency }),
      ...(thanksUrl && { thank: encodeURIComponent(thanksUrl) }),
      ...(sellerUrl && { sellerUrl: encodeURIComponent(sellerUrl) }),
      ...(homeUrl && { url: encodeURIComponent(homeUrl) }),
      ...(homeLogoUrl && { logo: encodeURIComponent(homeLogoUrl) }),
    };
    const new_params = new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...Object.entries(add_params),
    ]).toString();
    const new_url = new URL(`${url.origin}${url.pathname}?${new_params}`);
    return new_url.href;
  };

  const getGa = () => {
    window.addEventListener("message", function (e) {
      if (e.data?.type === "loaded") {
        loaded = true;
      }
      if (e.data?.type === "ga") {
        const ids = e.data.data[1];
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

          Promise.all(metrics).then(([client_id, session_id, ...args]) => {
            ref.contentWindow.postMessage(
              {
                type: "_ga",
                data: [{ id: ids[0], client_id, session_id }].concat(
                  args.map((session_id, i) => ({
                    id: ids[i + 1],
                    client_id,
                    session_id,
                  }))
                ),
              },
              "*"
            );
          });
        }
      }
    });
  };

  onMount(() => {
    try {
      if (typeof gtag !== "undefined") {
        getGa();
      }
      iframeUrl = getLink();
    } catch (e) {
      console.log(e);
    }
  });
</script>

<div
  class="slot-container"
  on:click={() =>
    (document.querySelector("body").style.overflow = "hidden") &&
    (opened = true)}
>
  <slot />
</div>

<div class="container" class:hidden={!opened}>
  {#if iframeUrl}
    <iframe
      class:hidden={!loaded}
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
  <button
    class:transparent={!iframeUrl || !loaded}
    on:click={() =>
      (document.querySelector("body").style.overflow = "auto") &&
      (opened = false)}
    class="close">✖</button
  >
</div>

<style>
  .hidden {
    visibility: hidden;
  }

  .slot-container {
    display: inline-block;
  }

  /* popup */
  .close {
    position: absolute;
    top: calc(10vh - 35px);
    color: #273d71;
    background: white;
    width: 40px;
    height: 35px;
    border: none;
    border-radius: 100% 100% 0 0;
    padding: 0;
    font-size: 30px;
  }

  .transparent {
    color: white;
    background: transparent;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    color: white;
    background: transparent;
    border: none;
    padding: 0;
    font-size: 30px;
  }

  .container {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: end;
    justify-content: center;
    z-index: 3000;
  }

  iframe {
    position: relative;
    margin: 0 auto;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 90vh;
    border: none;
    border-radius: 5px;
  }

  /* overlay popup with loader */
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  @media (min-width: 768px) {
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
      color: white;
      background: transparent;
      border: none;
      padding: 0;
      font-size: 30px;
    }
    .container {
      align-items: center;
    }
    iframe {
      border: none;
      border-radius: 0;
      outline: none;
      width: 95vw;
      height: 95vh;
      max-height: 500px;
      max-width: 800px;
    }
  }
</style>
