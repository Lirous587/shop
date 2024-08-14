<template>
  <div v-loading="loading">
    <el-card shadow="always">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="row.src"
                    fit="contain"
                    :lazy="true"
                  />
                  <div class="ml-3">
                    <p>{{ row.pay_method }}</p>
                    <small>{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180px">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  text
                  size="default"
                  @click="openDrawer(row)"
                >
                  配置
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="购物设置" name="second">
          <el-form :model="form" label-width="160px" :inline="false">
            <el-form-item label="未支付订单">
              <div>
                <el-input
                  v-model="form.close_order_minute"
                  placeholder="未支付订单"
                  type="number"
                  style="width: 350px"
                >
                  <template #append>分钟后自动关闭 </template>
                </el-input>
                <div>
                  <small>
                    订单下单未付款，n分钟后自动关闭，设置0不自动关闭
                  </small>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="已完成订单">
              <div>
                <div>
                  <el-input
                    v-model="form.auto_received_day"
                    placeholder="已完成订单"
                    type="number"
                    style="width: 350px"
                  >
                    <template #append>天后自动确认收货 </template>
                  </el-input>
                </div>
                <div>
                  <small
                    >如果在期间未确认收货，系统自动完成收货，设置0不自动收货</small
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item label="已发货订单">
              <div>
                <div>
                  <el-input
                    v-model="form.after_sale_day"
                    placeholder="已发货订单"
                    type="number"
                    style="width: 350px"
                  >
                    <template #append>天内允许申请售后 </template>
                  </el-input>
                </div>
                <div>
                  <small
                    >订单完成后
                    ，用户在n天内可以发起售后申请，设置0不允许申请售后</small
                  >
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="default" @click="submit">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

  <FormDrawer title="支付信息配置" ref="formDrawerRef" @submit="submit">
    <div v-if="pay_method == 'alipay'">
      <el-form :model="form" label-width="100px">
        <el-form-item label="app_id">
          <el-input style="width: 70%" v-model="form.alipay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="public_key">
          <el-input
            style="width: 70%"
            v-model="form.alipay.ali_public_key"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>

        <el-form-item label="private_key">
          <el-input
            style="width: 70%"
            v-model="form.alipay.private_key"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-form :model="form" label-width="100px">
        <el-form-item label="公众号">
          <el-input style="width: 70%" v-model="form.wxpay.app_id"></el-input>
        </el-form-item>
        <el-form-item label="小程序ID">
          <el-input
            style="width: 70%"
            v-model="form.wxpay.miniapp_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="secret">
          <el-input style="width: 70%" v-model="form.wxpay.secret"></el-input>
        </el-form-item>
        <el-form-item label="APPID">
          <el-input style="width: 70%" v-model="form.wxpay.appid"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input style="width: 70%" v-model="form.wxpay.key"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥">
          <el-input style="width: 70%" v-model="form.wxpay.key"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            accept=".pem"
            :action="uploadAction"
            :limit="1"
            :headers="{
              token,
            }"
            @on-success="handelUploadClient"
          >
            <el-button type="primary" class="mb-2">点击上传</el-button>

            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_client ? form.wxpay.cert_client : "未配置" }}
              </p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            accept=".pem"
            :action="uploadAction"
            :limit="1"
            :headers="{
              token,
            }"
            @on-success="handelUploadKey"
          >
            <el-button type="primary" class="mb-2">点击上传</el-button>

            <template #tip>
              <p class="text-rose-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : "未配置" }}
              </p>
              <div class="el-upload__tip">例如：apiclient_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </FormDrawer>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getSysconfig, setSysconfig, uploadAction } from "~/api/sysconfig.js";
import { toast } from "~/composables/util";
import { getToken } from "~/composables/auth.js";
import FormDrawer from "~/components/FormDrawer.vue";

const formDrawerRef = ref(null);

const token = getToken();
const activeName = ref("first");

const form = reactive({
  alipay: {
    app_id: "",
    ali_public_key: "",
    private_key: "",
  },
  wxpay: {
    app_id: "", // 公众号 APPID
    miniapp_id: "", // 小程序 APPID
    secret: "", // 小程序secret
    appid: "", // appid
    mch_id: "", // 商户号
    key: "", // API 密钥
    cert_client: "",
    cert_key: "",
  },
});

const tableData = ref([
  {
    pay_method: "支付宝支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "alipay.png",
    key: "alipay",
  },
  {
    pay_method: "微信支付",
    desc: "该系统支持即时到账接口",
    src: "wxpay.png",
    key: "wxpay",
  },
]);

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

const pay_method = ref("");
const openDrawer = (row) => {
  formDrawerRef.value.open();
  pay_method.value = row.key;
};

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

const handelUploadClient = (response, uploadFile, uploadFiles) => {
  form.wxpay.cert_client = response.data;
};

const handelUploadKey = (response, uploadFile, uploadFiles) => {
  form.wxpay.cert_key = response.data;
};
</script>
