<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import { getTopThreeSaleService } from '@/api/chart.js'

onMounted(() => {
  pieChart()
})

function formatJavaTimestamp(javaTimestamp) {
  const year = javaTimestamp.substring(0, 4)
  const month = javaTimestamp.substring(4, 6) - 1 // JavaScript的月份从0开始
  const day = javaTimestamp.substring(6, 8)
  const hour = javaTimestamp.substring(8, 10)
  const minute = javaTimestamp.substring(10, 12)
  const jsTimestamp = new Date(year, month, day, hour, minute)

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai'
  }

  return jsTimestamp.toLocaleString('zh-CN', options)
}

async function pieChart() {

  const response = await getTopThreeSaleService()
// 模拟数据
  const inputData = response.data
// 将数据按时间戳进行分组
  const groupedData = inputData.reduce((acc, obj) => {
    const timestamp = obj.timestamp
    if (!acc.has(timestamp)) {
      acc.set(timestamp, new Map())
    }
    const salesMap = acc.get(timestamp)
    salesMap.set(obj.productName, obj.totalSales)
    return acc
  }, new Map())

// 创建 ECharts 实例
  groupedData.forEach((sales, timestamp) => {

    const formatTime = formatJavaTimestamp(timestamp.toString())
    const div = document.createElement('div')
    div.setAttribute('id', `chart-${timestamp}`)
    div.style.width = '500px'
    div.style.height = '300px'
    document.getElementById('pieChart').appendChild(div)

    const myChart = echarts.init(div)

    // 配置项
    const option = {
      title: {
        text: `Top 3 Products by Timestamp ${formatTime}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside'
        },
        labelLine: {
          length: 20,
          length2: 10
        },
        data: Array.from(sales.entries())
          .sort((a, b) => b[1] - a[1]) // 按销售额降序排序
          .slice(0, 3) // 取前三个产品
          .map(entry => ({ name: entry[0], value: entry[1] }))
      }]
    }

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option)
  })

}


</script>

<template>
  <el-space direction="vertical" style="background-color: white">
    <el-card style="width: 50%">
      <el-tag type="info">
        <span>每个时间戳的销售额前三</span>
      </el-tag>
      <div id="pieChart"></div>
    </el-card>

  </el-space>

</template>

<style scoped>
#pieChart {
  display: flex; flex-wrap: wrap;
  background-color: white;
  border: 1px solid #ddd;
  margin: auto;
}
</style>