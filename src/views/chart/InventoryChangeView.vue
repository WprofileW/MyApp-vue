<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { getInventoryChangeLimitFiveService } from '@/api/chart.js'

onMounted(() => {
  barChart()
})

async function barChart() {
  let response = await getInventoryChangeLimitFiveService()
  let data = response.data
  // 整理数据，按照时间戳和产品进行分组
  var groupedData = {}
  data.forEach(
    (item) => {
      var timestamp = item.timestamp
      var productName = item.productName
      var inventoryChange = item.inventoryChange
      if (!groupedData[timestamp]) {
        groupedData[timestamp] = {}
      }
      if (!groupedData[timestamp][productName]) {
        groupedData[timestamp][productName] = 0
      }
      groupedData[timestamp][productName] += inventoryChange
    })

  // 提取时间戳和产品名称
  var timestamps = Object.keys(groupedData)
  var products = Array.from(new Set(data.map(item => item.productName)))

  // 构造 ECharts 需要的数据格式
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: products.concat(['Total Inventory'])
    },
    xAxis: {
      type: 'category',
      data: timestamps
    },
    yAxis: {
      type: 'value'
    },
    series: []
  }

  // 根据产品名称构造系列数据
  products.forEach(function(product) {
    var seriesData = []
    timestamps.forEach(function(timestamp) {
      seriesData.push(groupedData[timestamp][product] || 0)
    })
    option.series.push({
      name: product,
      type: 'bar',
      data: seriesData
    })
  })

  // 计算每个时间戳的总库存量
  var totalInventory = []
  timestamps.forEach(function(timestamp) {
    var total = 0
    products.forEach(function(product) {
      total += (groupedData[timestamp][product] || 0)
    })
    totalInventory.push(total)
  })
  option.series.push({
    name: 'Total Inventory',
    type: 'line',
    data: totalInventory
  })

  // 初始化 ECharts 实例并绘制图表
  const myChart = echarts.init(document.getElementById('barChart'))
  myChart.setOption(option)
}
</script>
<template>
  <el-space direction="vertical" style="background-color: white">
    <el-card style="width: 50%">
      <el-tag type="info">
        <span>每个时间戳的库存变化</span>
      </el-tag>
      <div id="barChart"></div>
    </el-card>
  </el-space>
</template>

<style scoped>
#barChart {
  width: 1000px;
  height: 400px;
  background-color: white;
  border: 1px solid #ddd;
  margin: auto;
}
</style>