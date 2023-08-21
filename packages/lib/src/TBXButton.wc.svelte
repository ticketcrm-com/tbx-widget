<svelte:options
  customElement={{
    tag: "tbx-button",
    props: {
      widget: { reflect: true, type: "String", attribute: "widget" },
      lang: { reflect: true, type: "String", attribute: "lang" },
      thanks: { reflect: true, type: "String", attribute: "thanks" },
    },
  }}
/>

<script lang="ts">
  import { onMount } from "svelte";

  export let widget: string | undefined;
  export let lang: string | undefined;
  export let thanks: string | undefined;

  // below code required for webcomponent integration
  let ref: HTMLLinkElement;

  let iframeUrl: string;
  let ga: {id: string, session_id: string, client_id: string}[]

  const getLink = () => {
    const url = new URL("https://widget.ticketcrm.com/");
    const add_params = {
      ...(widget && { widgetHash: widget }),
      ...(lang && { lang }),
      ...(thanks && { thank: encodeURIComponent(thanks) }),
      ...(ga && {ga: JSON.stringify(ga)})
    };
    const new_params = new URLSearchParams([
      ...Array.from(url.searchParams.entries()),
      ...Object.entries(add_params),
    ]).toString();
    const new_url = new URL(`${url.origin}${url.pathname}?${new_params}`);
    return new_url.href;
  };

  $: ga, iframeUrl = getLink(), console.log('ga, ', ga)

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

          Promise.all(metrics).then(([client_id, session_id, ...args]: string[]) => {
                ga = [{ id: ids[0], client_id, session_id }].concat(
                  args.map((session_id, i) => ({
                    id: ids[i + 1],
                    client_id,
                    session_id,
                  }))
                )
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
    } catch (e) {
      console.log(e);
    }
  });
</script>

<div class="slot-container" on:click={location.href=iframeUrl}><slot /></div>

<style>
  .slot-container {
    display: inline-block;
  }
</style>
