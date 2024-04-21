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
            <el-table-column label="管理员">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar" @error="errorHandler">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6> {{ row.username }}</h6>
                            <small>ID :{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="所属管理员" width="380">
                <template #default="{ row }">
                    <!-- {{ row.role ? row.role.name : ""}} -->
                    {{ row.role?.name || "-" }}
                </template>
            </el-table-column>

            <el-table-column label="状态">
                <template #default="{ row }">
                    <div>
                        <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0">
                                
                        </el-switch>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="150" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handelEdit(scope.row)">修改</el-button>
                    <span @click.stop="() => { }">
                        <el-popconfirm title="是否要删除该管理员?" confirm-button-text="确定" cancel-button-text="取消"
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
import { getManagerList } from "~/api/manager";


const tableData = ref([])

const loading = ref(false)

//分页
const currentPage = ref(1)
const total = ref(0)

function getData(p = null) {
    if (typeof p == Number) {
        currentPage.value = p
    }
    loading.value = true
    getManagerList(currentPage.value, {
        limit: 10,
        keyWord: "ceshi"
    })
        .then(res => {
            tableData.value = res.list
            total.value = res.totalCount
        })
        .finally(() => {
            loading.value = false
        })
}

getData()


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