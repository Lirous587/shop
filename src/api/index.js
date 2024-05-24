import axios from "~/axios";

export function getstatistics1() {
    return axios.get("/admin/statistics1")
}

export function getstatistics2() {
    return axios.get("/admin/statistics2")
}

export function getstatistics3(type) {
    return axios.get("/admin/statistics3?type=" + type)
}
