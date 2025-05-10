<template>
  <div>
    <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate"
          >新增图片分类</el-button
        >
        <el-button type="warning" size="small" @click="handleOpenUpload"
          >上传图片</el-button
        >
      </el-header>
      <el-container>
        <ImageAside
          ref="ImageAsideRef"
          @change="handelAsideChange"
        ></ImageAside>
        <ImageMain ref="ImageMainRef"></ImageMain>
      </el-container>
    </el-container>
  </div>
</template>

<style scope>
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>

<script setup>
import { ref } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);
const handleOpenCreate = () => ImageAsideRef.value.handleCreate();
const handleOpenUpload = () => ImageMainRef.value.openUploadFile();

const handelAsideChange = (imageClassID) => {
  ImageMainRef.value.loadData(imageClassID);
};
</script>
