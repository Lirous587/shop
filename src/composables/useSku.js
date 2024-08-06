import { ref, nextTick, computed } from "vue";
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

import {
  toast,
  useArrMoveUp,
  useArrMoveDown,
  cartesianProductOf,
} from "~/composables/util.js";

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
  getTableData();
  sku_list.value = data.goodsSkus;
}

export function initSkuCardItem(id) {
  const item = sku_cart_list.value.find((o) => o.id == id);
  const loading = ref(false);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref(null);

  const handleClose = (tag) => {
    loading.value = true;
    tableLoading.value = true;

    deleteGoodsSkuCardValue(tag.id)
      .then(() => {
        let i = item.goodsSkusCardValue.findIndex((o) => o.id === tag.id);
        if (i != -1) {
          item.goodsSkusCardValue.splice(i, 1);
        }
        getTableData();
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
    tableLoading.value = true;

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
        getTableData();
      })
      .finally(() => {
        inputValue.value = "";
        inputVisible.value = false;
        loading.value = false;
      });
  };

  const handelChange = (value, tag) => {
    loading.value = true;
    tableLoading.value = true;

    updateGoodsSkuCardValue(tag.id, {
      goods_skus_card_id: id,
      name: item.name,
      order: item.order,
      value: value,
    })
      .then((res) => {
        tag.value = value;
        getTableData();
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
  tableLoading.value = true;

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
      getTableData();
    })
    .finally(() => {
      btnLoading.value = false;
    });
}

export function updateGoodsSkuCardEvent(item) {
  item.loading = true;
  tableLoading.value = true;

  updateGoodsSkuCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: item.type,
  })
    .then((res) => {
      item.name = item.text;
      getTableData();
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
  tableLoading.value = true;

  deleteGoodsSkuCard(item.id)
    .then(() => {
      const i = sku_cart_list.value.findIndex((o) => o.id === item.id);
      if (i != -1) {
        sku_cart_list.value.splice(i, 1);
        toast("删除商品该规格成功");
      }
      getTableData();
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
  tableLoading.value = true;
  sortGoodsSkuCard(sortData)
    .then(() => {
      func(sku_cart_list.value, index);
      getTableData();
    })
    .finally(() => {
      bodyLoading.value = false;
    });
}

export function handelSetGoodsSkuCardAndValue(id, data) {
  let item = sku_cart_list.value.find((o) => o.id == id);

  item.loading = true;
  tableLoading.value = true;

  setGoodsSkuCardAndValue(id, data)
    .then((res) => {
      item.name = item.text = res.goods_skus_card.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((o) => {
        o.text = o.value || "属性值";
        return o;
      });
      getTableData();
      toast("设置成功");
    })
    .finally(() => {
      item.loading = false;
    });
}

export const sku_list = ref([]);
export const tableLoading = ref(false);
export function initSkuTable() {
  const skuLabels = computed(() =>
    sku_cart_list.value.filter((v) => v.goodsSkusCardValue.length > 0)
  );

  const tableThs = computed(() => {
    let length = skuLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        width: "",
        rowspan: length > 0 ? 2 : 1,
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });

  return {
    skuLabels,
    tableThs,
    sku_list,
    tableLoading,
  };
}

export function getTableData() {
  if (sku_cart_list.value.length === 0) return [];

  let list = [];

  sku_cart_list.value.forEach((o) => {
    if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
      list.push(o.goodsSkusCardValue);
    }
  });

  if (list.length === 0) {
    return [];
  }

  let arr = cartesianProductOf(...list);

  // 获取之前的规格列表，将规格ID排序之后转换未字符串
  let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map((o) => {
    if (!Array.isArray(o.skus)) {
      o.skus = Object.keys(o.skus).map((k) => o.skus[k]);
    }
    // 为多规格选项生成唯一编码
    o.skusId = o.skus
      .sort((a, b) => a.id - b.id)
      .map((s) => s.id)
      .join(",");
    return o;
  });

  sku_list.value = [];
  sku_list.value = arr.map((skus) => {
    let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList);
    return {
      code: o?.code || "",
      cprice: o?.cprice || "0.00",
      goods_id: goodsId.value,
      image: o?.image || "",
      oprice: o?.oprice || "0.00",
      pprice: o?.pprice || "0.00",
      skus,
      stock: o?.stock || 0,
      volume: o?.volume || 0,
      weight: o?.weight || 0,
    };
  });
  tableLoading.value = false;
}

function getBeforeSkuItem(skus, beforeSkuList) {
  let skusId = skus
    .sort((a, b) => a.id - b.id)
    .map((s) => s.id)
    .join(",");
  return beforeSkuList.find((o) => {
    // 从大的里面找小的 --> 找到概率更高 优化算法
    if (skus.length > o.skus.length) {
      return skusId.indexOf(o.skusId) != -1;
    }
    return o.skusId.indexOf(skusId) != -1;
  });
}
