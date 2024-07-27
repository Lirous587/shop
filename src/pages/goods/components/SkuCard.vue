<template>
  <el-form-item label="规格选项" size="normal" v-loading="bodyLoading">
    <el-card
      v-for="(item, index) in sku_cart_list"
      :key="index"
      shadow="never"
      class="w-full mb-4"
      :body-style="{ padding: '20px' }"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            style="width: 200px"
            placeholder="规格选项"
            size="normal"
            clearable
            @change="updateGoodsSkuCardEvent(item)"
          >
            <template #append>
              <el-icon class="hover:cursor-pointer"><More /></el-icon>
            </template>
          </el-input>
          <div class="ml-auto">
            <el-button
              :disabled="index == 0"
              @click="sortCard(index, 'up')"
              size="small"
            >
              <el-icon><Top /></el-icon>
            </el-button>
            <el-button
              :disabled="index === sku_cart_list.length - 1"
              @click="sortCard(index, 'down')"
              size="small"
            >
              <el-icon><Bottom /></el-icon>
            </el-button>

            <el-popconfirm
              title="是否要删除该商品规格?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="deleteGoodsSkuCardEvent(item)"
            >
              <template #reference>
                <el-button size="small">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
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
  updateGoodsSkuCardEvent,
  deleteGoodsSkuCardEvent,
  sortCard,
  bodyLoading,
} from "~/composables/useSku.js";
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-100;
}
</style>
<!-- 
防止引用传值 
-->
