<template>
    <el-main :v-loading="loading" class="image-main">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{'padding' : 0}">
                        <el-image :src="'/public/' + item.url.split('/')[4]" fit="cover" :lazy="false"
                            class="w-full h-[150px]"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex justify-center items-center p-2">
                            <el-button type="primary" size="small" text>
                                重命名
                            </el-button>
                            <el-button type="primary" size="small" text>
                                删除
                            </el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>


        </div>
        <div class="bottom">
            <el-pagination background layout="prev, pager,next" :current-page="currentPage" @current-change="getData"
                :total="total" />
        </div>
    </el-main>
</template>


<script setup>
import { ref } from "vue"
import { getImageList } from "~/api/image.js"

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
    getImageList(imageClassID.value, currentPage.value)
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
.image-title{
    position: absolute;
    top:125px;
    left:-1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>