<template>
    <div>
        <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
            <el-header class="image-header">Header</el-header>
            <el-container>
                <ImageAside></ImageAside>
                <ImageMain></ImageMain>
               
            </el-container>
        </el-container>
    </div>
</template>

<style>
.image-header {
    border-bottom: 1px solid #eeeeee;
    @apply flex items-center;
}


</style>


<script setup>

import ImageAside from '~/components/imageAside.vue';
import ImageMain from '~/components/imageMain.vue';
const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40
</script>