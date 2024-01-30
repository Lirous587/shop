import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useCookies } from '@vueuse/integrations/useCookies';
export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()
    const router = useRouter()

    const activeTab = ref(route.path)

    const tabList = ref([
        {
            title: "后台首页",
            path: "/",
        }
    ])

    const handleClose = (c) => {
        if (c == "clearAll") {
            //切换回首页
            activeTab.value = "/"
            //过滤只剩下首页
            tabList.value = [{
                title: "后台首页",
                "path": "/"
            }]
            router.push("/")
        } else if (c == "clearOther") {
            //过滤只剩下首页和当前激活
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
        }
        cookie.set("tabList", tabList.value)
    }

    //添加标签导航的方法
    function addTab(tab) {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }
        cookie.set("tabList", tabList.value)
    }

    //删除标签导航的方法
    const removeTag = (t) => {
        let tabs = tabList.value
        let a = activeTab.value
        if (a == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    const nextTab = tab[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })
        }
        activeTab.value = a
        router.push(a)
        tabList.value = tabList.value.filter(tab => tab.path != t)

        cookie.set("tabList", tabList.value)
    }

    //初始化标签导航列表
    function initTabList() {
        let tbs = cookie.get("tabList")
        if (tbs) {
            tabList.value = tbs
        }
    }
    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTab = (t) => {
        router.push(t)
    }

    return {
        activeTab,
        tabList,
        removeTag,
        handleClose,
        changeTab
    }
}