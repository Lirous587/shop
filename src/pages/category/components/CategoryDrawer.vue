<template>
  <FormDrawer
    ref="formDrawerRef"
    title="推荐商品"
    width="60%"
    confirmText="关联"
    @submit="handelRelate"
  >
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="id" label="序号" width="100px" />
      <el-table-column label="图片">
        <template #default="{ row }">
          <el-image
            style="width: 90px; height: 90px"
            :src="row.cover"
            fit="contain"
            :lazy="true"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作" width="80px">
        <template #default="{ row }">
          <el-popconfirm
            title="是否要删除该关联商品?"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="handelDelete(row)"
          >
            <template #reference>
              <el-button type="primary" text size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>

  <ChooseGoods ref="ChooseGoodsRef"></ChooseGoods>
</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import {
  getCategoryRelate,
  deleteCategoryRelate,
  connectCategory,
} from "~/api/category";
import ChooseGoods from "~/components/ChooseGoods.vue";
import { toast } from "~/composables/util.js";

const formDrawerRef = ref(null);
const tableData = ref([]);
const category_id = ref(0);
const tableLoading = ref(false);

const open = async (item) => {
  category_id.value = item.id;
  item.btnLoading = true;
  await getCategoryRelateData();
  formDrawerRef.value.open();
  item.btnLoading = false;
};

async function getCategoryRelateData() {
  tableLoading.value = true;
  return await getCategoryRelate(category_id.value)
    .then((res) => {
      tableData.value = res;
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

const handelDelete = (row) => {
  deleteCategoryRelate(row.id)
    .then((res) => {
      getCategoryRelateData();
    })
    .finally(() => {});
};

const ChooseGoodsRef = ref(null);
const handelRelate = () => {
  ChooseGoodsRef.value.open((ids) => {
    formDrawerRef.value.showLoading();
    return connectCategory({
      category_id: category_id.value,
      goods_ids: ids,
    })
      .then(() => {
        toast("关联成功");
        getCategoryRelateData();
      })
      .finally(() => {
        formDrawerRef.value.hideLoading();
      });
  });
};

defineExpose({
  open,
});
</script>
