<div class="preloader">
  <div class="preloader__content">
    <svg
      class="preloader__spinner"
      viewBox="0 0 46 46"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="5">
          <circle cx="22" cy="22" r="18" />
          <path stroke-linecap="round" d="M40 22c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  </div>
</div>

<style>
  @keyframes spinning {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes opacityDelay {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .preloader {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column-reverse;
  }
  .preloader__content {
    display: block;
    width: 100px;
    animation-name: opacityDelay;
    animation-duration: 0.5s;
  }
  .preloader__spinner {
    display: block;
    margin: auto;
    stroke: #ee4256;
    animation: spinning 1s cubic-bezier(0.24, 0.45, 0.7, 0.47) infinite;
  }
  .preloader__spinner circle {
    stroke: rgba(238, 66, 86, 0.05);
  }
</style>
