<template>
  <el-aside width="200px" class="image-aside" v-loading="loading">
    <div class="top">
      <AsideList
        :active="activeId == item.id"
        v-for="(item, index) in list"
        :key="index"
        @edit="handleEdit(item)"
        @delete="handleDelete(item)"
        @click="handleChangerActiveId(item.id)"
      >
        {{ item.name }}
      </AsideList>
    </div>

    <div class="bottom">
      <el-pagination
        background
        layout="prev,pager, next"
        :current-page="currentPage"
        @current-change="getData"
        :total="total"
      />
    </div>
  </el-aside>
  <FormDrawer
    :closeAble="true"
    :title="drawerTitle"
    ref="formDrawerRef"
    @submit="handleSubmit"
  >
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import AsideList from "~/components/AsideList.vue";
import {
  getImageClassList,
  createImageClassList,
  updateImageClassList,
  deleteImageClassList,
} from "~/api/image_class.js";
import { toast } from "~/composables/util.js";
import { ref, reactive, computed } from "vue";
import FormDrawer from "~/components/FormDrawer.vue";
//加载动画
const loading = ref(false);

//默认激活
const list = ref([]);

//分页
const currentPage = ref(1);
const total = ref(0);

//抽屉
const formDrawerRef = ref(null);

const form = reactive({
  name: "",
  order: 50,
});

const rules = {
  name: [
    {
      required: true,
      message: "图库分类名称不能为空",
      tirgger: "blur",
    },
  ],
};
const formRef = ref(null);

//文章id
const editId = ref(null);

//表单title
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

//新增
const handleCreate = () => {
  form.name = "";
  form.order = 50;
  form.id = 0;
  editId.value = null;
  formDrawerRef.value.open();
};

const handleEdit = (item) => {
  formDrawerRef.value.open();
  form.name = item.name;
  editId.value = item.id;
};

//编辑
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    const fun = editId.value
      ? updateImageClassList(editId.value, form)
      : createImageClassList(form);
    fun
      .then((res) => {
        toast(drawerTitle.value + "成功");
        getData(editId.value ? currentPage.value : 1);
        formDrawerRef.value.close();
      })
      .finally(() => {
        formDrawerRef.value.hideLoading();
      });
  });
};

//删除
const handleDelete = (row) => {
  loading.value = true;
  deleteImageClassList(row.id)
    .then((res) => {
      getData(currentPage.value);
      toast("删除成功");
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  handleCreate,
});

//选中图库分类
const activeId = ref(0);
const emit = defineEmits(["change"]);

function handleChangerActiveId(id) {
  activeId.value = id;
  emit("change", id);
}

//获取数据
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getImageClassList(currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list;
      let item = list.value[0];
      if (item) {
        handleChangerActiveId(item.id);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}

.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex justify-center justify-center;
}
</style>
