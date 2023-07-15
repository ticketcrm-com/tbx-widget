<script lang="ts">
  import "../../lib";

  let element;
</script>

<main>
  <h1>TBX widget!</h1>
  <div>
    <p class="container">
      <tbx-widget
        bind:this={element}
        widget="c86c29dd3158560562dae05c329732084fe01104"
        lang="uk"
        thanks="https://ticketsbox.com/checkout_complete/c86c29dd3158560562dae05c329732084fe01104"
      />
    </p>
  </div>
  <div>
    <tbx-modal
      widget="c86c29dd3158560562dae05c329732084fe01104"
      lang="uk"
      thanks="https://ticketsbox.com/checkout_complete/c86c29dd3158560562dae05c329732084fe01104"
      >open widget</tbx-modal
    >
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  tbx-widget {
    display: block;
    min-width: 600px;
    min-height: 800px;
  }

  h1 {
    color: #ff3e00;
    font-size: 4em;
    line-height: 1.1;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }

    .container {
      display: inline-block;
      max-width: 320px;
    }
  }
</style>
