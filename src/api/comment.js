import axios from "~/axios";

export function getCommentList(page) {
  return axios.get(`/admin/goods_comment/${page}`);
}

export function updateCommentStatus(id, status) {
  return axios.post(`/admin/goods_comment/${id}/update_status`, {
    status,
  });
}
