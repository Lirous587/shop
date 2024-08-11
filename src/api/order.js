import axios from "~/axios";
import { queryToUrl } from "~/composables/util";

export function getOrderList(page, query = {}) {
  let r = queryToUrl(query);
  return axios.get(`/admin/order/${page}${r}`);
}

export function deleteOrder(ids) {
  return axios.post(`/admin/order/delete_all`, {
    ids,
  });
}
