<template>
    <div>
        <el-result
        icon="warning"
        title="404提升"
        sub-title="你找的页面走丢了"
      >
        <template #extra>
          <el-button type="primary" @click= "redirectToHome">回到首页</el-button>
        </template>
      </el-result>
    </div>
</template>

<script>
export default {
  methods: {
    redirectToHome() {
      this.$router.push("/");
      }
    }
  }
</script>