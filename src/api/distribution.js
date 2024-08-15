import axios from "~/axios.js";
import { queryToUrl } from "~/composables/util";

export function getStatisticsData() {
  return axios.get("/admin/agent/statistics");
}

export function getAgentData(page, query = {}) {
  let r = queryToUrl(query);
  return axios.get(`/admin/agent/${page}${r}`);
}

export function getOrderData(page, query = {}) {
  let r = queryToUrl(query);
  return axios.get(`/admin/user_bill/${page}${r}`);
}
