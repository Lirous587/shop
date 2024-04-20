<template>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <!-- 新增 | 刷新 -->
        <div class="flex items-center  justify-between mb-4">
            <el-button type="primary" size="default" @click="">新增</el-button>

            <el-tooltip class="box-item" effect="dark" content="Top Right prompts info" placement="top-end">
                <el-button text>
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
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





</template>

<script setup>
import { ref } from "vue";
const tableData = ref([])

function getData() {
    tableData.value = [{
        "id": 13,
        "title": "nip",
        "content": "nip\n",
        "order": 0,
        "create_time": "2022-06-06 14:40:11",
        "update_time": "2022-06-06 14:40:11"
    }]
}

getData()

const handelDelete = (id) => {
    console.log(id)
}
</script>