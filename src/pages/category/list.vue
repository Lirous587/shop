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
              v-loading="data.btnLoading"
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
                title="是否要删除该菜单?"
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
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      :inline="false"
      label-width="80px"
    >
      <el-form-item label="上级菜单" prop="rule_id">
        <el-cascader
          v-model="form.rule_id"
          :options="options"
          :props="{
            value: 'id',
            label: 'name',
            children: 'child',
            checkStrictly: true,
            emitPath: false,
          }"
          placeholder="请选择上级菜单"
        />
      </el-form-item>
      <el-form-item label="菜单/规则" prop="menu">
        <el-radio-group v-model="form.menu">
          <el-radio :label="1" size="large" border>菜单</el-radio>
          <el-radio :label="0" size="large" border>规则</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 40%"
          placeholder="名称"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="form.menu == 1" label="菜单图标" prop="icon">
        <IconSelect
          @update:modelValue="iconSelectHandel"
          :modelValue="form.icon"
        ></IconSelect>
      </el-form-item>
      <el-form-item
        v-if="form.menu == 1 && form.rule_id > 0"
        label="前端路由"
        prop="frontpath"
      >
        <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
      </el-form-item>
      <el-form-item v-if="form.menu == 0" label="后端规则" prop="condition">
        <el-input v-model="form.condition" placeholder="后端规则"></el-input>
      </el-form-item>
      <el-form-item v-if="form.menu == 0" label="请求方式" prop="method">
        <el-select
          v-model="form.method"
          placeholder="请求方式"
          style="width: 240px"
        >
          <el-option
            v-for="item in ['GET', 'POST', 'DELETE', 'PUT']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number :min="0" :max="1000" v-model="form.order" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import IconSelect from "~/components/IconSelect.vue";

import {
  getCategoryList,
  createCategory,
  updateCategoryStatus,
  updateCategory,
  deleteCategory,
} from "~/api/category.js";
import { useInitTable, useInitForm } from "~/composables/useCommon.js";
import { reactive, ref } from "vue";

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
          btnLoading: ref(false),
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
    rule_id: 0,
    menu: 1,
    name: "",
    condition: "",
    method: "",
    status: 1,
    order: 0,
    icon: "",
    frontpath: "",
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
