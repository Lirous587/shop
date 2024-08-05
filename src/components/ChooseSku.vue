<template>
  <el-dialog
    title="规格选择"
    width="80%"
    v-model="dialogVisibleRef"
    v-loading="loading"
    class="!mt-10"
  >
    <el-container style="height: 65vh">
      <el-aside class="sku-aside" width="220px">
        <div class="top">
          <div
            class="sku-list"
            @click="selectClassify(item.id)"
            :class="{ active: activeId == item.id }"
            v-for="(item, index) in tableData"
            :key="index"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            layout="prev,pager, next"
            :current-page="currentPage"
            @current-change="getData"
            :total="total"
          />
        </div>
      </el-aside>
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox
            v-for="(item, index) in list"
            :value="item"
            :key="index"
            label="item"
            class="p-3 border"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisibleRef = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useInitTable } from "~/composables/useCommon.js";
import { getSkusList } from "~/api/skus.js";

const { tableData, loading, currentPage, total, getData } = useInitTable({
  getList: getSkusList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
    if (res.list.length > 0) {
      selectClassify(res.list[0].id);
    }
  },
});

const dialogVisibleRef = ref(false);

const callFunction = ref(null);
const open = (callFunc) => {
  dialogVisibleRef.value = true;
  callFunction.value = callFunc;
  getData(1);
};

const form = reactive({
  name: "",
  list: [],
});

const list = ref([]);
const activeId = ref(0);
const selectClassify = (id) => {
  list.value = [];
  let item = tableData.value.find((o) => o.id == id);
  if (item) {
    list.value = item.default.split(",");
  }
  form.name = item.name;
  activeId.value = id;
};

// 利用回调函数返回数据给父组件
const submit = () => {
  if (typeof callFunction.value === "function") {
    callFunction.value(form);
  }
  dialogVisibleRef.value = false;
  form.list = [];
};

defineExpose({
  open,
});
</script>

<style scoped>
.sku-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.sku-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.sku-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex justify-center justify-center;
}

.sku-list {
  @apply p-3 bg-gray-50  hover:(bg-blue-100 cursor-pointer);
  border-bottom: 1px solid rgba(149, 166, 220, 0.146);
}
.active {
  @apply bg-blue-100;
}
</style>
