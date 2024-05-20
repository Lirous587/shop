<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <div class="flex items-center  justify-between mb-4">
            <el-button type="primary" size="default" @click="handelCreate">新增</el-button>

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
            <el-table-column prop="content" label="发布内容" show-overflow-tooltip />
            <el-table-column prop="create_time" label="发布时间" />
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
    getNoticeList,
    createNotice,
    updateNotice,
    deleteNotice
} from "~/api/notice";
import FormDrawer from "~/components/FormDrawer.vue"

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
    getList: getNoticeList,
    delete: deleteNotice
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
    create: createNotice,
    update: updateNotice,
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