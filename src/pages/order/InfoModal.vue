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
    <!-- 订单详情 -->
    <el-card class="mb-4" shadow="never">
      <template #header>
        <div class="p-2">
          <b class="text-sm">订单详情</b>
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
          <p>{{ order_time }}</p>
        </el-form-item>
        <el-form-item label="创建时间">
          <p>{{ info.create_time }}</p>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 发货信息 -->
    <el-card v-if="info.ship_data" class="mb-4" shadow="never">
      <template #header>
        <div class="p-2">
          <b class="text-sm">发货信息</b>
        </div>
      </template>
      <el-form label-width="80px" :inline="false">
        <el-form-item label="物流公司">
          <p>{{ info.ship_data.express_company }}</p>
        </el-form-item>
        <el-form-item label="运单号">
          <p>{{ info.ship_data.express_no }}</p>
          <el-button
            type="primary"
            text
            size="small"
            @click="openShipInfo"
            :loading="btnLoading"
            >查看物流</el-button
          >
        </el-form-item>
        <el-form-item label="发货时间">
          <p>{{ sent_time }}</p>
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

    <!-- 退款信息 -->
    <el-card class="mb-4" shadow="never" v-if="info.refund_status != 'pending'">
      <template #header>
        <div class="p-2 flex justify-between items-center">
          <b class="text-sm">退款信息</b>
          <el-button text disabled>
            {{ refund_status }}
          </el-button>
        </div>
      </template>
      <el-form label-width="80px" :inline="false">
        <el-form-item label="退款理由">
          <p>{{ info.extra.refund_reason }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
  <ShipInfoModal ref="shipInfoModalRef" />
</template>

<script setup>
import { ref, computed } from "vue";
import { useDateFormat } from "@vueuse/core";

import ShipInfoModal from "./ShipInfoModal.vue";

const drawerVisiableRef = ref(false);

const props = defineProps({
  info: {
    type: Object,
    required: true,
  },
});

const order_time = computed(() => {
  const s = useDateFormat(props.info.paid_time * 1000, "YYYY-MM-DD HH:mm:ss");
  return s;
});
const sent_time = computed(() => {
  if (props.info.ship_data) {
    const s = useDateFormat(
      props.info.ship_data.express_time * 1000,
      "YYYY-MM-DD HH:mm:ss"
    );
    return s;
  } else {
    return "未收货";
  }
});
const refund_status = computed(() => {
  const opt = {
    pending: "未退款",
    applied: "已申请,等待审核",
    processing: "退款中",
    success: "退款成功",
    failed: "退款失败",
  };
  return props.info.refund_status ? opt[props.info.refund_status] : "";
});

const shipInfoModalRef = ref(null);

const btnLoading = ref(false);
const openShipInfo = () => {
  btnLoading.value = true;
  shipInfoModalRef.value.open(props.info.id).finally(() => {
    btnLoading.value = false;
  });
};

const open = () => (drawerVisiableRef.value = true);

defineExpose({
  open,
});
</script>
