<template>
  <div class="mod-demo-echarts screen-charts-cont-diama screen-no-bg" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-row :gutter="0" class="full-screen-diama">
      <el-col :lg="24">
        <div class="screen-header-diama">
          <el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
            <span class="header-datetime">{{nowDate}}</span>
          </el-col>
          <el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
            <span class="screen-header-text">{{orgName}}信息化建设总览</span>
          </el-col>
          <el-col :span="6" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
            <span class="header-datetime">{{nowTime}}</span>
          </el-col>
        </div>
      </el-col>
      <el-col :lg="7">
        <el-card class="chart-card">
          <div class="chart-card-title">装备概览</div>
          <div class="chart-card-cont card-bg-left" style="height:205px">
            <el-col :span="13">
              <div class="chart-title-green">装备分布</div>
              <chart-pie-rose ref="diamaSchooltpierosechart" :id="'diamaSchooltpierosechart'" title="" height="184px" :isscreen="true"
                :series="pieRoseSeries"></chart-pie-rose>
            </el-col>
            <el-col :span="11">
              <div class="chart-title-green">使用年限分析</div>
              <chart-column ref="diamaccbarLineChart1" :themeColor='4' :id="'diamaccbarLineChart1'" height="180px" :isscreen="true" :series="barSeries4"></chart-column>
              <!-- <el-col :span="12" class="no-padding">
                <div class="card-value">
                  <div>{{kpiData.equipCount}}</div>装备总数
                </div>
              </el-col>
              <el-col :span="12" class="no-padding">
                <div class="card-value">
                  <div>{{parseInt(parseInt(kpiData.equipCount)*0.86)}}</div>开机装备
                </div>
              </el-col>
              <chart-pie-ring-one ref="diamaSchoolequipbarchartRate" :id="'diamaSchoolequipbarchartRate'" height="160px" :isscreen="true" :series="pieOneSeries3"></chart-pie-ring-one>
 -->            </el-col>
          </div>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">装备配备率</div>
          <div class="chart-card-cont card-bg-left" style="height:195px">
            <el-col :span="12">
              <chart-pie-one ref="diamaSchooltPieOne1" :id="'diamaSchooltPieOne1'" height="170px" style="margin-top:10px;" :isscreen="true"
                :series="pieOneSeries1"></chart-pie-one>
            </el-col>
            <el-col :span="12">
              <chart-pie-one ref="diamaSchooltPieOne2" :id="'diamaSchooltPieOne2'" height="170px" style="margin-top:10px;" :isscreen="true"
                :series="pieOneSeries2"></chart-pie-one>
            </el-col>
          </div>
        </el-card>
        <el-card class="chart-card card-bg-left">
          <div class="chart-card-title">网络带宽</div>
          <div class="chart-card-cont" style="height:200px">
            <el-col :span="10" style="padding:0px;text-align:center;">
              <div class="card-value"></div>
              <chart-dash-board ref="diamaSchooldashbordChart" :id="'diamaSchooldashbordChart'" height="180px" :isscreen="true" :series="dashbordSeries"></chart-dash-board>
            </el-col>
            <el-col :span="14">
              <div class="chart-title-green">传输平均速率</div>
              <chart-line ref="diamaSchoolccbarLineNetChart1" :themeColor='1' :id="'diamaSchoolccbarLineNetChart1'" height="180px" :isscreen="true" :series="lineSeries"></chart-line>
            </el-col>
          </div>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">装备配置分析</div>
          <div class="chart-card-cont card-bg-left" style="height:200px">
            <el-col :span="8" style="padding:0px">
              <div class="chart-title-green">操作系统</div>
              <chart-pie ref="diamatOperatepiechart" :id="'diamatOperatepiechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesSYS"></chart-pie>
            </el-col>
            <el-col :span="8" style="padding:0px">
              <div class="chart-title-green">CPU</div>
              <chart-pie ref="diamatCPUpierosechart" :id="'diamatCPUpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesCPU"></chart-pie>
            </el-col>
            <el-col :span="8" style="padding:0px;">
              <div class="chart-title-green">内存</div>
              <chart-pie ref="diamatRAMpierosechart" :id="'diamatRAMpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesRAM"></chart-pie>
            </el-col>
          </div>
        </el-card>
      </el-col>
      <el-col :lg="10">
        <el-card class="chart-card kpi-card">
        	<div class="text-center total-kpi-s-1 kpi-left-top">
        		<div><span class="totalkpi-dash" id="visits">{{kpiData.studentCount}}</span></div>
        		<div class="blue-grey-color">学生</div>
        	</div>
        	<div class="text-center total-kpi-s-1 kpi-left-bottom">
        		<div><span class="totalkpi-dash" id="visits">{{kpiData.teacherCount}}</span></div>
        		<div class="blue-grey-color">老师</div>
        	</div>
        	<div class="text-center total-kpi-s-1 kpi-right-top">
        		<div><span class="totalkpi-dash" id="visits">{{kpiData.classCount}}</span></div>
        		<div class="blue-grey-color">班级</div>
        	</div>
        	<div class="text-center total-kpi-s-1 kpi-right-bottom">
        		<div><span class="totalkpi-dash" id="visits">{{kpiData.softwareCount}}</span></div>
        		<div class="blue-grey-color">应用软件</div>
        	</div>
          <img src="~@/assets/img/diama/kpi-bg1.png" class="kpi-middle-bottom-2" width="96%" style="margin-left: 2%;" />
          <img src="~@/assets/img/diama/footer-bg.gif" class="kpi-middle-bottom-1" width="100%" style="margin-top: 150px;" />
        	<div class="text-center total-kpi-center-1">
        		<div class="kpi-middle-middle">
              <div><span class="totalkpi-dash-72" id="visits">{{kpiData.equipCount}}</span></div>
        			<div class="totalkpi-dash-20">装备</div>
        		</div>
        	</div>
          <el-button v-if="preCityName" class="btn-chart"  style="right: 10px;bottom:20px" type="text" @click="preInitData()">返回{{preCityName}}</el-button>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">软件使用日趋分析</div>
          <div class="chart-card-cont" style="height:265px">
           <chart-column ref="proccbarLineChart1" :themeColor='4' :id="'proccbarLineChart1'" height="260px" :isscreen="true" :series="barLineSeries1"></chart-column>
			<!-- <chart-column ref="proccbarLineChart1" :themeColor='2' :id="'proccbarLineChart1'" :standardLine="true"  height="260px" :isscreen="true" :series="barLineSeries1"></chart-column>
 -->
		  </div>
        </el-card>
      </el-col>

      <el-col :lg="7">
        <el-card class="chart-card">
          <div class="chart-card-title">信息化教学应用现状</div>
          <div class="chart-card-cont card-bg-right" style="height:200px">
            <el-col :span="10" class="no-padding">
              <div class="text-media" style="margin-top: 30px;">多媒体教学率：<font class="kpi-value1">{{kpiData.useRate || 0}}</font>%</div>
              <div class="text-media">平均使用时长：<font class="kpi-value1">{{kpiData.useTime || 0}}</font>分钟/节</div>
              <div class="text-media">交互度：
                <el-rate style="display: inline;" v-model="kpiData.interactivity/10*5 || 0" allow-half disabled
                  text-color="#40c2ee" void-color="#02e3fc" void-icon-class="icon-rate-face-off" :colors="['#F5CD32','#F5CD32','#F5CD32']"></el-rate>
              </div>
              <div class="text-media">多样性：
                <el-progress class="progress-inline" style="display: inline;" :stroke-width="12" color="#02e3fc"
                  :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
              </div>
            </el-col>
            <el-col :span="14" class="no-padding">
              <chart-radar ref="diamaSchooltradarchartUse" :id="'diamaSchooltradarchartUse'" style="margin-top:10px;" height="180px" :legendType="2"
                :isscreen="true" :series="radarSeries"></chart-radar>
            </el-col>
          </div>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">信息应用分析各学科对比</div>
          <!-- <div class="chart-card-cont card-bg-right" style="height: 200px;">
              <chart-column ref="tcolumnchartRate" :themeColor='3' :id="'tcolumnchartRate'" height="200px" :isscreen="true" :series="columnSeriesRate"></chart-column>
						</div> -->
          <div class="chart-card-cont card-bg-right" style="height:200px">
            <chart-bar-line ref="diamaSchoolccbarLineChart1" :themeColor='5' :id="'diamaSchoolccbarLineChart1'" height="195px" :isscreen="true"
              :series="barLineSeries2"></chart-bar-line>
          </div>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">多媒体教学率排行</div>
          <div class="chart-card-cont card-bg-right" style="height:200px;">
            <el-col :span="12">
              <div class="chart-title-green">年级排行</div>
              <chart-bar ref="diamaSchooltbarchart1Right" :id="'diamaSchooltbarchart1Right'" :themeColor='2' height="160px" :axisTickShow="false"
                title="" :isscreen="true" :series="barSeries2"></chart-bar>
            </el-col>
            <el-col :span="12">
              <div class="chart-title-green">教师排行Top5</div>
              <chart-bar ref="diamaSchooltbarchart2Right" :id="'diamaSchooltbarchart2Right'" :themeColor='2' height="160px" :axisTickShow="false"
                title="" :isscreen="true" :series="barSeries3"></chart-bar>
            </el-col>
          </div>
        </el-card>
        <el-card class="chart-card">
          <div class="chart-card-title">信息化教学应用分析</div>
          <div class="chart-card-cont card-bg-right" style="height: 200px;">
            <el-col :span="12">
              <div class="chart-title-green">应用分类占比</div>
              <chart-pie-rose ref="diamaSchooltpierosechartRight" :id="'diamaSchooltpierosechartRight'" title="" height="184px" :isscreen="true"
                :series="pieRoseSeries1"></chart-pie-rose>
            </el-col>
            <el-col :span="12">
              <div class="chart-title-green">应用软件Top5</div>
              <chart-bar ref="diamaSchooltbarchart3Right" :id="'diamaSchooltbarchart3Right'" :themeColor='2' height="160px" :axisTickShow="false"
                title="" :isscreen="true" :series="barSeries1"></chart-bar>
            </el-col>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- </div> -->
  </div>
