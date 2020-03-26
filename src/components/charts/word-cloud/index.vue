<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<!--<div class="chart-box-img">
	  	<img src="~@/assets/img/nodata.png" class="nodata" v-if="xValue.length ==0" >
	  </div>-->
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
				yValue: []
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
			//this.initChart()
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
				
				let data = [];
				
				const colors = ["#41cac0", "#00b1f3", "#a9d96c", "#a77cd1", "#7483cb", "#5a87c1", "#bf6a6a", "#bd9974", "#f9d346", "#6ab7c3"];
				
				this.chart.setOption({
					title: {
						text: this.title
					},
					series: [{
						type: 'wordCloud',
						gridSize: 2,
						sizeRange: [12, 50],
//						shape: 'star',
						textStyle: {
							
						},
						data: this.xValue
					}]

				})
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>