<template>
    <el-aside width="280px" class="image-aside">
        <div class="top">
          <AsideList active>
            分类标题
          </AsideList>
          <AsideList>
            分类标题
          </AsideList>
        </div>
        <div class="bottom">
            分页区域
        </div>
    </el-aside>
</template>

<script setup>
import AsideList from '~/components/AsideList.vue'
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