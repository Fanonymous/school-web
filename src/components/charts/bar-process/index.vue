<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img-small" v-if="xValue.length ==0">
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
		        barMaxWidth:30,
		        yAxisIndex: parseInt(i),
		        data: this.yValue[i]
				  })
	      	
	      	xAxisTemp.push({
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
      console.log(this.xValue)
			if(this.seriaName.length >1){
				this.isLegend = true
			}
			var data = [70, 34, 60]
var titlename = ['太原市民政局', '太原市运输局', '太原市残联'];
var valdata = [683, 234, 234]
var myColor = [{colorStops: [{
                            offset: 0,
                            color: '#39A7FC' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: '#00FBFF' // 100% 处的颜色
                        }]}, '#F57474', '#56D0E3', '#F8B448', '#8B78F6'];
      let  dataBorder = new Array()
      for(let i in this.xValue){
      	dataBorder.push(100)
      }
      this.chart.setOption({
        title: {
        	show:true,
		        text: this.title
		    },
		    xAxis: {
		        show: false
		    },
		    grid: {
		    	top: '20px',
		        left: '0',
		        right: '20px',
		        bottom: '10px',
		        containLabel: true,
		        borderColor: '#eee'
		    },
		    yAxis: [{
		        show: true,
		        data: this.xValue,
		        inverse: true,
		        axisLine: {
		            show: false
		        },
		        splitLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
//		            color: '#fff',
//		            formatter: function(value, index) {
//		                return [
//		                    '{lg|' + (index + 1) + '}' + '{title|' + value + '} '
//		                ].join('\n')
//		            },
//		            rich: {
//		                lg: {
//		                    backgroundColor: '#339911',
//		                    color: '#fff',
//		                    borderRadius: 15,
//		                    // padding: 5,
//		                    align: 'center',
//		                    width: 15,
//		                    height: 15
//		                },
//		            }
		        }
		
		
		    }, {
		        show: true,
		        inverse: true,
		        data: this.yValue,
		        axisLabel: {
		            textStyle: {
		                fontSize: 12,
		                color: '#fff',
		            },
		            formatter: '{value} %'
		        },
		        axisLine: {
		            show: false
		        },
		        splitLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		
		    }],
		    series: [{
		        name: '条',
		        type: 'bar',
		        yAxisIndex: 0,
		        data: this.yValue,
		        barWidth: 15,
		        itemStyle: {
		            normal: {
		                barBorderRadius: 15,
		                color: function(params) {
		                    var num = myColor.length;
		                    return myColor[0]
		                },
		            }
		        },
		        label: {
		            normal: {
		                show: true,
		                position: 'right',
		                formatter: '{c}%'
		            }
		        },
		    }, {
		        name: '框',
		        type: 'bar',
		        yAxisIndex: 1,
		        barGap: '-100%',
		        data: dataBorder,
		        barWidth: 20,
		        itemStyle: {
		            normal: {
		                color: 'none',
		                borderColor: '#00c1de',
		                borderWidth: 1,
		                barBorderRadius: 15,
		            }
		        }
		    }]
        })
      //window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
