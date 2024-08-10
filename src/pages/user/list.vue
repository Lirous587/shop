<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <Search @search="getData" @reset="resetSearchForm">
      <template #default>
        <SearchItem label="名称">
          <el-input
            placeholder="手机号/邮箱/会员昵称"
            v-model="searchForm.keyword"
            clearable
          ></el-input>
        </SearchItem>
      </template>

      <template #show>
        <SearchItem label="会员等级">
          <el-select
            v-model="searchForm.user_level_id"
            placeholder="会员等级"
            clearable
            filterable
          >
            <el-option
              v-for="item in user_level"
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
      <el-table-column label="会员" width="200px">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar"> </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID :{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="会员等级">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>

      <el-table-column label="登录注册时间">
        <template #default="{ row }">
          {{ row.create_time || "-" }}
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch
            v-loading="row.statusLoading"
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.super == 1"
            @change="handelStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handelEdit(scope.row)"
            >修改</el-button
          >
          <span @click.stop="() => {}">
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
          </span>
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

import {
  getUserList,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
} from "~/api/user";

import { useInitTable, useInitForm } from "~/composables/useCommon.js";

const user_level = ref([]);
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
  getList: getUserList,
  updateStatus: updateUserStatus,
  delete: deleteUser,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    user_level.value = res.user_level;
  },
  searchForm: {
    keyword: "",
    user_level_id: "",
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
  form: reactive({
    username: "",
    password: "",
    role_id: "",
    status: 1,
    avatar: "",
  }),
  getData,
  create: createUser,
  update: updateUser,
});
</script>
