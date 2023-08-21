<script lang="ts">
  import "../../lib";

  let element;
</script>

<main>
  <h1>Widget component</h1>
  <div class="widget-container">
    <tbx-widget
      bind:this={element}
      widget="4ddb389341cf6a8ca2ec9e7e13b1e3171cc38003"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/25210f2535d06bfc9493bed7bfe293195549e791"
    />
  </div>
  <h1>Popup component</h1>
  <div>
    <tbx-modal
      widget="4ddb389341cf6a8ca2ec9e7e13b1e3171cc38003"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/25210f2535d06bfc9493bed7bfe293195549e791"
    >
      <button class="tbx-popup"> Buy a ticket </button>
    </tbx-modal>
  </div>
  <h1>Button with redirect to Ticketsbox widget component</h1>
    <tbx-button
      widget="4ddb389341cf6a8ca2ec9e7e13b1e3171cc38003"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/25210f2535d06bfc9493bed7bfe293195549e791"
    >
      <button class="tbx-button">
        Buy on TBX page
      </button>
    </tbx-button>
  <h1>Playground</h1>
  <style
    style="display: block; white-space:pre; color-scheme: only light; transition: .5s all; border: solid white 1px"
    contenteditable=""
  >
    .widget-container {
      display: flex;
      justify-content: center;
    }

    .tbx-popup, .tbx-button {
      background-color: #ee4256;
      border: #ee4256 7px solid;
      border-radius: 7px;
      margin: 7px auto;
    }
  </style>
</main>
