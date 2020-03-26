<template>
  <div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0" :style="'top:'+topPosistion">
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
      default: '160px'
    },
    title:{
    	type: String,
      default: ''
    },
    series:{
    	type: Object,
    	default: {}
    },
    legendType:{
      type:Number,
      default:1
    }
  },
  data() {
    return {
      topPosistion:'100px',
      chart: null,
      xValue:[],
      yValue:[],
      seriaName:[],
      yAxis:[{max:100}]
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
	    this.yValue = val.yValue
	    this.seriaName = val.seriaName
	    this.yAxis = [{max:100,tipLabel:'%'}]
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
      this.chart
      let radarColor ='#333333'
      //大屏主题
			if(this.isscreen){
				this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
				radarColor ='#bedbff'
			}else{
				this.chart = echarts.init(document.getElementById(this.id), 'macarons')
				radarColor ='#333333'

			}
			let seriesTemp = []
      let xValueTemp = []
      for(let i in this.seriaName){
      	seriesTemp.push({
		        name: this.seriaName[i],
		        value: this.yValue[i]
			  })
      }
      for(let i in this.xValue){
      	xValueTemp.push({name:this.xValue[i],max:10})
      }
      let legendData = {
        show:this.seriaName.length ==1?false:true,
        orient: 'vertical',
        icon: 'circle',
        //						x: 'right',
        y: 40,
        right: "5%",
        data: this.seriaName
      }
      if(this.legendType ==2){
        //图例展示图在下面
        legendData = {
          show:this.seriaName.length ==1?false:true,
          orient: 'vertical',
          icon: 'circle',
          right:5,
          top: 5,
          data: this.seriaName
        }
      }
      this.chart.setOption(
        {
          title: {
			        text: this.title
			    },
          // grid: {
          //   top:'5%',
          // 	left: '5%',
          // 	right: '50px',
          // 	bottom: '0%',
          // },
			    toolbox: {
					right:20,
					feature: {
						saveAsImage: {}
					}
				},
			    tooltip: {formatter: function(params){
			    		console.log(params.name)
			    		let str = ''
			    		for(let i in params.value){
			    			str += xValueTemp[i].name+'：'+params.value[i]+'%<br/>'
			    		}
	            return params.name+'<br/>'+str;
			    	}
			    },

			    legend: legendData,
			    radar: {
              center: ['40%', '50%'],
              radius: '60%',
			        name: {
			            textStyle: {
			                color: radarColor,
//			                backgroundColor: '#999',
			                borderRadius: 3,
			                // padding: [3, 5]
			           }
			        },
              splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                  show: true,
                  areaStyle: { // 分隔区域的样式设置。
                      color: ['rgba(255,255,255,0)', 'rgba(255,255,255,0)'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                  }
              },
              axisLine: { //指向外圈文本的分隔线样式
                  lineStyle: {
                      color: '#3e5c80'
                  }
              },
              splitLine: {
                  lineStyle: {
                      color: '#3e5c80', // 分隔线颜色
                      width: 1, // 分隔线线宽
                  }
              },
			        indicator: xValueTemp
			    },
			    series: [{
		        name: '',
		        type: 'radar',
            symbolSize: 0,
		        data:seriesTemp
			    }]
        })
      window.addEventListener("resize", () => {
      	if(!this.chart) {
      		return
      	}
      	this.chart.resize();
      });
    }
  }
}
</script>
