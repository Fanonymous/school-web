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
//	import 'echarts/map/js/province/shanxi'
//	import 'echarts/map/js/city/xian'
//	import aomen from 'echarts/map/json/province/aomen'
	import aomen from 'echarts/map/json/city/610400'
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
				echarts.registerMap('beijing', aomen);
				this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
				window.onresize = this.chart.resize;

				var geoCoordMap = {
					'彬县': [108.940746408654, 34.2366081520891],
					'兴平市': [108.940746408654, 34.2366081520891],
					'渭城区': [108.940746408654, 34.2366081520891],
					'武功县': [108.940746408654, 34.2366081520891],
					'杨凌区': [108.940746408654, 34.2366081520891],
					'淳化县': [108.940746408654, 34.2366081520891],
					'礼泉县': [108.940746408654, 34.2366081520891],
					'长武县': [108.940746408654, 34.2366081520891],
					'三原县': [108.940746408654, 34.2366081520891],
					'秦都区': [108.940746408654, 34.2366081520891],
					'泾阳区': [108.940746408654, 34.2366081520891],
					'乾县': [108.940746408654, 34.2366081520891]

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
//				var data = [{
//						name: '西安市',
//						value: 23,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '渭南市',
//						value: 22,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '铜川市',
//						value: 23,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '宝鸡市',
//						value: 54,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '咸阳市',
//						value: 12,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '渭南市',
//						value: 12,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '延安市',
//						value: 54,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '汉中市',
//						value: 34,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '榆林市',
//						value: 64,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '安康市',
//						value: 23,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					},
//					{
//						name: '商洛市',
//						value: 13,
//						values: 23,
//						valuet: 23,
//						valuer: 23
//					}
//				];
				this.chart.setOption({ // 进行相关配置
					tooltip: {
						//	          	backgroundColor:'#092132',
						borderColor: '#2ee6c8',
						borderWidth: 1,
						padding: [10, 15],
						//	          	trigger: 'item',
						formatter: function(params) {
							
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
						map: 'beijing',
						zoom:1.13,
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
					if(param.name == '彬县'){
						that.$router.push({
							name: 'screen-edu',
							query:{currScreen:2}
						})
					}
			        
//			        遍历取到provincesText 中的下标  去拿到对应的省js
//			        for(var  i= 0 ; i < provincesText.length ; i++ ){
//			            if(param.name == provincesText[i]){
//			                //显示对应省份的方法
//			                // showProvince(provinces[i]) ;
//			                showProvince(provinces[i],provincesText[i])
//			                break ;
//			            }
//			        }
			    });
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>