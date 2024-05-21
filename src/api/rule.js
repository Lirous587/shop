import axios from "~/axios"

export function getRuleList(page) {
    return axios.get(`/admin/rule/${page}`)
}

export function createRule(data) {
    return axios.post("/admin/rule", data)
}

export function updateRule(id, data) {
    return axios.post(`/admin/rule/${id}`, data)
}