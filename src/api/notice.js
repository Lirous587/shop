import axios from "~/axios"

export function getNoticeList(page) {
    return axios.get(`/admin/notice/${page}`)
}