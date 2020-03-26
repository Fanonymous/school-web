<template>
	<div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0"  :style="'top:'+topPosistion">
			<img v-if="isscreen == true" src="~@/assets/img/screen-no.png" class="nodata-s">
			<img v-else src="~@/assets/img/nodata.png" class="nodata">
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import { newline} from '@/utils/common'
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
				seriaName: [],
				isLegend: false,
				yAxisLine: false,
				xAxisLine: false,
				zoomShow:false,
				yAxis:[]
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.seriaName = val.seriaName
				this.yAxis = val.yAxis
				setTimeout(() => {
				  this.initChart()
				},1000)
			}
		},
		mounted() {
			this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
      setTimeout(() => {
        this.initChart()
      },1000)
		},
		beforeDestroy() {
			  if (!this.chart) {
			    return
			  }
			  this.chart.dispose()
			  this.chart = null
		},
		methods: {
			initChart() {
				var colorPalette=[]
				let myCharts
				let seriesTemp = []
				let legendData={}
				let endZoom = 100
				let yAxisTemp=[]
        let yAxisArr = this.yAxis
				if(this.xValue.length > 0) {
					this.yAxisLine = true
					this.xAxisLine = true
					if(this.seriaName.length > 1) {
						this.isLegend = true
					}
					for(let i in this.seriaName) {
						seriesTemp.push({
							name: this.seriaName[i],
							type: 'line',
							barMaxWidth: 30,
							data: this.yValue[i]
						})
					}
				}
				if(this.xValue.length>20){
		      		this.zoomShow = true
		      		endZoom = 60
		        }
				//大屏主题
				if(this.isscreen){
					this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
					colorPalette = ['#2ee6c8','#006cd1','#bc4bd1','#00c1ff','#fffc00','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
					if(this.yValue.length == 1){
						colorPalette = [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
											offset: 0,
											color: '#00FBFF'
										}, {
											offset: 1,
											color: '#39A7FC'
										}])]
					}
					legendData = {
						show: this.isLegend,
						top: 10,
						left: 'right',
						data: this.seriaName
					}
				}else{
					this.chart = echarts.init(document.getElementById(this.id), 'macarons')
					colorPalette = ['#3C85EE','#FEB23A','#8ABE78','#E1BF6C','#F15643','#8386f5','#5e6afc','#3293fc']
					legendData= {
						show: this.isLegend,
						bottom: 12,
						left: 'center',
						data: this.seriaName
					}
				}

        let tipLabel = ''
        if(yAxisArr && yAxisArr.length >0){
          tipLabel = yAxisArr[0].tipLabel	== undefined?'':yAxisArr[0].tipLabel
        }

				if( this.xValue.length > 0){
					if(this.yAxis != undefined){
						for(let i in this.yAxis){
              if(this.seriaName.length >1){
                yAxisTemp= [{
                  type: 'value',
                  name: this.yAxis[i].name,
                  interval: this.yAxis[i].interval,
                  minInterval: 1,
                  axisLabel: {
                    show:true,
                      formatter: '{value} '+this.yAxis[i].axisLabel
                  },
                  axisLine:{
                   show:this.yAxisLine
                  }
                }]
              }else{
                yAxisTemp= [{
                      type: 'value',
                      name: this.yAxis[i].name,
                      nameLocation:'center',
                      nameGap: 38,//与轴线间距，
                      nameRotate:90,
                      interval: this.yAxis[i].interval,
                      minInterval: 1,
                      axisLabel: {
                      	show:true,
                          formatter: '{value} '+this.yAxis[i].axisLabel
                      },
                      axisLine:{
                	     show:this.yAxisLine
                	}
                  	}]
              }

						}
					}else{
						yAxisTemp= [{
					        type: 'value',
					        name: '',
					        interval: 10,
					        axisLabel: {
					        	show:true,
					            formatter: '{value} '
					        },
					        axisLine:{
							        show:true
							    }
				      	}]
					}

				}else{
					yAxisTemp= [{
				        type: 'value',
				        name: '',
				        interval: 10,
				        axisLabel: {
				        	show:false,
				            formatter: '{value} '
				        },
				        axisLine:{
						        show:false,
						    }
			      	}]
				}

				let options = {
					color: colorPalette,
					title: {
						text: this.title
					},
					legend: legendData,
					toolbox: {
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
          grid: {
              left: '50px',
              right: '20px',
              bottom: '25px',
              containLabel: true,
              borderColor: '#eee'
          },
					tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            formatter:function(params){
            	let str = params[0].name+'<br />'
            	for(let i in params){
            		params[i].value = params[i].value == undefined?'-':params[i].value
            		str+=params[i].seriesName+': '+params[i].value+tipLabel+'<br />'
            	}
            	return str
            }
          },
					xAxis: [{
						data: this.xValue,
						axisLabel:{
			                rotate:'30',
			                formatter: function(value){
			                	//X轴是否截取字符串 日期不截取
			                	let tempVal = value
			                	if(value.indexOf('-')>-1){
			                		tempVal = value
			                	}else{
			                		if(value.length >5){
			                			tempVal = value.substr(0,5)+'...'
			                		}
			                	}
			                	return tempVal;
			                }
			            },
						silent: false,
						splitLine: {
							show: false
						},
						axisLine: {
							show: this.xAxisLine,
						}
					}],
					yAxis: yAxisTemp,
					dataZoom: [{
						show: this.zoomShow,
						type: 'slider',
						bottom: 0,
						start: 0,
						height: 15,
						end: endZoom
					}],
					series: seriesTemp
				}

				//options = newline(options, 3, 'xAxis')
				this.chart.setOption(options)

				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>
