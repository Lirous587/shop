import axios from '~/axios'

export function getImageClassList(page) {
    return axios.get("/admin/image_class/"+page)
}