<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 | 刷新 -->
    <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

    <el-tree
      v-loading="loading"
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
    >
      <template #default="{ data }">
        <div class="flex flex-1">
          <div class="flex items-center ml-2">
            <span> {{ data.name }}</span>
          </div>

          <div class="ml-auto space-x-3">
            <el-button type="primary" text size="small" @click=""
              >推荐商品</el-button
            >

            <span @click.stop="() => {}">
              <el-switch
                v-loading="data.statusLoading"
                :modelValue="data.status"
                :active-value="1"
                :inactive-value="0"
                @change="handelStatusChange($event, data)"
              >
              </el-switch>
            </span>

            <el-button
              type="primary"
              text
              size="small"
              @click.stop="handelEdit(data)"
              >修改</el-button
            >
            <span @click.stop="() => {}">
              <el-popconfirm
                title="是否要删除该分类?"
                confirm-button-text="确定"
                cancel-button-text="取消"
                @confirm="handelDelete(data.id)"
              >
                <template #reference>
                  <el-button type="default" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </span>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>

  <FormDrawer
    ref="formDrawerRef"
    :closeAble="true"
    :title="drawerTitle"
    @submit="handelSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="分类名称"></el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";

import {
  getCategoryList,
  createCategory,
  updateCategoryStatus,
  updateCategory,
  deleteCategory,
} from "~/api/category.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import { reactive } from "vue";

// table
const { tableData, loading, getData, handelDelete, handelStatusChange } =
  useInitTable({
    getList: getCategoryList,
    updateStatus: updateCategoryStatus,
    delete: deleteCategory,
    onGetListSuccess: (res) => {
      tableData.value = res;
      tableData.value = tableData.value.map((o) => {
        return {
          ...o,
          statusLoading: false,
        };
      });
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
    name: "",
  }),
  getData,
  create: createCategory,
  update: updateCategory,
  rules: {},
});

const iconSelectHandel = (icon) => {
  form.icon = icon;
};

const addChild = (id) => {
  handelCreate();
  form.rule_id = id;
  form.status = 1;
};
</script>

<style scoped>
:deep(.el-tree-node__content) {
  @apply my-2;
}
</style>
