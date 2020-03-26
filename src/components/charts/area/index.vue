<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0">
	  	<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata"  >
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata">
	  </div>
  </div>
</template>

<script>
import echarts from 'echarts'

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
      chart: null,
      xValue:[],
      yValue:[],
      yAxis:[],
      xAxisLine:true,
      yAxisLine:true,     
      zoomShow:false,
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.yAxis  = val.yAxis
      setTimeout(() => {
        this.initChart()
      },1000)
    }
  },
  mounted() {
    //this.initChart()
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
    	let yAxisTemp = []
    	if(this.xValue.length>20){
      	this.start = 0
      	this.end = 60
      	this.zoomShow = true
      	
      }else{
      	this.start = 0
      	this.end = 100
      }
    	if(this.xValue.length == 0){
    		this.xAxisLine = false
    		this.yAxisLine = false
    	}else{
    		for(let i in this.yAxis) {
					yAxisTemp.push({
						type: 'value',
						name: this.yAxis[i].name,
						min: this.yAxis[i].min,
						max: this.yAxis[i].max,
						interval: this.yAxis[i].interval,
						axisLabel: {
							show: true,
							formatter: '{value} ' + this.yAxis[i].axisLabel
						}
					})
				}
    	}
    	//this.series={xValue:['10','20'],yValue:[{id:'12',value:10},{id:'11',value:5}]}
    	var _this = this
      this.chart.setOption(
        {
           title: {
				        text: this.title
				    },
				    noDataLoadingOption :{
                    text: '暂无数据',
                    effect:'bubble',
                    effectOption : {
                        effect: {
                            n: 0 //气泡个数为0 
                        }
                    },
                    textStyle: {
                        fontSize: 32,
                        fontWeight: 'bold'
                    }
                },
				    tooltip : 
				    {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            label: {
				                backgroundColor: '#6a7985'
				            }
				        }
//				        enterable: true,
//				        formatter: function (e) {
				        	//跳转页面
//				        	_this.$router.push({name:'a-detail',params: {gradeId: '1233445676767889', classId: '2321423424234234' }})
//            		console.log(e);
//								},
//				        triggerOn: 'click'
				    },
				    legend: {
				        
				    },
				    toolbox: {
				       right:20,
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    grid: {
			        bottom: '15%'
			      },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : this.xValue,
				            axisLine:{
								        show:this.xAxisLine,         
								    }
				        }
				    ],
				    yAxis : yAxisTemp,
				    dataZoom: [
		          {
		            type: 'slider',
		            show: this.zoomShow,
		            xAxisIndex: [0],
		            bottom: '2%',
		            start: this.start,
		            end: this.end
		          }
		        ],
				    series : 
				    [
				        {
				            name:this.name,
				            type:'line',
				            areaStyle: {normal: {}},
				            data:this.yValue
				        }
				    ]
        })
//			window.addEventListener("resize", () => { 
//				
//				this.chart.resize();
//			});
    }
  }
}
</script>
