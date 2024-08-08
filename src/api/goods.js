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

export function ifCheckGoods(id, status) {
  return axios.post(`/admin/goods/${id}/check`, {
    ischeck: status,
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

export function recoverGoods(ids) {
  return axios.post(`/admin/goods/restore`, {
    ids,
  });
}

export function destroyGoods(ids) {
  return axios.post(`/admin/goods/destroy`, {
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

export function setGoodsSku(id, data) {
  return axios.post(`/admin/goods/updateskus/${id}`, data);
}

export function addGoodsSkuCard(data) {
  return axios.post("/admin/goods_skus_card", data);
}

export function updateGoodsSkuCard(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}`, data);
}

export function deleteGoodsSkuCard(id) {
  return axios.post(`/admin/goods_skus_card/${id}/delete`);
}

export function sortGoodsSkuCard(sortdata) {
  return axios.post("/admin/goods_skus_card/sort", {
    sortdata,
  });
}

export function addGoodsSkuCardValue(data) {
  return axios.post("/admin/goods_skus_card_value", data);
}

export function updateGoodsSkuCardValue(id, data) {
  return axios.post(`/admin/goods_skus_card_value/${id}`, data);
}

export function deleteGoodsSkuCardValue(id) {
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`);
}

export function setGoodsSkuCardAndValue(id, data) {
  return axios.post(`/admin/goods_skus_card/${id}/set`, data);
}
