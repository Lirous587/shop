import { ref } from "vue";
import {
  addGoodsSkuCard,
  updateGoodsSkuCard,
  deleteGoodsSkuCard,
} from "~/api/goods.js";

import { toast } from "~/composables/util.js";

export const goodsId = ref(0);

export const sku_cart_list = ref([]);

export function initSkuCardList(data) {
  sku_cart_list.value = data.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
}

export function initSkuCardItem(id) {
  const item = sku_cart_list.value.find((o) => o.id == id);
  return { item };
}

export const btnLoading = ref(false);

export function addGoodsSkuCardEvent() {
  btnLoading.value = true;
  addGoodsSkuCard({
    goods_id: goodsId.value,
    name: "规格名称",
    order: 50,
    type: 0,
  })
    .then((res) => {
      sku_cart_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

export function updateGoodsSkuCardEvent(item) {
  item.loading = true;
  updateGoodsSkuCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: item.type,
  })
    .then((res) => {
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

export function deleteGoodsSkuCardEvent(item) {
  item.loading = true;
  deleteGoodsSkuCard(item.id)
    .then(() => {
      const i = sku_cart_list.value.find((o) => o.id == item.id);
      sku_cart_list.value.splice(i, 1);
      toast("删除商品该规格成功");
    })
    .finally(() => {
      item.loading = false;
    });
}
