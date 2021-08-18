<script lang="ts">
import { defineComponent } from 'vue';
import SplitDropdown from '@/split-dropdown.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    SplitDropdown
  },
  data() {
    return {
      themes: [
        'default',
        'primary',
        'secondary',
        'danger',
      ],
      items: [
        { text: 'Lorem ipsum dolor sit 1', href: "https://contaazul.com/", target: "_blank" },
        { text: 'Lorem ipsum dolor sit 2', click: () => alert('Click 2') },
        { text: 'Lorem ipsum dolor sit 3', click: () => alert('Click 3') },
      ]
    }
  },
});
</script>

<template>
  <div id="app">
    <p v-for="theme in themes" v-bind:key="theme">
      <split-dropdown :theme="theme" :items="items">Button</split-dropdown>
    </p>
  </div>
</template>
