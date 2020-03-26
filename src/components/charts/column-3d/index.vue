<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata">
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata" >
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
				chart: null,
				xValue: [],
				yValue: [],
				seriaName: [],
				isLegend: false,
				yAxisLine: false,
				xAxisLine: false
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
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
					
				if(this.xValue.length > 0) {
					this.yAxisLine = true
					this.xAxisLine = true
					if(this.seriaName.length > 1) {
						this.isLegend = true
					}
					for(let i in this.seriaName) {
						seriesTemp.push({
							name: this.seriaName[i],
							type: 'bar',
							barMaxWidth: 30,
							data: this.yValue[i]
						})
					}
				}
				myCharts.setOption({
					title: {
						text: this.title
					},
					legend: {
						show: this.isLegend,
						bottom: 0,
						left: 'center',
						data: this.seriaName
					},
					toolbox: {
						feature: {
							//			            dataView: {show: true, readOnly: false},
							saveAsImage: {
								show: true
							}
						}
					},
					tooltip: {},
					xAxis: {
						data: this.xValue,
						silent: false,
						splitLine: {
							show: false
						},
						axisLine: {
							show: this.xAxisLine,
						}
					},
					yAxis: {
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