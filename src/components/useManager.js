import { logout, updatePassword } from "~/api/manager"
import { showModal, toast } from "~/composables/util"
import { useRouter } from "vue-router"
import { useStore } from "vuex";
import { ref, reactive } from 'vue'


export function useRepassword() {
    const router = useRouter()
    const store = useStore()
    //修改密码
    const formDrawerRef = ref(null)
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

    const onSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showloading()
            updatePassword(form)
                .then((res) => {
                    toast("修改密码成功,请重新登录", "success")
                    store.dispatch("logout")
                    router.push("/login")
                }).finally(() => {
                    formDrawerRef.value.hideloading()
                })
        })
    }
    const updatePasswordForm = () => formDrawerRef.value.open()

    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        updatePasswordForm
    }
}
export function useLogout() {
    const router = useRouter()
    const store = useStore()
    function handleLogout() {
        // 退出登录function
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
    return {
        handleLogout
    }
}
