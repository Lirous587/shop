import { ref, reactive, computed } from "vue";
import { toast } from "~/composables/util.js";

// 列表 分页 搜索 删除 修改状态
export function useInitTable(opt = {}) {
  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  const tableData = ref([]);

  const loading = ref(false);

  //分页
  const currentPage = ref(1);
  const total = ref(0);

  // 获取数据
  function getData(p = null) {
    if (typeof p == "number") {
      currentPage.value = p;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  // 删除
  const handelDelete = (id) => {
    loading.value = true;
    opt
      .delete(id)
      .then(() => {
        toast("删除成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  //修改状态
  const handelStatusChange = async (status, row) => {
    row.statusLoading = true;
    await opt
      .updateStatus(row.id, status)
      .then((res) => {
        toast("修改状态成功");
        row.status = status;
      })
      .finally(() => {
        row.statusLoading = false;
      });
    return status;
  };

  // 表格多选
  const multipleTableRef = ref(null);
  const multipleSelectionIds = ref([]);
  const handleSelectionChange = (e) => {
    multipleSelectionIds.value = e.map((o) => o.id);
  };
  const handelMultipleDelete = () => {
    if (multipleSelectionIds.value.length > 0) {
      loading.value = true;
      opt
        .delete(multipleSelectionIds.value)
        .then((res) => {
          toast("批量删除成功");
          getData();
        })
        .finally(() => {
          loading.value = false;
          // 清空选中
          if (multipleTableRef.value) {
            multipleTableRef.value.clearSelection();
          }
        });
    } else {
      toast("请先选择", "warning");
    }
  };

  // 批量修改状态
  const handelMultipleStatusChange = (status) => {
    if (multipleSelectionIds.value.length > 0) {
      loading.value = true;
      opt
        .updateStatus(multipleSelectionIds.value, status)
        .then((res) => {
          toast("批量修改状态成功");
          getData();
        })
        .finally(() => {
          loading.value = false;
          // 清空选中
          if (multipleTableRef.value) {
            multipleTableRef.value.clearSelection();
          }
        });
    } else {
      toast("请先选择", "warning");
    }
  };

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    getData,
    handelDelete,
    handelStatusChange,
    multipleTableRef,
    handleSelectionChange,
    handelMultipleDelete,
    handelMultipleStatusChange,
    multipleSelectionIds,
  };
}

// 新增 修改
export function useInitForm(opt = {}) {
  // 表单部分
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  // 表单默认值
  const defaultForm = opt.form;
  const form = reactive({});

  // 表单验证
  const rules = opt.rules || {};

  const editId = ref(0);
  const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

  // 提交表单
  const handelSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;

      formDrawerRef.value.showLoading();

      let body = {};

      if (opt.beforSumbit && typeof opt.beforSumbit === "function") {
        body = opt.beforSumbit({ ...form });
      } else {
        body = form;
      }

      const fun = editId.value
        ? opt.update(editId.value, body)
        : opt.create(body);

      fun
        .then((res) => {
          toast(drawerTitle.value + "成功");
          opt.getData(editId ? null : 1);
          formDrawerRef.value.close();
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  // 重置表单
  function resetForm(row) {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
    for (const key in defaultForm) {
      form[key] = row[key];
    }
  }

  // 新增
  const handelCreate = () => {
    editId.value = 0;
    resetForm(defaultForm);
    formDrawerRef.value.open();
  };

  // 编辑
  const handelEdit = (row) => {
    editId.value = row.id;
    resetForm(row);
    formDrawerRef.value.open();
  };

  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handelSubmit,
    resetForm,
    handelCreate,
    handelEdit,
  };
}
