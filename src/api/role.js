import axios from "~/axios"

export function getRoleList(page) {
    return axios.get(`/admin/role/${page}`)
}

export function createRole(data) {
    return axios.post("/admin/role", data)
}

export function updateRole(id, data) {
    return axios.post(`/admin/role/${id}`, data)
}

export function deleteRole(id) {
    return axios.post(`/admin/role/${id}/delete`)
}

export function updateRoleStatus(id, status) {
    return axios.post(`/admin/role/${id}/update_status`, {
        status
    })
}

export function setRoleRules(id, rule_ids) {
    return axios.post(`/admin/role/set_rules`, {
        id,
        rule_ids
    })
}