<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img">
	  	<img src="~@/assets/img/nodata.png" class="nodata" v-if="xValue.length ==0" >
	  </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    height: {
      type: String,
      default: '350px'
    },
    title:{
    	type: String,
      default: ''
    },
    series:{
    	type: Object,
    	default: {}
    }
  },
  data() {
    return {
      chart: null,
      xValue:[],
      yValue:[]
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id),'macarons')
      this.chart.setOption(
        {
          title: {
			        text: this.title
			    },
			    tooltip: {
			        trigger: 'axis',
			        axisPointer: {
			            type: 'cross',
			            crossStyle: {
			                color: '#999'
			            }
			        }
			    },
			    toolbox: {
			        feature: {
			            dataView: {show: true, readOnly: false},
			            saveAsImage: {show: true}
			        }
			    },
			    legend: {
			        data:['蒸发量','降水量','平均温度']
			    },
			    xAxis: [
			        {
			            type: 'category',
			            data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			            axisPointer: {
			                type: 'shadow'
			            }
			        }
			    ],
			    yAxis: [
			        {
			            type: 'value',
			            name: '水量',
			            min: 0,
			            max: 250,
			            interval: 50,
			            axisLabel: {
			                formatter: '{value} ml'
			            }
			        },
			        {
			            type: 'value',
			            name: '温度',
			            min: 0,
			            max: 25,
			            interval: 5,
			            axisLabel: {
			                formatter: '{value} °C'
			            }
			        }
			    ],
			    series: [
			        {
			            name:'蒸发量',
			            type:'bar',
			            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
			        },
			        {
			            name:'降水量',
			            type:'bar',
			            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
			        },
			        {
			            name:'平均温度',
			            type:'line',
			            yAxisIndex: 1,
			            data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
			        }
			    ]
        })
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
