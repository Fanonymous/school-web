<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
	  	<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s"  >
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata">
	  </div>
  </div>
</template>

<script>
import echarts from 'echarts'

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
      yAxis:[],
      seriaName:[],
      xAxisLine:true,
      yAxisLine:true,
      zoomShow:false,
      isLegend: false,
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
      this.yValue = val.yValue
      this.yAxis  = val.yAxis
      this.seriaName = val.seriaName
      this.initChart()
    }
  },
  mounted() {
    this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
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
    	this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
    	let yAxisTemp = []
      let yAxisArr = this.yAxis
    	if(this.xValue.length>20){
      	this.start = 0
      	this.end = 60
      	this.zoomShow = true

      }else{
      	this.start = 0
      	this.end = 100
      }
      if(this.seriaName.length > 1) {
      	this.isLegend = true
      }
    	if(this.xValue.length == 0){
    		this.xAxisLine = false
    		this.yAxisLine = false
        yAxisTemp =[{
            axisLine:{
                show:false
            },
						type: 'value',
						name: [],
						min: 0,
						max: 0,
						interval: 0
					}]
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
      let colorPalette = [],colorArea=''
      let color1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}]) //蓝
      let color2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#00EAFF'}, {offset: 1,color: '#0B093F'}]) //青
      let color3 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#A859FF'}, {offset: 1,color: '#0B093F'}]) //紫
      let color4 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#00F7A7'}, {offset: 1,color: '#0B093F'}]) //绿
      let color5 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#FFD129'}, {offset: 1,color: '#0B093F'}]) //黄
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
        colorArea = color4
      }else if(this.themeColor == 3){
        colorPalette = [color2,color3]
        colorArea = color4
      }else if(this.themeColor == 4){
        colorPalette = ['#00F7A7']
        colorArea = color4
      }else if(this.themeColor == 5){
        colorPalette = ['#FFD129']
        colorArea = color5
      }else{
        colorPalette = [color5,color1]
        colorArea = color5
      }
    	//this.series={xValue:['10','20'],yValue:[{id:'12',value:10},{id:'11',value:5}]}
    	var _this = this
      this.chart.setOption(
        {
          color:colorPalette,
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
                formatter:function(params){
                  return params[0].name+'<br />'+params[0].seriesName+': '+params[0].value+yAxisArr[0].tipLabel
                }
				        // axisPointer: {
				        //     type: 'cross',
				        //     label: {
				        //         backgroundColor: '#77FFFF'
				        //     }
				        // }
//				        enterable: true,
//				        formatter: function (e) {
				        	//跳转页面
//				        	_this.$router.push({name:'a-detail',params: {gradeId: '1233445676767889', classId: '2321423424234234' }})
//            		console.log(e);
//								},
//				        triggerOn: 'click'
				    },
				    legend: {
              show: this.isLegend,
              bottom: 0,
              left: 'center',
              data: this.seriaName
				    },
				    toolbox: {
              show:false,
				       right:20,
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    grid: {
              top:'40px',
			        bottom: '15%'
			      },
				    xAxis : [
				        {
				            type : 'category',
				            boundaryGap : false,
				            data : this.xValue,
				            axisLine:{
								        show:this.xAxisLine,
								    },
                    axisLabel:{
                        rotate:'30',
                        formatter: function(value){
                          //X轴是否截取字符串 日期不截取
                          let tempVal = value
                          if(value.indexOf('-')>-1){
                            tempVal = value
                          }else{
                            tempVal = value.substr(0,5)
                          }
                          return tempVal;
                        }
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
				            name:this.seriaName[0],
				            type:'line',
                    symbol: 'circle',
                    symbolSize: 7,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
				            areaStyle: {normal: {
                        color: colorArea
                    }},
				            data:this.yValue
				        }
				    ]
        })
			window.addEventListener("resize", () => {

				this.chart.resize();
			});
    }
  }
}
</script>
