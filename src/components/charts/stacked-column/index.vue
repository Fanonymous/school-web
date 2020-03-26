<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}" ></div>
	  <div class="chart-box-img" v-if="xValue.length ==0" :style="'top:'+topPosistion">
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
    	topPosistion:'100px',
      chart: null,
      xValue:[],
      yValue:[],
      seriaName:[],
      yAxis:[],
      xAxis:[]
    }
  },
  watch:{
    series (val){
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.seriaName = val.seriaName
      this.xAxis = val.xAxis
      this.yAxis = val.yAxis
      setTimeout(()=>{
	  		this.initChart()
	  	})
    }
  },
  mounted() {
  	this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
  	setTimeout(()=>{
  		this.initChart()
  	})
    
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
    	let toolBox = true
    	if(this.isscreen){
    		toolBox = false
					this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
			}else{
				this.chart = echarts.init(document.getElementById(this.id),'macarons')
			}
    	this.chart.resize();
    	let seriesTemp = []
    	let isLegend = false
    	let isShowLine = false
    	let yAxisArr = this.yAxis
			if(this.xValue.length > 0) {
				for(let i in this.seriaName) {
					seriesTemp.push({
						name: this.seriaName[i],
						type:'bar',
            stack: '总量',
            barMaxWidth: 30,
						areaStyle: {normal: {}},
            data:this.yValue[i]
					})
				}
				isShowLine = true
			}
			if(this.seriaName.length>1){
				isLegend = true
			}else{
				isLegend = false
			}
    	let legendData = {
					show: isLegend,
					top: 15,
					right:50,
					data: this.seriaName
				}

      this.chart.setOption(
        {
          title: {
			        text: this.title
			    },
			    legend: legendData,
			    toolbox: {
			    	right:20,
			    	show:toolBox,
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    tooltip: {
			    	formatter:function(params){
			    		
			        	return params.name+'<br />'+params.seriesName+': '+params.value+yAxisArr[0].tipLabel
			        }
			    },
			    xAxis: {
			        type: 'category',
			        data: this.xValue,
			        axisLabel:{
	                rotate:'30',
	                formatter: function(value){
	                	//X轴是否截取字符串 日期不截取
	                	let tempVal = value
	                	if(value.indexOf('-')>-1){
	                		tempVal = value
	                	}else{
	                		if(value.length >5){
	                			tempVal = value.substr(0,5)+'...'
	                		}
	                	}
	                	return tempVal;
	                }
	            },
			        axisLine:{
							     show:isShowLine      
							}
			    },
			    yAxis: {
			        type: 'value',
			        name: this.yAxis[0].name,
			        axisLine:{
							     show:isShowLine      
							}
			    },
			    series: seriesTemp
        })
      this.chart.resize();
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
