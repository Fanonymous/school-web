<template>
  <div class="chart-box">
	  <div :class="className" :id="id" :style="{height:height}"></div>
	  <div class="chart-box-img">
	  	<img src="~@/assets/img/nodata.png" class="nodata" v-if="xValue.length ==0" >
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
    title:{
    	type: String,
      default: ''
    },
    series:{
    	type: Object,
    	default: {}
    }
  },
  data() {
    return {
      chart: null,
      xValue:[],
      yValue:[],
      yAxis:[]
    }
  },
  watch: {
    series (val) {
    	
      this.xValue = val.xValue
      this.yValue = val.yValue
      this.yAxis = val.yAxis
      this.initChart()
    }
  },
  mounted() {
    //this.initChart()
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
      this.chart = echarts.init(document.getElementById(this.id),'macarons')
      console.log(this.yValue)
        let data = [];
		this.yValue.forEach((d, i) => {
	      data.push({
	        name: this.xValue[i],
	        value: parseInt(d)
	      })
	    })
		data.sort(function(a, b){
		    return a.value > b.value
		});
		let tipLabel = ''
		if(this.yAxis && this.yAxis.length > 0){
			tipLabel = this.yAxis[0].tipLabel ? this.yAxis[0].tipLabel : ''
		}
		const colors = ["#41cac0","#00b1f3","#a9d96c","#a77cd1","#7483cb","#5a87c1","#bf6a6a","#bd9974","#f9d346","#6ab7c3"];
		let seriesBar = [];
	    data.forEach((d, i) => {
	      seriesBar.push({
	        value: d.value,
	        itemStyle: {
	          color: colors[i]
	        }
	      })
	    })
      this.chart.setOption({
      	title: {
	        text: this.title
	    },
	    toolbox: {
				right:20,
				feature: {
					saveAsImage: {}
				}
			},
	    tooltip: {
	    	show:true,
	    	formatter:function(params){
              	return params.name+': '+params.value+tipLabel
            }
	    },
      	polar: {
	        
	       },
	    angleAxis: {
	        show: false,
	        min: function(value) {
	        	//0
	        //return value.min
	            return value.min >= 1 ? value.min - value.max / 3 : 0
	        },
	        max: function(value) {
	            return value.max * 4 / 3;
	        }
	    },
	    radiusAxis: {
	        type: 'category',
	        axisLabel: {
	            interval: 0,
	            color: "#999999",
	            fontSize: 16
	        },
	        axisLine: {
	            show: false
	        },
	        axisTick: {
	            show: false,
	            alignWithLabel: true
	        },
	        splitLine: {
	            show: false,
	            lineStyle: {
	                color: "rgba(17, 51, 68, 0.8)"
	            }
	        },
	        data: data.map(function(item){return item.name}),
	    },
	    series: [
	        {
	            type: 'bar',
	            coordinateSystem: 'polar',
	            barWidth: data.length > 5 ? 10 : 20,
	            itemStyle: {
					color: '#ffffff'
	            },
	            data: seriesBar
	        },
	        {
	            type: "custom",
	            coordinateSystem: 'polar',
	            renderItem: function(params, api) {
	                var values = [api.value(0), api.value(1)];
	                var coord = api.coord(values);
	                return {
	                    type: 'text',
	                    position: [3 * Math.sin(coord[3]), 3 * Math.cos(coord[3])],
	                    rotation: coord[3] + Math.PI / 2,
	                    origin: [coord[0], coord[1]],
	                    style: {
//	                        text: api.value(1),
//	                        fill: "#333",
//	                        fontSize: 16,
//	                        textAlign: "right",
//	                        textVerticalAlign: "middle",
//	                        x: coord[0],
//	                        y: coord[1]
	                    }
	                };
	            },
	            data: data
	        }
	    ]
//	};
      	
      	
      	
//      title: {
//	        text: this.title
//	    },
//		    toolbox: {
//	        feature: {
//	            saveAsImage: {}
//	        }
//		    },
//		    legend: {
//		    	orient: 'vertical',
//		      x: 'right',
//		      y: 40,
//		      data: this.xValue
//		    },
//		    series: [{
//		        name: 'Line 1',
//		        type: 'pie',
//		        clockWise: true, //顺时针
//		        radius: ['70%', '80%'],
//		        label: {
//		            normal: {
//		                show: false,
//		                position: 'inside'
//		            }
//		        },
//		        labelLine: {
//		            normal: {
//		                show: false
//		            }
//		        },
//		        hoverAnimation: false,
//		        data: [{
//		            value: this.yValue[0],
//		            name: 'A'
//		        }, {
//		            value: 100-this.yValue[0],
//		            name: 'hide',
//		            itemStyle: hideStyle
//		        }]
//		    }, {
//		    	show: Line2Show,
//		        name: 'Line 2',
//		        type: 'pie',
//		        clockWise: true, //顺时针
//		        radius: ['50%', '60%'],
//		        label: {
//		            normal: {
//		                show: false,
//		                position: 'inside'
//		            }
//		        },
//		        labelLine: {
//		            normal: {
//		                show: false
//		            }
//		        },
//		        hoverAnimation: false,
//		        data: [{
//		            value: this.yValue[1],
//		            name: 'B'
//		        }, {
//		            value: 100-this.yValue[1],
//		            name: 'hide',
//		            itemStyle: hideStyle
//		        }]
//		    }, {
//		    	show: Line3Show,
//		        name: 'Line 3',
//		        type: 'pie',
//		        clockWise: true, //顺时针
//		        radius: ['30%', '40%'],
//		        label: {
//		            normal: {
//		                show: false,
//		                position: 'inside'
//		            }
//		        },
//		        labelLine: {
//		            normal: {
//		                show: false
//		            }
//		        },
//		        hoverAnimation: false,
//		        data: [{
//		            value: this.yValue[2],
//		            name: 'C'
//		        }, {
//		            value: 100-this.yValue[2],
//		            name: 'hide',
//		            itemStyle: hideStyle
//		        }]
//		    }]
        })
      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
