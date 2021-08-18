<script lang="ts">
import { defineComponent, PropType, ref, watchEffect, onMounted } from 'vue';
import { createPopper } from '@popperjs/core';

enum Theme {
  default = 'default',
  primary = 'primary',
  secondary = 'secondary',
  danger = 'danger',
}

export default defineComponent({
  name: 'SplitDropdown',
  props: {
    items: { type: Array, default: () => [] },
    theme: { type: String as PropType<Theme>, default: 'primary' },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
  },
  setup(props) {
    const uniqId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const uuid = ref(uniqId);
    const opened = ref<Boolean>(false);
    const box = ref<Element>(document.createElement('div'));
    const popper = ref<HTMLElement>(document.createElement('div'));

    const toggle = ():void => {
      if (!props.disabled) {
        opened.value = !opened.value;
        if (opened.value)
          window.postMessage(JSON.stringify({ slideDropdown: uuid.value }), window.location.origin);
      }
    }

    watchEffect(() => {
      if (popper.value) createPopper(box.value, popper.value, {
        placement: 'bottom-end',
      });
    });

    onMounted(() => {
      window.addEventListener('message', (e) => {
        try {
          const o = JSON.parse(e.data);
          if (o.slideDropdown) {
            opened.value = uuid.value === o.slideDropdown;
          }
        } catch (e) {
          // console.log(e);
        }
      });
    });

    return { opened, toggle, box, popper };
  },
});
</script>

<template>
<div class="split-dropdown">
  <div ref="box" :class="[{ disabled, block, pressed: opened }, theme, 'split-dropdown-box']" @click="toggle">
    <div class="split-dropdown-wrapper">
      <span class="label"><slot></slot></span>
      <span class="chevron bottom"></span>
    </div>
  </div>
  <transition name="fade">
    <div ref="popper" class="split-dropdown-popper" v-if="opened && items.length > 0">
      <ul>
        <li v-for="item in items" v-bind:key="item">
          <a :href="item.href || '#'" :target="item.target || '_self'" @click="() => item.click ? item.click() : null">
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </transition>

</div>
</template>

<style lang="sass" scoped>
@use "sass:math"

$primary-color: #1B9B45
$secondary-color: #2687E9
$danger-color: #DB242A
$default-color: #F1F4F9
$default-dark-color: #C9D3DD
$default-font-color: #1B69C8

@mixin colorize($color, $opacity: 0)
  background: $color
  color: #FFF
  transition: background 300ms ease

  &:hover
    background: lighten($color, $opacity)

  &.pressed
    background: darken($color, math.div($opacity, 2))

  .chevron
    background: darken($color, $opacity)

@font-face
    font-family: pingpong
    font-display: swap
    font-weight: 400
    font-style: normal
    src: url(https://contaazul.com/wp-content/themes/assets/global/layout/fonts/ping-pong/eot/PingPong-Regular.eot)
    src: url(https://contaazul.com/wp-content/themes/assets/global/layout/fonts/ping-pong/eot/PingPong-Regular.eot) format('embedded-opentype'),url(https://contaazul.com/wp-content/themes/assets/global/layout/fonts/ping-pong/woff2/PingPong-Regular.woff2) format('woff2')

.split-dropdown
  font-size: 14px
  font-family: pingpong

  .split-dropdown-box
    // padding: 1em 1.5em
    background: #CCC
    display: inline-block
    border-radius: 0.2em
    cursor: pointer
    overflow: hidden

    .split-dropdown-wrapper
      display: flex
      .chevron
        background: #000
        width: 40px
        height: 43px
        display: inline-block

        &::before
          border-style: solid
          border-width: 0.20em 0.20em 0 0
          content: ''
          display: inline-block
          height: 0.30em
          left: 1.1em
          position: relative
          top: 0.75em
          transform: rotate(135deg)
          vertical-align: middle
          width: 0.30em

      .label
        height: 43px
        display: flex
        align-items: center
        padding: 0 1em

    &.default
      background: $default-color
      color: $default-font-color
      border: 1px solid $default-dark-color
      transition: background 300ms ease

      &:hover, &.pressed
        background: darken($default-color, 5%)

      .chevron
        background: darken($default-dark-color, 5%)

    &.primary
      @include colorize($primary-color, 5%)

    &.secondary
      @include colorize($secondary-color, 8%)

    &.danger
      @include colorize($danger-color, 8%)

    &.disabled
      opacity: 0.5
      cursor: auto

    &.block
      display: block

  .split-dropdown-popper
    display: inline-block
    background: #ffffff
    color: #643045
    font-weight: bold
    font-size: 1em
    border-radius: 0.2em
    border: 1px solid $default-dark-color
    z-index: 1

    ul
      margin: 0
      padding: 0

      li
        list-style: none
        margin: 12px

        a
          padding: 0.75em
          display: block
          text-decoration: none
          color: $default-font-color
          border-radius: 0.2em

          &:hover
            background: #F1F4F9

  .fade-enter-active, .fade-leave-active
    transition: opacity 0.5s ease

  .fade-enter-from, .fade-leave-to
    opacity: 0
</style>
