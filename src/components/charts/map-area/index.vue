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
      },
      mapdata: {
        type: String,
        default: ''
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
        //				this.yValue = val.yValue
        //				this.seriaName = val.seriaName
        //				this.xAxis = val.xAxis
        //				this.yAxis = val.yAxis
        this.initChart()
      },
      mapdata() {
        this.initChart()
      }

    },
    mounted() {
      this.topPosistion = (parseInt(this.height.substring(0, this.height.length - 2)) - 100) / 2 + 'px';
      this.initChart()
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
        //this.$http.get('/static/json/' + this.mapdata + '.json').then((response) => {
	if(this.mapdata == ''){
          return
        }
        this.$http.get(window.SITE_CONFIG.webIp+window.SITE_CONFIG.packageName+'/static/json/' + this.mapdata + '.json').then((response) => {
          //console.log(response)
          var geoCoordMap = {}
          var data = this.series

          let arrTemp = [],rangeColor =[], visualShow = true,visualMap={},seriesData = []
          //最大值
          let dataMax =200
          let roamMap = false
          let geoShow = false
          if (this.mapdata.indexOf('county') > -1) {

            roamMap = true
            geoShow = true

            arrTemp = {
              features: [response.data.features],
              type: "FeatureCollection"
            }
            visualShow = false
          } else {
            arrTemp = response.data
          }
          data.forEach(item=>{
          		geoCoordMap[item.name] = item.locations
          })

          var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
              var geoCoord = geoCoordMap[data[i].name];
              if (geoCoord) {
                //res.push({name:data[i].name,value:data[i].value,equipRate:data[i].equipRate,bandwidth:data[i].bandwidth,equipFailureRate:data[i].equipFailureRate,equipRate:data[i].equipRate})
                res.push(geoCoord.concat({value:data[i].value,cityCode:data[i].cityCode,name:data[i].name,typeList:data[i].typeList}));
              }
            }
            return res;
          };
          seriesData = [{
              name: '',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke',
                period: 7,
                scale: 5
              },
              symbolSize: 12,
              showEffectOn: 'render',
              itemStyle: {
                normal: {
                  color: '#F09938'
                }
              },
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: '#ffffff',
                  borderWidth: 1
                }
              },
              data: convertData(data),
            }]
          echarts.registerMap('beijing', arrTemp)
          this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
          let imgSrc =
            '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAABBElEQVQ4T2NkIBOw33znyfjv/1yQ9v9MjMmMZJrDwHH97TMGBgZJqP7nlBj0H9kR9DGI8+ob839MjKUgm5n+/e/+ri1yEuYKjutviXcR+/W3axgZGIXBAcrw/+1PTeEQsgziuP5uP3I4/NAUcsRpEPu1V6pMjMx+IAX//v/d9FNL7DZCMQkGcV5/W/yfgYEXpJmRgeHzd03hXrIM4rj+tgHV+cJwPkleG8YGoQX2l++awj1kBTY0+v1Bsf/v/9/NZEc/vtxPUqzhMwgti7z7qSkcTFYWgWbaMpC3mf797yE70+L3Ngm5n4BByCXkC7ILNvZr77wYGcFl9t///xnTyDYI3bUAr2C4I10MPAcAAAAASUVORK5CYII=" width="18px">&nbsp;'
          this.chart.setOption({ // 进行相关配置
            title: {
              text: this.title,
              textStyle: {
              	fontSize: '15',
                  fontWeight: 'bold',
                  color: '#ffffff'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.45)',
              borderColor: '#00E3F6',
              borderWidth: 1,
              padding: [10, 15],
              //trigger: 'item',
              formatter: function(params) {
                console.log(params)
                var str = '';
                if (params.data == undefined) {
                  str = params.name
                }else if (Array.isArray(params.data)) {
                  str = params.data[2].name+'：'+params.data[2].value+'人'
                  for(let i=0;i< params.data[2].typeList.length;i++ ){
						if(params.data[2].typeList[i].value > 0){
							str+= '<br />'+params.data[2].typeList[i].name+'：'+params.data[2].typeList[i].value+'人'
						}
                  }
                  //str += params.data[7]+'<br>专任老师 : ' + params.data[2] + '人<br />工勤人员 : ' + params.data[4] + '人<br />教辅人员 : ' +params.data[5] + '人<br />' ;
                }  else {
                  str = params.name + '<br />'
                    str += imgSrc + '专任老师 : ' + params.value + '台<br />' +
                    imgSrc + '工勤人员 : ' + params.data.equipRate + '%<br />' +
                    imgSrc + '教辅人员 : ' + params.data.bandwidth + 'Mb/s<br />' ;
                    // imgSrc + '故障率 : ' + params.data.equipFailureRate + '%';
                }
                return str;
              }
            },
            //visualMap: visualMap,
            geo: {
              map: 'beijing',
              label: {
                normal: {
                  color: '#6cb9e7',
                  fontSize: 14,
                  show: true
                },
                emphasis: {
                  show: false
                }
              },
              roam: roamMap,
              zoom: 1.2,
              itemStyle: {
                normal: {
                  areaColor: '#fffae8',
                  borderColor: '#e1e6eb',
                  borderWidth: 4,
                  shadowColor: 'rgba(255, 255, 255, 1)',
                  shadowBlur: 30,
                },
                emphasis: {
                  areaColor: visualShow?'#00c6c4':'#fffae8',
                }
              }
            },
            series: seriesData
          })
          this.chart.resize();
          window.addEventListener("resize", () => {
            this.chart.resize();
          });
        })
      }
    }
  }
</script>
