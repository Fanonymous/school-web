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

	export default {
		props: {
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
				isscreen:false,
				topPosistion:'100px',
				chart: null,
				xValue: [],
				yValue: [],
				seriaName: [],
				isLegend: false,
				yAxisLine: false,
				xAxisLine: false,
				yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel: ''}]
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.yAxis = val.yAxis
				this.seriaName = val.seriaName
				this.initChart()
			}
		},
		mounted() {
			this.initChart()
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
				let myCharts = echarts.init(document.getElementById(this.id), 'macarons')
				let seriesTemp = []
				let yAxisArr= this.yAxis
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
							data: this.yValue[i]
						})
					}
				}
				myCharts.setOption({
					title: {
						text: this.title,
						show:false,
					},
					legend: {
						show: this.isLegend,
						bottom: 0,
						left: 'center',
						data: this.seriaName
					},
					grid: {
						top:'35px',
				        left: '5px',
				        right: '5px',
				        bottom: '0px',
				        containLabel: true,
				        borderColor: '#eee'
				    },
					toolbox: {
						right:20,
						feature: {
							//			            dataView: {show: true, readOnly: false},
							saveAsImage: {
								show: false
							}
						}
					},
					tooltip: {
						trigger: 'axis',
						formatter:function(params){
				        	let str = params[0].name+'<br />'
				        	for(let i in params){
				        		params[i].value = params[i].value == undefined?'-':params[i].value
				        		str+=params[i].seriesName+': '+params[i].value+yAxisArr[i].name+'<br />'
				        	}
				        	return str
				        }
					},
					xAxis: {
						data: this.xValue,
						silent: false,
						splitLine: {
							show: false
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
						axisLine: {
							show: this.xAxisLine,
						}
					},
					yAxis: {
						name: this.yAxis[0].name,
						min: this.yAxis[0].min,
						max: this.yAxis[0].max,
						interval: this.yAxis[0].interval,
						axisLabel: {
							show: true,
							formatter: '{value} ' + this.yAxis[0].axisLabel
						},
						axisLine: {
							show: this.yAxisLine,
						}
					},
					series: seriesTemp
				})
				window.addEventListener("resize", () => {
					myCharts.resize();
				});
			}
		}
	}
</script>