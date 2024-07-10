<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">订单统计</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="current == item.value"
                        @click="handerlChose(item.value)" type="primary" style="margin-right:8px;">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>

        <div ref="el" id="chart" style="height: 300px; width: 100%;">

        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue"
import * as echarts from 'echarts';
import { getstatistics3 } from "~/api/index.js"
import { useResizeObserver } from '@vueuse/core'

const current = ref("week")
const options =
    [{
        text: "近1月",
        value: "month"
    },
    {
        text: "近1周",
        value: "week"
    },
    {
        text: "近24小时",
        value: "hour"
    }]

const handerlChose = (type) => {
    current.value = type
    getData()
}

const el = ref(null)

let myChart = null

onMounted(() => {
    let chartDom = document.getElementById("chart")
    if (chartDom) {
        myChart = echarts.init(chartDom)
        getData()
    }
})

function getData() {
    myChart.showLoading()
    getstatistics3(current.value)
        .then((res) => {
            let option = {
                xAxis: {
                    type: 'category',
                    data: res.x,
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: res.y,
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        }
                    }
                ]
            };
            myChart.setOption(option)
        }).finally(() => {
            myChart.hideLoading();
        })

}

onBeforeMount(() => {
    if (myChart) {
        echarts.dispose(myChart)
    }
})

useResizeObserver(el, (entries) => {
    myChart.resize()
})
</script>