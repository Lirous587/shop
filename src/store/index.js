import { createStore } from "vuex";
import { login, getinfo } from "~/api/manager";
import { setToken, removeToken } from "~/composables/auth";
import { ref, watch } from "vue";
import { getExpendAside, setExpendAside } from "~/composables/auth.js";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      //用户信息
      user: {},
      //侧边宽度
      asideWidth: "250px",
      //菜单数组
      menus: [],
      ruleNames: [],
    };
  },
  mutations: {
    //记录用户信息
    SET_USERINFO(state, user) {
      state.user = user;
    },
    //展开|缩起侧边
    handleAsideWidth(state) {
      const ifExpendAside = ref(getExpendAside());
      if (!ifExpendAside.value) {
        state.asideWidth = "250px";
        setExpendAside(1);
      } else {
        state.asideWidth = "60px";
        setExpendAside(0);
      }
    },
    initAsideWidth(state) {
      const ifExpendAside = ref(getExpendAside());
      if (ifExpendAside.value) {
        state.asideWidth = "250px";
      } else {
        state.asideWidth = "60px";
      }
    },
    SET_MENUS(state, menus) {
      state.menus = menus;
    },
    SET_RULENAMES(state, ruleNames) {
      state.ruleNames = ruleNames;
    },
  },
  actions: {
    login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username, password)
          .then((res) => {
            setToken(res.token);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
    logout({ commit }) {
      //移除cookie里面的token
      removeToken();
      //清除当前用户状态 vuex
      commit("SET_USERINFO", {});
    },
    //获取当前用户登录信息
    getinfo({ commit }) {
      return new Promise((resolve, reject) => {
        getinfo()
          .then((res) => {
            commit("SET_USERINFO", res);
            commit("SET_MENUS", res.menus);
            commit("SET_RULENAMES", res.ruleNames);
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    },
  },
});

export default store;
