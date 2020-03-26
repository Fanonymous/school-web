<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
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
				yValue: [0],
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
				this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
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
				this.chart.setOption({
					color:['#17B3A3','#f2f2f2'],
					title: [{
						text: this.title
					},{
				         subtext: this.xValue[0],
				         text: this.yValue+'%',
				         textStyle: {
				             fontSize: 24,
				             color: ['#ffffff']
				         },
				         subtextStyle: {
				             color: '#bedbff',
				             fontSize: 12,
				         },
				         x: 'center',
//				         y: 'center',
						top:'38%'

				     }
					],
					
					tooltip: {
						show: false,
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					toolbox: {
						show:false,
						feature: {
							saveAsImage: {}
						}
					},
					legend: {
						show:false,
						orient: 'vertical',
						x: 'right',
						y: 40,
						data: this.xValue
					},
					series: [{
			            name: '面积模式',
			            type: 'pie',
			            radius: ['66%', '73%'],
			            center: ['50%', '50%'],
			            data: [{
			                    value: this.yValue,
			                    name: '',
			                    itemStyle: {
									normal: {
                    					borderWidth: 10,
					                    borderColor: '#02e3fc',
					                    color: '#02e3fc'
                    				},
			                        color: '#02e3fc'
			                    },
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
			                },
			                {
			                    value: 100-this.yValue,
			                    name: 'rose2',
			                    itemStyle: {
			                        color: "transparent"
			                    }
			                }
			            ]
			        },
			        {
			            name: '面积模式',
			            type: 'pie',
			            radius: ['67%', '72%'],
			            center: ['50%', '50%'],
			            data: [{
			                    value: this.yValue,
			                    name: '',
			                    itemStyle: {
			                        color: "transparent"
			                    }
			                },
			                {
			                    value: 100-this.yValue,
			                    name: 'rose2',
			                    itemStyle: {
						
			                        color: '#dffff9'
			                    },
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
			                }
			            ]
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