<template>
  <el-col :span="8" :offset="0">
    <el-form-item :label="label">
      <slot />
    </el-form-item>
  </el-col>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  label: String,
});
</script>
