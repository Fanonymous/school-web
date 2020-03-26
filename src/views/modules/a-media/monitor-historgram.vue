<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
	  	<img v-if="isscreen == true" src="~@/assets/img/screen-no.png"  class="nodata-s">
	  </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { newline} from '@/utils/common'
import { truncate } from 'fs';
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
      default: '680px'
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
        yAxis:[
            {
                type: '',
                name: '',
                min: 0,
                max: 100,
                interval: 1,
                axisLabel:''
            }],
        yAxisLine:false,
		xAxisLine:false, 
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
        this.yValue = val.yValue
        this.seriaName = val.seriaName
        this.seriaType = val.seriaType
        this.yAxis = val.yAxis
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
      let seriesTemp = []
      let yAxisTemp = []
      let legendData={}
      let isLegend = true
      let dataZoomEnd = 100
      let yAxisArr = this.yAxis
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
		        yAxisIndex: parseInt(i),
		        data: this.yValue[i]
				  })
	      	yAxisTemp.push({
		        type: 'value',
		        name: this.yAxis[i].name,
		        min: this.yAxis[i].min,
		        max: this.yAxis[i].max,
		        interval: this.yAxis[i].interval,
		        axisLabel: {
		        	show:true,
		            formatter: '{value} '+this.yAxis[i].axisLabel
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
					legendData = {
						show: isLegend,
						top: 10,
						left: 'right',
						data: this.seriaName
					}
				}else{
					this.chart = echarts.init(document.getElementById(this.id), 'macarons')
					
					legendData= {
						show: isLegend,
						bottom: 5,
						left: 'center',
						data: this.seriaName
					}
				}
				this.chart.resize();
				let option ={
          title: {
			        text: this.title
				},
				grid : {
					top : 70
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
						str+=params[i].seriesName+': '+params[i].value+yAxisArr[i].name+'<br />'
					}
					return str
				}
			},
			    toolbox: {
                    right:20,
                    feature: {
                        dataView: {show: this.dataViewShow, readOnly: true},
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
      this.chart.setOption(option)
      this.chart.off('click')
      this.chart.on('click', params => {
        this.$emit('handClick', params)
      })
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
