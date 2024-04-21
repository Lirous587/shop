import {
    createRouter,
    createWebHashHistory,
    useRouter
} from 'vue-router'
import Admin from "~/layout/admin.vue"
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
import UserList from '~/pages/user/list.vue'
import OrderList from '~/pages/order/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import SettingList from '~/pages/setting/list.vue'
import CouponList from '~/pages/coupon/list.vue'
import ManagerList from '~/pages/manager/list.vue'


//默认路由 所有用户共享
const routes = [
    {
        path: "/",
        name: "admin",
        component: Admin,
    },
    {
        path: '/login',
        name: "login",
        component: Login,
        meta: {
            title: "登录页面"
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },]

// 动态路由 用于匹配菜单动态添加路由
const asyncRoutes = [{
    path: "/",
    name: "/",
    component: Index,
    meta: {
        title: "后台首页"
    }
}, {
    path: "/goods/list",
    name: "/goods/list",
    component: GoodList,
    meta: {
        title: "商品管理"
    }
}, {
    path: "/category/list",
    name: "/category/list",
    component: CategoryList,
    meta: {
        title: "分类列表"
    }
}, {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
        title: "用户列表"
    }
}, {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
        title: "订单列表"
    }
}, {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
        title: "评论列表"
    }
}, {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
        title: "图库列表"
    }
}, {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
        title: "公告列表"
    }
}, {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingList,
    meta: {
        title: "配置列表"
    }
}, {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
        title: "优惠券列表"
    }
},
{
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
        title: "管理员列表"
    }
}]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//动态添加路由的方法
export function addRouters(menus) {
    //是否有新的路由
    let hasNewRoutes = false
    const findAndAddRoutersByMenus = (arr) => {
        arr.forEach(e => {
            let item = asyncRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(item.path)) {
                router.addRoute("admin", item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length > 0) {
                findAndAddRoutersByMenus(e.child)
            }
        })
    }

    findAndAddRoutersByMenus(menus)

    return hasNewRoutes
}