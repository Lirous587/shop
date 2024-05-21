<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增 | 刷新 -->
        <ListHeader @create="handelCreate" @refresh="getData"></ListHeader>
        菜单权限

        <el-tree v-loading="loading" :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpandedKeys" />

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

<style scoped></style>