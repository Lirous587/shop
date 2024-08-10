import axios from "~/axios";

import { queryToUrl } from "~/composables/util";

export function getUserList(page, query = {}) {
  let r = queryToUrl(query);
  return axios.get(`/admin/user/${page}${r}`);
}

export function createUser(data) {
  return axios.post("/admin/user", data);
}

export function updateUser(id, data) {
  return axios.post(`/admin/user/${id}`, data);
}

export function deleteUser(id) {
  return axios.post(`/admin/user/${id}/delete`);
}

export function updateUserStatus(id, status) {
  return axios.post(`/admin/user/${id}/update_status`, {
    status,
  });
}
