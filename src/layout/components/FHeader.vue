<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><eleme-filled /></el-icon>
            无尽仙码
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asideWidth== '250px'" />
            <Expand v-else />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>


        <div class="ml-auto flex items-center">

            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>

            <el-dropdown class="drop-dowm" @command="handeleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <!-- <el-drawer v-model="showDrawer" title="修改密码" size="45%" :close-on-click-modal=false>
      
    </el-drawer> -->
    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input type="password" show-password v-model="form.repassword" placeholder="请再次输入新密码">
                </el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>
<script setup>
import formDrawer from "~/components/formDrawer.vue";
import { useFullscreen } from '@vueuse/core'
import { onMounted, onBeforeMount } from 'vue'
import { useLogout,useRepassword } from "~/components/useManager"
const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    updatePasswordForm,
} = useRepassword()

const {
    //是否全屏
    isFullscreen,
    //自动切换全屏
    toggle
} = useFullscreen()

const {
    handleLogout
} = useLogout()

const handeleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            updatePasswordForm()
            break;
        default:
            break;
    }
}
// 刷新
const handleRefresh = () => location.reload()

//监听回车事件
function onKeyUp(e) {
    if (e.key == "Enter") onSubmit()
}

//添加键盘的监听
onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
})

//移除键盘监听
onBeforeMount(() => {
    document.removeEventListener("keyup", onKeyUp)
})

</script>
<style>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .drop-dowm {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>