<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">

        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="优惠卷名称" width="350">
                <template #default="{ row }">
                    <div class="border-dashed  border-2 px-2 py-4">
                        <h5 class="font-bold text-md"> {{ row.name }}</h5>
                        <small> {{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="状态" />
            <el-table-column label="优惠">
                <template #default="{ row }">
                    {{ row.type ? "优惠" : "满减" }}
                    {{ row.type ? (row.value + "折") : ("￥" + row.value) }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />
            <el-table-column label="操作" width="150" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handelEdit(scope.row)">修改</el-button>
                    <span @click.stop="() => { }">
                        <el-popconfirm title="是否要删除该公告?" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="handelDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="default" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex justify-center items-center mt-4">
            <el-pagination background layout="prev, pager,next" :current-page="currentPage" @current-change="getData"
                :total="total" />
        </div>

        <FormDrawer ref="formDrawerRef" :closeAble="true" :title="drawerTitle" @submit="handelSubmit">
            <el-form :model="form" ref="formRef" :rules="rules">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { reactive } from "vue";
import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon
} from "~/api/coupon.js";
import FormDrawer from "~/components/FormDrawer.vue"
import ListHeader from "~/components/ListHeader.vue";

import {
    useInitTable,
    useInitForm
} from "~/composables/useCommon.js"

// table
const {
    tableData,
    loading,
    currentPage,
    total,
    getData,
    handelDelete
} = useInitTable({
    getList: getCouponList,
    delete: deleteCoupon
})

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
        title: "",
        content: ""
    }),
    getData,
    create: createCoupon,
    update: updateCoupon,
    rules: {
        title: [{
            required: true,
            message: "公告标题不能为空",
            tirgger: "blur"
        }],
        content: [{
            required: true,
            message: "公告内容不能为空",
            tirgger: "blur"
        }]
    }
})
</script>