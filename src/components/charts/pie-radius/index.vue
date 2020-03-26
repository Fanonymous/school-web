<template>
	<div class="chart-box" v-loading="loading">
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
				isLegend:true,
        loading:false
			}
		},
		watch: {
			series(val) {
				this.xValue = val.xValue
				this.yValue = val.yValue
				this.yAxis = val.yAxis ? val.yAxis : []
        this.loading = true
				setTimeout(() => {
				   this.initChart()
				},500)
			}
		},
		mounted() {
      this.loading = true
			setTimeout(() => {
			   this.initChart()
			},500)
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
        let tipLabel = ''
				this.chart.resize();
				if(this.yValue.length > 0 && this.xValue.length > 0) {
					for(let i in this.xValue) {
						seriesTemp.push({
							name: this.xValue[i],
							value: this.yValue[i].value ?this.yValue[i].value:this.yValue[i],
              list:this.yValue[i].list?this.yValue[i].list:null
						})
					}
				}
				if(seriesTemp.length == 0) {
					seriesTemp = []
				}
				if(this.xValue.length > 1) {
					this.isLegend = true
				}
				let seriesName = this.yAxis && this.yAxis.length == 0?'百分比':this.yAxis[0].name
        tipLabel = this.yAxis && this.yAxis.length > 0 && this.yAxis[0].tipLabel ? this.yAxis[0].tipLabel:''
				this.chart.setOption({
					title: {
						text: this.title
					},
					tooltip: {
						trigger: 'item',
						//formatter: "{a} <br/>{b}: {c} ({d}%)",
            formatter:function(data){
              console.log(data)
              let strData='', str='<br />'
              if(data.data.list && data.data.list.length>0){
                data.data.list.forEach(item=>{
                  str+=item.name+'：'+item.value+tipLabel+'<br>'
                })
                strData = data.name+ "： " + data.value +tipLabel+ "（"+data.percent.toFixed(1)+"%）"+str
              }else{
                strData = data.name+ "<br/>数量： " + data.value +tipLabel+ "<br/>占比："+data.percent.toFixed(1)+"%"
              }
              return  strData;
            }
					},
					toolbox: {
						right:20,
						feature: {
							saveAsImage: {}
						}
					},
					legend: {
						show:this.isLegend,
						orient: 'vertical',
//						x: 'right',
						y: 40,


						orient: 'vertical',

				         right: "5%",
						data: this.xValue
					},
					series: [{

						name: seriesName,
						type: 'pie',
//						avoidLabelOverlap: false,
						radius: ['30%', '46%'],
             			center: ['38%', '50%'],
						label: {
							normal: {
			                     show: true,
			                     //formatter: "{d}%",
                           formatter:function(data){
                             return data.percent.toFixed(1) + "%";
                           },

			                     textStyle: {
			                         fontSize: 14,
			                     },
			                     position: 'outside'
			                 },
							emphasis: {
			                     show: true
			                 }
						},
						labelLine: {
			                 normal: {
			                     show: true,
			                     length: 3,
			                     length2: 5
			                 },
			                 emphasis: {
			                     show: true
			                 }
			             },
						data: seriesTemp
					}]
				})
        this.loading = false
        this.chart.resize();
				window.addEventListener("resize", () => {
					this.chart.resize();
				});
			}
		}
	}
</script>
