<template>
  <div class="chart-box">
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
      },
      titleCenter:{
        type: String,
        default: ''
      },
      titleCenterValue:{
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        chart: null,
        xValue: [],
        yValue: [],
        yAxis: [],
        isLegend: true,

      }
    },
    watch: {
      series(val) {
        this.xValue = val.xValue
        this.yValue = val.yValue
        this.yAxis = val.yAxis
        this.titleCenter = val.titleCenter
        this.titleCenterValue = val.titleCenterValue
        this.initChart()
      }
    },
    mounted() {
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
        this.chart = echarts.init(document.getElementById(this.id), 'macarons')
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
        console.log(seriesTemp)
        if (this.xValue.length > 1) {
          this.isLegend = true
        }
        let seriesName = this.yAxis == undefined ? '占比' : this.yAxis[0].name
        this.chart.setOption({
          title: [{
            text: this.title
          },{
                 text: this.titleCenter,
                 subtext: this.titleCenterValue+'台',
                 textStyle: {
                     fontSize: 14,
                 },
                 subtextStyle: {
                     fontSize: 18,
                     color: ['#3c85ee']
                 },
                 x: 'center',
                 y: 'center',
             }
          ],
          tooltip: {
            trigger: 'item',
            //formatter: "{a} <br/>{b}: {c} ({d}%)",
            formatter:function(data){
              return  data.name+ " : " + data.value + " ("+data.percent.toFixed(1)+"%)";
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
            radius: ['30%', '50%'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: true,
                //formatter: "{b}\n\n数量: {c}  百分比：{d}%",
                formatter:function(data){

                  return data.name + "\n\n数量: "+ data.value+ "  占比：" + data.percent.toFixed(1) + "%";
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
                length: 60,
                length2: 60
              },
              emphasis: {
                show: true
              }
            },
            data: seriesTemp
          }]
        })
        window.addEventListener("resize", () => {
          this.chart.resize();
        });
      }
    }
  }
</script>
