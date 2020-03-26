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
				let colorArr = ["#3c85ee","#f2f2f2","#a9d96c","#a77cd1","#7483cb","#5a87c1","#bf6a6a","#bd9974","#f9d346","#6ab7c3"]
				if(this.yValue.length > 0 && this.xValue.length > 0) {
					for(let i in this.xValue) {
						seriesTemp.push({
							name: this.xValue[i],
							value: this.yValue[i],
							itemStyle: {
				                emphasis: {color: colorArr[i]}
				            }
						})

					}
				}
				if(seriesTemp.length == 0) {
					seriesTemp = []
				}
				this.chart.setOption({
					color:['#3c85ee','#f2f2f2'],
					title: [{
						text: this.title
					},{
				         text: this.yValue[0]+'%',
				         subtext: this.yAxis[0].name1+':'+this.yAxis[0].classNum,
				         textStyle: {
				             fontSize: 18,
				             color: ['#3c85ee']
				         },
				         subtextStyle: {
				             fontSize: 12,
				             color: '#666666'
				         },
				         x: 'center',
				         y: '45%',
				    },
				    {
				    	text:'',
				    	subtext: this.yAxis[0].name2+':'+this.yAxis[0].classTotal,
				         subtextStyle: {
				             color: '#666666',
				             fontSize: 12,
				         },
				         x: 'center',
				         y: '56%',
				    }
					],
					toolbox: {
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
				
					legend: {
						show:false,
						orient: 'vertical',
						y: 40,
						orient: 'vertical',
				         right: "5%",
						data: this.xValue
					},
					series: [{
						name: '',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: false,
						animation: false,
            			clockWise: false,
						hoverAnimation: false, //鼠标移入变大
						tooltip: {
			                show: false
			            },
						legendHoverLink: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
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
				
//				this.chart.on('mouseover', function(e) {
//				//当检测到鼠标悬停事件，取消默认选中高亮
//				    this.chart.dispatchAction({
//				        type: 'downplay',
//				        seriesIndex: 1,
//				        dataIndex: 0
//				    });
//				//高亮显示悬停的那块
//				    this.chart.dispatchAction({
//				        type: 'highlight',
//				        seriesIndex: 1,
//				        dataIndex: e.dataIndex
//				    });
//				});
//				//检测鼠标移出后显示之前默认高亮的那块
//				this.chart.on('mouseout', function(e) {
//				    this.chart.dispatchAction({
//				        type: 'highlight',
//				        seriesIndex: 1,
//				        dataIndex: 0
//				    });
//				});

				
			}
		}
	}
</script>