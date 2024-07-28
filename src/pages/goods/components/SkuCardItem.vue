<template>
  <div class="flex gap-2">
    <el-tag
      v-for="(tag, index) in item.goodsSkusCardValue"
      :key="index"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag.text }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + 新增规格
    </el-button>
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

let {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
} = initSkuCardItem(props.skuCardId);

watch(
  () => props.skuCardId,
  () => {
    item = initSkuCardItem(props.skuCardId).item;
  }
);
</script>
