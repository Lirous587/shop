import { ElNotification } from "element-plus";
import { ElMessageBox } from "element-plus";
import nprogress from "nprogress";
//成功提示
export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    message: message,
    type: type,
    dangerouslyUseHTMLString,
    duration: 1500,
  });
}

//消息弹框
export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}
// 显示全局loading
export function showFullLoading() {
  nprogress.start();
}

//隐藏全局loading
export function hideFullLoading() {
  nprogress.done();
}

//弹出输入框
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

// 将query参数转为url
export function queryToUrl(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&");
  r = r ? "?" + r : "";
  return r;
}

export function useArrMoveUp(arr, index) {
  swapArry(arr, index, index - 1);
}

export function useArrMoveDown(arr, index) {
  swapArry(arr, index, index + 1);
}

export function swapArry(arr, index1, index2) {
  // 先保留index2
  const lastItem = arr[index2];
  // 将index1于index2交换
  arr.splice(index2, 1, arr[index1]);
  arr[index1] = lastItem;
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}
