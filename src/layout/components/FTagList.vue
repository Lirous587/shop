<template>
  <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="demo-tabs"
      style="min-width: 100px"
      @tab-change="changeTab"
      @tab-remove="removeTag"
    >
      <el-tab-pane
        :closable="item.path != '/'"
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 44px"></div>
</template>

<script setup>
import { useTabList } from "~/composables/useTabList.js";

const { activeTab, tabList, removeTag, handleClose, changeTab } = useTabList();
</script>

<style scoped>
.f-tag-list {
  @apply fixed bg-gray-100 flex items-center px-2;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}

.tag-btn {
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
  height: 32px;
}

:deep(.el-tabs__header) {
  @apply mb-0 flex items-center border-0;
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  @apply bg-white mx-1 rounded;
  height: 32px;
  line-height: 40px;
  border: 0 !important;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 32px;
  height: 32px;
}

:deep(.is-disabled) {
  @apply text-light-50;
  cursor: not-allowed;
}
</style>
