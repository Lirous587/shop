<template>
  <FormDrawer
    title="物流信息"
    destroyOnClose
    confirmText="发货"
    ref="formDrawer"
  >
    <el-form label-width="80px" :inline="false" size="normal">
      <el-form-item label="快递公司">
        <el-input v-model="form.express_company"></el-input>
      </el-form-item>
      <el-form-item label="快递单号">
        <el-input v-model="form.express_no"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getCompanysList, sent } from "~/api/order";
import { toast } from "~/composables/util";
import FormDrawer from "~/components/FormDrawer.vue";

const formDrawerRef = ref(null);

const form = reactive({
  express_company: "",
  express_no: "",
});

const open = () => {
  formDrawerRef.value.open();
};

const companyList = ref([]);

const getCompanysListHandel = () => {
  getCompanysList().then((res) => {
    companyList.value = res.list;
  });
};
getCompanysListHandel();

const sumbit = () => {
  sent(id, form).then((res) => {
    toast("发货成功");
  });
};

defineExpose({
  open,
});
</script>

<!-- 拿到公司列表 然后样式实现  -->