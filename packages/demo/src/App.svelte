<script lang="ts">
  import "../../lib";

  let eventHash = "";
  let abonementHash = "";
  let lang = "uk";
  let currency = "";
  let thanksUrl = "";
  let sellerUrl = "";
  let homeUrl = "";
  let homeLogoUrl = "";

  let type = "event";
  let selected = "tbx-modal";
  let output = "";

  $: attr = {
    ...(eventHash && type === "event" && { eventHash }),
    ...(abonementHash && type === "abonement" && { abonementHash }),
    ...(lang && { lang }),
    ...(currency && { currency }),
    ...(thanksUrl && { thanksUrl }),
    ...(sellerUrl && { sellerUrl }),
    ...(homeUrl && { homeUrl }),
    ...(homeLogoUrl && { homeLogoUrl }),
  };

  function onSubmit() {
    output = document.getElementsByTagName(selected)[0].outerHTML;
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  }
</script>

<main>
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
      >Event Hash*: <input bind:value={eventHash} type="text" required /></label
    >
  {/if}
  {#if type === "abonement"}
    <label
      >Abonement Hash*: <input
        bind:value={abonementHash}
        type="text"
        required
      /></label
    >
  {/if}
  <label>Language: <input bind:value={lang} type="text" /></label>
  <label>Currency: <input bind:value={currency} type="text" /></label>
  <label>Thanks Url: <input bind:value={thanksUrl} type="text" /></label>
  <label>Seller Url: <input bind:value={sellerUrl} type="text" /></label>
  <label>Home Page Url: <input bind:value={homeUrl} type="text" /></label>
  <label>Home Page Url: <input bind:value={homeLogoUrl} type="text" /></label>

  {#if (eventHash && type === "event") || (abonementHash && type === "abonement")}
    <label>
      <input bind:group={selected} type="radio" value="tbx-modal" />
      <tbx-modal {...attr}>
        <button class="tbx-popup">Buy a ticket</button>
      </tbx-modal>
    </label>
    <label>
      <input bind:group={selected} type="radio" value="tbx-button" />
      <tbx-button {...attr}>
        <button class="tbx-button">Buy on TBX page</button>
      </tbx-button>
    </label>
    <label>
      <input bind:group={selected} type="radio" value="tbx-widget" />
      <tbx-widget {...attr} />
    </label>
    <button on:click={onSubmit}>Get code</button>
    {#if output}
      <br />
      <h3>HTML component code to paste on your page</h3>
      <textarea readonly>{output}</textarea>
    {/if}
  {/if}
</main>
