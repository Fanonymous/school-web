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
				isLegend:true
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
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
				console.log(seriesTemp)
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
						feature: {
							saveAsImage: {}
						}
					},
					legend: {
						show:this.isLegend,
						orient: 'vertical',
//						x: 'right',
						y: 40,
						
						
						orient: 'vertical',
				        
				         right: "5%",
						data: this.xValue
					},
					series: [{
						
						name: '',
						type: 'pie',
//						avoidLabelOverlap: false,
						radius: ['30%', '61%'],
             			center: ['50%', '50%'],
						label: {
							normal: {
			                     show: true,
			                     formatter: "{c}",
			                     textStyle: {
			                         fontSize: 20,
			
			                     },
			                     position: 'outside'
			                 },
							emphasis: {
			                     show: true
			                 }
						},
						labelLine: {
			                 normal: {
			                     show: true,
			                     length: 5,
			                     length2: 55
			                 },
			                 emphasis: {
			                     show: true
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