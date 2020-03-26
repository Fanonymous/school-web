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
import 'echarts/map/js/china'
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
    title:{
    	type: String,
      default: ''
    },
    series:{
    	type: Array,
			default: []
    }
  },
  data() {
    return {
    	topPosistion:'100px',
      chart: null,
      xValue:[],
      yValue:[],
      seriaName:[],
      yAxis:[],
      xAxis:[]
    }
  },
  watch:{
    series (val){
//      this.xValue = val.xValue
//    this.yValue = val.yValue
//    this.seriaName = val.seriaName
//    this.xAxis = val.xAxis
//    this.yAxis = val.yAxis
      this.initChart()
    }
  },
  mounted() {
  	this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
    //this.initChart()
  },
  beforeDestroy() {
    // if (!this.chart) {
    //   return
    // }
    // this.chart.dispose()
    // this.chart = null
  },
  methods: {
    initChart() {
    	  this.chart = echarts.init(document.getElementById(this.id),'macarons-screen')
        window.onresize = this.chart.resize;
       // console.log(this.xValue)
        var geoCoordMap = {
        	"江苏":[118.76741,32.041546],
					"浙江":[120.15358,30.287458],
					"上海":[121.472641,31.231707],
					"广东":[113.28064,23.125177],
					"北京":[116.405289,39.904987],
					"山东":[117.000923,36.675808],
					"安徽":[117.283043,31.861191],
					"福建":[119.306236,26.075302],
					"天津":[117.190186,39.125595],
					"辽宁":[123.429092,41.796768],
					"重庆":[106.504959,29.533155],
					"山西":[112.549248,37.857014],
					"四川":[104.065735,30.659462],
					"湖北":[114.298569,30.584354],
					"宁夏":[106.232480,38.486440],
					"内蒙古":[111.751990,40.841490],
					"江西":[115.892151,28.676493],
					"新疆":[87.616880,43.826630],
					"贵州":[106.713478,26.578342],
					"黑龙江":[126.642464,45.756966],
					"陕西":[108.948021,34.263161],
					"青海":[101.777820,36.617290],
					"吉林":[125.324501,43.886841],
					"湖南":[112.982277,28.19409],
					"河北":[114.502464,38.045475],
					"甘肃":[103.834170,36.061380],
					"海南":[110.199890,20.044220],
					"河南":[113.665413,34.757977],
					"广西":[108.320007,22.82402],
					"云南":[102.71225,25.040609],
					"西藏":[91.11450,29.644150],
					"台湾":[121.50,25.05 ]
				};

				var convertData = function (data) {
				    var res = [];
				    for (var i = 0; i < data.length; i++) {
				        var geoCoord = geoCoordMap[data[i].name];
				        if (geoCoord) {
				            res.push(geoCoord.concat(data[i].value));
				        }
				    }
				    return res;
				};

        //最大值
        let dataMax =100
        let seriesDataTemp = this.series
        let tempData=[]
        for (var i = 0; i < seriesDataTemp.length; i++) {
            tempData.push(parseInt(seriesDataTemp[i].value))
        }
        dataMax = tempData.reduce(function(a , b){
          return b > a ? b : a;
        });

        let imgSrc = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAABBElEQVQ4T2NkIBOw33znyfjv/1yQ9v9MjMmMZJrDwHH97TMGBgZJqP7nlBj0H9kR9DGI8+ob839MjKUgm5n+/e/+ri1yEuYKjutviXcR+/W3axgZGIXBAcrw/+1PTeEQsgziuP5uP3I4/NAUcsRpEPu1V6pMjMx+IAX//v/d9FNL7DZCMQkGcV5/W/yfgYEXpJmRgeHzd03hXrIM4rj+tgHV+cJwPkleG8YGoQX2l++awj1kBTY0+v1Bsf/v/9/NZEc/vtxPUqzhMwgti7z7qSkcTFYWgWbaMpC3mf797yE70+L3Ngm5n4BByCXkC7ILNvZr77wYGcFl9t///xnTyDYI3bUAr2C4I10MPAcAAAAASUVORK5CYII=" width="18px">&nbsp;'
        this.chart.setOption({ // 进行相关配置
	          tooltip: {
	          	backgroundColor:'rgba(41,85,252,0.45)',
	          	borderColor: '#00E3F6',
	          	borderWidth: 1,
	          	padding: [10, 15],
	          	//trigger: 'item',
	          	formatter: function(params) {
	          		var str = params.name + '<br />';
	          		if(params.data == undefined){
	          			str = params.name
	          		}else{
                  str =
	          			str+=imgSrc+'装备数 : ' + params.value + '台<br />' +
	          			imgSrc+'装备配备率 : ' + params.data.equipRate + '%<br />' +
	          			imgSrc+'班均带宽 : ' + params.data.bandwidth + 'Mb/s<br />' ;
	          			// imgSrc+'故障率 : ' + params.data.equipFailureRate + '%';
	          		}
	          		return str;
	          	}
	          },// 鼠标移到图里面的浮动提示框
	          visualMap: {
				        min: 0,
				        max: dataMax,
				        left: 'left',
				        top: 'bottom',
				        text: ['高','低'],
				        inRange: {
                  color:['#0495FB','#0053F5','#1E11C1','#0C1768']
				            //color: ['#0d2794','#226fab','#118df3','#6cd9ff','#69f1ff'].reverse()
				        },
//				        calculable: true,
				        textStyle: {
				            color: '#fff'
				        }
				    },
				    geo: {
				        map: 'china',
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
				        roam: false,
				        zoom: 1.2,
				        itemStyle: {
									normal: {
										areaColor: 'transparent',
										borderColor: '#c6d5ff',
										borderWidth: 4,
										shadowColor: 'rgba(255, 255, 255, 1)',
										shadowBlur: 20
									},
									emphasis: {
										areaColor: '#277eea',
									}
								}
				    },
				    series: [{
				        name: '信息化',
				        type: 'map',
				        mapType: 'china',
		            roam: false,
		            zoom: 1.2,
		            label: {
		                normal: {
		                    show: true,
                        color: '#dae4ff',
		                },
		                emphasis: {
		                	show: true
		                }
		            },
		            itemStyle: {
						         normal: {
						             borderColor: "#096bf9", //省市边界线
						             // borderColor: "#a7e4e6", //省市边界线
						             // shadowColor: 'rgba(166, 230, 236, 0.6)',
						             // shadowOffsetX: 0,
						             // shadowOffsetY: 0,
						             // shadowBlur: 120
						         },
						         emphasis: {
						             areaColor:"#00E3F6",
						         }
						     },
				        //coordinateSystem: 'geo3D',
				        data: this.series
				    }]

        })

        let that = this
				this.chart.on('click', function (param) {
            console.log(param)
		        // if(param.data.value == 0){
		        //   return
		        // }
            let cityArr = ['北京','上海','天津','重庆']
            let codeType = 1
            let cityNoClickArr = ['台湾','南海诸岛','香港','澳门']
            if(cityNoClickArr.includes(param.name)){
              return
            }
            that.$router.push({
            	name: 'diama-province',
            	query: {cityName:param.data.name,codeType:codeType,cityCode:param.data.cityCode}
            })
		    });

      window.addEventListener("resize", () => { this.chart.resize();});
    }
  }
}
</script>
