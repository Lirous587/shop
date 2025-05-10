<template>
  <FormDrawer
    @submit="submit"
    ref="formDrawerRef"
    title="修改商品内容"
    destroy-on-close
    size="70%"
  >
    <Editor v-model:content="form.content"></Editor>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive, defineAsyncComponent } from "vue";
const Editor = defineAsyncComponent(() => import("~/components/Editor.vue"));
import FormDrawer from "~/components/FormDrawer.vue";
import { toast } from "~/composables/util.js";

import { readGoods, updateGoods } from "~/api/goods";

const formDrawerRef = ref(null);

const form = reactive({
  content: "",
});

const goodsId = ref(0);

const open = (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;
      formDrawerRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};

const submit = () => {
  formDrawerRef.value.showLoading();
  updateGoods(goodsId.value, form)
    .then(() => {
      toast("设置商品内容成功");
      formDrawerRef.value.close();
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};

defineExpose({
  open,
});
</script>
