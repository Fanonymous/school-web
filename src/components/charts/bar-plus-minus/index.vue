<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img">
			<img src="~@/assets/img/nodata.png" class="nodata" v-if="xValue.length ==0">
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
				chart: null,
				seriesNameArr: [],
				xValue: [],
				yValue: [],
				seriaName: [],
				zoomShow: false,
				start: 100,
				end: 0,
				dataViewShow: false,
				yAxis: [{
					type: 'bar',
					name: '',
					min: 0,
					max: 100,
					interval: 1,
					axisLabel: ''
				}],
				isLegend: false,
				yAxisLine: false,
				xAxisLine: false,
			}
		},
		watch: {
			series(val) {
				console.log(val)
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.seriaName = val.seriaName
				this.yAxis = val.yAxis
				this.initChart()
			}
		},
		activated() {
			if(!this.chart) {
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
				this.chart = echarts.init(document.getElementById(this.id), 'macarons')
				let seriesTemp = []
				let xAxisTemp = []
				let tipLabel = this.yAxis[0].tipLabel
				tipLabel = tipLabel != undefined ?tipLabel:''
				if(this.yValue[0].length > 20) {
					this.start = 100
					this.end = 70
					this.zoomShow = true
					this.dataViewShow = true

				} else if(this.yValue[0].length > 10 && this.yValue[0].length < 20) {
					this.start = 100
					this.end = 30
					this.zoomShow = true
					this.dataViewShow = true
				} else {
					this.start = 0
					this.end = 100
				}
				if(this.seriaName.length > 0 && this.xValue.length > 0) {
					this.yAxisLine = true
					for(let i in this.seriaName) {

						seriesTemp.push({
							name: this.seriaName[i],
              stack: '总量',
							type: 'bar',
							barMaxWidth: 30,
							data: this.yValue[i]
						})

					}
					for(let i in this.yAxis) {
						xAxisTemp.push({
							type: 'value',
              name: this.yAxis[0].name,
							// name: this.yAxis[i].name,
							// min: this.yAxis[i].min,
							// max: this.yAxis[i].max,
							//interval: this.yAxis[i].interval,
							axisLabel: {
								// show: true,
								formatter: function(param) {
									if (param > 0) {
										return param
									} else {
										return -param
									}
								}
							}
						})
					}
				}

				if(seriesTemp.length == 0) {
					this.yAxisLine = false
					seriesTemp = [{
						name: '',
						type: 'bar',
						data: []
					}]
					xAxisTemp = [{
						type: 'value',
						show: false
					}]
				}

				if(this.seriaName.length > 1) {
					this.isLegend = true
				}
				this.chart.setOption({
          color: ['#41cac0','#00b1f3', '#a9d96c'],
					title: {
						text: this.title
					},
					tooltip: {
						formatter: function(params){
							return params.name+'：'+params.value+tipLabel
						}
					},
					toolbox: {
						right:20,
						feature: {
							dataView: {
								show: this.dataViewShow,
								readOnly: true,
								textareaBorderColor: '#c8c8c8',
								buttonColor: '#30b8ac'
							},
							saveAsImage: {
								show: true
							}
						}
					},
					grid: {
						right: '10%'
					},
					legend: {
						show: this.isLegend,
						bottom: 0,
						left: 'center',
						data: this.seriaName
					},
					xAxis: xAxisTemp,
					yAxis: {
						axisLine: {
							show: this.yAxisLine,
						},
						type: 'category',
            axisTick : {show: false},
						data: this.xValue
					},
					dataZoom: [{
						type: 'slider',
						show: this.zoomShow,
						yAxisIndex: [0],
						height: 15,
						left: '90%',
						start: this.start,
						end: this.end
					}],
					series: seriesTemp
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
