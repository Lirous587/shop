<template>
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="closeAble"
    :destroy-on-close="destroyOnClose"
    :append-to-body="true"
  >
    <div class="formDrawer">
      <div class="body">
        <slot> </slot>
      </div>
      <div class="actions">
        <el-button type="primary" :loading="loading" @click="submit">
          {{ confirmText }}</el-button
        >
        <el-button type="default" @click="close">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
const showDrawer = ref(false);
const props = defineProps({
  title: {
    type: String,
    default: "新增",
  },
  size: {
    type: String,
    default: "50%",
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: "提交",
  },
  closeAble: {
    type: Boolean,
    default: false,
  },
});
//加载状态
const loading = ref(false);
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);

//打开
const open = () => (showDrawer.value = true);

//关闭
const close = () => (showDrawer.value = false);

//提交
const emit = defineEmits(["submit"]);
const submit = () => emit("submit");

//向父组件暴露以下方式
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>

<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}

.formDrawer .body {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}

.formDrawer .actions {
  height: 50px;
  @apply mt-auto flex items-center;
}
</style>
