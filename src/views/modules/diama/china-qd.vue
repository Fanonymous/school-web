<template>
	<div class="mod-demo-echarts screen-charts-cont-diama" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
			<el-row :gutter="0" class="full-screen-diama">
        <el-col :lg="24">
            <div class="screen-header-diama">
                <el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
                  <span class="header-datetime">{{nowDate}}</span>
                </el-col>
                <el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
                  <span class="screen-header-text">全国教育信息化建设总览</span>
                  <!-- <span class="screen-header-text"><router-link to="/diama-china-out" target="_blank"  style="color: #FFFFFF;">全国教育信息化建设总览</router-link></span> -->
                </el-col>
                <el-col :span="6" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
                  <span class="header-datetime">{{nowTime}}</span>
                </el-col>
            </div>
        </el-col>
				<el-col :lg="7">
					<el-card class="chart-card">
						<div class="chart-card-title">装备配备率</div>
						<div class="chart-card-cont card-bg-left" style="height:200px">
							<el-col :span="6" >
								<chart-pie-one ref="chinatPieOne1" :id="'chinatPieOne1'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries1"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="chinatPieOne2" :id="'chinatPieOne2'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="chinatPieOne3" :id="'chinatPieOne3'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries3"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="chinatPieOne4" :id="'chinatPieOne4'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries4"></chart-pie-one>
							</el-col>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">装备资产统计</div>
						<div class="chart-card-cont card-bg-left" style="height:195px">
              <el-col :span="12">
                <div class="chart-title-green">装备类型占比</div>
                <chart-pie-rose ref="chinatpierosechart" :id="'chinatpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeries"></chart-pie-rose>
              </el-col>
              <el-col :span="12">
                <div class="chart-title-green">装备品牌排行TOP5</div>
                <chart-bar ref="chinatbarchart2" :id="'chinatbarchart2'" :themeColor='2' height="160px"  title="" :axisTickShow="false"  :isscreen="true" :series="barSeries"></chart-bar>
              </el-col>
						</div>
					</el-card>
          <el-card class="chart-card card-bg-left">
          	<div class="chart-card-title">近半年装备量趋势分析</div>
          	<div class="chart-card-cont" style="height:200px">
          		<chart-area ref="chinatareachart2" :id="'chinatareachart2'" :themeColor='4' height="200px" :isscreen="true" :series="areaSeries"></chart-area>
          	</div>
          </el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">装备故障概览</div>
						<div class="chart-card-cont card-bg-left" style="height:200px">
              <el-col :span="14" style="padding:0px">
                <chart-column ref="chinatcolumnchartFail" :themeColor='4' :id="'chinatcolumnchartFail'" height="200px" :isscreen="true" :series="columnSeries1"></chart-column>
              </el-col>
              <el-col :span="10" style="padding:0px;text-align:center;">
                <div class="card-value">平均处理时长：23分钟</div>
                <chart-pie-ring-one ref="chinatbarchartTime" :id="'chinatbarchartTime'" height="180px" :isscreen="true" :series="pieOneSeries5"></chart-pie-ring-one>
              </el-col>
						</div>
					</el-card>
				</el-col>
				<el-col :lg="10">
					<el-card class="chart-card kpi-card">
						<!-- <div class="screen-map-title">教育信息化发展情况</div> -->
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">学校</div>
              <div><span class="kpi-value">{{kpiData.schoolCount}}</span>所</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">教师</div>
              <div><span class="kpi-value">{{kpiData.teacherCount}}</span>人</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">学生</div>
              <div><span class="kpi-value">{{kpiData.studentCount}}</span>人</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">装备数</div>
              <div><span class="kpi-value">{{kpiData.equipCount}}</span>台</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">应用数</div>
              <div><span class="kpi-value">{{kpiData.softwareCount}}</span>个</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">开机率</div>
              <div><span class="kpi-value">{{kpiData.turnonRate}}</span>%</div>
            </el-col>
						<div class="current-radio-screen">
							<!--<current-radio :currScreen="'1'"></current-radio> -->
						</div>
						<div >
							<chart-map-china ref="chinadiamaMapChinaChart" :id="'chinadiamaMapChinaChart'" height="560px" :isscreen="true" :series="chinaMapSeries"></chart-map-china>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">各省市信息化网络建设分析</div>
						<div class="chart-card-cont" style="height:265px">
								<!-- <chart-bar-line ref="ccbarLineChart1" :id="'ccbarLineChart1'" height="280px" :isscreen="true" :series="barLineSeries1"></chart-bar-line> -->
								<chart-bar-line ref="chinaccbarLineChart1" :themeColor='4' :id="'chinaccbarLineChart1'" height="260px" :isscreen="true" :series="barLineSeries1"></chart-bar-line>

						</div>
					</el-card>
				</el-col>

				<el-col :lg="7">
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学应用现状</div>
						<div class="chart-card-cont card-bg-right" style="height:200px">
              <el-col :span="9"  class="no-padding">
                <div class="text-media" style="margin-top: 30px;">多媒体教学率：<font class="kpi-value1">{{kpiData.useRate || 0}}</font>%</div>
                <div class="text-media">平均使用时长：<font class="kpi-value1">{{kpiData.useTime || 0}}</font>分钟/节</div>
                <div  class="text-media">交互度：
                  <el-rate style="display: inline;" v-model="kpiData.interactivity/10*5 || 0" allow-half disabled text-color="#40c2ee" void-color="#02e3fc" void-icon-class="icon-rate-face-off" :colors="['#F5CD32','#F5CD32','#F5CD32']"></el-rate>
                </div>
                <div  class="text-media">多样性：
                <el-progress class="progress-inline"  style="display: inline;" :stroke-width="12" color="#02e3fc" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
                </div>
              </el-col>
              <el-col :span="15" class="no-padding">
               <chart-radar ref="chinatradarchartUse" :id="'chinatradarchartUse'" style="margin-top:10px;" height="180px" :isscreen="true" :series="radarSeries"></chart-radar>
              </el-col>
            </div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学应用分析</div>
						<!-- <div class="chart-card-cont card-bg-right" style="height: 200px;">
              <chart-column ref="tcolumnchartRate" :themeColor='3' :id="'tcolumnchartRate'" height="200px" :isscreen="true" :series="columnSeriesRate"></chart-column>
						</div> -->
            <div class="chart-card-cont card-bg-right" style="height:195px">
              <el-col :span="12">
                <div class="chart-title-green">应用分类占比</div>
                <chart-pie-rose ref="chinatpierosechartRight" :id="'chinatpierosechartRight'" title="" height="184px" :isscreen="true" :series="pieRoseSeries1"></chart-pie-rose>
              </el-col>
              <el-col :span="12">
                <div class="chart-title-green">应用软件Top5</div>
                <chart-bar ref="chinatbarchart2Right" :id="'chinatbarchart2Right'" :themeColor='2' height="160px" :axisTickShow="false" title=""  :isscreen="true" :series="barSeries1"></chart-bar>
              </el-col>
            </div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">使用习惯热力图</div>
						<div class="chart-card-cont card-bg-right" style="height:200px;">
              <div class="heatmap-bg">
                <heatmapjs-vue class="heatmapjs-container" :max="100" :min="0" :data="heatmapData"></heatmapjs-vue>
              </div>

              <!-- <chart-pie-two ref="tPieChart" :id="'tPieChart'" height="200px" :isscreen="true" :series="pieSeries"></chart-pie-two> -->
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">装备运维状况</div>
						<div class="chart-card-cont card-bg-right" style="height: 199px;">
							<el-col :span="8">
								<chart-rings ref="chinatPieRingsChart" :id="'chinatPieRingsChart'" height="200px" :isscreen="true" :series="pieRingsSeries"></chart-rings>
							</el-col>
							<el-col :span="16">
                <div class="chart-title-green">近七天装备告警分析</div>
                <chart-area ref="chinatareachartoperation" :themeColor='5' :id="'chinatareachartoperation'" height="180px" :isscreen="true" :series="areaSeries1"></chart-area>
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
	import ChartBarProcess from '@/components/charts/bar-process'
  import ChartPieRingOne from '@/components/diama/pie-ring-one'
	import ChartPieOne from '@/components/diama/pie-ring-one-diama'
	import ChartPieHalf from '@/components/charts/pie-ring-half'
	import ChartColumn from '@/components/diama/column'
	import ChartDashBoard from '@/components/charts/dash-board'
	import ChartLiquidFill from '@/components/charts/liquidfill'
	import ChartStackedBar from '@/components/charts/stacked-bar'
	import ChartPie from '@/components/charts/pie-s'
	import ChartMapChina from '@/components/diama/map-china'
	import { getCommHttpData, getAnalysisChartData, getNowDate, getNowTime,getDateStr } from '@/utils/common'
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
			ChartPieHalf,
			ChartColumn,
			ChartDashBoard,
			ChartLiquidFill,
			ChartBarProcess,
			ChartBarLine,
			ChartStackedBar,
			ChartPie,
			ChartMapChina
		},
		data() {
			return {
				nowDate: '--:--:--',
				nowTime: '--:--:--',
				loading:false,
				orgId: this.GLOBAL.getOrgId(),
				userType: this.GLOBAL.getUserType(),

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
				chinaMapSeries:[],
				kpiData: {
					schoolCount: 0,
					teacherCount: 0,
					studentCount: 0,
					equipCount: 0,
					softwareCount: 0,
          turnonRate:0,

          equipFailureRate:0,
					//网络建设
					//资源
					// fileNum:{
					// 	countFileNum: 0,
					// 	countVolume: 0,
					// 	nowMonthFileNum: 0,
					// },
					// schoolNetinRat: 0,
					// schoolNetinCityRat: 0,
					// schoolNetinVillageRat: 0,
					// schoolNetinTotal: 0,
					// schoolNetoutTotal: 0,

					// //教学环境建设
					// mediaClassroomRat: 0,
					// mediaClassroomRatCs: 0,
					// mediaClassroomRatNc: 0,

					// primarySchoolEquipRet: 0,
					// mediaSchoolEquipRet: 0,
					// hightSchoolEquipRet: 0,

					// //网络
					// netspaceOpenStuRat: 0,
					// netspaceOpenTechRat: 0,
					// netspaceOpenUsers: 0,
					// netspaceRegistRat: 0,

					//多媒体
					diversity: 0,
					useTime: 0,
					interactivity: 0,
					useRate: 0,
					//top10  //infoLevelList
					//table  fileLevelList
				},
        heatmapData:[
          { x: 110, y: 5, value: 60},
          { x: 110, y: 20, value: 95},
          { x: 110, y: 50, value: 60},
          { x: 110, y: 70, value: 50},
          { x: 110, y: 80, value: 50},
          { x: 110, y: 100, value: 90},
          { x: 120, y: 120, value: 90},
          { x: 110, y: 140, value: 40},
          { x: 110, y: 160, value: 70},
          { x: 110, y: 180, value: 30},

          { x: 110, y: 190, value: 80},
          { x: 120, y: 190, value: 60},
          { x: 140, y: 190, value: 40},
          { x: 150, y: 160, value: 35},
          { x: 160, y: 190, value: 60},
          { x: 190, y: 190, value: 30},

          { x: 200, y: 190, value: 10},
          { x: 220, y: 190, value: 5},
          { x: 240, y: 190, value: 40},
          { x: 260, y: 190, value: 40},
          { x: 280, y: 190, value: 40},
          { x: 300, y: 190, value: 10},
          { x: 320, y: 190, value: 50},

          { x: 200, y: 80, value: 20},
          { x: 200, y: 80, value: 5},
          { x: 380, y: 190, value: 60},
          { x: 420, y: 190, value: 89},

          { x: 360, y: 20, value: 80},
          { x: 360, y: 30, value: 60},
          { x: 380, y: 30, value: 40},
          { x: 400, y: 30, value: 40},
          { x: 420, y: 30, value: 60},

          ],


        radarSeries:{
        	xValue: [],
        	yValue: []
        },
        areaSeries:{
					xValue: [],
					yValue: []
				},
        areaSeries1:{
					xValue: [],
					yValue: []
				},
        barSeries:{
					xValue: [],
					yValue: []
				},
        barSeries1:{
        	xValue: [],
        	yValue: []
        },
				barLineSeries1: {
					xValue: [],
					yValue: []
				},

				columnSeries: {
					xValue: [],
					yValue: []
				},
        columnSeriesRate:{
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
        pieRingsSeries:{
          xValue: [],
          yValue: []
        },
				topFiveList:[],
				n: 0
			}
		},
		mounted() {
			this.iniChartsData()
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
			// fullToggle() {
			// 	this.$fullscreen.toggle(this.$el.querySelector('.example-full-screen'), {
			// 		wrap: false,
			// 		callback: this.fullscreenChange
			// 	})
			// },
			// fullscreenChange(fullscreen) {
			// 	if(fullscreen) {
			// 		this.fullPic = fullE
			// 	} else {
			// 		this.fullPic = fullS
			// 	}
			// 	this.fullscreen = fullscreen
			// },
			resizeListener() {

				if(this.$refs.ccbarLineChart1.chart) {
					this.$refs.ccbarLineChart1.chart.resize()
				}
				if(this.$refs.tPieOne1.chart) {
					this.$refs.tPieOne1.chart.resize()
				}
				if(this.$refs.tPieOne2.chart) {
					this.$refs.tPieOne2.chart.resize()
				}
				if(this.$refs.tPieOne3.chart) {
					this.$refs.tPieOne3.chart.resize()
				}
        if(this.$refs.tPieOne4.chart) {
        	this.$refs.tPieOne4.chart.resize()
        }
				if(this.$refs.tpierosechart.chart) {
					this.$refs.tpierosechart.chart.resize()
				}
        if(this.$refs.tbarchart2.chart) {
        	this.$refs.tbarchart2.chart.resize()
        }
        if(this.$refs.tpierosechartRight.chart) {
        	this.$refs.tpierosechartRight.chart.resize()
        }
        if(this.$refs.tbarchart2Right.chart) {
        	this.$refs.tbarchart2Right.chart.resize()
        }
        if(this.$refs.tareachart2.chart) {
        	this.$refs.tareachart2.chart.resize()
        }
        if(this.$refs.tareachartoperation.chart) {
        	this.$refs.tareachartoperation.chart.resize()
        }
				if(this.$refs.tcolumnchartFail.chart) {
					this.$refs.tcolumnchartFail.chart.resize()
				}
				if(this.$refs.tradarchartUse.chart) {
					this.$refs.tradarchartUse.chart.resize()
				}

			},

			iniChartsData() {
				let that = this
        that.columnSeries1 = {
        	xValue: ['触摸不灵', '花屏', '音响故障', '其他'],
        	yValue:
        		[[523,470,294,208]],
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
        that.pieRingsSeries ={
          xValue: ['差','中','良','优'],
          yValue: [2,15,18,65],
        }
        that.areaSeries1 = {
        	xValue: [getDateStr(-7).substr(5,10),getDateStr(-6).substr(5,10),getDateStr(-5).substr(5,10),getDateStr(-4).substr(5,10),getDateStr(-3).substr(5,10),getDateStr(-2).substr(5,10),getDateStr(-1).substr(5,10)],
        	yValue:[452,652,612,421,201,315,787],
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
        that.pieOneSeries5 = {
          xValue: ['当前故障率', ''],
          yValue: 3.8
        }
        that.loading = true
				getCommHttpData({
					url: 'country/infos',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.loading = false
					let kpiInfo = data.info
          that.pieOneSeries1 = {
            xValue: [kpiInfo.classroomRateXd.xValue[0], ''],
            yValue: kpiInfo.classroomRateXd.yValue[0]
          }
          that.pieOneSeries2 = {
            xValue: [kpiInfo.classroomRateXd.xValue[1], ''],
            yValue: kpiInfo.classroomRateXd.yValue[1]
          }
          that.pieOneSeries3 = {
            xValue: [kpiInfo.classroomRateXd.xValue[2], ''],
            yValue: kpiInfo.classroomRateXd.yValue[2]
          }
          that.pieOneSeries4 = {
            xValue: [kpiInfo.classroomRateXd.xValue[3], ''],
            yValue: kpiInfo.classroomRateXd.yValue[3]
          }

          that.troubleHandleTime = kpiInfo.troubleHandleTime
          that.pieOneSeries5 = {
            xValue: ['当前故障率', ''],
            yValue: kpiInfo.equipTroubleRate
          }
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

					that.kpiData = {
          	schoolCount:kpiInfo.schoolCount,
          	teacherCount:kpiInfo.teacherCount,
          	studentCount:kpiInfo.studentCount,
          	equipCount:kpiInfo.equipCount,
          	softwareCount:kpiInfo.softwareCount,
            turnonRate:86,
            diversity: kpiInfo.diversity,
            useTime: kpiInfo.useTime,
            interactivity: kpiInfo.interactivity,
            useRate:kpiInfo.useRate}
          that.pieRoseSeries = kpiInfo.equipTypeRateMap

            


          that.areaSeries = {
          	xValue: kpiInfo.equipCountTrendMap.xValue,
          	yValue:kpiInfo.equipCountTrendMap.yValue,
            seriaName: ['装备数'],
            yAxis: [{
            	name: '台',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'台'
            }]
          }
          that.barSeries = {
          	xValue: kpiInfo.brandTypeRateMap.xValue.slice(0,5).reverse(),
          	yValue:
          		[kpiInfo.brandTypeRateMap.yValue.slice(0,5).reverse()],
            seriaName: ['品牌'],
            seriaType: ['bar'],
            yAxis: [{
            	name: '千台',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'千台'
            }]
          }

          let mapdataTemp = []
          let xValueNetWork = []
          let yValueNetWork = []
          kpiInfo.everyProvince.yValue1.forEach((item,index)=>{
            if(item>0){
              yValueNetWork.push(item)
              xValueNetWork.push(kpiInfo.everyProvince.xValue[index])
            }

          })
          that.barLineSeries1 = {
          	xValue: xValueNetWork.slice(0,20),
          	yValue: [
          		yValueNetWork.slice(0,20),
//          		kpiInfo.everyProvince.yValue.slice(0,20)
          	],
          	seriaName: ['班均带宽(Mb/s)'],
          	seriaType: ['bar'],
          	yAxis: [{
          		name: '',
          		min: 0,
          		max: null,
          		interval: 3,
          		axisLabel: '',
              tipLabel:'%'
          	}]
          }
          that.radarSeries = {
            xValue: ['使用时长','交互度','多样性','教学率'],
            yValue: kpiInfo.teachAnalysisMap.yValue,
            seriaName:kpiInfo.teachAnalysisMap.xValue,
            yAxis:[{max:100,tipLabel:'%'}]
          }

          that.pieRoseSeries1 = kpiInfo.equipAppAnalyseMap
          that.barSeries1 = {
          	xValue: kpiInfo.softUseTop10.xValue.slice(0,5).reverse(),
          	yValue:
          		[kpiInfo.softUseTop10.yValue.slice(0,5).reverse()],
            seriaName: ['应用排行'],
            seriaType: ['bar'],
            yAxis: [{
            	name: '次数',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'次'
            }]
          }

          let mapdata = [{name:'台湾',value:0,equipFailureRate:0,equipRate:0,bandwidth:0},{name:'南海诸岛',value:0,equipFailureRate:0,equipRate:0,bandwidth:0}]
          kpiInfo.equipInfoProvinceList.forEach((item,index)=>{
            mapdata.push({name:item.province,cityCode:item.provinceid,value:item.equipCount,equipFailureRate:item.equipFailureRate,equipRate:item.equipRate,bandwidth:item.bandwidth})
          })

          that.chinaMapSeries = mapdata
          console.log(that.$refs.diamaMapChinaChart.chart)
					// that.$refs.diamaMapChinaChart.chart.on('click', function (param) {
     //          alert(param.name )
					//     that.$router.push({
					// 			name: 'diama-province',
					// 			query: {cityCode:param.cityCode,codeType:1,cityName:param.name}
					// 		})

				 //  });
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
