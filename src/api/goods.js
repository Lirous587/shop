import axios from "~/axios";
import { queryToUrl } from "~/composables/util";

export function getGoodsList(page, query = {}) {
  let r = queryToUrl(query);
  return axios.get(`/admin/goods/${page}${r}`);
}

export function updateGoodsStatus(ids, status) {
  return axios.post(`/admin/goods/changestatus`, {
    ids,
    status,
  });
}

export function createGoods(data) {
  return axios.post(`/admin/goods`, data);
}

export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}

export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, {
    ids,
  });
}

export function readGoods(id) {
  return axios.get(`/admin/goods/read/${id}`);
}

export function setGoodsBanner(id, banners) {
  return axios.post(`/admin/goods/banners/${id}`, {
    banners,
  });
}

export function setGoodsSkus(id, sku_type, sku_value) {
  return axios.post(`/admin/goods/updateskus/${id}`, {
    sku_type,
    sku_value,
  });
}
