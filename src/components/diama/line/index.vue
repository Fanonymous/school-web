<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
			<img v-else src="~@/assets/img/nodata.png" class="nodata">
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
			title: {
				type: String,
				default: ''
			},
			series: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				topPosistion:'100px',
				chart: null,
				xValue: [],
				yValue: [],
				seriaName: [],
				isLegend: false,
				yAxisLine: false,
				xAxisLine: false,
				zoomShow:false,
				yAxis:[]
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.seriaName = val.seriaName
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
				let myCharts
				let seriesTemp = []
				let legendData={}
				let endZoom = 100
				let yAxisTemp=[]
        let yAxisArr = this.yAxis
				if(this.xValue.length > 0) {
					this.yAxisLine = true
					this.xAxisLine = true
					if(this.seriaName.length > 1) {
						this.isLegend = true
					}
					for(let i in this.seriaName) {
						seriesTemp.push({
							name: this.seriaName[i],
							type: 'line',
							barMaxWidth: 25,
              symbol: 'circle',
              symbolSize: 10,
              itemStyle: {
                  normal: {
                      borderColor: '#33D9FB',//边框颜色
                      borderWidth: 0//边框宽度
                  }
              },
							data: this.yValue[i]
						})
					}
				}
				if(this.xValue.length>10){
		      		this.zoomShow = true
		      		endZoom = 60
		        }
				//大屏主题
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
          }else{
            colorPalette = [color3,color1]
          }
					legendData = {
						show: this.isLegend,
						top: 10,
						left: 'right',
						data: this.seriaName
					}
				}else{
					this.chart = echarts.init(document.getElementById(this.id), 'macarons')
					colorPalette = ["#41cac0","#00b1f3","#a9d96c","#a77cd1","#7483cb","#5a87c1","#bf6a6a","#bd9974","#f9d346","#6ab7c3"];
					legendData= {
						show: this.isLegend,
						bottom: 12,
						left: 'center',
						data: this.seriaName
					}
				}

				if( this.xValue.length > 0){
					if(this.yAxis != undefined){
						for(let i in this.yAxis){
							yAxisTemp= [{
						        type: 'value',
						        name: this.yAxis[i].name,
						        interval: this.yAxis[i].interval,
						        axisLabel: {
						        	show:true,
						            formatter: '{value} '+this.yAxis[i].axisLabel
						        },
						        axisLine:{
								     show:this.yAxisLine
								}
					      	}]
						}
					}else{
						yAxisTemp= [{
					        type: 'value',
					        name: '',
					        interval: 10,
					        axisLabel: {
					        	show:true,
					            formatter: '{value} '
					        },
					        axisLine:{
							        show:true
							    }
				      	}]
					}

				}else{
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

				let options = {
					color: colorPalette,
					title: {
						text: this.title
					},
					legend: legendData,
					toolbox: {
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
          grid: {
            right:'4%',
          	bottom: '5%'
          },
					tooltip: {
            formatter:function(params){
              	return params.name+'<br />'+params.seriesName+': '+params.value+yAxisArr[0].tipLabel
            }
          },
					xAxis: [{
						data: this.xValue,
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
			            },
						silent: false,
						splitLine: {
							show: false
						},
						axisLine: {
							show: this.xAxisLine,
						}
					}],
					yAxis: yAxisTemp,
					// dataZoom: [{
					// 	show: this.zoomShow,
					// 	type: 'slider',
					// 	bottom: 0,
					// 	start: 0,
					// 	height: 15,
					// 	end: endZoom
					// }],
					series: seriesTemp
				}

				//options = newline(options, 3, 'xAxis')
				this.chart.setOption(options,true)

				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>
