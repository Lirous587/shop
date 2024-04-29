<template>
   <el-row class="login-container">
      <el-col :lg="16" :md="12" class="left">
         <!-- 响应式布局 -->
         <div>
            <div>欢迎光临</div>
         </div>
      </el-col>

      <el-col :lg="8" :md="12" class="right">
         <h2 class="title">欢迎回来</h2>
         <div>
            <span class="line"></span>
            <span>账号密码登录</span>
            <span class="line"></span>
         </div>

         <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
            <el-form-item prop="username">
               <el-input v-model="form.username" placeholder="请输入用户名">
                  <template #prefix>
                     <el-icon class="el-input__icon">
                        <user />
                     </el-icon>
                  </template>
               </el-input>
            </el-form-item>

            <el-form-item prop="password">
               <el-input type="password" show-password v-model="form.password" placeholder="请输入密码">
                  <template #prefix>
                     <el-icon class="el-input__icon">
                        <lock />
                     </el-icon>
                  </template>
               </el-input>
            </el-form-item>

            <el-form-item>
               <el-button round type="primary" class="w-[250px]" :loading="loading" @click="onSubmit">登 录</el-button>
            </el-form-item>
         </el-form>

      </el-col>
   </el-row>
</template>

<script setup>
import { ref, reactive,onMounted,onBeforeMount } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { toast } from '~/composables/util'

const router = useRouter()
const store = useStore()

// do not use same name with ref
const form = reactive({
   username: "",
   password: "",
})

const rules = {
   username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      // { min: 3 , max: 5, message: '用户名长度必须是3到5之间', trigger: 'blur' },
   ],
   password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
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
      store.dispatch("login", form).then(res => {
         toast("登录成功", "success")
         router.push("/")
      }).finally(() => {
         loading.value = false
      })
   })
}

//监听回车事件
function onKeyUp(e) {
   if (e.key == "Enter")  onSubmit()
}

//添加键盘的监听
onMounted(() => {
   document.addEventListener("keyup", onKeyUp)
})

//移除键盘监听
onBeforeMount(() => {
   document.removeEventListener("keyup",onKeyUp)   
})   

</script>


<style scoped>
.login-container {
   @apply min-h-screen bg-indigo-400;
}

.login-container .left {
   @apply flex items-center justify-center;
}

.login-container .right {
   @apply bg-light-50 flex items-center justify-center flex-col;
}

.left>div>div:first-child {
   @apply font-bold text-5xl text-light-50 mb-4;
}

.right .title {
   @apply font-bold text-3xl text-gray-800;
}

.right>div {
   @apply flex justify-center items-center my-5 text-gray-300 space-x-2;
}

.right .line {
   @apply h-[1px] w-16 bg-gray-200;
}
</style>