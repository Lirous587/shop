<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="default"
        @click="$emit('create')"
        >新增</el-button
      >

      <el-popconfirm
        title="是否要批量删除?"
        confirm-button-text="确定"
        cancel-button-text="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button
            v-if="btns.includes('delete')"
            type="warning"
            size="default"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
    </div>

    <el-tooltip
      class="box-item"
      effect="dark"
      content="Top Right prompts info"
      placement="top-end"
    >
      <el-button v-if="btns.includes('refresh')" text @click="emit('refresh')">
        <el-icon :size="20">
          <Refresh />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";

const emit = defineEmits(["create", "refresh", "delete"]);

const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});
const btns = computed(() => props.layout.split(","));
</script>

<style scoped></style>
