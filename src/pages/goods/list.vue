<template>
  <el-tabs v-model="searchForm.tab" @tab-change="getData()">
    <el-tab-pane
      v-for="(item, index) in tabsBar"
      :label="item.name"
      :name="item.key"
      :key="index"
    >
    </el-tab-pane>
  </el-tabs>

  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <Search @search="getData" @reset="resetSearchForm">
      <template #default>
        <SearchItem label="商品名称">
          <el-input
            :placeholder="searchForm.title"
            v-model="searchForm.title"
            clearable
          >
          </el-input>
        </SearchItem>
      </template>

      <template #show>
        <SearchItem label="商品分类">
          <el-select
            v-model="searchForm.category_id"
            placeholder="商品分类"
            clearable
            filterable
          >
            <el-option
              v-for="item in categoryList"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </SearchItem>
      </template>
    </Search>

    <!-- 新增 | 刷新 -->
    <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品" width="300">
        <template #default="{ row }">
          <div class="flex justify-center items-center">
            <el-image
              v-if="row.cover"
              :src="'/public/' + row.cover.split('/')[4]"
              fit="contain"
              :lazy="false"
              loading="eager"
              style="width: 50px; height: 50px"
            ></el-image>
            <el-image v-else></el-image>
            <div class="flex-1 flex flex-col ml-2">
              <h5>{{ row.title }}</h5>
              <div>
                <span class="text-rose-500">￥ {{ row.min_oprice }}</span>
                <el-divider direction="vertical" />
                <span>￥{{ row.min_oprice }}</span>
              </div>
              <small class="text-gray-400"
                >分类: {{ row.category ? row.category.name : "未分类" }}</small
              >
              <small class="text-gray-400"
                >创建时间:{{ row.create_time }}</small
              >
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="实际销量" align="center">
        <template #default="{ row }">
          {{ row.sale_count }}
        </template>
      </el-table-column>

      <el-table-column label="商品状态" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? "上架" : "仓库" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="120" align="center">
        <template #default="{ row }">
          <div v-if="row.ischeck === 0" class="flex flex-col">
            <el-button type="success" plain>审核通过</el-button>
            <el-button type="danger" class="mt-2 !ml-0" plain
              >审核拒绝</el-button
            >
          </div>
          <span v-else>
            {{ row.ischeck === 1 ? "通过" : "拒绝" }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="总库存" align="center">
        <template #default="{ row }">
          {{ row.stock }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template #default="scope">
          <div v-if="searchForm.tab != 'delete'">
            <el-button class="px-1" type="primary" size="small" text
              >修改</el-button
            >
            <el-button class="px-1" type="primary" size="small" text
              >商品规格</el-button
            >
            <el-button class="px-1" type="primary" size="small">
              设置轮播图</el-button
            >
            <el-button class="px-1" type="primary" size="small" text
              >商品详细</el-button
            >
            <el-popconfirm
              title="是否要删除该管理员?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handelDelete(scope.row.id)"
            >
              <template #reference>
                <el-button type="default" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div v-else>暂无操作</div>
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

    <FormDrawer
      ref="formDrawerRef"
      :closeAble="true"
      :title="drawerTitle"
      @submit="handelSubmit"
    >
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>

        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";

import { getCategoryList } from "~/api/category";

import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods,
} from "~/api/goods";

import { useInitTable, useInitForm } from "~/composables/useCommon.js";

const roles = ref([]);

// table
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  getData,
  handelDelete,
  handelStatusChange,
} = useInitTable({
  getList: getGoodsList,
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
});

// form
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handelSubmit,
  handelCreate,
  handelEdit,
} = useInitForm({
  form: reactive({}),
  getData,
  create: createGoods,
  update: updateGoods,
});

const tabsBar = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

// 高级搜索
const categoryList = ref([]);
getCategoryList().then((res) => (categoryList.value = res));
</script>
