<template>
  <div class="chart-box">
    <div :class="className" :id="id" :style="{height:height}"></div>
    <div class="chart-box-img"   :style="'top:'+topPosistion">
      <img src="~@/assets/img/screen-no.png"  class="nodata-s" v-if="xValue.length ==0">
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
        yAxis: [],
        isLegend: true,
        topPosistion:'100px',
      }
    },
    watch: {
      series(val) {
        this.xValue = val.xValue
        this.yValue = val.yValue
        this.yAxis = val.yAxis
        this.initChart()
      }
    },
    mounted() {
      this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
      this.initChart()
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
        this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
        var colorPalette = ['#30CDE0','#793EA2','#484599','#8A376F','#A859FF','#6B89FF','#30CDE0','793EA2','#484599','#8A376F'];
        let seriesTemp = []
        this.chart.resize();
        if (this.yValue.length > 0 && this.xValue.length > 0) {
          for (let i in this.xValue) {
            seriesTemp.push({
              name: this.xValue[i],
              value: this.yValue[i]
            })

          }
        }
        if (seriesTemp.length == 0) {
          seriesTemp = []
        }
        if (this.xValue.length > 1) {
          this.isLegend = true
        }
        let seriesName = this.yAxis == undefined ? '百分比' : this.yAxis[0].name
        this.chart.setOption({
          color:colorPalette,
          title: {
            text: this.title
          },
          tooltip: {
            trigger: 'item',
            //formatter: "{a} <br/>{b}: {c} ({d}%)",
            formatter: function(data) {
              return data.name + "<br/>数量： " + data.value + "<br/>占比：" + data.percent.toFixed(1) + "%";
            }
          },
          toolbox: {
            right: 20,
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            show: this.isLegend,
            orient: 'vertical',
            icon: 'circle',
            //						x: 'right',
            y: 40,
            orient: 'vertical',
            right: "5%",
            data:  this.xValue
          },
          series: [{
              name: '访问来源',
              type: 'pie',
              selectedMode: 'single',
              radius: [0, '30%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: this.yValue[0]
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                normal: {
                  formatter: '{b}  ',
                  // backgroundColor: '#eee',
                  // borderColor: '#aaa',
                  // borderWidth: 1,
                  // borderRadius: 4,
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data: this.yValue[1]
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
