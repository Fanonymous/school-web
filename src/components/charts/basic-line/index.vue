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
  watch: {
    series (val) {
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.initChart()
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
      const xAxisData = []
      const data = []
      const data2 = []
      for (let i = 0; i < 50; i++) {
        xAxisData.push(i)
        data.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5)
        data2.push((Math.sin(i / 5) * (i / 5 + 10) + i / 6) * 3)
      }
      this.chart.setOption(
        {
        	title: {
		        text: this.title
		    	},
          xAxis: [{
            show: false,
            data: xAxisData
          }, {
            show: false,
            data: xAxisData
          }],
          visualMap: {
            show: false,
            min: 0,
            max: 50,
            dimension: 0,
            inRange: {
              color: ['#4a657a', '#308e92', '#b1cfa5', '#f5d69f', '#f5898b', '#ef5055']
            }
          },
          yAxis: {
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#4a657a'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#08263f'
              }
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            name: 'back',
            type: 'bar',
            data: data2,
            z: 1,
            itemStyle: {
              normal: {
                opacity: 0.4,
                barBorderRadius: 5,
                shadowBlur: 3,
                shadowColor: '#111'
              }
            }
          }, {
            name: 'Simulate Shadow',
            type: 'line',
            data,
            z: 2,
            showSymbol: false,
            animationDelay: 0,
            animationEasing: 'linear',
            animationDuration: 1200,
            lineStyle: {
              normal: {
                color: 'transparent'
              }
            },
            areaStyle: {
              normal: {
                color: '#08263a',
                shadowBlur: 50,
                shadowColor: '#000'
              }
            }
          }, {
            name: 'front',
            type: 'bar',
            data,
            xAxisIndex: 1,
            z: 3,
            itemStyle: {
              normal: {
                barBorderRadius: 5
              }
            }
          }],
          animationEasing: 'elasticOut',
          animationEasingUpdate: 'elasticOut',
          animationDelay(idx) {
            return idx * 20
          },
          animationDelayUpdate(idx) {
            return idx * 20
          }
        })
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
