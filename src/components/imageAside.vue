<template>
    <el-aside width="280px" class="image-aside">
        <div class="top">
            <AsideList :active="activeId == item.id" v-for="(item, index) in list" :key="index">
                {{ item.name }}
            </AsideList>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :current-page="currentPage" @current-change="getData"
                :total="total" />
        </div>
    </el-aside>
    <FormDrawer closeAble="true" title="新增" ref="formDrawerRef"  @submit="handlerSubmit">
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
import AsideList from '~/components/AsideList.vue'
import {
    getImageClassList,
    createImageClassList
} from "~/api/image_class.js"
import { toast } from "~/composables/util.js"
import { ref, reactive } from "vue"
import FormDrawer from "~/components/FormDrawer.vue"
//加载动画
const loading = ref(false)

//默认激活
const list = ref([])
const activeId = ref(0)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

//抽屉
const formDrawerRef = ref(null)
const handlerCreate = () => formDrawerRef.value.open()

const form = reactive({
    name: "",
    order: 50

})

const rules = {
    name: [{
        required: true,
        message: "图库分类名称不能为空",
        tirgger: "blur"
    }]
}
const formRef = ref(null)

const handlerSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return
        console.log(form)
        createImageClassList(form)
            .then(res => {
                toast("新增成功")
                getData(1)
                formDrawerRef.value.close()
            })
            .finally(() => {
                formDrawerRef.value.hideLoading()
            })
    })
}


defineExpose({
    handlerCreate
})



//获取数据
function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageClassList(currentPage.value)
        .then(res => {
            list.value = res.list
            let item = list.value[0]
            if (item) {
                activeId.value = item.id
                total.value = res.totalCount
            }

        })
        .finally(() => {
            loading.value = false
        })
}
getData()

</script>

<style>
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