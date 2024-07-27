<template>
  <el-form-item label="规格选项" size="normal">
    <el-card
      v-for="(item, index) in sku_cart_list"
      :key="index"
      shadow="never"
      class="w-full mb-4"
      :body-style="{ padding: '20px' }"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            style="width: 200px"
            placeholder="规格选项"
            size="normal"
            clearable
            @change="updateSkuCardEvent(item)"
          >
            <template #append>
              <el-icon class="hover:cursor-pointer"><More /></el-icon>
            </template>
          </el-input>
          <div class="ml-auto">
            <el-button size="small">
              <el-icon><Top /></el-icon>
            </el-button>
            <el-button size="small">
              <el-icon><Bottom /></el-icon>
            </el-button>
            <el-button size="small">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </template>
      <!-- card body -->
      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <el-button
      type="success"
      :loading="btnLoading"
      @click="addGoodsSkuCardEvent"
    >
      添加规格
    </el-button>
  </el-form-item>
</template>

<script setup>
import SkuCardItem from "./SkuCardItem.vue";
import {
  sku_cart_list,
  btnLoading,
  addGoodsSkuCardEvent,
  updateSkuCardEvent,
} from "~/composables/useSku.js";
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-100;
}
</style>
