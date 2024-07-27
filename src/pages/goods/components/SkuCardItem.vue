<template>
  <div v-for="(tag, index) in item.goodsSkusCardValue" :key="index">
    {{ tag.text }}
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { initSkuCardItem } from "~/composables/useSku.js";

const props = defineProps({
  skuCardId: {
    type: Number || String,
    required: true,
  },
});

let item = reactive({});

item = initSkuCardItem(props.skuCardId);

watch(
  () => props.skuCardId,
  () => {
    item = initSkuCardItem(props.skuCardId);
  }
);
</script>
