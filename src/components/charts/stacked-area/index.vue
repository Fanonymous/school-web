<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
			<img v-else src="~@/assets/img/nodata.png" class="nodata">
		</div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
  	isscreen: {
			type: Boolean,
			default: false
		},
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
      yValue:[],
      seriaName:[],
      legendData:[],
      yAxis:[],
      xAxis:[]
    }
  },
  watch:{
    series (val){
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.seriaName = val.seriaName
      this.legendData = val.legendData
      this.xAxis = val.xAxis
      this.yAxis = val.yAxis
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
    	this.chart = echarts.init(document.getElementById(this.id),'macarons-screen')
    	
    	let seriesTemp = []
    	let isLegend = false
			if(this.xValue.length > 0) {
				for(let i in this.seriaName) {
					seriesTemp.push({
						name: this.seriaName[i],
						type:'line',
//          stack: '总量',
						areaStyle: {normal: {}},
            data:this.yValue[i]
					})
				}
			}
			if(this.seriaName.length>1){
				isLegend = true
			}else{
				isLegend = false
			}
    	let legendData = {
					show: isLegend,
					top: 10,
					left: 'right',
					data: this.legendData,
				}
      this.chart.setOption(
        {
          title: {
			        text: this.title
			    },
			    legend: legendData,
			    toolbox: {
			    	right:20,
			    	show:false,
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    tooltip: {show:true},
			    grid: {
		        left: '20px',
		        right: '50px',
		        bottom: '25px',
		        containLabel: true
		      },
			    xAxis: {
			        type: 'category',
			        boundaryGap:['8%','5%'],
			        data: this.xValue,
			        name:this.xAxis[0].name
			    },
			    yAxis: {
			        type: 'value',
			        name:this.yAxis[0].name
			    },
			    series: seriesTemp
        })
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
