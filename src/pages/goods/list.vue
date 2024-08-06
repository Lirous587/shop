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
    <ListHeader
      layout="create,refresh,delete"
      @create="handelCreate"
      @refresh="getData"
      @delete="handelMultipleDelete"
    >
      <el-button
        v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
        size="small"
        @click="handelMultipleStatusChange(1)"
      >
        上架
      </el-button>

      <el-button
        size="small"
        @click="handelMultipleStatusChange(0)"
        v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
      >
        下架
      </el-button>
    </ListHeader>

    <el-table
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
      :data="tableData"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
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
            <el-button
              type="success"
              plain
              @click="ifCheckGoodsEvent(row.id, 1)"
            >
              审核通过
            </el-button>
            <el-button
              type="danger"
              class="mt-2 !ml-0"
              plain
              @click="ifCheckGoodsEvent(row.id, 1)"
            >
              审核拒绝
            </el-button>
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
            <el-button
              class="px-1"
              type="primary"
              size="small"
              text
              @click="handelEdit(scope.row)"
            >
              修改
            </el-button>

            <el-button
              class="px-1"
              size="small"
              text
              @click="handelSetGoodsSkus(scope.row)"
              :type="
                (scope.row.sku_type == 0 && !scope.row.sku_value) ||
                (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                  ? 'danger'
                  : 'primary'
              "
              :loading="scope.row.skusLoading"
            >
              商品规格
            </el-button>

            <el-button
              class="px-1"
              :type="scope.row.goods_banner.length > 0 ? 'primary' : 'danger'"
              size="small"
              text
              @click="handelSetGoodsBanner(scope.row)"
              :loading="scope.row.bannnersLoading"
            >
              设置轮播图
            </el-button>

            <el-button
              class="px-1"
              :type="scope.row.content ? 'primary' : 'danger'"
              size="small"
              text
              @click="handelSetGoodsContent(scope.row)"
              :loading="scope.row.contentLoading"
            >
              商品详细
            </el-button>

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
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" placeholder="商品名称"></el-input>
        </el-form-item>

        <el-form-item label="封面" prop="cover">
          <ChooseImage v-model="form.cover" />
        </el-form-item>

        <el-form-item label="商品分类" prop="category_id">
          <el-select
            v-model="form.category_id"
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
        </el-form-item>

        <el-form-item label="商品描述" prop="desc">
          <el-input
            type="textarea"
            v-model="form.desc"
            placeholder="商品描述"
          ></el-input>
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="单位"></el-input>
        </el-form-item>

        <el-form-item label="总库存" prop="stock">
          <el-input style="width: 50%" type="number" v-model="form.stock">
            <template #append>
              {{ form.unit }}
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="库存预警" prop="min_stock">
          <el-input style="width: 50%" type="number" v-model="form.min_stock">
            <template #append>
              {{ form.unit }}
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="最低销售价" prop="min_price">
          <el-input style="width: 50%" type="number" v-model="form.min_price">
            <template #append> 元 </template>
          </el-input>
        </el-form-item>

        <el-form-item label="最低原价" prop="min_oprice">
          <el-input style="width: 50%" type="number" v-model="form.min_oprice">
            <template #append> 元 </template>
          </el-input>
        </el-form-item>

        <el-form-item label="库存显示" prop="stock_display">
          <el-radio-group v-model="form.stock_display" class="ml-4">
            <el-radio :value="0" size="large">隐藏</el-radio>
            <el-radio :value="1" size="large">显示</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status" class="ml-4">
            <el-radio :value="0" size="large">放入仓库</el-radio>
            <el-radio :value="1" size="large">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
  <banner ref="bannerRef" @reload="getData"> </banner>
  <content ref="contentRef"></content>
  <skus ref="skusRef"></skus>
</template>

<script setup>
import { ref, reactive } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ChooseImage from "~/components/ChooseImage.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import banner from "./banner.vue";
import content from "./content.vue";
import skus from "./skus.vue";

import { toast } from "~/composables/util.js";

import { getCategoryList } from "~/api/category";

import {
  getGoodsList,
  updateGoodsStatus,
  ifCheckGoods,
  createGoods,
  updateGoods,
  deleteGoods,
} from "~/api/goods";

import { useInitTable, useInitForm } from "~/composables/useCommon.js";

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
  handleSelectionChange,
  handelMultipleDelete,
  handelMultipleStatusChange,
} = useInitTable({
  getList: getGoodsList,
  updateStatus: updateGoodsStatus,
  delete: deleteGoods,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannnersLoading = false;
      o.contentLoading = false;
      return o;
    });
    total.value = res.totalCount;
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
  form: reactive({
    title: null,
    category_id: null,
    cover: null,
    desc: null,
    unit: "件",
    stock: 200,
    min_stock: 10,
    status: 1,
    stock_display: 1,
    min_price: 1.0,
    min_oprice: 100.0,
  }),
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

// 审核功能
const ifCheckGoodsEvent = (id, status) => {
  ifCheckGoods(id, status).then(() => {
    toast("操作成功");
    getData();
  });
};

// 高级搜索
const categoryList = ref([]);
getCategoryList().then((res) => (categoryList.value = res));

// 轮播图
const bannerRef = ref(null);
const handelSetGoodsBanner = (row) => {
  row.bannnersLoading = true;
  bannerRef.value.open(row);
};

// 商品内容
const contentRef = ref(null);
const handelSetGoodsContent = (row) => {
  row.contentLoading = true;
  contentRef.value.open(row);
};

// 商品规格
const skusRef = ref(null);
const handelSetGoodsSkus = (row) => {
  row.skusLoading = true;
  skusRef.value.open(row);
};
</script>
