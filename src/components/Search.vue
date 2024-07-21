<template>
  <el-form class="mb-3">
    <el-row :gutter="20">
      <!-- 默认 -->

      <slot />

      <!-- 高级搜索 -->
      <template v-if="catagerySearchForm">
        <slot name="show" />
      </template>

      <el-col :span="8" :offset="catagerySearchForm ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button type="primary" size="default" @click="$emit('search')"
            >搜索</el-button
          >
          <el-button size="default" @click="$emit('reset')">重置</el-button>
          <el-button
            v-if="hasShow"
            type="primary"
            size="default"
            text
            @click="catagerySearchForm = !catagerySearchForm"
          >
            {{ catagerySearchForm ? "收起" : "展开" }}
            <el-icon v-if="catagerySearchForm">
              <ArrowUp />
            </el-icon>
            <el-icon v-else>
              <ArrowDown />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, useSlots } from "vue";

const catagerySearchForm = ref(false);

defineEmits(["search", "reset"]);
const slots = useSlots();
const hasShow = ref(!!slots.show);
</script>
