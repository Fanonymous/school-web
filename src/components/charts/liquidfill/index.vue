<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0" :style="'top:'+topPosistion">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
	  	<img v-else src="~@/assets/img/nodata.png" class="nodata" >
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'

	export default {
		props: {
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
				xValue: [0],
				yValue: 0
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
			this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px'; 
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

				this.chart.setOption({
					title: {
						text: this.title,
						top:'75%',
						x:'center',
						y:'center',
						textStyle: {
							fontWeight: 'normal',
							fontSize: '14',
							color: '#bedbff',
							textAlign: 'center',
						}
					},
					series: [{
			        type: 'liquidFill',
			        data: [this.yValue],
			        label: {
			            normal: {
			                textStyle: {
			                    color: '#ffffff',
			                    fontSize: 30
			                }
			            }
			        },
			        color: ['#23a1cb', '#02e3fc', '#2aaf66'],
					backgroundStyle: {
			        	color: "transparent",
		                borderWidth: 0,
		                borderColor: '#02e3fc'
		            },
		            outline: {
			            itemStyle: {
			                borderColor: '#02e3fc',
			                borderWidth: 3
			            },
			            borderDistance: 0
			        }
			    }]
				})
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>