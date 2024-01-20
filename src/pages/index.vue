<template>
    <div>
        后台首页
        <el-button @click="set">设置</el-button>
        <el-button @click="get">读取</el-button>
        <el-button @click="remove">删除</el-button>
    </div>
</template>

<script setup>
import { useCookies } from '@vueuse/integrations/useCookies';


const cookie = useCookies()


function set() {
    cookie.set("admin-token", "12346")
}
function get() {
    let token = cookie.get("admin-token")
    console.log(token)
}
function remove() {
    cookie.remove("admin-token")
}
</script>