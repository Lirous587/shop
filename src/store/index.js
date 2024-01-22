import { createStore } from 'vuex'
import { login, getinfo } from '~/api/manager'
import { setToken,removeToken } from '~/composables/auth'
// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            //用户信息
            user: {}
        }
    },
    mutations: {
        //记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
        }
    },
    actions: {
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        logout({ commit }) {
            //移除cookie里面的token
            removeToken()
            //清除当前用户状态 vuex
            commit("SET_USERINFO",{})
        },
        //获取当前用户登录信息
        getinfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    commit("SET_USERINFO", res)
                    resolve(res)
                }).catch(err => reject(err))
            })
        }
    }
})

export default store