<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" width="60%">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="tableLoading"
    >
      <el-table-column prop="id" label="序号" width="80px" />
      <el-table-column label="图片">
        <template #default="{ row }">
          <el-image
            style="width: 85px; height: 85px"
            :src="row.cover"
            fit="fill"
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
</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { getCategoryRelate, deleteCategoryRelate } from "~/api/category";

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

defineExpose({
  open,
});
</script>
