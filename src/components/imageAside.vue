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
</template>

<script setup>
import AsideList from '~/components/AsideList.vue'
import { getImageClassList } from "~/api/image_class.js"
import { ref } from "vue"

//加载动画
const loading = ref(false)

//默认激活
const list = ref([])
const activeId = ref(0)

//分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)


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