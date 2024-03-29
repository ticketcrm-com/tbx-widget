<script lang="ts">
  import { onMount } from "svelte";
  import "../../lib";

  const initialWidgetUrl = "https://widget.ticketcrm.com/";
  let widgetUrl = "https://widget.ticketcrm.com/";
  let eventHash: string = "";
  let abonementHash: string = "";
  let lang: "uk" | "ru" | "en" | string = "uk";
  let currency: "UAH" | "EUR" | "USD" | string = "";
  let thanksUrl: string = "";
  let thanksInvoiceUrl: string = "";
  let sellerUrl: string = "";
  let homeUrl: string = "";
  let homeLogoUrl: string = "";
  let isAdmin: boolean | string = false;

  let type: "event" | "abonement" | "custom" | string = "event";
  let selected:
    | "tbx-modal"
    | "tbx-fullscreen-modal"
    | "tbx-widget"
    | "tbx-button"
    | string = "tbx-modal";
  let output: string = "";
  let attr: Record<string, string>;

  $: custom =
    widgetUrl.includes(initialWidgetUrl) &&
    widgetUrl.length > initialWidgetUrl.length;

  $: attr = {
    ...(widgetUrl && custom && { widgetUrl }),
    ...(eventHash && type === "event" && { eventHash }),
    ...(abonementHash && type === "abonement" && { abonementHash }),
    ...(lang && { lang }),
    ...(currency && { currency }),
    ...(thanksUrl && { thanksUrl }),
    ...(thanksInvoiceUrl && { thanksInvoiceUrl }),
    ...(sellerUrl && { sellerUrl }),
    ...(homeUrl && { homeUrl }),
    ...(homeLogoUrl && { homeLogoUrl }),
  };

  const getLink = () => {
    const url = new URL(window.location.href);
    const params: Record<string, string> = {
      ...attr,
      ...(selected && { selected }),
      ...(type && { type }),
      ...(type && isAdmin === "true" && { isAdmin }),
    };
    const new_params = new URLSearchParams(Object.entries(params)).toString();
    const new_url = new URL(`${url.origin}${url.pathname}?${new_params}`);
    return new_url.href;
  };

  $: setTimeout(
    () =>
      (attr || selected || type || type) &&
      window.history.pushState(null, "", getLink()),
    500
  ) && (output = "");

  onMount(() => {
    const url = new URL(window.location.href);
    ({
      eventHash,
      abonementHash,
      lang,
      currency,
      thanksUrl,
      thanksInvoiceUrl,
      sellerUrl,
      homeUrl,
      homeLogoUrl,
      selected,
      type,
      isAdmin,
      widgetUrl = initialWidgetUrl,
    } = Object.fromEntries(url.searchParams));
  });

  function onSubmit() {
    const clonedElement = document.getElementById(selected)?.cloneNode(true);
    clonedElement?.removeAttribute("id");
    clonedElement
      ?.querySelectorAll("[control-id]")
      .forEach((el) => el.removeAttribute("control-id"));
    output = clonedElement?.outerHTML;
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  }
</script>

<main>
  <div class="sidenote">
    List of all known conversion parameters so far: utm_source, utm_medium,
    utm_campaign, utm_source_campaign, utm_content, utm_term, gclid, dclid,
    fbclid, gad_source
    <hr />
    If you didn`t find yours, please let<a href="https://t.me/bjarnadottir"
      >us</a
    > know
  </div>
  {#if isAdmin === "true"}
    <label>Widget Url: <input bind:value={widgetUrl} type="text" /></label>
  {/if}
  Widget type:
  <label>
    <input bind:group={type} type="radio" value="event" />
    event widget
  </label>
  <label>
    <input bind:group={type} type="radio" value="abonement" />
    abonement widget
  </label>
  {#if type === "event"}
    <label
      >Event Hash{custom ? "" : "*"}:
      <input bind:value={eventHash} type="text" required /></label
    >
  {/if}
  {#if type === "abonement"}
    <label
      >Abonement Hash{custom ? "" : "*"}:
      <input bind:value={abonementHash} type="text" required /></label
    >
  {/if}
  <label>Language: <input bind:value={lang} type="text" /></label>
  <label>Currency: <input bind:value={currency} type="text" /></label>
  <label>Thanks Url: <input bind:value={thanksUrl} type="text" /></label>
  <label
    >Thanks Invoice Url: <input
      bind:value={thanksInvoiceUrl}
      type="text"
    /></label
  >
  <label>Seller Url: <input bind:value={sellerUrl} type="text" /></label>
  <label>Home Page Url: <input bind:value={homeUrl} type="text" /></label>
  <label>Home Logo Url: <input bind:value={homeLogoUrl} type="text" /></label>

  {#if (eventHash && type === "event") || (abonementHash && type === "abonement") || custom}
    <label>
      <input bind:group={selected} type="radio" value="tbx-modal" />
      <tbx-modal id="tbx-modal" {...attr}>
        <button class="tbx-popup">Buy on popup</button>
      </tbx-modal>
    </label>
    <label>
      <input bind:group={selected} type="radio" value="tbx-fullscreen-modal" />
      <tbx-modal id="tbx-fullscreen-modal" {...{ ...attr, fullScreen: true }}>
        <button class="tbx-fullscreen-popup">Buy on your page</button>
      </tbx-modal>
    </label>
    <label>
      <input bind:group={selected} type="radio" value="tbx-button" />
      <tbx-button id="tbx-button" {...attr}>
        <button class="tbx-button">Buy on TBX page</button>
      </tbx-button>
    </label>
    <label style="display: block">
      <input
        style="margin-bottom: 10px"
        bind:group={selected}
        type="radio"
        value="tbx-widget"
      />
      Paste widget on your page
      <tbx-widget id="tbx-widget" {...attr} />
    </label>
    <button on:click={onSubmit}>Get code</button>
    {#if output}
      <br />
      <h3>HTML component code to paste on your page</h3>
      <textarea readonly>{output}</textarea>
    {/if}
  {/if}
</main>
