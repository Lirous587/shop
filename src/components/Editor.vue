<template>
  <el-card>
    <template #header>
      <el-button type="primary" @click="ChooseImageRef.open()"
        >插入图片</el-button
      >
    </template>
    <MdEditor
      v-model="content"
      editorId="editorId-edit"
      :showToolbarName="true"
      :toolbarsExclude="toolbarsExclude"
      noUploadImg
      ref="editorRef"
    >
    </MdEditor>
  </el-card>
  <div class="w-[0] h-[0] overflow-hidden">
    <ChooseImage
      @update:modelValue="handelChooseImg"
      :preview="true"
      ref="ChooseImageRef"
      :limit="1"
    />
  </div>
</template>
<script setup>
import ChooseImage from "~/components/ChooseImage.vue";
import { ref } from "vue";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const content = defineModel("content", {
  type: String,
  required: true,
});

const ChooseImageRef = ref(null);

const toolbarsExclude = ["save", "preview", "htmlPreview", "github"];

const editorRef = ref(null);

const handelChooseImg = (url) => {
  const insertValue = `\n![图片信息](${url})\n`;
  editorRef.value.insert(() => {
    return {
      targetValue: insertValue,
      select: false,
      deviationStart: 0,
      deviationEnd: 0,
    };
  });
};
</script>
