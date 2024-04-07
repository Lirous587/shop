<template>
    <el-main class="image-main">
        <div class="top">
            <div v-for="i in 100" :key="i"> {{ i }}</div>
        </div>
        <div class="bottom">
            分页区域
        </div>
    </el-main>

</template>


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