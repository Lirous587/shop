<template>
  <div v-loading="loading">
    <el-card shadow="always">
      <el-form :model="form" label-width="160px">
        <el-form-item label="物流查询key">
          <el-input style="width: 50%" v-model="form.ship"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getSysconfig, setSysconfig } from "~/api/sysconfig.js";
import { toast } from "~/composables/util";

const form = reactive({
  ship: "",
});

const loading = ref(false);
const getData = () => {
  loading.value = true;
  getSysconfig()
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

const submit = () => {
  loading.value = true;
  setSysconfig(form)
    .then(() => {
      toast("修改成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
