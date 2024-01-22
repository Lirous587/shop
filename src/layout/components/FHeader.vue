<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1"><eleme-filled /></el-icon>
            无尽仙码
        </span>
        <el-icon class="icon-btn">
            <Fold />
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

    <el-drawer v-model="showDrawer" title="修改密码" size="45%" :close-on-click-modal=false>
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input  v-model="form.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" show-password v-model="form.password" placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" show-password v-model="form.repassword" placeholder="请再次输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="onSubmit">提 交</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<script setup>
import { logout, updatePassword } from "~/api/manager"
import { showModal, toast } from "~/composables/util"
import { useRouter } from "vue-router"
import { useStore } from "vuex";
import { useFullscreen } from '@vueuse/core'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'


const {
    //是否全屏
    isFullscreen,
    //自动切换全屏
    toggle
} = useFullscreen()

const router = useRouter()
const store = useStore()

//修改密码
const showDrawer = ref(false)


const handeleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            showDrawer.value = true
            break;
        default:
            break;
    }
}
// 刷新
const handleRefresh = () => location.reload()

//退出登录
function handleLogout() {
    showModal("是否要退出登录").then(res => {
        logout()
            .finally(() => {
                store.dispatch("logout")
                //跳转到登录页面
                router.push("/login")
                //提示
                toast("退出登录成功", "success")
            })
    })
}


// do not use same name with ref
const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
})

const rules = {
    oldpassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' },
        // { min: 3 , max: 5, message: '用户名长度必须是3到5之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '确认密码不能为空', trigger: 'blur' },
    ]
}

const formRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true
        updatePassword(form)
        .then((res) => {
            toast("修改密码成功,请重新登录", "success")
            store.dispatch("logout")
            router.push("/login")
        }).finally(() => {
            loading.value = false
        })
    })
}

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