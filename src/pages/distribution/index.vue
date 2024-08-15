<template>
  <Panel class="mb-3"></Panel>

  <el-card shadow="always">
    <Search @search="getData" @reset="resetSearchForm">
      <template #default>
        <SearchItem label="时间选择">
          <el-radio-group v-model="searchForm.type">
            <el-radio-button
              v-for="item in searchRadioChooses"
              :label="item.label"
              :key="item.key"
              :value="item.key"
              size="small"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </SearchItem>
      </template>

      <template #show>
        <SearchItem label="关键词">
          <el-input size="small" v-model="searchForm.keyword" clearable />
        </SearchItem>
        <SearchItem> </SearchItem>
        <SearchItem label="开始日期">
          <el-date-picker
            v-model="searchForm.starttime"
            type="date"
            placeholder="开始日期"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
        <SearchItem label="结束日期">
          <el-date-picker
            v-model="searchForm.endtime"
            type="date"
            placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
      </template>
    </Search>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
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
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="用户信息" width="200">
        <template #default="{ row }">
          <div class="text-xs">
            <p>用户：{{ row.username }}</p>
            <p>昵称：{{ row.nickname }}</p>
            <p>姓名：{{ row.user_info?.name }}</p>
            <p>电话：{{ row.phone }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="推广用户数量" prop="share_num" />
      <el-table-column label="订单数量" prop="share_order_num" />
      <el-table-column label="订单金额" prop="order_price" />
      <el-table-column label="账户佣金" prop="commission" />
      <el-table-column label="已提现金额" prop="cash_out_price" />
      <el-table-column label="未提现金额" prop="no_cash_out_price" />
      <el-table-column label="提现次数" prop="cash_out_time" />
      <el-table-column label="操作" width="200" align="center">
        <template #default="{ row }">
          <el-button
            class="px-1"
            type="primary"
            size="small"
            text
            @click="openDataDrawer('user', row)"
          >
            推广人
          </el-button>
          <el-button
            class="px-1"
            type="primary"
            size="small"
            text
            @click="openDataDrawer('order', row)"
          >
            推广订单
          </el-button>
        </template>
      </el-table-column>
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

  <DataDrawer ref="dataDrawerUserRef" type="user" />
  <DataDrawer ref="dataDrawerOrderRef" type="order" />
</template>

<script setup>
import { ref } from "vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import { getAgentData } from "~/api/distribution";
import { useInitTable } from "~/composables/useCommon.js";

import Panel from "./Panel.vue";
import DataDrawer from "./DataDrawer.vue";
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
  },
});

const searchRadioChooses = [
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

const dataDrawerUserRef = ref(null);
const dataDrawerOrderRef = ref(null);

const openDataDrawer = (type, row) => {
  if (type === "user") {
    dataDrawerUserRef.value.open(row.id);
  } else {
    dataDrawerOrderRef.value.open(row.id);
  }
};
</script>
