<template>
  <el-upload
    class="upload-demo"
    drag
    :action="uploadImageAction"
    :headers="{
      token,
    }"
    name="img"
    :data="data"
    multiple
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖动文件到这里或者<em>点击这里</em></div>
    <template #tip>
      <div class="el-upload__tip">上传文件要小于500kb</div>
    </template>
  </el-upload>
</template>

<script setup>
import { uploadImageAction } from "~/api/image.js";
import { toast } from "~/composables/util.js";
import { getToken } from "~/composables/auth.js";
const token = getToken();

defineProps({
  data: Object,
});

const emit = defineEmits(["success"]);

const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit("success", {
    response,
    uploadFile,
    uploadFiles,
  });
};

const uploadError = (error, uploadFile, uploadFiles) => {
  let message = JSON.parse(error.message).msg || "上传失败";
  toast(message, "error");
  console.log(uploadFile);
};
</script>
