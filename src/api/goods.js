import axios from "~/axios";
import { queryToUrl } from "~/composables/util";

export function getGoodsList(page, query = {}) {
    let r = queryToUrl(query)
    return axios.get(`/admin/goods/${page}${r}`)
}

export function updateGoodsStatus(ids, status) {
    return axios.post(`/admin/goods/changestatus`, {
        ids,
        status
    })
}

export function createGoods(data) {
    return axios.post(`/admin/goods`, data)
}

export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)

}

export function deleteGoods(id) {
    return axios.post(`/admin/goods/${id}/delete`)
}