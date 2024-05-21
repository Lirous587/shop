<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>

        <el-tree v-loading="loading" :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpandedKeys">
            <template #default="{ node, data }">
                <div class="flex flex-1">
                    <div class="flex items-center">
                        <el-tag  :type="data.menu ? '' : 'info'">{{ data.menu ? "菜单" : "权限" }}</el-tag>
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
                        <el-button type="primary" text size="small" @click="">修改</el-button>
                        <el-button type="primary" text size="small" @click="">增加</el-button>
                        <el-button type="primary" text size="small" @click="">删除</el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>
</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue";
import {
    getRuleList
} from "~/api/rule.js";

import {
    useInitTable
} from "~/composables/useCommon.js"
import { ref } from "vue";

const defaultExpandedKeys = ref([])

const {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    getData,
    handelDelete,
    handelStatusChange
} = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
    }
})

</script>

<style scoped>
    :deep(.el-tree-node__content) {
        @apply my-2;
    }
</style>