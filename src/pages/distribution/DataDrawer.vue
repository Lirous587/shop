<template>
  <el-drawer
    :title="title"
    v-model="drawerVisiableRef"
    direction="rtl"
    size="55%"
    :destroy-on-close="true"
    :show-close="true"
  >
    <el-form :model="searchForm" :inline="false">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button
            v-for="item in searchRadioTimeChooses"
            :label="item.label"
            :key="item.key"
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
            :key="item.key"
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

    <template v-if="type === 'user'">
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="ID" prop="id" width="80" />
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
    </template>
    <template v-else>
      <el-card>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="ID" prop="order.no" width="200" />
          <el-table-column label="用户名|昵称|手机" width="250" align="center">
            <template #default="{ row }">
              <div v-if="row.order.user">
                {{ row.order.user.username }} | {{ row.order.user.nickname }} |
                {{ row.order.user.phone }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="200" prop="create_time" />
          <el-table-column label="返佣金额" width="80" prop="commission" />
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
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref } from "vue";
import { getAgentData, getOrderData } from "~/api/distribution";
import { useInitTable } from "~/composables/useCommon.js";

const props = defineProps({
  type: {
    type: String,
    default: "user",
  },
});

const title = computed(() => {
  return props.type === "user" ? "推广人列表" : "推广订单列表";
});

// table
const { searchForm, tableData, loading, currentPage, total, getData } =
  useInitTable({
    getList: (() => {
      if (props.type === "user") {
        return getAgentData;
      }
      return getOrderData;
    })(),
    searchForm: {
      keyword: "",
      type: "all",
      starttime: "",
      endtime: "",
      level: 0,
      user_id: 0,
    },
  });

const resetSearchForm = () => {
  searchForm.keyword = "";
  searchForm.type = "all";
  searchForm.starttime = "";
  searchForm.endtime = "";
  searchForm.level = 0;
};

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
  resetSearchForm();
  drawerVisiableRef.value = true;
  searchForm.user_id = id;
  getData();
};

defineExpose({
  open,
});
</script>
