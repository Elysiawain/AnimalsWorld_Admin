<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import {getAnimalClassificationApi, getAnimalListApi} from "@/api/Animals";
import {useAnimalStore} from "@/stores/animal";

onMounted(() => {
  initChart_1()
  initChart_2()
  initChart_3()
  initChart_4()
})

const initChart_1 = () => {
  const chartDom = document.querySelector('#charts-1');
  const myChart = echarts.init(chartDom as HTMLDivElement);
  const animalCountList = ref([120, 200, 150, 80, 70, 110]);
  let option;
  option = {
    xAxis: {
      type: 'category',
      data: ['昨日新增', '本周新增', '本月新增', '总数据', '用户总上传', '官方上传']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: animalCountList.value,
        type: 'bar'
      }
    ]
  };
  option && myChart.setOption(option);
}
const initChart_2 = () => {

  type EChartsOption = echarts.EChartsOption;
  let currentDate = new Date();
  let recentSevenDays: string[] = [];

  for (let i = 0; i < 7; i++) {
    let date = new Date();
    date.setDate(currentDate.getDate() - i);
    let month = date.getMonth() + 1; // 月号从0开始，所以要加1
    let day = date.getDate();
    let formattedDate = month + "月" + day + "号";
    recentSevenDays.push(formattedDate);
  }
  const chartDom = document.querySelector('#charts-2')!;
  const myChart = echarts.init(chartDom as HTMLDivElement);
  let option: EChartsOption;

  option = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: recentSevenDays
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: recentSevenDays
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
    ]
  };
  option && myChart.setOption(option);
}
const animalStore = useAnimalStore();
const initChart_3 = async () => {
  const chartDom = document.querySelector('#charts-3');
  const myChart = echarts.init(chartDom as HTMLDivElement);
  let option;
  let list: { name: string, value: number }[]
  const res = await getAnimalClassificationApi()
  animalStore.category = res.data.classificationList
  list = animalStore.category.map((item) => {
    return {
      name: item.name,
      value: Math.floor(Math.random() * (3000 - 100 + 1)) + 100
    }
  })
  list.sort((a, b) => b.value - a.value)
  console.log(list)
  option = {
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 250],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: list
      }
    ]
  };

  option && myChart.setOption(option);

}
const initChart_4 = async () => {
  const res = await getAnimalListApi(1, 10, 1, '', 1)
  const nameList = res.data.data.map((item) => {
    return item.name
  })
  const countList = res.data.data.map(item => {
    return Math.floor(Math.random() * (3000 - 100 + 1)) + 100
  })
  const chartDom = document.querySelector('#charts-4');
  const myChart = echarts.init(chartDom as HTMLDivElement);
  let option;
  option = {
    xAxis: {
      type: 'category',
      data: nameList
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: countList,
        type: 'bar'
      }
    ]
  };
  option && myChart.setOption(option);
}
</script>

<template>
  <div class="container">
    <div class="charts">
      <div id="charts-1" class="charts-main "></div>
      <h4>动物数据新增统计</h4>
    </div>
    <div class="charts">
      <div id="charts-2" class="charts-main"></div>
      <h4>用户数据增长统计</h4>
    </div>
    <div class="charts">
      <div id="charts-4" class="charts-main"></div>
      <h4>动物热门排行</h4>
    </div>
    <div class="charts">
      <div class="charts-main" style="scale: .7">
        <div id="charts-3" style="width: 100%;height: 550px"></div>
        <h4 style="text-align: center;scale: 1.3;padding: 10px 0">动物分类统计</h4>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  row-gap: 60px;
}

.charts {
  width: 48%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.charts-main {
  flex: 1;
  width: 100%;
  min-height: 300px;
}
</style>