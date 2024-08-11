<template>
  <el-drawer
    title="导出订单"
    v-model="drawerVisiableRef"
    size="46%"
    direction="rtl"
    :show-close="true"
    :wrapperClosable="true"
  >
    <div>
      <el-form :model="form" label-width="80px" :inline="false">
        <el-form-item label="订单类型">
          <el-select
            v-model="form.tab"
            placeholder="订单类型"
            clearable
            filterable
            @change=""
          >
            <el-option
              v-for="item in tabsBar"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.time"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script setup>
import { reactive, ref } from "vue";

const tabsBar = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

const drawerVisiableRef = ref(false);

const form = reactive({
  tab: "all",
  time: "",
});

const onSubmit = () => {
    
}

const open = () => (drawerVisiableRef.value = true);
const close = () => (drawerVisiableRef.value = false);

defineExpose({
  open,
  close,
});
</script>
