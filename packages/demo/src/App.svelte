<script lang="ts">
  import "../../lib";

  let element;
</script>

<main>
  <h1>Widget component</h1>
  <div class="widget-container">
    <tbx-widget
      bind:this={element}
      widget="25210f2535d06bfc9493bed7bfe293195549e791"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/25210f2535d06bfc9493bed7bfe293195549e791"
    />
  </div>
  <h1>Popup component</h1>
  <div>
    <tbx-modal
      widget="25210f2535d06bfc9493bed7bfe293195549e791"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/25210f2535d06bfc9493bed7bfe293195549e791"
    >
      <button class="tbx-popup"> Buy a ticket </button>
    </tbx-modal>
  </div>
  <h1>Playground</h1>
  <style
    style="display: block; white-space:pre; color-scheme: only light; transition: .5s all; border: solid white 1px"
    contenteditable=""
  >
    .widget-container {
      display: flex;
      justify-content: center;
    }

    .tbx-popup {
      background-color: #ee4256;
      border: #ee4256 7px solid;
      border-radius: 7px;
      margin: 7px auto;
    }
  </style>
</main>
