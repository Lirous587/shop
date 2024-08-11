<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <el-table
      :data="tableData"
      default-expand-all
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column width="80px" type="expand">
        <template #default="{ row }">
          <div class="pl-20">
            <div class="flex">
              <div>
                <el-avatar
                  :size="50"
                  shape="circle"
                  :src="row.user?.avatar"
                  fit="fill"
                ></el-avatar>
              </div>

              <div class="ml-3 flex-1">
                <h5>
                  <p class="mb-1">
                    {{ row.user.nickname || row.user.username }}
                    <small class="ml-2"> {{ row.review_time }}</small>
                  </p>
                  {{ row.review.data }}
                </h5>

                <div
                  class="flex mt-1"
                  v-for="(item, index) in row.review.image"
                  :key="index"
                >
                  <el-image
                    :src="item"
                    fit="contain"
                    style="width: 90px; height: 90px"
                    :lazy="true"
                  >
                  </el-image>
                </div>

                <!-- 评论区 -->
                <div
                  v-for="(item, index) in row.extra"
                  :key="index"
                  class="mt-4 p-3 bg-gray-100 flex flex-col rounded"
                >
                  <!-- 回复  -->
                  <div v-if="!row.isEdit">
                    <div class="font-bold flex mb-1">
                      客服
                      <el-button
                        class="ml-auto"
                        type="info"
                        size="small"
                        @click="openEdit(row, item.data)"
                      >
                        {{ item.data ? "修改" : "回复" }}
                      </el-button>
                    </div>
                    <p>{{ item.data }}</p>
                  </div>

                  <!-- 修改评论 -->
                  <div v-else>
                    <div class="font-bold flex mb-1"></div>
                    <el-input
                      v-model="reviewTextarea"
                      type="textarea"
                      size="normal"
                      clearable
                    ></el-input>
                    <div class="mt-2">
                      <el-button
                        type="primary"
                        size="small"
                        @click="handelReviewComment(row)"
                      >
                        回复
                      </el-button>
                      <el-button
                        type="plain"
                        size="small"
                        @click="row.isEdit = false"
                      >
                        取消
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="goods_id" label="ID" width="80px" />

      <el-table-column prop="discount" label="商品" width="200px">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              class="mr-3"
              :src="row.goods_item?.cover"
              fit="contain"
              :lazy="false"
              loading="eager"
              style="width: 60px; height: 60px"
            ></el-image>
            <h5>{{ row.goods_item?.title }}</h5>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="level" label="评价信息">
        <template #default="{ row }">
          <p>用户: {{ row.user?.nickname }}</p>
          <p>
            <el-rate v-model="row.rating" disabled show-score allow-half />
          </p>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column prop="review_time" label="评价时间" />

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
</template>

<script setup>
import {
  getCommentList,
  updateCommentStatus,
  reviewComment,
} from "~/api/comment";
import { toast } from "~/composables/util.js";
import { useInitTable } from "~/composables/useCommon.js";
import { ref } from "vue";

// table
const { tableData, loading, currentPage, total, getData, handelStatusChange } =
  useInitTable({
    getList: getCommentList,
    updateStatus: updateCommentStatus,
    onGetListSuccess: (res) => {
      total.value = res.totalCount;
      tableData.value = res.list.map((o) => {
        return {
          ...o,
          isEdit: false,
        };
      });
    },
  });

const reviewTextarea = ref("");

const openEdit = (row, data = "") => {
  row.isEdit = true;
  reviewTextarea.value = data;
};

const handelReviewComment = (row) => {
  if (reviewTextarea.value === "") {
    toast("回复内容不能为空", "error");
    return;
  }

  loading.value = true;

  reviewComment(row.id, { data: reviewTextarea.value })
    .then(() => {
      toast("回复成功");
      getData();
    })
    .finally(() => {
      row.isEdit = false;
      loading.value = false;
    });
};
</script>
