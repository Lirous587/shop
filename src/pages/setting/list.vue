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
                  :value="item.value"
                  class="p-3 rounded border"
                />
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="上传设置" name="second">
            <div>
              <el-form-item label="默认上传方式">
                <el-radio-group v-model="form.upload_method">
                  <el-radio class="border rounded p-3" value="oss"
                    >对象储存</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="Bucket">
                <el-input
                  v-model="form.upload_config.Bucket"
                  placeholder="Bucket"
                  style="width: 30%"
                ></el-input>
              </el-form-item>
              <el-form-item label="ACCESS_KEY">
                <el-input
                  v-model="form.upload_config.ACCESS_KEY"
                  style="width: 30%"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="SECRET_KEY">
                <el-input
                  v-model="form.upload_config.SECRET_KEY"
                  style="width: 30%"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="空间域名">
                <el-input
                  v-model="form.upload_config.http"
                  placeholder="空间域名"
                  style="width: 30%"
                >
                </el-input>
                <small class="ml-1">请补全 http:// 或 https://</small>
              </el-form-item>
            </div>
          </el-tab-pane>

          <el-tab-pane label="Api安全" name="third">
            <div>
              <el-form-item label="是否开启API安全">
                <el-radio-group v-model="form.api_safe">
                  <el-radio class="p-4 border rounded" :value="1"
                    >开启</el-radio
                  >
                  <el-radio class="p-4 border rounded" :value="0"
                    >关闭</el-radio
                  >
                </el-radio-group>
              </el-form-item>
              <el-form-item label="秘钥">
                <el-input v-model="form.api_secret"></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
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
import { getSysconfig, setSysconfig } from "~/api/sysconfig.js";

const activeName = ref("first");

const form = reactive({
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

const encryptSelections = ref([
  { value: "0", label: "数字" },
  { value: "1", label: "小写字母" },
  { value: "2", label: "大写字母" },
  { value: "3", label: "符号" },
]);

const submit = () => {
  loading.value = true;
  setSysconfig({
    ...form,
    password_encrypt: form.password_encrypt.join(","),
  })
    .then(() => {
      toast("修改成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
