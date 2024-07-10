<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">

        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="desc" label="角色描述" />

            <el-table-column label="状态">
                <template #default="{ row }">
                    <el-switch v-loading="row.statusLoading" :modelValue="row.status" :active-value="1"
                        :inactive-value="0" :disabled="row.super == 1" @change="handelStatusChange($event, row)">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" text @click="openSetRole(scope.row)">配置权限</el-button>
                    <el-button type="primary" size="small" text @click="handelEdit(scope.row)">修改</el-button>
                    <span @click.stop="() => { }">
                        <el-popconfirm title="是否要删除该角色?" confirm-button-text="确定" cancel-button-text="取消"
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>


        <!-- 权限配置 -->
        <FormDrawer ref="setRoleformDrawerRef" :closeAble="true" title="权限配置" @submit="handelSetRoleSubmit">
            <!-- node-key是节点标识=> id  default-expanded-keys是节点标识数组 => 用来指定 哪些节点被展开  -->
            <el-tree-v2 v-loading="treeLoading" ref="elTreeRef" node-key="id"
                :default-expanded-keys="defaultExpandedKeys" :data="ruleList"
                :props="{ label: 'name', children: 'child' }" show-checkbox :height="treeHeight" @check="handelCheck"
                :checkStrictly>
                <template #default="{ node, data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
                            {{ data.menu ? "菜单" : " 权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm"> {{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus
} from "~/api/role";
import {
    getRuleList
} from "~/api/rule.js"

import FormDrawer from "~/components/FormDrawer.vue"
import ListHeader from "~/components/ListHeader.vue";
import { toast } from "~/composables/util.js"
import {
    useInitTable,
    useInitForm
} from "~/composables/useCommon.js"
import { setRoleRules } from "~/api/role";

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
    getList: getRoleList,
    delete: deleteRole,
    updateStatus: updateRoleStatus,
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
        desc: "",
        status: 1,
    }),
    getData,
    create: createRole,
    update: updateRole,
    rules: {
        name: [{
            required: true,
            message: "角色名称不能为空",
            tirgger: "blur"
        }],
    }
})

const setRoleformDrawerRef = ref(null)
const elTreeRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
// 获取当前角色拥有的权限id
const ruleIds = ref([])
const treeLoading = ref(true)
const checkStrictly = ref(false)

const openSetRole = (row) => {
    ruleIds.value = []
    treeLoading.value = true
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 190
    checkStrictly.value = true
    getRuleList(1).then((res) => {
        defaultExpandedKeys.value = res.list.map(o => o.id)
        ruleList.value = res.list
        setRoleformDrawerRef.value.open()

        // 获取当前角色拥有的权限id
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            checkStrictly.value = false
            treeLoading.value = false
        }, 500);
    })
}

const handelSetRoleSubmit = () => {
    setRoleformDrawerRef.value.showLoading()
    setRoleRules(roleId.value, ruleIds.value)
        .then((res) => {
            toast("配置成功")
            getData()
            setRoleformDrawerRef.value.close()
        })
        .finally(() => {
            setRoleformDrawerRef.value.hideLoading()
        })
}

const handelCheck = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script>