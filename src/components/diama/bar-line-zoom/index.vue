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
    themeColor:{
    	type: Number,
    	default: 1
    },
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
      xAxisLine:false
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
    	var colorPalette=[]
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
        // seriesTemp = [{
        //   markLine: {
        //     silent: true,
        //     symbolSize:0,
        //     data: [{
        //         yAxis: 10
        //     }],
        //     label:{
        //       show:true,
        //       position: 'middle',
        //       formatter: '带宽达标线'
        //     },
        //     lineStyle: {
        //       color:'#FF6773',
        //       type:'dash'
        //     }
        //   }
        // }]


	      for(let i in this.seriaName){
	      	seriesTemp.push({
		        name: this.seriaName[i],
		        type: this.seriaType[i],
		        barMaxWidth:15,
		        yAxisIndex: parseInt(i),
		        data: this.yValue[i],
            symbol: 'circle',
            symbolSize: 7,
            itemStyle: {
                normal: {
                    // borderColor: '#33D9FB',//边框颜色
                    // borderWidth: 1//边框宽度
                }
            },
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
        this.xAxisLine= false
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
	            formatter: '{value} '
	        },
	        axisLine:{
			        show:false,
			    }
      	}]
      }
      //大屏主题
      if(this.xValue.length > 0) {
        this.xAxisLine = true
      }
				if(this.isscreen){
					this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')

          
          let color1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          let color2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#00EAFF'}, {offset: 1,color: '#0B093F'}])
          let color3 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#A859FF'}, {offset: 1,color: '#0B093F'}])
          let color4 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          let color5 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          let color6 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          let color7 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          let color8 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
          //themeColor默认1
          //themeColor渐变2  蓝色主题
          //themeColor渐变3  绿色
          if(this.themeColor == 1){
            colorPalette = ['#2ee6c8','#006cd1','#bc4bd1','#00c1ff','#fffc00','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
          }else if(this.themeColor == 2){
            colorPalette = [color1,color2]
          }else if(this.themeColor == 3){
            colorPalette = [color2,color3]
          }else if(this.themeColor == 4){
            colorPalette = ['#FF9745',color1]
          }else if(this.themeColor == 5){
            colorPalette = [color1,'#F5CD32']
          }else if(this.themeColor == 6){
            colorPalette = [color2,'#F5CD32']
          }else{
            colorPalette = [color3,color1]
          }

					legendData = {
						show: isLegend,
						top: 10,
						left: 'center',
						data: this.seriaName,
            itemHeight: 12,
            itemWidth: 12
					}
				}else{
					this.chart = echarts.init(document.getElementById(this.id), 'macarons')
					colorPalette = ["#41cac0","#00b1f3"]
					legendData= {
						show: isLegend,
						bottom: 12,
						left: 'center',
						data: this.seriaName,
            itemHeight: 12,
            itemWidth: 12
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
			        // axisPointer: {
			        //     type: 'cross',
			        //     crossStyle: {
			        //         color: '#999'
			        //     }
			        // },
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
			          saveAsImage: {show: true}
			        }
			    },
          grid: {
            right:'4%',
          	bottom: '5%'
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
			                rotate:'40',
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
      this.chart.setOption(option,true)
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}


</script>
