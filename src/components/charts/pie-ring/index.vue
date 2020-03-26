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
				xValue: [],
				yValue: [],
				yAxis:[],
				isLegend:true
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.yAxis = val.yAxis
				this.initChart()
			}
		},
		mounted() {
			this.initChart()
		},
		beforeDestroy() {
			if(!this.chart) {
				return
			}
			this.chart.dispose()
			this.chart = null
		},
		methods: {
			initChart() {
				this.chart = echarts.init(document.getElementById(this.id), 'macarons')
				let seriesTemp = []

				if(this.yValue.length > 0 && this.xValue.length > 0) {
					for(let i in this.xValue) {
						seriesTemp.push({
							name: this.xValue[i],
							value: this.yValue[i]
						})

					}
				}
				if(seriesTemp.length == 0) {
					seriesTemp = []
				}
				if(this.xValue.length > 1) {
					this.isLegend = true
				}
				this.chart.setOption({
					title: {
						text: this.title
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					toolbox: {
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
					legend: {
						show:this.isLegend,
						orient: 'vertical',
						x: 'right',
						y: 40,
						data: this.xValue
					},
					series: [{
						name: this.yAxis[0].name,
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: seriesTemp
					}]
				})
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>
