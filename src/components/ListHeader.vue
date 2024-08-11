<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="small"
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
          <el-button v-if="btns.includes('delete')" type="danger" size="small"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
      <slot />
    </div>

    <el-tooltip
      class="box-item"
      effect="dark"
      content="Top Right prompts info"
      placement="top-end"
    >
      <div>
        <el-button
          v-if="btns.includes('refresh')"
          text
          @click="emit('refresh')"
          size="small"
        >
          <el-icon :size="15">
            <Refresh />
          </el-icon>
        </el-button>

        <el-button
          v-if="btns.includes('download')"
          text
          @click="emit('download')"
          size="small"
        >
          <el-icon :size="15">
            <Download />
          </el-icon>
        </el-button>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup>
import { Download } from "@element-plus/icons-vue";
import { computed } from "vue";

const emit = defineEmits(["create", "refresh", "delete", "download"]);

const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});
const btns = computed(() => props.layout.split(","));
</script>

<style scoped></style>
