<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
	  	<img v-if="isscreen == true" src="~@/assets/img/screen-no.png"  class="nodata-s">
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata" >
	  </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { newline} from '@/utils/common'
export default {
  props: {
  	isscreen:{
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
      seriaType:[],
      zoomShow:false,
      dataViewShow:false,
      yAxis:[{type: '',
	            name: '',
	            min: 0,
	            max: 100,
	            interval: 1,
	            axisLabel:''}],
	    yAxisLine:false,
      xAxisLine:false,
      tipLabel:[]
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.seriaName = val.seriaName
      this.seriaType = val.seriaType
      this.yAxis = val.yAxis
      this.tipLabel = val.tipLabel
      this.initChart()
    }
  },
  mounted() {
  	this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px'; 
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
    	var colorPalette=[]
      let seriesTemp = []
      let yAxisTemp = []
      let legendData={}
      let isLegend = true
      let dataZoomEnd = 100
      let yAxisArr = this.yAxis
      let tipLabelArr = this.tipLabel
      if(this.yValue.length>10){
      	this.zoomShow = true
      	this.dataViewShow = true
      	dataZoomEnd = 60
      }
      if(this.xValue.length >0){
      	if(this.xValue.length>20){
      		 	this.zoomShow = true
      		 	dataZoomEnd = 60
      	}
      	this.xAxisLine = true
	      for(let i in this.seriaName){
	      	seriesTemp.push({
		        name: this.seriaName[i],
		        type: this.seriaType[i],
		        barMaxWidth:30,
		        yAxisIndex: this.seriaType[i] == 'line' ?1:0,
		        data: this.yValue[i]
				  })
	      }
        for(let j in this.yAxis){
          yAxisTemp.push({
            type: 'value',
            name: this.yAxis[j].name,
            min: this.yAxis[j].min,
            max: this.yAxis[j].max,
            interval: this.yAxis[j].interval,
            axisLabel: {
              show:true,
                formatter: '{value} '+this.yAxis[j].axisLabel
            },
            axisLine:{
              show:true
            }
          })
        }
      }
      if(seriesTemp.length ==0){
      	this.xAxisLine = false
      	seriesTemp = [{
      		name:'',
	        type: 'bar',
	        data: []
	    	}]
      	yAxisTemp= [{
      		
	        type: 'value',
	        name: '',
	        interval: 10,
	        axisLabel: {
	        	show:false,
	            formatter: '{value} '+this.yAxis[0].axisLabel
	        },
	        axisLine:{
			        show:false,         
			    }
      	}]
      }
      //大屏主题
				if(this.isscreen){
					this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
					this.xAxisLine = true
					colorPalette = ['#2ee6c8','#006cd1','#bc4bd1','#00c1ff','#fffc00','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
					legendData = {
						show: isLegend,
						top: 10,
						left: 'right',
						data: this.seriaName
					}
				}else{
					this.chart = echarts.init(document.getElementById(this.id), 'macarons')
					colorPalette = ['#3C85EE','#FEB23A','#8ABE78','#E1BF6C','#F15643','#8386f5','#5e6afc','#3293fc']
					legendData= {
						show: isLegend,
						bottom: 12,
						left: 'center',
						data: this.seriaName
					}
				}
				this.chart.resize();
				let option ={
					color: colorPalette,
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
			        },
			        formatter:function(params){
			        	let str = params[0].name+'<br />'
			        	for(let i in params){
			        		params[i].value = params[i].value == undefined?'-':params[i].value
                  let tipLabel = seriesTemp.length > yAxisTemp.length ? tipLabelArr[i] : yAxisArr[i].name
			        		str+=params[i].seriesName+': '+params[i].value+tipLabel+'<br />'
			        	}
			        	return str
			        }
			    },
			    toolbox: {
			    	  right:20,
			        feature: {
			        	dataView: {show: this.dataViewShow, readOnly: true},
			          saveAsImage: {show: true}
			        }
			    },
			    legend: legendData,
			    xAxis: [
			        {
			            type: 'category',
			            data: this.xValue,
			            nameTextStyle: {
			            	width:'60px',
			            	height:'60px'
			            },
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
			            axisPointer: {
			                type: 'shadow'
			            },
			            axisLine:{
							        show:this.xAxisLine,         
							    },
							    boundaryGap:['5%','5%']
			            
			        }
			    ],
			    yAxis: yAxisTemp,
			    dataZoom: [
	          {	
	          	show: this.zoomShow,
		        bottom: '0',
	            type: 'slider',
	            height: 15,
	            start: 0,
	            end: dataZoomEnd
	          }
	        ],
			    series: seriesTemp
			    
        }
				//option = newline(option, 3, 'xAxis')
//				option = newline(option, 4, 'yAxis')
      this.chart.setOption(option)
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}


</script>
