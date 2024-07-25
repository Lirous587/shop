<template>
  <div v-if="modelValue && preview">
    <el-avatar
      v-if="typeof modelValue == 'string'"
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    >
    </el-avatar>

    <div v-else class="flex flex-wrap">
      <div
        class="relative w-[100px] h-[100px] rounded border mr-2"
        v-for="(url, index) in modelValue"
        :key="index"
      >
        <el-icon
          @click="removeImage(url)"
          :size="18"
          class="absolute z-10 top-[5px] right-[5px] cursor-pointer bg-white rounded-full"
        >
          <CircleClose />
        </el-icon>
        <el-avatar
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        >
        </el-avatar>
      </div>
    </div>
  </div>

  <div v-if="preview" class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500">
      <Plus />
    </el-icon>
  </div>

  <el-dialog title="选择图片" v-model="dialogVisable" width="80%" top="5vh">
    <el-container class="bg-white rounded" style="height: 70vh">
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
        <ImageMain
          :limit="props.limit"
          :openChoose="true"
          ref="ImageMainRef"
          @choose="handleChoose"
        ></ImageMain>
      </el-container>
    </el-container>

    <template #footer>
      <span>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "~/composables/util.js";
import ImageAside from "~/components/imageAside.vue";
import ImageMain from "~/components/imageMain.vue";
const dialogVisable = ref(false);
const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);
const handleOpenCreate = () => ImageAsideRef.value.handleCreate();
const handleOpenUpload = () => ImageMainRef.value.openUploadFile();
const handelAsideChange = (imageClassID) => {
  ImageMainRef.value.loadData(imageClassID);
};

const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const callbackFuction = ref(null);
const open = (callback) => {
  callbackFuction.value = callback;
  dialogVisable.value = true;
};
const close = (callFunc) => (dialogVisable.value = false);

const submit = () => {
  let value = null;
  if (props.limit == 1) {
    value = urls[0];
  } else {
    value = props.preview ? [...props.modelValue, ...urls] : [...urls];
    if (value.length > props.limit) {
      let leftNumber = props.preview
        ? props.limit - props.modelValue.length
        : props.limit;
      toast(`最多还能选择${leftNumber}张图片`, "warning");
      return;
    }
  }
  if (value && props.preview) {
    emit("update:modelValue", value);
  }
  if (!props.preview && typeof callbackFuction.value === "function") {
    callbackFuction.value(value);
  }
  close();
};

const cancel = () => {
  dialogVisable.value = false;
};

let urls = [];
const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};

const removeImage = (url) =>
  emit(
    "update:modelValue",
    props.modelValue.filter((o) => o != url)
  );

defineExpose({
  open,
});
</script>

<style scoped>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}

.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>
