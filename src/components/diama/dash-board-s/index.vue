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
				    title: {
				        text: '',
				        left:'50%',
				        top:'60%',
				        textStyle:{
				        	color:'#ffffff',
				            fontSize:14,
				        },

				    },
				    series: [
				        {
				                name: '业务指标',
				                type: 'gauge',
				                splitNumber: 10, // 分割段数，默认为5
				                startAngle: 180, //开始刻度的角度
				                endAngle: 0, //结束刻度的角度
				                z: 8,
				                min: 0,
				                max: 20,
				                axisLine: { // 坐标轴线
				                    lineStyle: { // 属性lineStyle控制线条样式
				                        color: [
				                            [0.231, '#277ee2'],
				                            [0.462, '#277ee2'],
				                            [0.5, '#11ffbd'],
				                            [0.923, '#11ffbd'],
				                            ['1', '#11ffbd']
				                        ],
				                        width: 0
				                    }
				                },
				                axisTick: { // 坐标轴小标记
				                    splitNumber: 5, // 每份split细分多少段
				                    length: 5, // 属性length控制线长
				                    lineStyle: { // 属性lineStyle控制线条样式
				                        color: 'auto',
				                        width: 2,
				                    }
				                },
				                axisLabel: { // 坐标轴文本标签，详见axis.axisLabel
				                    formatter: function(v) {
				                        switch (v + '') {
				                            case '0':
				                                return '0';
				                            case '5':
				                                return '5';
				                            case '10':
				                                return '10';
				                            case '15':
				                                return '15';
				                            case '20':
				                                return '20';
				                        }
				                    },
				                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                        color: 'auto'
				                    }
				                },
				                splitLine: { // 分隔线
				                    show: true, // 默认显示，属性show控制显示与否
				                    length: 10, // 属性length控制线长
				                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
				                        color: 'auto',
				                        width: 2,
				                    }
				                },
				                pointer: {
				                    width: 5
				                },
				                title: {
				                    show: true,
				                    offsetCenter: [0, '-30%'], // x, y，单位px
				                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                        fontWeight: 'bolder'
				                    }
				                },
				                detail: { //'{value}%'
				                    formatter: function(value) {

				                        var zhuangtai = " ";

				                        // if (value <= 20) {
				                        //     zhuangtai = "达标";
				                        // } else if (value > 20 && value <= 10) {
				                        //     zhuangtai = "良好";
				                        // } else if (value > 40 && value <= 60) {
				                        //     zhuangtai = "一般";
				                        // } else if (value > 60 && value <= 80) {
				                        //     zhuangtai = "超标";
				                        // } else if (value > 80) {
				                        //     zhuangtai = "严重超标";
				                        // }

				                        // alert(zhuangtai)

				                        value = zhuangtai + '\n' + value + "Mbps";
				                        return value;
				                    },
				                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
				                        color: 'auto',
				                        fontWeight: 'bolder',
				                        lineHeight: 20,
				                        fontSize: 14
				                    }
				                },
				                //  达标、良好、一般、超标、严重超标
				                data: [{
				                    value: this.yValue[0]
				                }]
				            }

				    ]
				})
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>
