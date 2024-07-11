<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">

        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="优惠卷名称" width="400">
                <template #default="{ row }">
                    <div class="border-dashed  border px-2 py-4"
                        :class="row.statusText === '领取中' ? 'active' : 'inactive'">
                        <h5 class="font-bold text-md"> {{ row.name }}</h5>
                        <small> {{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="状态" />
            <el-table-column label="优惠" width="150">
                <template #default="{ row }">
                    {{ row.type ? "折扣" : "满减" }}
                    {{ row.type ? (row.value + "折") : ("￥" + row.value) }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="发放数量" />
            <el-table-column prop="used" label="已使用" />
            <el-table-column label="操作" width="150" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.statusText === '未开始'" type="primary" size="small" text
                        @click="handelEdit(scope.row)">
                        修改
                    </el-button>

                    <span @click.stop="() => { }">
                        <el-popconfirm v-if="scope.row.statusText !== '领取中'" title="是否要删除该优惠券?" confirm-button-text="删除"
                            cancel-button-text="取消" @confirm="handelDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="default" size="small" text>删除</el-button>
                            </template>
                        </el-popconfirm>

                        <el-popconfirm v-if="scope.row.statusText === '领取中'" title="是否让该优惠券失效？" confirm-button-text="失效"
                            cancel-button-text="取消" @confirm="handelStatus(0, scope.row)">
                            <template #reference>
                                <el-button type="danger" size="small" danger>失效</el-button>
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
            <el-form :model="form" ref="formRef" :rules="rules" label-position="right" label-width="auto">
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="form.name" placeholder="优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0" :value="0">满减</el-radio>
                        <el-radio :label="1" :value="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" placeholder="面值">
                        <template #append>
                            {{ form.type ? "折" : "元" }}
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="1" :max="9999" />
                </el-form-item>
                <el-form-item label="最低使用" prop="min_price">
                    <el-input-number v-model="form.min_price" :min="0" />
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="50" :max="1000" />
                </el-form-item>

                <el-form-item label="活动时间" prop="order">
                    <el-date-picker v-model="timeRange" type="datetimerange" range-separator="到"
                        start-placeholder="开始时间" format="YYYY-MM-DD HH:mm:ss" />
                </el-form-item>

                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="描述" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { computed, reactive } from "vue";
import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateCouponStatus
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
    handelDelete,
    handelStatusChange
} = useInitTable({
    getList: getCouponList,
    delete: deleteCoupon,
    updateStatus: updateCouponStatus,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusText = formatStatus(o)
            return o
        })
        total.value = res.totalCount
    }
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
        name: "",
        type: 0,
        value: 5,
        total: 100,
        min_price: 1,
        start_time: null,
        end_time: null,
        order: 50,
        desc: ""
    }),
    getData,
    create: createCoupon,
    update: updateCoupon,
    beforSumbit: (f) => {
        if (f.start_time && typeof f.start_time != "number") {
            f.start_time = (new Date(f.start_time).getTime())
        }
        if (f.end_time && typeof f.end_time != "number") {
            f.end_time = (new Date(f.end_time).getTime())
        }
        console.log(f)
        return f
    }
})

const formatStatus = (row) => {
    let text = "领取中"
    let now_time = (new Date()).getTime()
    let start_time = (new Date(row.start_time)).getTime()
    let end_time = (new Date(row.end_time)).getTime()

    if (end_time < now_time) {
        text = "已结束"
    } else if (start_time > now_time) {
        text = "未开始"
    } else if (row.status === 0) {
        text = "已失效"
    }
    return text
}

const timeRange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(value) {
        form.start_time = value[0]
        form.end_time = value[1]
    }
})

const handelStatus = async(status, row) => {
    let callback = await handelStatusChange(status, row)
    if (callback === 0) {
        getData()
    }
}

</script>

<style scoped>
    .active {
        @apply border-rose-300 text-rose-500 bg-rose-200;
    }

    .inactive {
        @apply border-gray-300 text-gray-400 bg-gray-100;
    }
</style>