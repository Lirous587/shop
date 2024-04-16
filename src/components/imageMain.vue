<template>
    <el-main :v-loading="loading" class="image-main">
        <div class="top">
            <div v-for="(item, index) in list" :key="index"> 
                {{ item.url }}
            </div>
        </div>
        <div class="bottom">
            <el-pagination background layout="prev, pager,next" :current-page="currentPage" @current-change="getData"
                :total="total" />
        </div>
    </el-main>
</template>


<script setup>
import { ref } from "vue"
import {
    getImageList,
} from "~/api/image.js";

const loading = ref(false)
//分页
const currentPage = ref(1)
const total = ref(0)
const list = ref([])

const imageClassID = ref(0)


//获取数据
function getData(p = null) {
    if (typeof p == "number") {
        currentPage.value = p
    }
    loading.value = true
    getImageList(imageClassID.value,currentPage.value)
        .then(res => {
            list.value = res.list
        })
        .finally(() => {
            loading.value = false
        })
}

//根据分类id重新加载图片列表
const loadData = (id) => {
    currentPage.value = 1
    imageClassID.value = id
    getData()
}
defineExpose({
    loadData
})
</script>

<style>
.image-main {
    border-right: 1px solid #eeeeee;
    position: relative;
}

.image-main .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-main .bottom {
    position: absolute;
    bottom: 0;
    height: 50px;
    left: 0;
    right: 0;
    @apply flex justify-center justify-center;
}
</style>