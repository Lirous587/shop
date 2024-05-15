<template>
  <button @click="show = !show">Toggle</button>
  <transition>
    <p v-if="show">hello</p>
  </transition>
</template>
<script setup>
import { ref } from 'vue';
const show = ref(false)

</script>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>