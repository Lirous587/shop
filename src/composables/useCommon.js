import { ref, reactive, computed } from "vue";
import { toast } from "~/composables/util.js"

// 列表 分页 搜索
export function useInitTable(opt = {}) {
    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }

    const tableData = ref([])

    const loading = ref(false)

    //分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    // 获取数据
    function getData(p = null) {
        if (typeof p == 'number') {
            currentPage.value = p
        }
        loading.value = true
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => {
                loading.value = false
            })
    }
    getData()


    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        getData
    }
}

// 新增 修改
export function useInitForm(opt = {}) {
    // 表单部分
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    // 表单默认值
    const defaultForm = opt.form
    const form = reactive({})

    // 表单验证
    const rules = opt.rules || {}

    const editId = ref(0)
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")

    // 提交表单
    const handelSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return

            const fun = editId.value ? opt.update(editId.value, form) : opt.create(form)

            formDrawerRef.value.showLoading()

            fun.then(res => {
                toast(drawerTitle.value + "成功")
                opt.getData(editId ? null : 1)
            })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })
        })
    }

    // 重置表单
    function resetForm(row) {
        if (formRef.value) {
            formRef.value.clearValidate()
        }
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }

    // 新增
    const handelCreate = () => {
        editId.value = 0
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }

    // 编辑
    const handelEdit = (row) => {
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }

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
    }
}