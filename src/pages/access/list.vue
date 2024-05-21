<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-tree v-loading="loading" :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ data }">
                <div class="flex flex-1">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
                    </div>
                    <div class="flex items-center ml-3">
                        <el-icon v-if="data.icon" :size="16">
                            <component class="my-auto" :is="data.icon"></component>
                        </el-icon>
                    </div>

                    <div class="flex items-center ml-2">
                        <span> {{ data.name }}</span>
                    </div>

                    <div class="ml-auto space-x-3">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0" @change="">
                        </el-switch>
                        <el-button type="primary" text size="small" @click.stop="handelEdit(data)">修改</el-button>
                        <el-button type="primary" text size="small" @click="">增加</el-button>
                        <el-button type="primary" text size="small" @click="">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>

    <FormDrawer ref="formDrawerRef" :closeAble="true" :title="drawerTitle" @submit="handelSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" :inline="false" label-width="80px">
            <el-form-item label="上级菜单" prop="rule_id">
                <el-cascader v-model="form.rule_id" :options="options"
                    :props="{ label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
                    @change="handleChange" />
                    {{ form.rule_id }}
            </el-form-item>
            <el-form-item label="菜单规则" prop="menu">
                <el-input v-model="form.menu" placeholder="菜单规则"></el-input>
            </el-form-item>
            <el-form-item label="菜单/权限名称" prop="name">
                <el-input v-model="form.name" placeholder="菜单/权限名称"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="form.icon" placeholder="菜单图标"></el-input>
            </el-form-item>
            <el-form-item label="前端路由" prop="frontpath">
                <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
            </el-form-item>
            <el-form-item label="后端规则" prop="condition">
                <el-input v-model="form.condition" placeholder="后端规则"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="method">
                <el-input v-model="form.method" placeholder="请求方式"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" />
            </el-form-item>

        </el-form>
    </FormDrawer>

</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue"
import {
    getRuleList,
    createRule,
    updateRule
} from "~/api/rule.js";
import {
    useInitTable,
    useInitForm
} from "~/composables/useCommon.js"
import { ref, reactive } from "vue"

const options = ref([])
const defaultExpandedKeys = ref([])

// table
const {
    tableData,
    loading,
    getData,
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
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
    handelEdit
} = useInitForm({
    form: reactive({
        rule_id: 0,
        menu: 0,
        name: "",
        condition: "",
        method: "",
        status: 1,
        order: 0,
        icon: "",
        frontpath: ""
    }),
    getData,
    create: createRule,
    update: updateRule,
    rules: {}
})


</script>

<style scoped>
    :deep(.el-tree-node__content) {
        @apply my-2;
    }
</style>