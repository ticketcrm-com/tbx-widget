<div class="preloader">
  <div class="preloader__content sk-folding">
    <div class="sk-folding-cube">
      <div class="sk-cube1 sk-cube" />
      <div class="sk-cube2 sk-cube" />
      <div class="sk-cube4 sk-cube" />
      <div class="sk-cube3 sk-cube" />
    </div>
  </div>
</div>

<style>
  @keyframes sk-foldCubeAngle {
    0%,
    10% {
      transform: perspective(140px) rotateX(-180deg);
      opacity: 0;
    }
    25%,
    75% {
      transform: perspective(140px) rotateX(0deg);
      opacity: 1;
    }
    90%,
    100% {
      transform: perspective(140px) rotateY(180deg);
      opacity: 0;
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

  .sk-folding {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .sk-folding-cube {
    margin: auto;
    width: 40px;
    height: 40px;
    position: relative;
    display: block;
    transform: rotate(45deg);
  }
  .sk-folding-cube .sk-cube {
    float: left;
    width: 50%;
    height: 50%;
    position: relative;
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
  .sk-folding-cube .sk-cube:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #49bcb7;
    -webkit-animation: sk-foldCubeAngle 2.4s infinite linear both;
    animation: sk-foldCubeAngle 2.4s infinite linear both;
    -webkit-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
  }
  .sk-folding-cube .sk-cube2 {
    -webkit-transform: scale(1.1) rotateZ(90deg);
    transform: scale(1.1) rotateZ(90deg);
  }
  .sk-folding-cube .sk-cube3 {
    -webkit-transform: scale(1.1) rotateZ(180deg);
    transform: scale(1.1) rotateZ(180deg);
  }
  .sk-folding-cube .sk-cube4 {
    -webkit-transform: scale(1.1) rotateZ(270deg);
    transform: scale(1.1) rotateZ(270deg);
  }
  .sk-folding-cube .sk-cube2:before {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  .sk-folding-cube .sk-cube3:before {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
  }
  .sk-folding-cube .sk-cube4:before {
    -webkit-animation-delay: 0.9s;
    animation-delay: 0.9s;
  }
</style>
