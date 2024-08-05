<template>
  <div v-loading="loading" class="flex flex-wrap">
    <el-tag
      v-for="(tag, index) in item.goodsSkusCardValue"
      :key="index"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      effect="plain"
      class="mr-3 mb-2"
    >
      <el-input
        v-model="tag.text"
        size="small"
        @change="handelChange($event, tag)"
        class="w-20 ml-[-10px]"
      ></el-input>
    </el-tag>

    <el-tag
      v-if="inputVisible"
      :disable-transitions="false"
      effect="plain"
      class="mr-3 mb-2 pr-0"
    >
      <el-input
        ref="InputRef"
        v-model="inputValue"
        size="small"
        class="w-20 ml-[-10px] pr-0"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
    </el-tag>
    <el-button v-else size="small" @click="showInput"> + 新增规格 </el-button>
  </div>
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
