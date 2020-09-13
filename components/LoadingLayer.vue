<template>
  <transition name="fade">
    <div v-if="isShow" ref="loading" class="loading-layer" :style="{'animation-duration': delay > 0 ? '0.3s' : '0s'}">
      <transition name="fade">
        <div v-show="isIconShow" ref="icon" class="loading-icon">
          <svg viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
          </svg>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import $ from 'jquery'

@Component({})
export default class LoadingLayer extends Vue {
  isShow = false
  isIconShow = false

  @Prop({ default: 700 })
  delay !: number

  showTimeouter: number = -1

  show () {
    this.showTimeouter = window.setTimeout(() => {
      this.isShow = true
      if (!this.isShow) return
      this.isIconShow = true
      this.showTimeouter = -1
    }, this.delay)
  }

  hide () {
    if (this.showTimeouter !== -1) {
      window.clearTimeout(this.showTimeouter)
    }
    this.isIconShow = false
    this.isShow = false
  }
}
</script>

<style scoped lang="scss">
.loading-layer {
  z-index: 5;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  transition: background 0.15s ease-in-out;
}

@keyframes color {
  0%,
  100% {
    stroke: #ff5652;
  }

  40% {
    stroke: #2196f3;
  }

  66% {
    stroke: #32c787;
  }

  80%,
  90% {
    stroke: #ffc107;
  }
}

.loading-icon {
  position: relative;
  width: 50px;
  height: 50px;
}

.loading-icon svg {
  animation: rotate 2s linear infinite;
  transform-origin: center center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.loading-icon svg circle {
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;
  stroke-linecap: round;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }

  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
