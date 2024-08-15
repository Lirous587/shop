<template>
  <div v-if="loading">
    <el-row :gutter="20">
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton
          style="width: 100%; --el-skeleton-circle-size: 50px"
          animate
          loading
        >
          <template #template>
            <el-card shadow="hover">
              <div class="flex items-center">
                <div>
                  <el-skeleton-item variant="circle" />
                </div>
                <div class="ml-4 flex-1">
                  <div>
                    <el-skeleton-item variant="p" style="width: 30%" />
                  </div>
                  <div>
                    <el-skeleton-item variant="p" style="width: 60%" />
                  </div>
                </div>
              </div>
            </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </el-row>
  </div>

  <div v-else>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in list" :span="6">
        <el-card shadow="always">
          <div class="flex items-center">
            <div>
              <el-icon
                :class="color[index]"
                class="w-[40px] h-[40px] rounded-full text-white"
                :size="20"
              >
                <User v-if="index == 0" />
                <Tickets v-if="index == 1" />
                <Wallet v-if="index == 2" />
                <Coin v-if="index == 3" />
              </el-icon>
            </div>
            <div class="ml-5">
              <p>{{ item.value }}</p>
              <small class="text-gray-400">{{ item.label }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { getStatisticsData } from "~/api/distribution";

const loading = ref(false);

const color = ref([
  "bg-blue-400",
  "bg-orange-400",
  "bg-green-400",
  "bg-indigo-400",
]);
const list = ref([]);

const getData = () => {
  loading.value = true;
  getStatisticsData()
    .then((res) => {
      console.log(res);
      list.value = res.panels;
    })
    .finally(() => {
      loading.value = false;
    });
};

getData();
</script>
