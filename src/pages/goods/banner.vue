<template>
  <el-drawer
    title="设置轮播图"
    v-model="dialoVisable"
    :destroy-on-close="true"
    size="50%"
  >
    <el-form :model="form" :inline="false" size="normal" label-width="80px">
      <el-form-item label="轮播图">
        <ChooseImage v-model="form.banners"></ChooseImage>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import ChooseImage from "~/components/ChooseImage.vue";
import { readGoods, setGoodsBanner } from "~/api/goods.js";
const dialoVisable = ref(false);
const form = reactive({
  banners: [],
});

const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  dialoVisable.value = true;
  readGoods(goodsId.value).then((res) => {
    form.banners = res.goodsBanner.map((o) => o.url);
  });
};

const submit = () => {};

defineExpose({
  open,
});
</script>
