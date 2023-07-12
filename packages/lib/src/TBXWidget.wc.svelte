<svelte:options
  customElement={{
    tag: "tbx-widget",
    props: {
      src: { reflect: true, type: "String", attribute: "src" },
      widget: { reflect: true, type: "String", attribute: "widget" },
      type: { reflect: true, type: "String", attribute: "type" },
      lang: { reflect: true, type: "String", attribute: "lang" },
      thanks: { reflect: true, type: "String", attribute: "thanks" },
      iriStart: { reflect: true, type: "String", attribute: "iriStart" },
      iri: { reflect: true, type: "String", attribute: "iri" },
    },
  }}
/>

<script lang="ts">
  import { onMount } from "svelte";

  export let src: string | undefined;
  export let iriStart: string | undefined;
  export let iri: string | undefined;
  export let widget: string | undefined;
  export let type: string | undefined;
  export let lang: string | undefined;
  export let thanks: string | undefined;
  let iframeUrl = undefined;

  // below code required for webcomponent integration
  let ref: HTMLDivElement;
  onMount(() => {
    console.log(src, iriStart, iri);
    iframeUrl = src || iriStart + iri || "https://widget.ticketcrm.com/";
    console.log(iframeUrl);
  });

  // const updateParent = function (val) {
  //   if (ref?.getRootNode()?.host) {
  //     console.log("host", ref.getRootNode().host, valid);
  //     ref.getRootNode().host.value = val;
  //     ref.getRootNode().host.valid = valid;
  //   }
  // };
  // $: updateParent(value);
</script>

{#if iframeUrl}
  <iframe bind:this={ref} src={iframeUrl} />
{/if}

<style>
  iframe {
    min-width: 600px;
    min-height: 800px;
  }
</style>
