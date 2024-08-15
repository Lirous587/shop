<template>
  <el-drawer
    title="推广人列表"
    v-model="drawerVisiableRef"
    direction="rtl"
    size="45%"
    :destroy-on-close="true"
    :show-close="true"
  >
    <el-form :model="form" :inline="false">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button
            v-for="item in searchRadioTimeChooses"
            :label="item.label"
            :key="key"
            :value="item.key"
            size="small"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker
          v-model="searchForm.starttime"
          type="date"
          placeholder="开始日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker
          v-model="searchForm.endtime"
          type="date"
          placeholder="结束日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="searchForm.level">
          <el-radio-button
            v-for="item in searchRadioUserTypeChooses"
            :label="item.label"
            :key="key"
            :value="item.key"
            size="small"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="getData">搜索</el-button>
        <el-button size="small" @click="resetSearchForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="ID" width="80">
          <template #default="{ row }">
            {{ row.id }}
          </template>
        </el-table-column>
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <el-avatar
              size="large"
              shape="circle"
              :src="row.avatar"
              fit="contain"
            />
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="100">
          <template #default="{ row }">
            <div class="text-xs">
              <p>{{ row.username }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="推广数" width="100" prop="share_num" />
        <el-table-column label="推广订单数" prop="share_order_num" />
        <el-table-column label="绑定时间" width="200" prop="create_time" />
      </el-table>
      <div class="flex justify-center items-center mt-4">
        <el-pagination
          background
          layout="prev, pager,next"
          :current-page="currentPage"
          @current-change="getData"
          :total="total"
        />
      </div>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { getAgentData } from "~/api/distribution";
import { useInitTable } from "~/composables/useCommon.js";

// table
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  getData,
} = useInitTable({
  getList: getAgentData,
  searchForm: {
    keyword: "",
    type: "all",
    starttime: "",
    endtime: "",
    level: "",
    user_id: 0,
  },
});

const searchRadioTimeChooses = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "today",
    name: "今天",
  },
  {
    key: "yesterday",
    name: "昨天",
  },
  {
    key: "last7days",
    name: "最近七天",
  },
];
const searchRadioUserTypeChooses = [
  {
    key: 0,
    name: "全部",
  },
  {
    key: 1,
    name: "一级推广",
  },
  {
    key: 2,
    name: "二级推广",
  },
];

const drawerVisiableRef = ref(false);

const open = (id) => {
  drawerVisiableRef.value = true;
  searchForm.user_id = id;
  getData();
};

defineExpose({
  open,
});
</script>
