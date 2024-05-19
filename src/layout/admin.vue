<template>
    <el-container>
        <el-header>
            <f-header></f-header>
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <f-tag-list />
                <router-view v-slot="{ Component }">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FMenu from "~/layout/components/FMenu.vue";
import FHeader from "~/layout/components/FHeader.vue";
import FTagList from "~/layout/components/FTagList.vue";
</script>


<style scoped>
.el-aside {
    transition: all 0.2s;
}

.fade-enter-from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}

.fade-leave-active {
    transition-delay: all 0.3s;
}
</style>