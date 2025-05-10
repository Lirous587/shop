import { createRouter, createWebHashHistory } from "vue-router";
import Admin from "~/layout/admin.vue";
import Index from "~/pages/index.vue";
import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
// import GoodList from "~/pages/goods/list.vue";
// import CategoryList from "~/pages/category/list.vue";
// import UserList from "~/pages/user/list.vue";
// import OrderList from "~/pages/order/list.vue";
// import CommentList from "~/pages/comment/list.vue";
// import ImageList from "~/pages/image/list.vue";
// import NoticeList from "~/pages/notice/list.vue";
// import CouponList from "~/pages/coupon/list.vue";
// import ManagerList from "~/pages/manager/list.vue";
// import AccessList from "~/pages/access/list.vue";
// import RoleList from "~/pages/role/list.vue";
// import SkusList from "~/pages/skus/list.vue";
// import LevelList from "~/pages/level/list.vue";
// import SettingBase from "~/pages/setting/base.vue";
// import SettingBuy from "~/pages/setting/buy.vue";
// import SettingShip from "~/pages/setting/ship.vue";
// import DistributionIndex from "~/pages/distribution/index.vue";
// import DistributionSetting from "~/pages/distribution/setting.vue";

// 默认路由 所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "登录页面",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

// 动态路由 用于匹配菜单动态添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "GoodsList",
    component: () => import("~/pages/goods/list.vue"),
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "CategoryList",
    component: () => import("~/pages/category/list.vue"),
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "UserList",
    component: () => import("~/pages/user/list.vue"),
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "OrderList",
    component: () => import("~/pages/order/list.vue"),
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "CommentList",
    component: () => import("~/pages/comment/list.vue"),
    meta: {
      title: "评论列表",
    },
  },
  {
    path: "/image/list",
    name: "ImageList",
    component: () => import("~/pages/image/list.vue"),
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "NoticeList",
    component: () => import("~/pages/notice/list.vue"),
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/coupon/list",
    name: "CouponList",
    component: () => import("~/pages/coupon/list.vue"),
    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/manager/list",
    name: "ManagerList",
    component: () => import("~/pages/manager/list.vue"),
    meta: {
      title: "管理员列表",
    },
  },
  {
    path: "/access/list",
    name: "AccessList",
    component: () => import("~/pages/access/list.vue"),
    meta: {
      title: "菜单权限管理",
    },
  },
  {
    path: "/role/list",
    name: "RoleList",
    component: () => import("~/pages/role/list.vue"),
    meta: {
      title: "角色管理",
    },
  },
  {
    path: "/skus/list",
    name: "SkusList",
    component: () => import("~/pages/skus/list.vue"),
    meta: {
      title: "规格管理",
    },
  },
  {
    path: "/level/list",
    name: "LevelList",
    component: () => import("~/pages/level/list.vue"),
    meta: {
      title: "会员等级",
    },
  },
  {
    path: "/setting/base",
    name: "SettingBase",
    component: () => import("~/pages/setting/base.vue"),
    meta: {
      title: "配置列表",
    },
  },
  {
    path: "/setting/buy",
    name: "SettingBuy",
    component: () => import("~/pages/setting/buy.vue"),
    meta: {
      title: "交易设置",
    },
  },
  {
    path: "/setting/ship",
    name: "SettingShip",
    component: () => import("~/pages/setting/ship.vue"),
    meta: {
      title: "物流设置",
    },
  },
  {
    path: "/distribution/index",
    name: "DistributionIndex",
    component: () => import("~/pages/distribution/index.vue"),
    meta: {
      title: "分销员管理",
    },
  },
  {
    path: "/distribution/setting",
    name: "DistributionSetting",
    component: () => import("~/pages/distribution/setting.vue"),
    meta: {
      title: "分销设置",
    },
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 动态添加路由的方法
export function addRouters(menus) {
  let hasNewRoutes = false;
  const findAndAddRoutersByMenus = (arr) => {
    arr.forEach((e) => {
      if (e.frontpath) {
        // 确保 asyncRoutes 中的路由有唯一的 name 属性
        const routeToAdd = asyncRoutes.find((o) => o.path === e.frontpath);
        if (
          routeToAdd &&
          routeToAdd.name &&
          !router.hasRoute(routeToAdd.name)
        ) {
          router.addRoute("admin", routeToAdd);
          hasNewRoutes = true;
        }
      }
      if (e.child && e.child.length > 0) {
        findAndAddRoutersByMenus(e.child);
      }
    });
  };

  findAndAddRoutersByMenus(menus);
  return hasNewRoutes;
}
