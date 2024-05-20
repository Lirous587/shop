<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <el-form :model="searchForm" label-width="80px" class="mb-3">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0">
                    <el-form-item label="">
                        <el-input placeholder="管理员名称" v-model="searchForm.keyword" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="8">
                    <div class="flex items-center justify-end">
                        <el-form-item size="small">
                            <el-button type="primary" @click="getData">搜索</el-button>
                            <el-button @click="resetSearchForm">重置</el-button>
                        </el-form-item>
                    </div>

                </el-col>
            </el-row>
        </el-form>

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
                        <el-avatar :size="40" :src="row.avatar">
                        </el-avatar>
                        <div class="ml-3">
                            <h6> {{ row.username }}</h6>
                            <small>ID :{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="所属角色" width="380">
                <template #default="{ row }">
                    <!-- {{ row.role ? row.role.name : ""}} -->
                    {{ row.role?.name || "-" }}
                </template>
            </el-table-column>

            <el-table-column label="状态">
                <template #default="{ row }">
                    <div>
                        <el-switch v-loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                            :inactive-value="0" :disabled="row.super == 1" @change="handelStatusChange($event, row)">
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
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="用户名"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="密码"></el-input>
                </el-form-item>

                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>

                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0" @change="">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>

</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { toast } from "~/composables/util.js"
import FormDrawer from "~/components/FormDrawer.vue"
import ChooseImage from "~/components/ChooseImage.vue"
import {
    getManagerList,
    updateManagerStatus,
    createManager,
    updateManager,
    deleteManager
} from "~/api/manager";

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
    getList: getManagerList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        total.value = res.totalCount
        roles.value = res.roles
    },
    searchForm: {
        keyword: ""
    }
})


// 表单部分
const formDrawerRef = ref(false)
const formRef = ref(null)
const form = reactive({
    username: "",
    password: "",
    role_id: "",
    status: 1,
    avatar: ""
})

// 表单验证
const rules = {}

const editId = ref(0)
const drawerTitle = computed(() => editId.value ? "修改" : "新增")



const handelSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return

        const fun = editId.value ? updateManager(editId.value, form) : createManager(form)

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
        username: "",
        password: "",
        role_id: "",
        status: 1,
        avatar: ""
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
    deleteManager(id)
        .then(() => {
            toast("删除成功")
            getData()
        })
        .finally(() => {
            loading.value = false
        })
}

//修改状态
const handelStatusChange = (status, row) => {
    row.statusLoading = true
    updateManagerStatus(row.id, status)
        .then(res => {
            toast("修改状态成功")
            row.status = status
        })
        .finally(() => {
            row.statusLoading = false
        })
}
</script>