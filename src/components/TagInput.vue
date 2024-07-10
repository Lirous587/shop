<template>
    <div class="flex gap-2 flex-wrap mt-3">
        <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false" @close="handleClose(tag)">
            {{ tag }}
        </el-tag>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + New Tag
        </el-button>
    </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'

const props = defineProps({
    modelValue: String
})
const emits = defineEmits(["update"])

const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(",") : [])
const inputVisible = ref(false)
const InputRef = ref()

const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    emits("update", dynamicTags.value.join(","))
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        emits("update", dynamicTags.value.join(","))
    }
    inputVisible.value = false
    inputValue.value = ''
}
</script>