<template>
  <div v-loading="loading">
    <el-card shadow="always">
      <el-form :model="form" label-width="160px" :inline="false">
        <h5 class="bg-gray-100 p-4 rounded mb-4">基础设置</h5>
        <el-form-item label="是否允许注册会员">
          <el-radio-group v-model="form.distribution_open">
            <el-radio class="p-4 border rounded" :value="1">开启</el-radio>
            <el-radio class="p-4 border rounded" :value="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分销海报图">
          <ChooseImage
            :modelValue="form.spread_banners"
            @update:modelValue="handleUpdateBanner"
            :limit="9"
          />
        </el-form-item>

        <h5 class="bg-gray-100 p-4 rounded mb-4">返佣设置</h5>
        <el-form-item label="一级返佣比例">
          <div>
            <el-input
              v-model="form.store_first_rebate"
              type="number"
              style="width: 60%"
            >
              <template #append> % </template>
            </el-input>
            <small class="block"
              >订单交易成功后给上级返佣的比例0 - 100,例:5 =
              反订单金额的5%</small
            >
          </div>
        </el-form-item>
        <el-form-item label="二级返佣比例">
          <div>
            <el-input
              v-model="form.store_second_rebate"
              type="number"
              style="width: 60%"
            >
              <template #append> % </template>
            </el-input>
            <small class="block"
              >订单交易成功后给上级返佣的比例0 - 100,例:5 =
              反订单金额的5%</small
            >
          </div>
        </el-form-item>
        <el-form-item label="自购返佣">
          <div>
            <el-radio-group v-model="form.is_self_brokerage">
              <el-radio label="是" :value="1" class="p-3 rounded border" />
              >
              <el-radio label="否" :value="0" class="p-3 rounded border" />
              >
            </el-radio-group>
            <small class="block"
              >是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；
              关闭：分销员自己购买商品没有返佣）</small
            >
          </div>
        </el-form-item>

        <h5 class="bg-gray-100 p-4 rounded mb-4">结算设置</h5>
        <el-form-item label="结算时间">
          <div>
            <el-input
              v-model="form.settlement_days"
              type="number"
              style="width: 60%"
            >
              <template #preappend> 订单完成后 </template>
              <template #append> 天 </template>
            </el-input>
            <small class="block"
              >预估佣金结算后无法进行回收，请谨慎设置结算天数</small
            >
          </div>
        </el-form-item>
        <el-form-item label="佣金到账方式">
          <div>
            <el-radio-group v-model="form.brokerage_method">
              <el-radio
                label="手动到账"
                value="hand"
                class="p-3 rounded border"
              />
              >
              <el-radio
                label="自动到账微信零钱"
                value="wx"
                class="p-3 rounded border"
              />
              >
            </el-radio-group>
            <small class="block"
              >佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</small
            >
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="default" @click="submit"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getConfig, setConfig } from "~/api/distribution.js";
import { toast } from "~/composables/util";
import ChooseImage from "~/components/ChooseImage.vue";

const form = reactive({
  distribution_open: 1,
  store_first_rebate: 10,
  store_second_rebate: 20,
  spread_banners: [],
  is_self_brokerage: 1,
  settlement_days: 7,
  brokerage_method: "hand",
});

const loading = ref(false);
const getData = () => {
  loading.value = true;
  getConfig()
    .then((res) => {
      for (const k in form) {
        form[k] = res[k];
      }
      form.password_encrypt = res.password_encrypt.split(",");
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();

const handleUpdateBanner = (banners) => {
  form.spread_banners = banners;
};

const submit = () => {
  loading.value = true;
  setConfig(form)
    .then(() => {
      toast("修改成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
