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
        console.log(this.seriaName)
				if(this.xValue.length > 0) {
					this.yAxisLine = true
					this.xAxisLine = true
					if(this.seriaName.length > 1) {
						this.isLegend = false
					}
					for(let i in this.seriaName) {
						seriesTemp.push({
							name: this.seriaName[i],
							type: 'bar',
              stack: '总数',
							barMaxWidth: 30,
							data: this.yValue[i]
						})
					}
				}
        console.log(seriesTemp)
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
					colorPalette = ["#fe8203","#41cac0","#a77cd1","#7483cb","#5a87c1","#bf6a6a","#bd9974","#f9d346","#6ab7c3"];
					legendData= {
						show: this.isLegend,
						bottom: 12,
						left: 'center',
						data: this.seriaName
					}
				}

        let tipLabel = '',xtipLabel = ''
        if(yAxisArr && yAxisArr.length >0){
          tipLabel = yAxisArr[0].tipLabel	== undefined?'':yAxisArr[0].tipLabel
          xtipLabel =  yAxisArr[0].xtipLabel	== undefined?'':yAxisArr[0].xtipLabel
        }

				if( this.xValue.length > 0){
					if(this.yAxis != undefined){
						for(let i in this.yAxis){
							yAxisTemp= [{
						        type: 'value',
						        name: this.yAxis[i].name,
						        interval: this.yAxis[i].interval,
                    min:-this.yAxis[i].max,
                    max:this.yAxis[i].max,
                    inverse: true,
                    position:'right',
						        axisLabel: {
						        	show:true,
                      formatter: function (data) {
                          return Math.abs(data)
                      }
						          //formatter: '{value} '+this.yAxis[i].axisLabel
						        },
						        axisLine:{
								     show:this.yAxisLine
								}
					      	}]
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
        console.log(seriesTemp)
				let options = {
					color: colorPalette,
					title: {
						text: this.title
					},
					legend: legendData,
					toolbox: {
            show:false,
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
					tooltip: {
            formatter:function(params){
              let strData='', str='<br />'
              if(params.data.list && params.data.list.length>0){
                params.data.list.forEach(item=>{
                  str+=item.name+'：'+item.value+tipLabel+'<br>'
                })
                strData = params.name+xtipLabel+': '+params.value+tipLabel+str
              }else{
                strData = params.name+'<br />'+params.seriesName+': '+Math.abs(params.value)+tipLabel+str
              }
              return strData
            }
          },
					xAxis: [{
						data: this.xValue,
						axisLabel:{
                rotate:'0',
                // formatter: function(value){
                //   //X轴是否截取字符串 日期不截取
                //   let tempVal = value
                //   if(value.indexOf('-')>-1){
                //     tempVal = value
                //   }else{
                //     if(value.length >5){
                //       tempVal = value.substr(0,5)+'...'
                //     }
                //   }
                //   return tempVal;
                // }
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
