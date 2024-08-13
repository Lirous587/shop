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

export function exportOrderToExcel(query = {}) {
  let r = queryToUrl(query);
  return axios.post(
    `/admin/order/excelexport${r}`,
    {},
    {
      responseType: "blob",
    }
  );
}

export function getShipInfo(id) {
  return axios.get(`/admin/order/${id}/get_ship_info`);
}
