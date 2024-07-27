import { ref } from "vue";
import { addGoodsSkuCard, updateGoodsSkuCard } from "~/api/goods.js";

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

export function updateSkuCardEvent(row) {
  row.loading = true;
  updateGoodsSkuCard(row.id, {
    goods_id: row.goods_id,
    name: row.text,
    order: row.order,
    type: row.type,
  })
    .then((res) => {
      row.name = row.text;
    })
    .catch(() => {
      row.text = row.name;
    })
    .finally(() => {
      row.loading = false;
    });
}
