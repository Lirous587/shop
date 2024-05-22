<template>
    <div class="flex items-center" style="width: 80%;">
        <div class="flex items-center">
            <el-icon :size="16">
                <component :is="modelValue"></component>
            </el-icon>
        </div>
        <div style="width: 80%;">
            <el-select :modelValue="modelValue" class="ml-2" filterable placeholder="请选择图标" @change="hanlerChange">
                <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                    <div class="flex items-center justify-between">
                        <el-icon :size="16">
                            <component :is="item"></component>
                        </el-icon>
                        <span class="text-gray-500"> {{ item }}</span>
                    </div>
                </el-option>
            </el-select>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import * as IconList from '@element-plus/icons-vue' //这个是全局引入elment plus图标

defineProps({
    modelValue: String,
})

const icons = ref(Object.keys(IconList))
const emit = defineEmits(["update:modelValue"])

const hanlerChange = (icon) => {
    emit("update:modelValue", icon)
}
</script>