<template>
  <formDrawer
    @submit="submit"
    ref="formDrawerRef"
    title="设置商品规格"
    destroy-on-close
    size="70%"
  >
    <el-form :model="form" label-width="80px" :inline="false" size="normal">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio label="单规格" :value="0"> 单规格 </el-radio>
          <el-radio label="多规格" :value="1"> 多规格 </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type === 0">
        <el-form-item style="width: 60%" label="市场价格">
          <el-input v-model="form.sku_value.oprice" size="normal" clearable>
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 60%" label="销售价格">
          <el-input v-model="form.sku_value.pprice" size="normal" clearable>
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 60%" label="成本价格">
          <el-input v-model="form.sku_value.cprice" size="normal" clearable>
            <template #append> 元 </template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 60%" label="商品重量">
          <el-input v-model="form.sku_value.weight" size="normal" clearable>
            <template #append> 公斤 </template>
          </el-input>
        </el-form-item>
        <el-form-item style="width: 60%" label="商品体积">
          <el-input v-model="form.sku_value.volume" size="normal" clearable>
            <template #append> 立方米 </template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <SkuCard></SkuCard>
      </template>
    </el-form>
  </formDrawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import formDrawer from "~/components/formDrawer.vue";
import SkuCard from "./components/SkuCard.vue";
import { toast } from "~/composables/util.js";
import { readGoods, setGoodsSku } from "~/api/goods";

const formDrawerRef = ref(null);

const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});

import { goodsId, initSkuCardList } from "~/composables/useSku.js";

let rowDeepCopy = {};

const open = (row) => {
  rowDeepCopy = row;
  goodsId.value = row.id;
  row.skusLoading = true;
  readGoods(goodsId.value)
    .then((res) => {
      if (res.sku_value) {
        form.sku_value = res.sku_value;
      }
      formDrawerRef.value.open();
      initSkuCardList(res);
    })
    .finally(() => {
      row.skusLoading = false;
    });
};

const submit = () => {
  formDrawerRef.value.showLoading();
  setGoodsSku(goodsId.value, form.sku_type, form.sku_value)
    .then(() => {
      toast("设置商品规格成功");
      formDrawerRef.value.close();
      rowDeepCopy.sku_value = form.sku_value;
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};

defineExpose({
  open,
});
</script>
