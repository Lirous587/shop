<template>
  <div v-loading="loading" class="flex flex-wrap">
    <el-tag
      v-for="(tag, index) in item.goodsSkusCardValue"
      :key="index"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      effect="plain"
      class="mr-3"
    >
      <el-input
        v-model="tag.text"
        placeholder=""
        size="small"
        @change="handelChange($event, tag)"
        class="w-20 ml-[-10px]"
      ></el-input>
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
  {{ props.skuCardId }}
</template>

<script setup>
import { watch } from "vue";
import { initSkuCardItem } from "~/composables/useSku.js";

const props = defineProps({
  skuCardId: {
    type: Number || String,
    required: true,
  },
});

const {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  loading,
  handelChange,
} = initSkuCardItem(props.skuCardId);
</script>
