<svelte:options
  customElement={{
    tag: "tbx-modal",
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

  let dialog;
  onMount(() => {
    iframeUrl = src || iriStart + iri || "https://widget.ticketcrm.com/";
  });
</script>

<button on:click={dialog.showModal()}>
  <slot />
</button>

{#if iframeUrl}
  <dialog bind:this={dialog}>
    <iframe bind:this={ref} src={iframeUrl} />
    <button on:click={dialog.close()}>close</button>
  </dialog>
{/if}

<style>
</style>
