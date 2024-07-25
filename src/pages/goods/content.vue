<template>
  <formDrawer
    @submit="submit"
    ref="formDrawerRef"
    title="修改商品内容"
    destroy-on-close
  >
    <Editor v-model="form.content"></Editor>
  </formDrawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import Editor from "~/components/Editor.vue";
import formDrawer from "~/components/formDrawer.vue";
import { toast } from "~/composables/util.js";

import { readGoods, updateGoods } from "~/api/goods";

const formDrawerRef = ref(null);

const form = reactive({
  content: [],
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
      emits("reload");
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};

defineExpose({
  open,
});
</script>