</template>
<style>
  .heatmapjs-container {
    width: 100%;
    height: 200px;
  }
</style>
<script>
  import echarts from 'echarts'
  import macaronsScreen from 'macaronsScreen'
  import mediacss from '@/assets/scss/media.scss'
  import ChartArea from '@/components/diama/area'
  import ChartBar from '@/components/diama/bar'
  import ChartRadar from '@/components/diama/radar'
  import ChartPieRose from '@/components/diama/pie-rose'
  import ChartRings from '@/components/diama/rings'
  import ChartPieTwo from '@/components/diama/pie-two'
  import ChartBarLine from '@/components/diama/bar-line-zoom'
  import ChartPieRingOne from '@/components/diama/pie-ring-one'
  import ChartPieOne from '@/components/diama/pie-ring-one-diama'
  import ChartColumn from '@/components/diama/column'
  import ChartLine from '@/components/diama/line'
  import ChartPie from '@/components/diama/pie'
  import ChartDashBoard from '@/components/diama/dash-board-s'

  // import FullScreen from '../common/full-screen'
  // import CurrentRadio from './com/current-radio'
  import {
    getCommHttpData,
    getAnalysisChartData,
    getNowDate,
    getNowTime,
    getDateStr
  } from '@/utils/common'
  const fullS = require('../../../assets/img/icons/full-s.png')
  const fullE = require('../../../assets/img/icons/full-e.png')
  export default {
    components: {
      ChartArea,
      ChartBar,
      ChartRadar,
      ChartPieRose,
      ChartPieOne,
      ChartPieRingOne,
      ChartRings,
      ChartPieTwo,
      ChartColumn,
      ChartBarLine,
      ChartLine,
      ChartPie,
      ChartDashBoard
    },
    data() {
      return {
        nowDate: '--:--:--',
        nowTime: '--:--:--',
        loading: false,
        orgId: '',
        orgName: '',
        userType: this.GLOBAL.getUserType(),
        preCityName:'',
        preCityCode:'',
        preCodeType:3,
        startDate: '',
        endDate: '',
        gradeShow: true,
        subjectShow: true,
        classroomShow: true,
        gradeIds: [],
        subjectIds: [],
        classroomIds: [],
        schoolSideType: '',
        schoolType: '',
        dataListLoading: false,
        dataList: [],
        fullPic: fullS,
        chinaMapSeries: [],
        totalNetWork:100,
        kpiData: {
          schoolCount: 0,
          teacherCount: 0,
          studentCount: 0,
          equipCount: 0,
          softwareCount: 0,
          turnonRate: 0,
          classCount:0,
          equipFailureRate: 0,
          //多媒体
          diversity: 0,
          useTime: 0,
          interactivity: 0,
          useRate: 0,
        },
        heatmapData: [{
            x: 110,
            y: 5,
            value: 60
          },
          {
            x: 110,
            y: 20,
            value: 95
          },
          {
            x: 110,
            y: 50,
            value: 60
          },
          {
            x: 110,
            y: 70,
            value: 50
          },
          {
            x: 110,
            y: 80,
            value: 50
          },
          {
            x: 110,
            y: 100,
            value: 90
          },
          {
            x: 120,
            y: 120,
            value: 90
          },
          {
            x: 110,
            y: 140,
            value: 40
          },
          {
            x: 110,
            y: 160,
            value: 70
          },
          {
            x: 110,
            y: 180,
            value: 30
          },

          {
            x: 110,
            y: 190,
            value: 80
          },
          {
            x: 120,
            y: 190,
            value: 60
          },
          {
            x: 140,
            y: 190,
            value: 40
          },
          {
            x: 150,
            y: 160,
            value: 35
          },
          {
            x: 160,
            y: 190,
            value: 60
          },
          {
            x: 190,
            y: 190,
            value: 30
          },

          {
            x: 200,
            y: 190,
            value: 10
          },
          {
            x: 220,
            y: 190,
            value: 5
          },
          {
            x: 240,
            y: 190,
            value: 40
          },
          {
            x: 260,
            y: 190,
            value: 40
          },
          {
            x: 280,
            y: 190,
            value: 40
          },
          {
            x: 300,
            y: 190,
            value: 10
          },
          {
            x: 320,
            y: 190,
            value: 50
          },

          {
            x: 200,
            y: 80,
            value: 20
          },
          {
            x: 200,
            y: 80,
            value: 5
          },
          {
            x: 380,
            y: 190,
            value: 60
          },
          {
            x: 420,
            y: 190,
            value: 89
          },

          {
            x: 360,
            y: 20,
            value: 80
          },
          {
            x: 360,
            y: 30,
            value: 60
          },
          {
            x: 380,
            y: 30,
            value: 40
          },
          {
            x: 400,
            y: 30,
            value: 40
          },
          {
            x: 420,
            y: 30,
            value: 60
          },

        ],
        troubleHandleTime:0,

        radarSeries: {
          xValue: [],
          yValue: []
        },
        areaSeries: {
          xValue: [],
          yValue: []
        },
        areaSeries1: {
          xValue: [],
          yValue: []
        },
        barSeries: {
          xValue: [],
          yValue: []
        },
        barSeries1: {
          xValue: [],
          yValue: []
        },
        barSeries2: {
          xValue: [],
          yValue: []
        },
        barSeries3: {
          xValue: [],
          yValue: []
        },
        barSeries4: {
          xValue: [],
          yValue: []
        },
        barLineSeries1: {
          xValue: [],
          yValue: []
        },
        barLineSeries2: {
          xValue: [],
          yValue: []
        },
        lineSeries: {
          xValue: [],
          yValue: []
        },

        columnSeries: {
          xValue: [],
          yValue: []
        },
        columnSeriesRate: {
          xValue: [],
          yValue: []
        },
        columnSeries1: {
          xValue: [],
          yValue: []
        },
        columnSeries3: {
          xValue: [],
          yValue: []
        },
        columnSeries4: {
          xValue: [],
          yValue: []
        },
        columnSeries5: {
          xValue: [],
          yValue: []
        },

        pieRoseSeries: {
          xValue: [],
          yValue: []
        },
        pieRoseSeries1: {
          xValue: [],
          yValue: []
        },
        pieOneSeries1: {
          xValue: [],
          yValue: []
        },
        pieOneSeries2: {
          xValue: [],
          yValue: []
        },
        pieOneSeries3: {
          xValue: [],
          yValue: []
        },
        pieOneSeries4: {
          xValue: [],
          yValue: []
        },
        pieOneSeries5: {
          xValue: [],
          yValue: []
        },
        pieRingsSeries: {
          xValue: [],
          yValue: []
        },
        dashbordSeries: {
          xValue: [],
          yValue: [0]
        },
        pieRoseSeriesSYS:{
          xValue: [],
          yValue: []
        },
        pieRoseSeriesCPU:{
          xValue: [],
          yValue: []
        },
        pieRoseSeriesRAM:{
          xValue: [],
          yValue: []
        },
        topFiveList: [],
        n: 0
      }
    },
    mounted() {
      if(!this.$route.query.orgId){
        this.orgId = this.GLOBAL.getOrgId()
        this.orgName = this.GLOBAL.getOrgName()
        this.getCode()
      }else{
        this.orgName = this.$route.query.orgName
        this.preCityName = this.$route.query.preCityName
        this.preCityCode = this.$route.query.preCityCode
        this.preCodeType = this.$route.query.preCodeType
        this.deptId = this.$route.query.orgId
        this.iniChartsData()
      }


      window.addEventListener('resize', () => {
        this.resizeListener()
      })
      this.nowDate = getNowDate()
      this.nowTime = getNowTime()
      let that = this
      setInterval(function() {
        that.dateData = getNowDate()
        that.nowTime = getNowTime()
      }, 1000)
      //that.fullToggle()
    },
    //  activated () {
    //			this.resizeListener()
    //  },
    methods: {
      //查询省市区码
      getCode(){
        let that = this
        getCommHttpData({
        	url: 'country/getAreasInfo',
        	method: 'get',
        	contentType: 1,
          serverType:1,
        	data: {deptId:this.orgId,zorecode:window.SITE_CONFIG.zoreCode}
        }, function(data) {
          //数仓机构ID
          that.deptId = data.info.deptid
          that.iniChartsData()
        })
      },
      preInitData(){
        this.$router.push({
        	name: 'diama-province',
        	query: {cityCode:this.preCityCode,codeType:this.preCodeType,cityName:this.preCityName,prevType:10}
        })
      },
      resizeListener() {
        if (this.$refs.ccbarLineChart1.chart) {
          this.$refs.ccbarLineChart1.chart.resize()
        }
        if (this.$refs.tPieOne1.chart) {
          this.$refs.tPieOne1.chart.resize()
        }
        if (this.$refs.tPieOne2.chart) {
          this.$refs.tPieOne2.chart.resize()
        }

        if (this.$refs.tpierosechart.chart) {
          this.$refs.tpierosechart.chart.resize()
        }
        if (this.$refs.tbarchart2.chart) {
          this.$refs.tbarchart2.chart.resize()
        }
        if (this.$refs.tpierosechartRight.chart) {
          this.$refs.tpierosechartRight.chart.resize()
        }
        if (this.$refs.tbarchart2Right.chart) {
          this.$refs.tbarchart2Right.chart.resize()
        }
        if (this.$refs.tareachart2.chart) {
          this.$refs.tareachart2.chart.resize()
        }
        if (this.$refs.tareachart1.chart) {
          this.$refs.tareachart1.chart.resize()
        }
        if (this.$refs.tcolumnchartFail.chart) {
          this.$refs.tcolumnchartFail.chart.resize()
        }
        if (this.$refs.tradarchartUse.chart) {
          this.$refs.tradarchartUse.chart.resize()
        }

      },

      iniChartsData() {
        let that = this
        // that.dashbordSeries = {
        // 	xValue: ['间/百人'],
        // 	yValue: [2.21]
        // }
        // that.pieRingsSeries = {
        //   xValue: ['差', '中', '良', '优'],
        //   yValue: [2, 15, 18, 65],
        // }

        that.loading = true
        getCommHttpData({
          url: 'schoolScreen/infos',
          method: 'get',
          contentType: 1,
          serverType:1,
          data: {
            deptId: that.deptId
          }
        }, function(data) {
          that.loading = false
          let kpiInfo = data.info
          that.totalNetWork = 100
          that.dashbordSeries = {
          	xValue: ['间/百人'],
          	yValue: [kpiInfo.classBandwidth?kpiInfo.classBandwidth:0]
          }
          that.pieOneSeries1 = {
            xValue: [kpiInfo.classroomEquipRate.xValue[0], ''],
            yValue: kpiInfo.classroomEquipRate.yValue[0]
          }
          that.pieOneSeries2 = {
            xValue: [kpiInfo.classroomEquipRate.xValue[1], ''],
            yValue: kpiInfo.classroomEquipRate.yValue[1]
          }
          that.troubleHandleTime = kpiInfo.troubleHandleTime
          that.pieOneSeries3 = {
            xValue: ['开机率', ''],
            yValue: 86
          }
          that.pieOneSeries5 = {
            xValue: ['当前故障率', ''],
            yValue: kpiInfo.equipTroubleRate
          }
          that.barSeries4 = {
            xValue: kpiInfo.softwareUseYearAnalyse.xValue,
            yValue:
              [kpiInfo.softwareUseYearAnalyse.yValue],
            seriaName: ['装备数'],
            seriaType: ['bar'],
            yAxis: [{
              name: '台',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel:'台'
            }]
          }

          if(kpiInfo.equipTroubleAnalyseMap && kpiInfo.equipTroubleAnalyseMap.xValue){
            that.columnSeries1 = {
              xValue: kpiInfo.equipTroubleAnalyseMap.xValue,
              yValue:
                [kpiInfo.equipTroubleAnalyseMap.yValue],
              seriaName: ['装备数'],
              seriaType: ['bar'],
              yAxis: [{
                name: '台',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:'台'
              }]
            }
          }
          if(kpiInfo.equipAlarmAnalyseMap && kpiInfo.equipAlarmAnalyseMap.xValue){
            that.areaSeries1 = {
              xValue: kpiInfo.equipAlarmAnalyseMap.xValue,
              yValue: kpiInfo.equipAlarmAnalyseMap.yValue,
              seriaName: ['数量'],
              yAxis: [{
                name: '台',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:'台'
              }]
            }
          }
          that.kpiData = {
            teacherCount: kpiInfo.teacherCount,
            studentCount: kpiInfo.studentCount,
            equipCount: kpiInfo.equipCount,
            softwareCount: kpiInfo.softwareCount,
            classCount:kpiInfo.classCount,
            turnonRate: 86,
            diversity: kpiInfo.diversity,
            useTime: kpiInfo.useTime,
            interactivity: kpiInfo.interactivity,
            useRate: kpiInfo.useRate
          }
          that.pieRoseSeries = kpiInfo.equipTypeRate

          that.pieRoseSeriesSYS = kpiInfo.systemAnalyseMap
          that.pieRoseSeriesCPU = kpiInfo.cpuAnalyseMap
          that.pieRoseSeriesRAM = kpiInfo.ramAnalyseMap
          let dataObj = []
          //排序降序，取前20个条数据
          // if(kpiInfo.everyProvince.yValue1.length >0){
          //   kpiInfo.everyProvince.yValue1.forEach((item,index)=>{
          //     dataObj.push({name:kpiInfo.everyProvince.xValue[index],value:item})
          //   })
          //   dataObj.sort(compareDown(dataObj,'value'))
          //   dataObj.forEach((item,index)=>{
          //     yValueNetWork.push(item.value)
          //     xValueNetWork.push(item.name)
          //   })
          // }
          if(kpiInfo.softwardAddUsetimeAnalyseMap.xValue.length > 0){
            that.barLineSeries1 = {
              xValue: kpiInfo.softwardAddUsetimeAnalyseMap.xValue,
              yValue:[kpiInfo.softwardAddUsetimeAnalyseMap.yValue1,
              kpiInfo.softwardAddUsetimeAnalyseMap.yValue2,
              kpiInfo.softwardAddUsetimeAnalyseMap.yValue3,
              kpiInfo.softwardAddUsetimeAnalyseMap.yValue4,
              kpiInfo.softwardAddUsetimeAnalyseMap.yValue5,
              kpiInfo.softwardAddUsetimeAnalyseMap.yValue6],
              seriaName: kpiInfo.softwardAddUsetimeAnalyseMap.xValue1,
              // seriaName: ['班均带宽(Mb/s)'],
              seriaType: ['bar'],
              yAxis: [{
                name: '分钟',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:'分钟'
              }]
            }
          }else{
            that.barLineSeries1 = {
            	xValue: [],
            	yValue:[],
            	seriaName: [],
            	seriaType: [],
            	yAxis: []
            }

          }


          that.barLineSeries2 = {
            xValue: kpiInfo.subjectAnalyse.xValue.slice(0, 20),
            yValue: [
              kpiInfo.subjectAnalyse.yValue.slice(0, 20),
              kpiInfo.subjectAnalyse.yValue1.slice(0, 20),
              //          		kpiInfo.everyProvince.yValue.slice(0,20)
            ],
            seriaName: ['平均使用时长', '教学率'],
            seriaType: ['bar', 'line'],
            yAxis: [{
              name: '分钟',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel: '分钟'
            }, {
              name: '%',
              min: 0,
              max: 100,
              interval: 20,
              axisLabel: '',
              tipLabel: '%'
            }]
          }
          that.lineSeries = {
            xValue: kpiInfo.networkUpDownAnalyseMap.xValue,
            yValue: [
              kpiInfo.networkUpDownAnalyseMap.yValue,
              kpiInfo.networkUpDownAnalyseMap.yValue1
            ],
            seriaName: ['上行','下行'],
            yAxis: [{
              name: 'Mbp',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel: 'Mbp'
            }]
          }

          that.radarSeries = {
            xValue: ['使用时长', '交互度', '多样性', '教学率'],
            yValue: [[kpiInfo.usetimeRate,kpiInfo.interactivityRate,kpiInfo.diversityRate,kpiInfo.useRateRate],[kpiInfo.teachTimeRateOther,kpiInfo.interactionRateOther,kpiInfo.diversityRateOther,kpiInfo.useTeachRatOther]],
            seriaName: ['我校应用水平','全区应用平均水平'],
            yAxis: [{
              max: 100,
              tipLabel: '%'
            }]
          }

          that.pieRoseSeries1 = kpiInfo.equipAppAnalyse
          if(kpiInfo.softUseTop10 && kpiInfo.softUseTop10.xValue){
            that.barSeries1 = {
              xValue: kpiInfo.softUseTop10.xValue.slice(0, 5).reverse(),
              yValue: [kpiInfo.softUseTop10.yValue.slice(0, 5).reverse()],
              seriaName: ['应用排行'],
              seriaType: ['bar'],
              yAxis: [{
                name: '次数',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel: '次'
              }]
            }
          }
          that.barSeries2 = {
            xValue: kpiInfo.gradeTop.xValue.slice(0, 5).reverse(),
            yValue: [kpiInfo.gradeTop.yValue.slice(0, 5).reverse()],
            seriaName: ['年级排行'],
            seriaType: ['bar'],
            yAxis: [{
              name: '',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel: '%'
            }]
          }
          that.barSeries3 = {
            xValue: kpiInfo.teacherTop10.xValue.slice(0, 5).reverse(),
            yValue: [kpiInfo.teacherTop10.yValue.slice(0, 5).reverse()],
            seriaName: ['教师排行'],
            seriaType: ['bar'],
            yAxis: [{
              name: '',
              min: 0,
              max: null,
              interval: null,
              axisLabel: '',
              tipLabel: '%'
            }]
          }


          that.resizeListener()
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }
</style>
