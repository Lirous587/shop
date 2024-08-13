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
        <SearchItem label="订单编号">
          <el-input size="small" v-model="searchForm.no" clearable> </el-input>
        </SearchItem>
      </template>

      <template #show>
        <SearchItem label="收货人">
          <el-input size="small" v-model="searchForm.name" clearable>
          </el-input>
        </SearchItem>
        <SearchItem label="手机号">
          <el-input size="small" v-model="searchForm.phone" clearable>
          </el-input>
        </SearchItem>
        <SearchItem label="开始日期">
          <el-date-picker
            v-model="searchForm.starttime"
            type="date"
            placeholder="开始日期"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
        <SearchItem label="结束日期">
          <el-date-picker
            v-model="searchForm.endtime"
            type="date"
            placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </SearchItem>
      </template>
    </Search>

    <!-- 新增 | 刷新 -->
    <ListHeader
      layout="refresh,download"
      @refresh="getData"
      @delete="handelMultipleDelete"
      @download="openexcelDrawer"
    >
      <el-popconfirm
        title="是否要批量删除商品?"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="handelMultipleDelete"
        v-if="searchForm.tab != 'delete'"
      >
        <template #reference>
          <el-button size="small" type="danger"> 批量删除 </el-button>
        </template>
      </el-popconfirm>
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
          <div class="flex flex-col items-start">
            <div class="flex">
              <div class="flex flex-col mr-3">
                订单号:
                <small>{{ row.no }}</small>
              </div>

              <div class="flex flex-col">
                下单时间:
                <small>{{ row.update_time }}</small>
              </div>
            </div>

            <div>
              <div
                v-for="(item, index) in row.order_items"
                :key="index"
                class="flex items-center my-3"
              >
                <el-image
                  :src="item.goods_item?.cover"
                  fit="contain"
                  :lazy="true"
                  loading="eager"
                  style="width: 50px; height: 50px"
                />
                <div
                  class="ml-2"
                  :class="
                    item.goods_item?.title ? 'text-blue-500' : 'text-pink-500'
                  "
                >
                  {{ item.goods_item?.title ?? "商品已被删除" }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="实际付款" align="center">
        <template #default="{ row }">
          {{ row.total_price }}
        </template>
      </el-table-column>

      <el-table-column label="买家" align="center" width="120">
        <template #default="{ row }">
          <p>
            {{ row.user?.nickname ? row.user.nickname : row.user.username }}
          </p>
          <small> (用户ID:{{ row.user?.id }}) </small>
        </template>
      </el-table-column>

      <el-table-column label="交易状态" width="160" align="center">
        <template #default="{ row }">
          <div class="flex flex-col items-center">
            <!-- 支付状态 -->
            <div class="flex items-center">
              <small class="mr-1">支付状态:</small>
              <el-tag
                v-if="row.payment_method == 'alipay'"
                type="primary"
                size="small"
                >支付宝支付</el-tag
              >
              <el-tag
                v-if="row.payment_method == 'wechat'"
                type="success"
                size="small"
                >微信支付</el-tag
              >
              <el-tag v-if="!row.paid_time" type="info" size="small"
                >未支付</el-tag
              >
            </div>

            <!-- 发货状态 -->
            <div class="flex items-center">
              <small class="mr-1">发货状态:</small>
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">
                {{ row.ship_data ? "已发货" : "未发货" }}
              </el-tag>
            </div>

            <!-- 收货状态 -->
            <div class="flex items-center">
              <small class="mr-1">收货状态:</small>
              <el-tag
                :type="row.ship_status == 'received' ? 'success' : 'info'"
                size="small"
              >
                {{ row.ship_status == "" ? "已收货" : "未收货" }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="350" align="center">
        <template #default="{ row }">
          <!-- 订单详细 -->
          <el-button
            class="px-1"
            type="primary"
            size="small"
            text
            @click="openInfoModalDrawer(row)"
          >
            订单详细
          </el-button>

          <!-- 订单发货 -->
          <el-button
            v-if="searchForm.tab === 'noship'"
            class="px-1"
            type="primary"
            size="small"
            text
          >
            订单发货
          </el-button>

          <!-- 同意退款 -->
          <el-button
            v-if="searchForm.tab === 'refunding'"
            class="px-1"
            type="primary"
            size="small"
            text
            @click="handelRefund(row.id, 1)"
          >
            同意退款
          </el-button>

          <!-- 拒绝退款 -->
          <el-button
            v-if="searchForm.tab === 'refunding'"
            class="px-1"
            type="primary"
            size="small"
            text
            @click="handelRefund(row.id, 0)"
          >
            拒绝退款
          </el-button>
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
  </el-card>

  <ExcelDrawer ref="excelDrawerRef" :tabsBar="tabsBar" />
  <InfoModal ref="infoModalRef" :info="orderInfo" />
</template>

<script setup>
import { reactive, ref } from "vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import ExcelDrawer from "./ExcelDrawer.vue";
import InfoModal from "./InfoModal.vue";

import { toast, showModal, showPrompt } from "~/composables/util.js";

import { getOrderList, deleteOrder, refund } from "~/api/order";

import { useInitTable } from "~/composables/useCommon.js";

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
  handelMultipleDelete,
  multipleTableRef,
} = useInitTable({
  getList: getOrderList,
  delete: deleteOrder,
  //   onGetListSuccess: (res) => {
  //     tableData.value = res.list.map((o) => {
  //       return o;
  //     });
  //     total.value = res.totalCount;
  //   },
  searchForm: {
    no: "",
    tab: "all",
    category_id: null,
    starttime: "",
    endtime: "",
    name: "",
    phone: "",
  },
});

const tabsBar = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

const excelDrawerRef = ref(null);

const openexcelDrawer = () => excelDrawerRef.value.open();

const infoModalRef = ref(null);

const orderInfo = ref({});

const openInfoModalDrawer = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const k in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[k].value);
      }
      o.sku = s.join(",");
    }
    return o;
  });

  orderInfo.value = row;
  infoModalRef.value.open();
};

const handelRefund = (id, agree) => {
  (agree
    ? showModal("是否要同意该订单退款?")
    : showPrompt("请输入拒绝的理由")
  ).then(({ value }) => {
    let data = { agree };
    if (!agree) data.disagree_reason = value;
    // 拒绝退款
    refund(id, data).then(() => {
      toast("操作成功");
      getData();
    });
  });
};
</script>
