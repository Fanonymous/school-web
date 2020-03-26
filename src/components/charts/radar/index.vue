<template>
  <div class="chart-box">
		<div :class="className" :id="id" :style="{height:height}"></div>
		<div class="chart-box-img" v-if="xValue.length ==0">
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
      seriaName:[],
      yAxis:[{max:100}]
    }
  },
  watch: {
    series (val) {
    	this.xValue = val.xValue
	    this.yValue = val.yValue
	    this.seriaName = val.seriaName
	    this.yAxis = [{max:100,tipLabel:'%'}]
	    setTimeout(() => {
	      this.initChart()
	    },1000)
    }
  },
  mounted() {
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
      this.chart
      let radarColor ='#333333'
      //大屏主题
			if(this.isscreen){
				this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
				radarColor ='#bedbff'
			}else{
				this.chart = echarts.init(document.getElementById(this.id), 'macarons')
				radarColor ='#333333'
				
			}
      
      
      
			let seriesTemp = []
      let xValueTemp = []
      for(let i in this.seriaName){
      	seriesTemp.push({
		        name: this.seriaName[i],
		        value: this.yValue[i]
			  })
      }
      for(let i in this.xValue){
      	xValueTemp.push({name:this.xValue[i],max:100})
      }
      this.chart.setOption(
        {
          title: {
			        text: this.title
			    },
			    toolbox: {
					right:20,
					feature: {
						saveAsImage: {}
					}
				},
			    tooltip: {formatter: function(params){
			    		console.log(params.name)
			    		let str = ''
			    		for(let i in params.value){
			    			str += xValueTemp[i].name+'：'+params.value[i]+'%<br/>'
			    		}
	            return params.name+'<br/>'+str;
			    	}
			    },
			    legend: {
			    	show:this.seriaName.length ==1?false:true,
			    	orient: 'vertical',
		        x: 'right',
		        y:40,
			      data: this.seriaName
			    },
			    radar: {
			        name: {
			            textStyle: {
			                color: radarColor,
//			                backgroundColor: '#999',
			                borderRadius: 3,
			                padding: [3, 5]
			           }
			        },
			        indicator: xValueTemp
			    },
			    series: [{
		        name: '',
		        type: 'radar',
		        data:seriesTemp
			    }]
        })
      //window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
