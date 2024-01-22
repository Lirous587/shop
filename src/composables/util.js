import { ElNotification } from "element-plus";
import { ElMessageBox } from 'element-plus'
import  nprogress from "nprogress"
//成功提示
export function toast(message,type = "success") {
    ElNotification({
        message: message,
        type: type,
        duration:1500
        })
}

//消息弹框
export function showModal(content = "提示内容", type = "warning", title = "") {
   return  ElMessageBox.confirm(
          content,
          title,
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type,
          }
        )
}
// 显示全局loading
export function showFullLoading() {
  nprogress.start();
}

//隐藏全局loading
export function hideFullLoading() { 
  nprogress.done();
}
