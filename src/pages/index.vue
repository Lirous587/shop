<template>
  <div>
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
      <template v-if="panels.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animate loading>
            <template #template>
              <el-card shadow="hover" :body-style="{ padding: '20px' }">
                <template #header>
                  <div class="flex justify-between items-center">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 15%" />
                  </div>
                </template>
                <span class="text-3xl font-bold text-gray-500">
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </span>
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 15%" />
                </div>
                <el-divider />
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="index"
      >
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <CountTo :value="item.value"></CountTo>
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span> {{ item.subTitle }}</span>
            <span> {{ item.subValue }}</span>
          </div>
          <el-divider />
        </el-card>
      </el-col>
    </el-row>

    <IndexNavs></IndexNavs>

    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <IndexChart v-permission="['getStatistics3,GET']"></IndexChart>
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <IndexCard
          title="店铺及商品提示"
          tip="店铺及商品提示"
          :btns="goods"
          class="mb-3"
        ></IndexCard>
        <IndexCard
          title="交易提示"
          tip="需要立即处理的交易订单"
          :btns="order"
        ></IndexCard>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CountTo from "~/components/CountTo.vue";
import IndexNavs from "~/components/IndexNavs.vue";
import IndexChart from "~/components/IndexChart.vue";
import IndexCard from "~/components/IndexCard.vue";
import { getstatistics1, getstatistics2 } from "~/api/index.js";

const panels = ref([]);
getstatistics1().then((res) => {
  panels.value = res.panels;
});

const goods = ref([]);
const order = ref([]);

getstatistics2().then((res) => {
  goods.value = res.goods;
  order.value = res.order;
});
</script>
