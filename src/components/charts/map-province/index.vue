<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<!--<div class="chart-box-img" v-if="xValue.length ==0" :style="'top:'+topPosistion">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
			<img v-else src="~@/assets/img/nodata.png" class="nodata">
		</div>-->
	</div>
</template>

<script>
	import echarts from 'echarts'
	import 'echarts/map/js/province/shanxi1'
	//import '../../../assets/mapjson/china.json'
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
				type: Array,
				default: []
			}
		},
		data() {
			return {
				topPosistion: '100px',
				chart: null,
				xValue: [],
				yValue: [],
				seriaName: [],
				yAxis: [],
				xAxis: []
			}
		},
		watch: {
			series(val) {
//				this.xValue = val.xValue
//				this.yValue = val.yValue
//				this.seriaName = val.seriaName
//				this.xAxis = val.xAxis
//				this.yAxis = val.yAxis
				this.initChart()
			}
		},
		mounted() {
			this.topPosistion = (parseInt(this.height.substring(0, this.height.length - 2)) - 100) / 2 + 'px';
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
				window.onresize = this.chart.resize;

				var geoCoordMap = {
					'西安': [108.940746408654, 34.2366081520891],
					'渭南': [109.498937165377, 34.5038081858649],
					'铜川': [108.968067, 34.908368],
					'宝鸡': [107.170645, 34.364081],
					'咸阳': [108.707509, 34.345373],
					'渭南': [109.483933, 34.502358],
					'延安': [109.50051, 36.60332],
					'汉中': [107.045478, 33.081569],
					'榆林': [109.745926, 38.279439],
					'安康': [109.038045, 32.70437],
					'商洛': [109.934208, 33.873907]
				};

				var convertData = function(data) {
					var res = [];
					for(var i = 0; i < data.length; i++) {
						var geoCoord = geoCoordMap[data[i].name];
						if(geoCoord) {
							res.push(geoCoord.concat(data[i].value));
						}
					}
					return res;
				};

				var data = this.series
				console.log(this.series)
//				[{
//						name: '西安市',
//						value: 23,
//						studentCount: 23,
//						teacherCount: 23,
//						schoolNetinRat: 23
//					}
//				];
				this.chart.setOption({ // 进行相关配置
					tooltip: {
						//	          	backgroundColor:'#092132',
						borderColor: '#2ee6c8',
						borderWidth: 1,
						padding: [10, 15],
						//trigger: 'item',
						formatter: function(params) {
							//console.log(params)
							var str = params.name + '<br />';
								
							if(params.data == undefined){
								str = params.name
							}else{
								str+='学校数 : ' + params.value + '<br />' +
								'学生数 : ' + params.data.studentCount + '<br />' +
								'教师数 : ' + params.data.teacherCount + '<br />' +
								'互联网接入比例 : ' + params.data.schoolNetinRat + '%';
							}
							return str;
						}
					}, // 鼠标移到图里面的浮动提示框
					//	          visualMap: {
					//				        min: 0,
					//				        max: 500,
					//				        splitNumber: 5,
					//				        inRange: {
					//				            color: ['#d94e5d','#eac736','#50a3ba'].reverse()
					//				        },
					//				        textStyle: {
					//				            color: '#fff'
					//				        }
					//				    },
					geo: {
						map: '陕西',
						label: {
							normal: {
								color: '#6cb9e7',
								fontSize: 8,
								show: true
							},
							emphasis: {
								show: false
							}
						},
						roam: true,
						zoom: 1.25,
						itemStyle: {
							normal: {
								areaColor: 'transparent',
								borderColor: '#0075ff',
								borderWidth: 2,
								shadowColor: 'rgba(0, 117, 255, 0.3)',
								shadowBlur: 30
							},
							emphasis: {
								areaColor: '#00c6c4',
							}
						}
					},
					series: [{
							name: '陕西',
							type: 'map', 
							
							//			            mapType: 'beijing',
							//			            selectedMode : 'multiple',
							label: {
								normal: {
									show: true
								},
								emphasis: {
									show: true
								}
							},
							data: data

						},
						{
							type: 'map',
							//          map: 'shandong',
							geoIndex: 0,
							aspectScale: 0.75,
							showLegendSymbol: false,
							label: {
								normal: {
									show: false
								},
								emphasis: {
									show: false,
									textStyle: {
										color: '#fff'
									}
								}
							},
							roam: true,
							itemStyle: {
								normal: {
									areaColor: '#031525',
									borderColor: '#FFFFFF',
								},
								emphasis: {
									areaColor: '#2B91B7'
								}
							},
							animation: false,
							data: data
						}
					]

				})
				let that = this
				this.chart.on('click', function (param) {
					if(param.name == '咸阳市'){
				        that.$router.push({
							name: 'screen-city',
							query:{currScreen:1}
						})
			        }
			    })
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>