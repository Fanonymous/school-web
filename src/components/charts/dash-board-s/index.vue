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
				    title: {
				        text: this.xValue[0],
				        left:'50%',
				        top:'60%',
				        textStyle:{
				        	color:'#ffffff',
				            fontSize:14,
				        },
				        
				    },
				    series: [
				        {
				            name: '内圈小',
				            type: 'gauge',
				            pointer:{
				              show:false  
				            },
				            radius: '80%',
				            startAngle: 200,
				            endAngle: -20,
				            splitNumber: 4,
				            axisLine: { // 坐标轴线
				                lineStyle: { // 属性lineStyle控制线条样式
				                    color: [
				                        [1, '#1d3653']
				                    ],
				                    width: 15
				                }
				
				            },
				            splitLine: { //分隔线样式
				                show: true,
				            },
				            axisLabel: { //刻度标签
				                show: false,
				            },
				            axisTick: { //刻度样式
				                show: true,
				            },
				            detail: {
				            	show:false,
				                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                fontWeight: 'bolder',
				                color:'#ffffff',
				                fontSize:16,
				                offsetCenter:[0, '70%']
				            },
				            data: [{
				                value: 0,
				                name: ''
				            }]
				        }, {
				            name: '内圈小',
				            type: 'gauge',
				            title : {
				                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                fontWeight: 'bolder',
				                fontSize: 30,
				                fontStyle: 'italic',
				                offsetCenter: [0, '33%'],
				            },
				            pointer:{
				              show:true  
				            },
				            radius: '80%',
				            startAngle: 200,
				            endAngle: -20,
				            splitNumber: 4,
				            axisLine: { // 坐标轴线
				                lineStyle: { // 属性lineStyle控制线条样式
				                    color: [
				                        [1, '#02e3fc']
				                    ],
				                    width: 15,
				                    shadowColor: '#0093ee', //默认透明
				                    shadowOffsetX: 0,
				                    shadowOffsetY: 0,
				                    shadowBlur: 15,
				                    opacity: 1,
				                }
				
				            },
				            splitLine: { //分隔线样式
				                show: true,
				            },
				            axisLabel: { //刻度标签
				                show: true,
				            },
				            axisTick: { //刻度样式
				                show: true,
				            },
				            detail: {
				                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                fontWeight: 'bolder',
				                color:'#ffffff',
				                fontSize:16,
				                offsetCenter:['-20%', '40 %']
				            },
				            data: [{
				                value: this.yValue[0],
				                name: ''
				            }]
				        }, 
				
				    ]
				})
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>