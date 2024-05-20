import { useCookies } from '@vueuse/integrations/useCookies';
const TokenKey = "admin-token"
const ExpendAside = "expend"

const cookie = useCookies()


//获取token
export function getToken() {
    return cookie.get(TokenKey)
}
//设置token
export function setToken(token) {
    return cookie.set(TokenKey, token)
}
//清除token
export function removeToken() {
    return cookie.remove(TokenKey)
}

//获取expend
export function getExpendAside() {
    return cookie.get(ExpendAside)
}
//设置expend
export function setExpendAside(value) {
    return cookie.set(ExpendAside, value)
}

