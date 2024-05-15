<template>
    <div class="aside-list" :class="{ 'active': active }">
        <span class="truncate">
            <slot />
        </span>
        <el-button class="ml-auto px-1" type="primary" text size="small" @click.stop="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>


        <span  @click.stop="()=>{}">
            <el-popconfirm title="是否要删除该分类?" confirm-button-text="确定" cancel-button-text="取消"
                @confirm="$emit('delete')">
                <template #reference>
                    <el-button class="px-1" type="primary" text size="default">
                        <el-icon :size="12">
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
    </div>
</template>

<script setup>
defineProps({
    active: {
        type: Boolean,
        default: false
    }
});

defineEmits(["edit", "delete"])
</script>

<style>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600 justify-center;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>