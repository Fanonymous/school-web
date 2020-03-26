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
        yAxis:[]
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
        let data =[]
        this.yValue.forEach((item,index)=>{
          data.push({name:this.xValue[index],value:item})
        })
        let tipLabel = this.yAxis[0].tipLabel
				this.chart.setOption({
						title: {
							text: this.title,
							subtext: ''
						},
						tooltip: {
							trigger: 'item',
							formatter: "{b} : {c}"+tipLabel
						},
						toolbox: {
						   right:20,
						    feature: {
						        saveAsImage: {}
						    }
						},
						legend: {
							data: this.xValue,
              show:false
						},
            
						calculable: true,
						series: [{
							name: '',
							type:'funnel',
              left: '15%',
              right:'15%',
              top: '10%',
              bottom: '10%',
              minSize: '0%',
              maxSize: '100%',
              sort: 'ascending',
							// gap: 2,
							label: {
								normal: {
									formatter: '{b}: {c}'
								},
								emphasis: {
									position:'inside',
									formatter: '{b}: {c}'
								}
							},
							labelLine: {
								length: 10,
								lineStyle: {
									width: 1,
									type: 'solid'
								}
							},
							itemStyle: {
								borderColor: '#fff',
								borderWidth: 1
							},
							emphasis: {
								label: {
									fontSize: 20
								}
							},
							data: data
						}]
					}

				)
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