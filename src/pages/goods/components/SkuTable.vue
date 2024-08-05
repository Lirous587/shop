<template>
  <el-form-item label="规格设置">
    <table class="border" v-loading="tableLoading">
      <thead>
        <tr>
          <th
            v-for="(th, thi) in tableThs"
            class="border"
            :width="th.width"
            :colspan="th.colspan"
            :key="thi"
          >
            {{ th.name }}
          </th>
        </tr>

        <tr>
          <th
            v-for="(label, labeli) in skuLabels"
            class="border"
            :width="label.width"
            :key="labeli"
          >
            {{ label.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sku_list" :key="index">
          <td
            class="border text-center"
            :width="100"
            v-for="(sku, skuI) in item.skus"
            :key="skuI"
          >
            {{ sku.value }}
          </td>
          <td class="border">
            <el-input
              v-model="item.pprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.oprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.cprice"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.stock"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.volume"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.volume"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input
              v-model="item.weight"
              size="small"
              type="number"
            ></el-input>
          </td>
          <td class="border">
            <el-input v-model="item.code" size="small"></el-input>
          </td>
        </tr>
      </tbody>
    </table>
  </el-form-item>
</template>

<script setup>
import { initSkuTable } from "~/composables/useSku";
const { skuLabels, tableThs, sku_list, tableLoading } = initSkuTable();
</script>
