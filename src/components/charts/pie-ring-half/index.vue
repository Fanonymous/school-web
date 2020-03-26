<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0" :style="'top:'+topPosistion">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s-half">
			<img v-else src="~@/assets/img/nodata.png" class="nodata">
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
			colorBlue:{
				type: Boolean,
				default: true
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
				xValue: [],
				yValue: [],
				isLegend: true
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
				let colorBlue = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#39A7FC'
										}, {
											offset: 1,
											color: '#00FBFF'
										}])
				let colorRed  = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#ca4098'
										}, {
											offset: 1,
											color: '#9948d6'
										}])
				let colorDefault = colorBlue
				if(this.colorBlue){
					colorDefault = colorBlue
				}else{
					colorDefault = colorRed
				}
				if(seriesTemp.length == 0) {
					seriesTemp = []
				}
				var placeHolderStyle = {
					normal: {
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						color: "rgba(0,0,0,0)",
						borderWidth: 0
					},
					emphasis: {
						color: "rgba(0,0,0,0)",
						borderWidth: 0
					}
				};
				let fontSize = this.height=='90px'?16:24
				var dataStyle = {
					normal: {
						formatter: function(value){
							let tempVal = value.value/50*100
							if(String(tempVal).indexOf('.') >-1){
								tempVal = parseFloat(value.value/50*100).toFixed(2)+'%'
							}else{
								tempVal =value.value/50*100+'%'
							}
							return tempVal
						},
						position: 'center',
						show: true,
						textStyle: {
							fontSize: fontSize,
							fontWeight: 'normal',
							color: '#fff'
						}
					}
				};
				
				
				this.chart.setOption({
					color: ['#17B3A3', '#f2f2f2'],
					//					title: [{
					//						text: this.title
					//					},{
					//				         text: this.xValue[0],
					//				         subtext: this.yValue[0]+'%',
					//				         textStyle: {
					////				             color: '#f2f2f2',
					//				             fontSize: 14,
					//				         },
					//				         subtextStyle: {
					//				             fontSize: 18,
					//				             color: ['#17B3A3']
					//				         },
					//				         x: 'center',
					//				         y: 'center',
					//				     }
					//					],
					//					
					title: [{
						text: '',
						x: '20',
						y: '20',
						textStyle: {
							color: '#fff',
							fontSize: 20
						}
					}, {
						text: this.xValue,
						left: '46%',
						top: '60%',
						textAlign: 'center',
						textStyle: {
							fontWeight: 'normal',
							fontSize: '14',
							color: '#bedbff',
							textAlign: 'center',
						},
					}],
					series: [{
							type: 'pie',
							hoverAnimation: false, //鼠标经过的特效
							radius: ['68%', '79%'],
							center: ['50%', '50%'],
							startAngle: 180,
							endAngle: 0,
							labelLine: {
								normal: {
									show: false
								}
							},
							label: {
								normal: {
									position: 'center'
								},
//								formatter: function(value){
//									return value/50*100
//								}
							},
							data: [{
								value: this.yValue/100*50,
								itemStyle: {
									normal: {
										color:colorDefault
									}
								},
								label: dataStyle,
							}, {
								value: 50,
								itemStyle: placeHolderStyle,
							}, ]
						},

						//外圈的边框
						{
							// name: '总人数',
							type: 'pie',
							hoverAnimation: false, //鼠标经过的特效
							radius: ['80%', '84%'],
							center: ['50%', '50%'],
							startAngle: 180,
							endAngle: 0,
							labelLine: {
								normal: {
									show: false
								}
							},
							label: {
								normal: {
									position: 'center'
								}
							},
							data: [{
									value: 50,
									itemStyle: {
										normal: {
											color:colorDefault
										}
									},
								}, {
									value: 50,
									itemStyle: placeHolderStyle,
								},

							]
						},
					]

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