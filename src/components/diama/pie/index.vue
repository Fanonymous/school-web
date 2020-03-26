<template>
  <div class="chart-box">
    <div :class="className" :id="id" :style="{height:height}"></div>
    <div class="chart-box-img" :style="'top:'+topPosistion">
      <img src="~@/assets/img/screen-no.png" class="nodata-s" v-if="xValue.length ==0">
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
        topPosistion: '100px',
        chart: null,
        xValue: [],
        yValue: [],
        yAxis: [],
        isLegend: true
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
      this.topPosistion = (parseInt(this.height.substring(0, this.height.length - 2)) - 100) / 2 + 'px';
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
        var color = []
        let seriesTemp = []
        let colorPalette = []
        let color1 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}]) //蓝
        let color2 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#00EAFF'}, {offset: 1,color: '#0B093F'}]) //青
        let color3 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#A859FF'}, {offset: 1,color: '#0B093F'}]) //紫
        let color4 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#00F7A7'}, {offset: 1,color: '#0B093F'}]) //绿
        let color5 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#FFD129'}, {offset: 1,color: '#0B093F'}]) //黄
        let color6 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
        let color7 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])
        let color8 = new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0,color: '#2880E5'}, {offset: 1,color: '#0B093F'}])

        colorPalette = [color1,color2,color3,color4,color5,color6]
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
        const colorList = ['#2EB9EF','#00F7A7','#FFDD5F','#FF6773','#bc4bd1','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
        //const colorList = ['#389EE2','#77FFFF','#3868E2','#793EA2','#F5CD32','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
        let seriesName = this.yAxis == undefined ? '百分比' : ''
        let pieRoseOption = {
          color: colorList,
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
            show: true,
            bottom: 10,
            left: 'center',
            itemHeight: 12,
            itemWidth: 12,
            data: this.xValue
          },
          series: [{

            name: seriesName,
            type: 'pie',
            // roseType: 'area',
            //avoidLabelOverlap: false,
            radius: ['0%', '40%'],
            center: ['50%', '38%'],
            label: {
              normal: {
                show: true,
                //formatter: "{d}%",
                formatter: function(data) {
                  //return data.name + "\n" + data.percent.toFixed(1) + "%";
                  return  data.percent.toFixed(1) + "%";
                },
                textStyle: {
                  fontSize: 14,
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 5,
                length2: 5
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 50,
              }
            },
            data: seriesTemp
          }]
        }
        this.chart.setOption(pieRoseOption)
        //const colorList = ['#2ee6c8','#006cd1','#bc4bd1','#00c1ff','#fffc00','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
        //const colorList = colorPalette

        function appendBaseColor(dataList, colorList, opacity){
            const temp = [];
            for (let i in dataList) {
                const tempObj = {
                    ...dataList[i],
                    itemStyle: {
                        color: colorList[i],
                        opacity: opacity
                    }
                };
                temp.push(tempObj)
            }
            return temp;
        }
        //startLoopMove()
        let that = this
        function startLoopMove() {
         let idx = 0;
         setInterval(()=>{
            clearSelectedStatus();
            pieRoseOption.series[0].data[idx]['selected'] = true;
            that.chart.setOption(pieRoseOption);
            idx++;
            if(idx>=seriesTemp.length){
                idx = 0;
            }
         }, 1000)
        }
        function clearSelectedStatus() {
            pieRoseOption.series[0].data = appendBaseColor(seriesTemp, colorList, 1)
            that.chart.setOption(pieRoseOption);
        }
        window.addEventListener("resize", () => {
          this.chart.resize();
        });
      }
    }
  }
</script>
