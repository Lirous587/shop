<template>
  <el-drawer
    title="订单详情"
    v-model="drawerVisiableRef"
    direction="rtl"
    size="50%"
    :destroy-on-close="true"
    :show-close="true"
    :wrapperClosable="true"
  >
    <!-- 支付信息 -->
    <el-card class="mb-4" shadow="never">
      <template #header>
        <div class="p-2">
          <b class="text-sm">支付信息</b>
        </div>
      </template>
      <el-form label-width="80px" :inline="false">
        <el-form-item label="订单号">
          <p>{{ info.no }}</p>
        </el-form-item>
        <el-form-item label="付款方式">
          <p>{{ info.payment_method }}</p>
        </el-form-item>
        <el-form-item label="付款时间">
          <p>{{ info.paid_time }}</p>
        </el-form-item>
        <el-form-item label="创建时间">
          <p>{{ info.create_time }}</p>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商品信息 -->
    <el-card class="mb-4" shadow="never">
      <template #header>
        <div class="p-2">
          <b class="text-sm">商品信息</b>
        </div>
      </template>
      <el-form :inline="false">
        <el-form-item>
          <div class="flex flex-col">
            <div class="p-2">
              <div
                class="flex my-3"
                v-for="(item, index) in info.order_items"
                :key="index"
              >
                <el-image
                  :src="item.goods_item?.cover ?? ''"
                  fit="contain"
                  style="height: 65px; width: 65px"
                  :lazy="true"
                />
                <div class="mx-3">
                  <p>{{ item.goods_item?.title ?? "商品已被删除" }}</p>
                  <p v-if="item.sku" class="mt-1">
                    <el-tag type="info" size="small">
                      {{ item.sku }}
                    </el-tag>
                  </p>
                  <p>
                    <span class="text-rose-500 text-sm font-bold">
                      ￥{{ item.price }}
                    </span>
                    <span class="text-gray-400 text-sm font-bold">
                      x {{ item.num }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-rose-500 text-sm font-bold text-center mt-2">
              成交价 ￥{{ info.total_price }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 收货信息 -->
    <el-card class="mb-4" shadow="never" v-if="info.address">
      <template #header>
        <div class="p-2">
          <b class="text-sm">收货信息</b>
        </div>
      </template>
      <el-form label-width="80px" :inline="false">
        <el-form-item label="收货人">
          <p>{{ info.address.name }}</p>
        </el-form-item>
        <el-form-item label="联系方式">
          <p>{{ info.address.phone }}</p>
        </el-form-item>
        <el-form-item label="收货地址">
          <p>
            {{ info.address.province }}{{ info.address.city
            }}{{ info.address.district }}{{ info.address.address }}
          </p>
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
const drawerVisiableRef = ref(false);

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});

const open = () => (drawerVisiableRef.value = true);
const close = () => (drawerVisiableRef.value = false);

defineExpose({
  open,
});
</script>
