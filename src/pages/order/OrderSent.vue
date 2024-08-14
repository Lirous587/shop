<template>
  <FormDrawer
    title="物流信息"
    destroyOnClose
    confirmText="发货"
    ref="formDrawerRef"
    @submit="submit"
  >
    <el-form label-width="80px" :inline="false">
      <el-form-item label="快递公司">
        <el-select
          v-model="form.express_company"
          placeholder="选择快递公司"
          style="width: 240px"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="快递单号">
        <el-input
          type="number"
          style="width: 240px"
          v-model="form.express_no"
        ></el-input>
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

const order_id = ref(0);

const handleData = ref(null);
const open = (id, func) => {
  formDrawerRef.value.open();
  order_id.value = id;
  if (typeof func == "function") {
    handleData.value = func;
  }
  getCompanysListHandel();
};

const companyList = ref([]);

function getCompanysListHandel() {
  getCompanysList().then((res) => {
    companyList.value = res.list;
  });
}

const submit = () => {
  formDrawerRef.value.showLoading();
  sent(order_id.value, form)
    .then((res) => {
      toast("发货成功");
      formDrawerRef.value.close();
      handleData.value();
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};

defineExpose({
  open,
});
</script>

<!-- 拿到公司列表 然后样式实现  -->
