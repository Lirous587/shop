<template>
  <FormDrawer ref="formDrawerRef" title="推荐商品" width="60%">
    <el-table :data="tableData" border style="width: 100%">
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
        <template #default>
          <el-button type="primary" text size="small" @click="">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </FormDrawer>
</template>

<script setup>
import { ref } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import { getCategoryRelateList } from "~/api/category";

const formDrawerRef = ref(null);
const category_id = ref(0);
const tableData = ref([]);

function getCategoryRelateListData() {
  return getCategoryRelateList(category_id.value).then((res) => {
    tableData.value = res;
  });
}

const open = (item) => {
  category_id.value = item.id;
  getCategoryRelateListData();
  formDrawerRef.value.open();
};

defineExpose({
  open,
});
</script>
