<template>
  <el-dialog
    title="商品选择"
    v-model="dialogVisiableRef"
    width="80%"
    align-center
    draggable="false"
    destroy-on-close
  >
    <Search @search="getData" @reset="resetSearchForm">
      <template #default>
        <SearchItem label="商品名称">
          <el-input
            :placeholder="searchForm.title"
            v-model="searchForm.title"
            clearable
            size="small"
          >
          </el-input>
        </SearchItem>
      </template>
    </Search>

    <el-table
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
      :data="tableData"
      stripe
      style="width: 100%"
      height="500px"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column label="商品">
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

      <el-table-column label="总库存" prop="stock" width="80px" />

      <el-table-column label="价格[销售价|原价](元)" width="200px">
        <template #default="{ row }">
          <span>￥ {{ row.min_price }}</span>
          <el-divider
            direction="vertical"
            content-position="center"
          ></el-divider>
          <span>￥ {{ row.min_oprice }}</span>
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

    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConnect">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getGoodsList } from "~/api/goods";
import { useInitTable } from "~/composables/useCommon.js";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";

// table
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  getData,
  handleSelectionChange,
  multipleSelectionIds,
} = useInitTable({
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  },
  searchForm: {
    title: "",
  },
});

const dialogVisiableRef = ref(false);

const callFunc = ref(null);
const open = (call) => {
  dialogVisiableRef.value = true;
  callFunc.value = call;
};

const handelConnect = () => {
  if (typeof callFunc.value == "function") {
    callFunc.value(multipleSelectionIds.value).then(() => {
      getData();
      close();
    });
  }
};

const close = () => {
  dialogVisiableRef.value = false;
};

defineExpose({
  open,
});

const tableLoading = ref(false);
</script>
