import { ref, nextTick } from "vue";
import {
  addGoodsSkuCard,
  updateGoodsSkuCard,
  deleteGoodsSkuCard,
  sortGoodsSkuCard,
  addGoodsSkuCardValue,
  updateGoodsSkuCardValue,
  deleteGoodsSkuCardValue,
  setGoodsSkuCardAndValue,
} from "~/api/goods.js";

import { toast, useArrMoveUp, useArrMoveDown } from "~/composables/util.js";

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
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref(null);

  const handleClose = (tag) => {
    loading.value = true;
    deleteGoodsSkuCardValue(tag.id)
      .then(() => {
        let i = item.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  const handleInputConfirm = () => {
    if (!inputValue.value) {
      inputVisible.value = false;
      return;
    }

    loading.value = true;
    addGoodsSkuCardValue({
      goods_skus_card_id: id,
      name: item.name,
      order: 50,
      value: inputValue.value,
    })
      .then((res) => {
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
      })
      .finally(() => {
        inputValue.value = "";
        inputVisible.value = false;
        loading.value = false;
      });
  };

  const handelChange = (value, tag) => {
    loading.value = true;

    updateGoodsSkuCardValue(tag.id, {
      goods_skus_card_id: id,
      name: item.name,
      order: item.order,
      value: value,
    })
      .then((res) => {
        tag.value = value;
      })
      .catch(() => {
        tag.text = tag.value;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    loading,
    handelChange,
  };
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
      const i = sku_cart_list.value.findIndex((o) => o.id === item.id);
      if (i != -1) {
        sku_cart_list.value.splice(i, 1);
        toast("删除商品该规格成功");
      }
    })
    .finally(() => {
      item.loading = false;
    });
}

export const bodyLoading = ref(false);

export function sortCard(index, action) {
  const func = action === "up" ? useArrMoveUp : useArrMoveDown;
  const oList = JSON.parse(JSON.stringify(sku_cart_list.value));
  func(oList, index);
  const sortData = oList.map((o, i) => {
    return {
      id: o.id,
      order: i + 1,
    };
  });

  bodyLoading.value = true;
  sortGoodsSkuCard(sortData)
    .then(() => {
      func(sku_cart_list.value, index);
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

export function handelSetGoodsSkuCardAndValue(id, data) {
  setGoodsSkuCardAndValue(id, data).then((res) => {
    toast("设置成功");
  });
}
