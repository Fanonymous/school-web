<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata" >
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
      seriesNameArr:[],
    	xValue:[],
      yValue:[],
      seriaName:[],
      zoomShow:false,
      start:100,
      end:0,
      dataViewShow:false,
      yAxis:[{type: 'bar',
	            name: '',
	            min: 0,
	            max: 100,
	            interval: 1,
	            axisLabel:''}],
	    isLegend:false,
	    yAxisLine:false,
      xAxisLine:false,
    }
  },
  watch: {
    series (val) {
    	console.log(val)
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.seriaName = val.seriaName
      this.yAxis = val.yAxis
      this.initChart()
    }
  },
  activated () {
  	if (!this.chart) {
      return
    }
		this.chart.resize()
  },
  beforeDestroy() {
//  if (!this.chart) {
//    return
//  }
//  this.chart.dispose()
//  this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id),'macarons-screen')
      let seriesTemp = []
      let xAxisTemp = []
      if(this.yValue[0].length>20){
      	this.start = 100
      	this.end = 70
      	this.zoomShow = true
      	this.dataViewShow = true
      	
      }else{
      	this.start = 0
      	this.end = 100
      }
			if(this.seriaName.length >0 && this.xValue.length > 0){
	      for(let i in this.seriaName){
	      	seriesTemp.push({
		        name: this.seriaName[i],
		        type: 'bar',
		        barMaxWidth:25,
		        yAxisIndex: parseInt(i),
		        data: this.yValue[i],
		        itemStyle: {
		            normal: {
		                barBorderRadius: 0,
		                color: {
		                	colorStops: [{
	                        offset: 0,
	                        color: '#0071da' // 0% 处的颜色
	                    }, {
	                        offset: 1,
	                        color: '#46d0fa' // 100% 处的颜色
	                    }]
		                }
		            },
		        }
		       
				  })
	      	
	      	xAxisTemp.push({
	      		show:false,
		        type: 'value',
		        name: this.yAxis[i].name,
		        min: this.yAxis[i].min,
		        max: this.yAxis[i].max,
		        interval: this.yAxis[i].interval,
		        axisLabel: {
		        	show:true,
		          formatter: '{value} '+this.yAxis[i].axisLabel
		        }
	      	})
	      }
      }
      if(seriesTemp.length ==0){
      	seriesTemp = [{
      		name:'',
	        type: 'bar',
	        data: []
	    	}]
      	xAxisTemp= [{
	        type: 'value',
	        show:false
      	}]
      }
      console.log(xAxisTemp)
			if(this.seriaName.length >1){
				this.isLegend = true
			}
      this.chart.setOption({
        title: {
		        text: this.title
		    },
		    tooltip: {
//		        trigger: 'axis',
//		        axisPointer: {
//		            type: 'shadow'
//		        }
		    },
		    toolbox: {
		    	show:false,
		        feature: {
			          dataView: {show: this.dataViewShow, readOnly: true,
			          	textareaBorderColor:'#c8c8c8',
			          	buttonColor: '#30b8ac'
			          },
		            saveAsImage: {show: true}
		        }
		    },
		    grid: {
		    	top: '10%',
		        left: '3%',
		        right: '5%',
		        bottom: '10%',
		        containLabel: true,
		        borderColor: '#eee'
		    },
		    legend: {
		    		show:this.isLegend,
		    	  bottom: 0,
            left: 'center',
		        data:this.seriaName
		    },
		    xAxis: xAxisTemp,
		    yAxis: {
		    	  axisLine:{
			        show:this.yAxisLine,         
			      }, 
		        type: 'category',
		        data: this.xValue
		    },
		  	dataZoom: [
          {
            type: 'slider',
            show: this.zoomShow,
            yAxisIndex: [0],
            left: '90%',
            start: this.start,
            end: this.end
          }
        ],
		    series: seriesTemp
        })
      //window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
