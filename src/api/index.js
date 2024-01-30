import axios from "~/axios";
export function getstatistics1() {
    return axios.get("/admin/statistics1")
}