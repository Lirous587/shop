<template>
    <div class="flex items-center  justify-between mb-4">
        <el-button type="primary" size="default" @click="$emit('create')">新增</el-button>

        <el-tooltip class="box-item" effect="dark" content="Top Right prompts info" placement="top-end">
            <el-button text @click="emit('refresh')">
                <el-icon :size="20">
                    <Refresh />
                </el-icon>
            </el-button>
        </el-tooltip>
    </div>
</template>

<script setup>
const emit = defineEmits(['create', 'refresh'])
</script>

<style scoped></style>