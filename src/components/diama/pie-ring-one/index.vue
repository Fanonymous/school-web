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
        topPosistion:'100px',
        chart: null,
        xValue: [],
        yValue: []
      }
    },
    watch: {
      series(val) {
        this.xValue = val.xValue
        this.yValue = val.yValue
        this.initChart()
      }
    },
    mounted() {
      this.topPosistion = (parseInt(this.height.substring(0,this.height.length-2))-100)/2+'px';
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

        var data = this.yValue; //数值大小
        var max = 100; //满刻度大小
        this.chart.setOption({
          title: [{
          	text: this.title
          },{
                 text: this.yValue+'%',
                 textStyle: {
                     fontSize: 22,
                     color: ['#06e2b3']
                 },
                 x: 'center',
          	     top:'30%'

             },{
                 subtext: this.xValue[0],
                 subtextStyle: {
                     color: '#bedbff',
                     fontSize: 12
                 },
                 x: 'center',
          	     top:'40%'

             }
          ],
          "color": ["#242362", '#242362', '#242362'],
          "series": [{
            "type": "pie",
            "center": ["50%", "43%"],
            "radius": ["70%", "73%"],
            "hoverAnimation": false,
            "data": [{
                "name": "",
                "value": data,
                "itemStyle": {
                  "normal": {
                    "color": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      "offset": 0.05,
                      "color": '#B66EE2'
                    }, {
                      "offset": 0.5,
                      "color": '#4BA6FD'
                    }, {
                      "offset": 1,
                      "color": '#8D86EF'
                    }]),
                  }
                },
                "label": {
                  "show": false,
                  "position": "center",
                  "color": "#242362",
                  "fontSize": 38,
                  "fontWeight": "bold",
                  "formatter": function(o) {
                    return data
                  }
                },
                labelLine: {
                  show: false,
                  emphasis: {
                    show: false
                  }
                }
              },
              { //画中间的图标
                "name": "",
                "value": 0,
                "label": {
                  position: 'inside',
                  backgroundColor: {
                    image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACi0lEQVRIS7WVT0wTURDGvzdvtwttqTRWRWuLGjBG0AQCaOJBPWjUGBMTD96Mf2KMRM4eOXomIVZj8OrBhMSDknjAg0YDFaNiYoQIpVbRgFQo1e3ue89sY6WspRGFd9yd/e3MN2++YVjijIx0GXPcs0NoshaS1jEGLxiEUsiAyTS3KVElcm/r6zvMUgjmftivOrU1iZpWAdb8wRJ6ygLSpsR3CYCASgKqdUJYBzbr3OJQQ99qJwcPsk67mLUI/GykK6B7PCdSORl6lZWYXxT6Z14+DdjtJYQ9NGXlcvf21nfMFqJ+g4e/dPt/ZLXTr7PC/y6f3t+f7ZWEXV6eqfDadxrXt2ecL/Ngp3x/csOp4YyqWS608HsH3uhnk5nI57uOLHnwwMTN1pRp7xuYXV6m7praAoRagx43Ry/FmdP9GcM41zdtGaUUIKIGzvgBIhVxQFKypFDikZTyjRvsNPbIWt0MmmYPG0rEdo7l5OF4iWw1zo8RsUOl1JZSPbSFuO9+1xIgbOXUz54nrh9/OqfqUuZiGZxMNU4XyrXQFvKWO/OwQdgTwHs2OB47/2DGrnLLoHO9nZGqKwdWko1awuoujnHkOBrU5lg8EbvS+9Xm0tU3Q9euKcAoB2aAaVr21eIYAnAypAkWn4hd7p22PSsPTtw405e2gu4p+28pVq15q3bd+sduV/h47uxSA8I5NRL4fkYq6jRJSTZRdkCqdTNomz0rPtJhQ3vSFr04uLom5JRYsM2XWeEfXaZtbqskNJWyzcIF/xejb/ASouWMvgB3vNmX3NQEqJakKYxPJpC2fq0mLKymjQYQMbgJsPh85OOLsqupeDQXlim2QCLEGPPlb4VS8yBMcRvj5ZbpT8w9eHz5e+VAAAAAAElFTkSuQmCC'
                  },
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  padding: 10
                }
              }, { //画剩余的刻度圆环
                "name": "",
                "value": max - data,
                "label": {
                  show: false
                },
                labelLine: {
                  show: false,
                  emphasis: {
                    show: false
                  }
                },
              }
            ]
          }]
        })
        window.addEventListener("resize", () => {
          this.chart.resize();
        });
      }
    }
  }
</script>
