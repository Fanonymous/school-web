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
      themeColor:{
      	type: Number,
      	default: 1
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
      },
      axisTickShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        topPosistion: '100px',
        chart: null,
        seriesNameArr: [],
        xValue: [],
        yValue: [],
        seriaName: [],
        zoomShow: false,
        start: 100,
        end: 0,
        dataViewShow: false,
        yAxis: [{
          type: 'bar',
          name: '',
          min: 0,
          max: 100,
          interval: 1,
          axisLabel: ''
        }],
        isLegend: false,
        yAxisLine: false,
        xAxisLine: false,
      }
    },
    watch: {
      series(val) {
        console.log(val)
        this.xValue = val.xValue
        this.yValue = val.yValue
        this.seriaName = val.seriaName
        this.yAxis = val.yAxis
        this.initChart()
      }
    },
    activated() {
      if (!this.chart) {
        return
      }
      this.chart.resize()
    },
    mounted() {
      this.topPosistion = (parseInt(this.height.substring(0, this.height.length - 2)) - 100) / 2 + 'px';
    },
    beforeDestroy() {
      //  if (!this.chart) {
      //    return
      //  }
      //  this.chart.dispose()
      //  this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(document.getElementById(this.id), 'macarons-screen')
        let seriesTemp = []
        let xAxisTemp = []
        let tipLabel = this.yAxis[0].tipLabel
        tipLabel = tipLabel != undefined ? tipLabel : ''
        if (this.yValue[0].length > 20) {
          this.start = 100
          this.end = 70
          this.zoomShow = true
          this.dataViewShow = true

        } else if (this.yValue[0].length > 10 && this.yValue[0].length < 20) {
          this.start = 100
          this.end = 30
          this.zoomShow = true
          this.dataViewShow = true
        } else {
          this.start = 0
          this.end = 100
        }
        if (this.seriaName.length > 0 && this.xValue.length > 0) {
          this.yAxisLine = true
          for (let i in this.seriaName) {
            let labelshow = this.yAxis && this.yAxis[0].labelshow?true:false
            seriesTemp.push({
              name: this.seriaName[i],
              type: 'bar',
              barMaxWidth: 15,
              itemHeight: 12,
              itemWidth: 12,
              data: this.yValue[i],
              label: {
                show:labelshow,
                color:'#bedbff',
                position:'right',
                formatter: '{c} ' + this.yAxis[0].axisLabel[i]
              },
              itemStyle: {
                  normal: {
                      borderColor: '#33D9FB',//边框颜色
                      borderWidth: this.themeColor == 2?0:1,//边框宽度
                  }
              }
            })

          }
          for (let i in this.yAxis) {
            xAxisTemp.push({
              show: this.axisTickShow,
              type: 'value',
              name: this.yAxis[i].name,
              min: this.yAxis[i].min,
              max: this.yAxis[i].max,
              interval: this.yAxis[i].interval,
              axisLabel: {
                show: true,
                formatter: '{value} ' + this.yAxis[i].axisLabel
              }
            })
          }
        }

        if (seriesTemp.length == 0) {
          this.yAxisLine = false
          seriesTemp = [{
            name: '',
            type: 'bar',
            data: []
          }]
          xAxisTemp = [{
            type: 'value',
            show: false
          }]
        }

        if (this.seriaName.length > 1) {
          this.isLegend = true
        }
        // var colorPalette = [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //   offset: 0,
        //   color: '#447FD3'
        // }, {
        //   offset: 1,
        //   color: '#A859FF'
        // }]), new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //   offset: 0,
        //   color: '#00EAFF'
        // }, {
        //   offset: 1,
        //   color: '#0B093F'
        // }])]
        let color1 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0,color: '#447FD3'}, {offset: 1,color: '#A859FF'}])
        let color2 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0,color: '#0B093F'}, {offset: 1,color: '#2880E5'}])
        let color3 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0,color: '#0B093F'}, {offset: 1,color: '#00EAFF'}])
        let color4 = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0,color: '#0B093F'}, {offset: 1,color: '#A859FF'}])
        let colorPalette = []
        if(this.themeColor == 1){
          colorPalette = ['#2ee6c8','#006cd1','#bc4bd1','#00c1ff','#fffc00','#ff3363','#2ee66f','ff9625','#ff5490','#78dbf0'];
        }else if(this.themeColor == 2){
          colorPalette = [color1,color2]
        }else if(this.themeColor == 3){
          colorPalette = [color3,color4]
        }else{
          colorPalette = [color3,color1]
        }

        this.chart.setOption({
          color: colorPalette,
          title: {
            text: this.title
          },
          tooltip: {
            formatter: function(params) {
              return params.name + '：' + params.value + tipLabel
            }
          },
          toolbox: {
            show: false,
            right: 20,
            feature: {
              dataView: {
                show: this.dataViewShow,
                readOnly: true,
                textareaBorderColor: '#c8c8c8',
                buttonColor: '#30b8ac'
              },
              saveAsImage: {
                show: true
              }
            }
          },
          grid: {
            top: '0px',
            left: '5%',
            right: '50px',
            bottom: '5%',
          },
          legend: {
            show: this.isLegend,
            bottom: 0,
            left: 'center',
            itemHeight: 12,
            itemWidth: 12,
            data: this.seriaName
          },
          xAxis: xAxisTemp,
          yAxis: {
            axisLine: {
              show: this.axisTickShow,
            },
            axisTick: {
              show: this.axisTickShow
            },
            type: 'category',
            data: this.xValue
          },
          dataZoom: [{
            type: 'slider',
            show: this.zoomShow,
            yAxisIndex: [0],
            height: 15,
            left: '90%',
            start: this.start,
            end: this.end
          }],
          series: seriesTemp
        },true)
        window.addEventListener("resize", () => {
          if (!this.chart) {
            return
          }
          this.chart.resize();
        });
      }
    }
  }
</script>
