<template>
    <li v-for="n in evenNumbers">{{ n }}</li>
    <el-button type="primary" size="small" class="mt-4" @click="changeArrHandel">修改</el-button>
</template>

<script setup>
import { ref } from "vue"
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
</script>
