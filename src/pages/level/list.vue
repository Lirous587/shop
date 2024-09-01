<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <!-- 新增 | 刷新 -->
    <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="discount" label="折扣率" />
      <el-table-column prop="level" label="等级序列" />

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

      <el-table-column label="操作" width="250" align="center">
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
              title="是否要删除该角色?"
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
      <template #append></template>
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
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="等级名称" prop="name">
          <el-input v-model="form.name" placeholder="等级名称"></el-input>
        </el-form-item>
        <el-form-item label="等级权重" prop="desc">
          <el-input
            v-model="form.level"
            placeholder="等级权重"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>

        <el-form-item label="升级条件">
          <div class="flex justify-between items-cente gap-2">
            <div>
              <span class="text-xs text-gray-500">累计消费满</span>
              <el-input
                v-model="form.max_price"
                type="number"
                style="width: 200px"
              >
                <template #append> 元 </template>
              </el-input>
              <small class="inline-block"
                >设置会员等级所需要的累计消费必须大于等于0,单位：元</small
              >
            </div>
            <div>
              <span class="text-xs text-gray-500">累计次数满</span>
              <el-input
                v-model="form.max_times"
                type="number"
                style="width: 200px"
              >
                <template #append> 次 </template>
              </el-input>
              <small class="inline-block"
                >设置会员等级所需要的购买量必须大于等于0,单位：笔</small
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="折扣率(%)" prop="discount">
          <el-input v-model="form.discount" placeholder="折扣率" type="number">
            <template #append> % </template>
          </el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { reactive } from "vue";
import {
  getUserLevelList,
  createUserLevel,
  updateUserLevel,
  deleteUserLevel,
  updateUserLevelStatus,
} from "~/api/level";

import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";

// table
const {
  tableData,
  loading,
  currentPage,
  total,
  getData,
  handelDelete,
  handelStatusChange,
} = useInitTable({
  getList: getUserLevelList,
  delete: deleteUserLevel,
  updateStatus: updateUserLevelStatus,
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
    name: "",
    level: 1,
    status: 1,
    discount: 10,
    max_price: 1000,
    max_times: 500,
  }),
  getData,
  create: createUserLevel,
  update: updateUserLevel,
});
</script>
