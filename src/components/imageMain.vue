<template>
    <el-main v-loading="loading" class="image-main">
        <div class="top p-3">
            <el-row :gutter="10">
                <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
                    <el-card shadow="hover" class="relative mb-3" :body-style="{ 'padding': 0 }" :class="{ 'border-red-500': item.checked}">
                        <el-image :src="'/public/' + item.url.split('/')[4]" fit="cover" :lazy="false"
                            :preview-src-list="['/public/' + item.url.split('/')[4]]" :initial-index="0"
                            class="w-full h-[150px]"></el-image>
                        <div class="image-title">{{ item.name }}</div>
                        <div class="flex justify-center items-center py-2">
                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handelChooseChange(item)">
                            </el-checkbox>
                            <el-button type="primary" size="small" text @click="handleEdit(item)">
                                重命名
                            </el-button>
                            <el-popconfirm title="是否要删除该图片?" confirm-button-text="确定" cancel-button-text="取消"
                                @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button type="primary" size="small" text>
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
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

    <el-drawer v-model="drawer" title="上传图片">
        <UploadFile :data="{ 'image_class_id': imageClassID }" @success="handelUploadSuccess"></UploadFile>
    </el-drawer>

</template>

<script setup>
import { ref, computed } from "vue"
import {
    getImageList,
    updateImageList,
    deleteImageList
} from "~/api/image.js"
import {
    showPrompt,
    toast
} from "~/composables/util";
import UploadFile from "~/components/UploadFile.vue";

// 上传图片
const drawer = ref(false)
const openUploadFile = () => {
    drawer.value = true
}


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
            total.value = res.totalCount
            list.value = res.list.map(o => {
                o.checked = false
                return o
            })
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

//重命名
const handleEdit = (item) => {
    showPrompt("重命名", item.name)
        .then(({ value }) => {
            loading.value = true
            updateImageList(item.id, value)
                .then(res => {
                    toast("修改成功")
                    getData()
                })
                .finally(() => {
                    loading.value = false
                })
        })
}

//删除图片
const handleDelete = (id) => {
    loading.value = true
    deleteImageList([id])
        .then(res => {
            toast("删除成功")
            getData()
        })
        .finally(() => {
            loading.value = false
        })

}

//上传成功
const handelUploadSuccess = () => {
    getData(1)
}



// 选中的图片
const emit = defineEmits(["choose"])
const checkedImage = computed(() => {
    return list.value.filter(o => o.checked)
})

// 选中图片
const handelChooseChange = (item) => {
    if (item.checked && checkedImage.value.length > 1) {
        item.checked = false
        return toast("最多只能选中一张", "error")
    }
    emit("choose", checkedImage.value)
}

defineProps({
    openChoose:{
        type: Boolean,
        default:false
    }
})

defineExpose({
    loadData,
    openUploadFile
})
</script>

<style scoped>
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

.image-title {
    position: absolute;
    top: 125px;
    left: -1px;
    right: -1px;
    @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>