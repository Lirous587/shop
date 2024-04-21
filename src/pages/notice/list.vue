<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div class="flex items-center  justify-between mb-4">
            <el-button type="primary" size="default" @click="">新增</el-button>

            <el-tooltip class="box-item" effect="dark" content="Top Right prompts info" placement="top-end">
                <el-button text @click="getData">
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="发布时间" width="380" />
            <el-table-column label="操作" width="150" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="">修改</el-button>
                    <span @click.stop="() => { }">
                        <el-popconfirm title="是否要删除该公告?" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="handelDelete(scope.row.id)">
                            <template #reference>
                                <el-button type="primary" size="small" text @click="">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </span>
                </template>
            </el-table-column>

        </el-table>
    </el-card>


    <div class="flex justify-center items-center mt-4">
        <el-pagination background layout="prev, pager,next" :current-page="currentPage" @current-change="getData"
            :total="total" />
    </div>


</template>

<script setup>
import { ref } from "vue";
import {
    getNoticeList
} from "~/api/notice";


const tableData = ref([])

const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)
const list = ref([])


function getData(p = null) {
    if (typeof p == Number) {
        currentPage.value = p
    }
    loading.value = true
    getNoticeList(currentPage.value)
        .then(res => {
            tableData.value = res.list
            total.value = res.totalCount
        })
        .finally(() => {
            loading.value = false
        })
}

getData()

const handelDelete = (id) => {
    console.log(id)
}
</script>