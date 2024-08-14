<template>
  <div v-loading="loading">
    <el-card shadow="always">
      <el-form :model="form" label-width="160px" :inline="false">
        <el-tabs v-model="activeName">
          <el-tab-pane label="注册与访问" name="first">
            <el-form-item label="是否允许注册会员">
              <el-radio-group v-model="form.open_reg">
                <el-radio class="p-4 border rounded" :value="1">开启</el-radio>
                <el-radio class="p-4 border rounded" :value="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="注册类型">
              <el-radio-group v-model="form.reg_method">
                <el-radio class="p-4 border rounded" value="username"
                  >普通注册</el-radio
                >
                <el-radio class="p-4 border rounded" value="phone"
                  >手机注册</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="密码最小长度">
              <el-input
                v-model="form.password_min"
                style="width: 30%"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="强制密码复杂度">
              <el-checkbox-group
                v-model="form.password_encrypt"
                class="flex flex-wrap gap-y-3"
              >
                <el-checkbox
                  v-for="item in encryptSelections"
                  :key="item.value"
                  :label="item.label"
                  class="p-3 rounded border"
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="上传设置" name="second">
            <div>上传设置</div>
          </el-tab-pane>

          <el-tab-pane label="Api安全" name="third">
            <div>Api安全</div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" size="default" @click="">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getSysconfig, setSysconfig } from "~/api/sysconfig.js";

const activeName = ref("first");

const form = ref({
  open_reg: 1,
  reg_method: "username",
  password_min: 7,
  password_encrypt: [],
  upload_method: "oss",
  upload_config: {
    Bucket: "",
    ACCESS_KEY: "",
    SECRET_KEY: "",
    http: "",
  },
  api_safe: 1,
  api_secret: "",
  close_order_minute: 0,
  auto_received_day: 0,
  after_sale_day: 0,
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: "",
  },
});

const loading = ref(false);
const getData = () => {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      form.va = res;
    })
    .finally(() => {
      loading.value = false;
    });
};
getData();

const encryptSelections = ref([
  { value: 0, label: "数字" },
  { value: 1, label: "小写字母" },
  { value: 2, label: "大写字母" },
  { value: 3, label: "符号" },
]);
</script>
