<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="规格名称" />
            <el-table-column prop="default" label="规格值" />
            <el-table-column prop="order" label="排序" />

            <el-table-column label="状态">
                <template #default="{ row }">
                    <el-switch v-loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                        :inactive-value="0" :disabled="row.super == 1" @change="handelStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="handelEdit(scope.row)">修改</el-button>
                    <span @click.stop="() => { }">
                        <el-popconfirm title="是否要删除该规格?" confirm-button-text="确定" cancel-button-text="取消"
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

        <FormDrawer ref="formDrawerRef" destroyOnClose :closeAble="true" :title="drawerTitle" @submit="handelSubmit">
            <el-form :model="form" ref="formRef" :rules="rules">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="规格名称"></el-input>
                </el-form-item>

                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order"></el-input-number>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <div class="flex flex-col justify-center">
                        {{ form.default }}
                        <TagInput v-model="form.default" @update="(value) => form.default = value"></TagInput>
                    </div>

                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
    getSkusList,
    createSkus,
    updateSkus,
    deleteSkus,
    updateSkusStatus
} from "~/api/skus";
import TagInput from "~/components/TagInput.vue"

import FormDrawer from "~/components/FormDrawer.vue"
import ListHeader from "~/components/ListHeader.vue";
import { toast } from "~/composables/util.js"
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
    getList: getSkusList,
    delete: deleteSkus,
    updateStatus: updateSkusStatus,
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
        order: 52,
        status: 1,
        default: [],
    }),
    getData,
    create: createSkus,
    update: updateSkus,
    rules: {
        name: [{
            required: true,
            message: "角色名称不能为空",
            tirgger: "blur"
        }],
    }
})

const setSkusformDrawerRef = ref(null)
const elTreeRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
// 获取当前角色拥有的权限id
const ruleIds = ref([])
const treeLoading = ref(true)
const checkStrictly = ref(false)


const handelSetSkusSubmit = () => {
    setSkusformDrawerRef.value.showLoading()
    setSkusRules(roleId.value, ruleIds.value)
        .then((res) => {
            toast("配置成功")
            getData()
            setSkusformDrawerRef.value.close()
        })
        .finally(() => {
            setSkusformDrawerRef.value.hideLoading()
        })
}

const handelCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script>