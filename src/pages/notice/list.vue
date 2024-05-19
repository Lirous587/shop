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
            <el-table-column prop="create_time" label="发布时间" width="380" />
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
import { ref, reactive, computed } from "vue";
import {
    getNoticeList,
    createNotice,
    updateNotice,
    deleteNotice
} from "~/api/notice";
import { toast } from "~/composables/util.js"
import FormDrawer from "~/components/FormDrawer.vue"

import {
    useInitTable
} from "~/composables/useCommon.js"

const roles = ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData
} = useInitTable({
    getList: getNoticeList,
})



// 表单部分
const formDrawerRef = ref(false)
const formRef = ref(null)
const form = reactive({
    title: "",
    content: ""
})

// 表单验证
const rules = {
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

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")


const handelSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form)

        formDrawerRef.value.showLoading()

        fun.then(res => {
            toast(drawerTitle.value + "成功")
            getData(editId ? null : 1)
        })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}
// 重置表单
function resetForm(row) {
    if (formRef.value) {
        formRef.value.clearValidate()
    }
    if (row) {
        for (const key in row) {
            form[key] = row[key]
        }
    }
}

// 新增
const handelCreate = () => {
    editId.value = 0
    resetForm({
        title: "",
        content: ""
    })
    formDrawerRef.value.open()
}
// 更新
const handelEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}
// 删除
const handelDelete = (id) => {
    loading.value = true
    deleteNotice(id)
        .then(() => {
            toast("删除成功")
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}
</script>