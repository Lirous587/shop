import { ref } from "vue";
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
