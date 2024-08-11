<template>
  <el-drawer
    title="导出订单"
    v-model="drawerVisiableRef"
    size="45%"
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
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script setup>
import { reactive, ref } from "vue";
import { toast } from "~/composables/util";
import { exportOrderToExcel } from "~/api/order";

defineProps({
  tabsBar: {
    type: Array,
    require: true,
  },
});

const drawerVisiableRef = ref(false);

const form = reactive({
  tab: "",
  time: "",
});

const loading = ref(false);
const onSubmit = () => {
  if (!form.tab) toast("订单类型不能为空", "error");
  if (form.time && Array.isArray(form.time)) {
    loading.value = true;
    let starttime = form.time[0];
    let endtime = form.time[1];
    exportOrderToExcel({ tab: form.tab, starttime, endtime })
      .then((data) => {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        let filename = new Date().getTime() + ".xlsx";
        link.setAttribute("download", filename);
        document.body.append(link);
        link.click();
        close();
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    toast("请正确选择时间范围");
  }
};

const open = () => (drawerVisiableRef.value = true);
const close = () => (drawerVisiableRef.value = false);

defineExpose({
  open,
  close,
});
</script>
