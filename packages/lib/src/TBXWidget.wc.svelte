<svelte:options
  customElement={{
    tag: "tbx-widget",
    props: {
      widget: { reflect: true, type: "String", attribute: "widget" },
      lang: { reflect: true, type: "String", attribute: "lang" },
      thanks: { reflect: true, type: "String", attribute: "thanks" },
    },
  }}
/>

<script lang="ts">
  import { onMount } from "svelte";
  import Loader from "./Loader.svelte";

  export let widget: string | undefined;
  export let lang: string | undefined;
  export let thanks: string | undefined;
  let iframeUrl: string;
  let loaded: boolean;

  // below code required for webcomponent integration
  let ref: HTMLIFrameElement;

  const getLink = () => {
    const url = new URL("https://widget.ticketcrm.com/");
    const add_params = {
      ...(widget && { widgetHash: widget }),
      ...(lang && { lang }),
      ...(thanks && { thank: encodeURIComponent(thanks) }),
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

<div class="container">
  {#if iframeUrl}
    <iframe
      title="TBX widget"
      class:hidden={!loaded}
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
    width: 100%;
    height: 100%;
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
