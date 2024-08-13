<template>
  <el-drawer
    title="物流信息"
    v-model="drawerVisiableRef"
    direction="rtl"
    size="40%"
    :destroy-on-close="true"
    :show-close="true"
  >
    <div>
      <el-card shadow="never" class="border-0">
        <div class="flex items-center">
          <el-image
            :src="info.logo"
            fit="contain"
            class="border"
            style="width: 65px; height: 65px"
          />
          <div class="ml-3">
            <p>物流公司：{{ info.typename }}</p>
            <p>物流单号：{{ info.number }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <div class="border-t">
      <el-card shadow="never" class="border-0">
        <el-timeline class="!pl-0" style="max-width: 600px">
          <el-timeline-item
            v-for="(item, index) in info.list"
            :key="index"
            :timestamp="item.time"
            placement="top"
          >
            {{ item.status }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { getShipInfo } from "~/api/order";
import { toast } from "~/composables/util";
const drawerVisiableRef = ref(false);

const info = ref({});

const open = (id) => {
  return getShipInfo(id).then((res) => {
    if (res.status != 0) {
      toast(res.msg, "error");
      return;
    }
    info.value = res.result;
    drawerVisiableRef.value = true;
  });
};

defineExpose({
  open,
});
</script>
