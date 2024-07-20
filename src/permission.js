import { router, addRouters } from "~/router";
import { getToken } from "~/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "~/composables/util";
import store from "./store";
//全局前置守卫
let hasGetInfo = false;

router.beforeEach(async (to, from, next) => {
  //显示loading
  showFullLoading();

  const token = getToken();

  //没有登录,强制跳转登录页面
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({ path: "/login" });
  }
  //防止重复登录
  if (token && to.path == "/login") {
    toast("请勿重复登录", "warning");
    return next({ path: from.path ? from.path : "/" }); //三元运算 key是path 如果from存在 就直接返回原来的路径 如果不存在 就跳转到 '/'
  }

  //如果用户登录了,自动获取用户信息,并存储到vuex中
  let hasNewRoutes = false;
  if (token && !hasGetInfo) {
    let { menus } = await store.dispatch("getinfo");
    hasGetInfo = true;
    //动态添加路由
    hasNewRoutes = addRouters(menus);
  }

  //设置页面标题
  let title = (to.meta.title ? to.meta.title : "商城管理系统") + " —— 罹景偓佺";
  document.title = title;

  hasNewRoutes ? next(to.fullPath) : next();
});

router.afterEach((to, from) => {
  //隐藏loading
  hideFullLoading();
});
