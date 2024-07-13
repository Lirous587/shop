import axios from "~/axios";
import { queryToUrl } from "~/composables/util";


export function login(username, password) {
    return axios.post("/admin/login", {
        username,
        password
    })
}

export function getinfo() {
    return axios.post("/admin/getinfo")
}

export function logout() {
    return axios.post("/admin/logout")
}

export function updatePassword(data) {
    return axios.post("/admin/updatepassword", data)
}

export function getManagerList(page, query = {
    limit,
    keyword
}) {
    let r = queryToUrl(query)
    return axios.get(`/admin/manager/${page}${r}`)
}

export function updateManagerStatus(id, status) {
    return axios.post(`/admin/manager/${id}/update_status`, {
        status
    })
}

export function createManager(data) {
    return axios.post(`/admin/manager`, data)
}

export function updateManager(id, data) {
    return axios.post(`/admin/manager/${id}`, data)

}

export function deleteManager(id) {
    return axios.post(`/admin/manager/${id}/delete`)
}