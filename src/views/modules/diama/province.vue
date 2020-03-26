<template>
	<div class="mod-demo-echarts screen-charts-cont-diama" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
			<el-row :gutter="0" class="full-screen-diama">
        <el-col :lg="24">
            <div class="screen-header-diama">
                <el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
                  <span class="header-datetime">{{nowDate}}</span>
                </el-col>
                <el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
                  <span class="screen-header-text">{{currCityName}}教育信息化建设总览</span>
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
								<chart-pie-one ref="tPieOne1" :id="'tPieOne1'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries1"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="tPieOne2" :id="'tPieOne2'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="tPieOne3" :id="'tPieOne3'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries3"></chart-pie-one>
              </el-col>
              <el-col :span="6">
                <chart-pie-one ref="tPieOne4" :id="'tPieOne4'" height="120px" style="margin-top:30px;" :isscreen="true" :series="pieOneSeries4"></chart-pie-one>
							</el-col>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">装备资产统计</div>
						<div class="chart-card-cont card-bg-left" style="height:195px">
              <el-col :span="12">
                <div class="chart-title-green">装备类型占比</div>
                <chart-pie-rose ref="tpierosechart" :id="'tpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeries"></chart-pie-rose>
              </el-col>
              <el-col :span="12">
                <div class="chart-title-green">装备品牌排行TOP5</div>
                <chart-bar ref="tbarchart2" :id="'tbarchart2'"  :themeColor='2'  height="160px"  title="" :axisTickShow="false"  :isscreen="true" :series="barSeries"></chart-bar>
              </el-col>
						</div>
					</el-card>
          <el-card class="chart-card card-bg-left">
          	<div class="chart-card-title">近半年装备量趋势分析</div>
          	<div class="chart-card-cont card-bg-left" style="height:190px">
          	 <chart-area ref="tareachart2" :id="'tareachart2'" :themeColor='5' height="190px" :isscreen="true" :series="areaSeries"></chart-area>
          	</div>
          </el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">装备配置分析</div>
						<div class="chart-card-cont card-bg-left" style="height:200px">
              <el-col :span="8" style="padding:0px">
                <div class="chart-title-green">操作系统</div>
                <chart-pie ref="protOperatepiechart" :id="'protOperatepiechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesSYS"></chart-pie>
              </el-col>
              <el-col :span="8" style="padding:0px">
                <div class="chart-title-green">CPU</div>
                <chart-pie ref="protCPUpierosechart" :id="'protCPUpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesCPU"></chart-pie>
              </el-col>
              <el-col :span="8" style="padding:0px;">
                <div class="chart-title-green">内存</div>
                <chart-pie ref="protRAMpierosechart" :id="'protRAMpierosechart'" title="" height="184px" :isscreen="true" :series="pieRoseSeriesRAM"></chart-pie>
              </el-col>
						</div>
					</el-card>
				</el-col>
				<el-col :lg="10">
					<el-card class="chart-card kpi-card">
            <el-col :lg="4" class="kpi-box"  :push="2">
              <div class="kpi-text">学校</div>
              <div><span class="kpi-value">{{kpiData.schoolCount}}</span>所</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box" :push="2">
              <div class="kpi-text">教师</div>
              <div><span class="kpi-value">{{kpiData.teacherCount}}</span>人</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box" :push="2">
              <div class="kpi-text">学生</div>
              <div><span class="kpi-value">{{kpiData.studentCount}}</span>人</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box" :push="2">
              <div class="kpi-text">装备数</div>
              <div><span class="kpi-value">{{kpiData.equipCount}}</span>台</div>
              <div class="border"></div>
            </el-col>
            <el-col :lg="4" class="kpi-box" :push="2">
              <div class="kpi-text">应用软件</div>
              <div><span class="kpi-value">{{kpiData.softwareCount}}</span>个</div>
              <!-- <div class="border"></div> -->
            </el-col>
            <!-- <el-col :lg="4" class="kpi-box">
              <div class="kpi-text">开机率</div>
              <div><span class="kpi-value">{{kpiData.turnonRate}}</span>%</div>
            </el-col> -->
						<div style="position: relative;" class="baidumap">
							<chart-map-province  ref="tmapprovincechart1" @refreshData="refreshProvinceData" v-if="currCodeType == 1" :mapdata="mapdata" :id="'tmapprovincechart1'" height="560px" :isscreen="true" :series="provinceMapSeries"></chart-map-province>
              <chart-map-city  ref="tmapprovincecitychart1" @refreshData="refreshCityData" v-else-if="currCodeType == 2" :mapdata="mapdata" :id="'tmapprovincecitychart1'" height="560px" :isscreen="true" :series="provinceMapSeries"></chart-map-city>
              <chart-map-area  ref="tmapprovincechart1" @refreshData="refreshAreaData" v-else :mapdata="mapdata" :id="'tmapprovincechart1'" height="560px" :isscreen="true" :series="provinceMapSeries"></chart-map-area>

             <!-- <el-button  class="btn-chart" type="text" @click="preInitData()" v-if="prevType !=''" > <返回{{preCityName}}</el-button>
              <template v-else> -->
                 <el-button  class="btn-chart" type="text" @click="preInitData()" v-if="preCityName !=''" > <返回{{preCityName}}</el-button>
             <!-- </template> -->

<!--               <el-button   class="btn-chart" style="bottom: 10px;" type="text" @click="preInitData()" v-if="currCodeType == 3 && preCityName !=''" > <返回{{preCityName}}</el-button>
 -->            </div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">{{cityTitle}}信息化网络建设</div>
						<div class="chart-card-cont" style="height:265px">
								<!-- <chart-bar-line ref="ccbarLineChart1" :id="'ccbarLineChart1'" height="280px" :isscreen="true" :series="barLineSeries1"></chart-bar-line> -->
								<chart-column ref="proccbarLineChart1" :themeColor='2' :id="'proccbarLineChart1'" :standardLine="true"  height="260px" :isscreen="true" :series="barLineSeries1"></chart-column>

						</div>
					</el-card>
				</el-col>

				<el-col :lg="7">
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学应用现状</div>
						<div class="chart-card-cont card-bg-right" style="height:200px">
              <el-col :span="12"  class="no-padding">
                <chart-radar ref="tradarchartUse" :id="'tradarchartUse'" :legendType="2" style="margin-top:10px;" height="180px" :isscreen="true" :series="radarSeries"></chart-radar>
              </el-col>
              <el-col :span="12" class="no-padding">
                <div class="chart-title-green">学段对比</div>
               <chart-bar ref="tbarchart1Right" :id="'tbarchart1Right'"  :themeColor='3' height="160px" :axisTickShow="false" title=""  :isscreen="true" :series="sectionBarSeries"></chart-bar>
              </el-col>
            </div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">学科应用分析</div>
            <div class="chart-card-cont card-bg-right" style="height:200px">
              <chart-bar-line ref="procbarLineChart2" :themeColor="5" :id="'procbarLineChart2'" height="200px" :isscreen="true" :series="barLineSeries2"></chart-bar-line>
            </div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">年级应用分析</div>
						<div class="chart-card-cont card-bg-right" style="height:200px;">
							<chart-bar-line ref="procbarLineChart3" :themeColor="6" :id="'procbarLineChart3'" height="200px" :isscreen="true" :series="barLineSeries3"></chart-bar-line>

						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">软件使用情况</div>
						<div class="chart-card-cont card-bg-right" style="height: 200px;">
              <el-col :span="12">
                <div class="chart-title-green">应用分类占比</div>
                <chart-pie-rose ref="tpierosechartRight" :id="'tpierosechartRight'" title="" height="184px" :isscreen="true" :series="pieRoseSeries1"></chart-pie-rose>
              </el-col>
              <el-col :span="12">
                <div class="chart-title-green">应用软件Top5</div>
                <chart-bar ref="tbarchart2Right" :id="'tbarchart2Right'" :themeColor='2' height="160px" :axisTickShow="false" title=""  :isscreen="true" :series="barSeries1"></chart-bar>
              </el-col>
						</div>
					</el-card>
				</el-col>
			</el-row>
		<!-- </div> -->
	</div>
</template>
<style scoped>
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
	import ChartPie from '@/components/diama/pie'
	import ChartMapProvince from '@/components/diama/map-province'
  import ChartMapArea from '@/components/diama/map-area'
  import ChartMapCity from '@/components/diama/map-city'
	// import FullScreen from '../common/full-screen'
	// import CurrentRadio from './com/current-radio'
	import { getCommHttpData, getAnalysisChartData, getNowDate, getNowTime,getDateStr,trimAll,compareDown } from '@/utils/common'
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
			ChartMapProvince,
      ChartMapArea,
      ChartMapCity
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
				provinceMapSeries:[],
        //mapdata:'province/610000',
        mapdata:'',
        cityName:'',
        currCityName:'',
        currCityCode:'',
        currCodeType:1,
        preCityName:'全国',
        preCityCode:'',
        preCodeType:5,
        prevType:'',
        mapRouteArr:[],
        cityTitle:'各市',
				kpiData: {
					schoolCount: 0,
					teacherCount: 0,
					studentCount: 0,
					equipCount: 0,
					softwareCount: 0,
          turnonRate:0,

          equipFailureRate:0,
					//多媒体
					diversity: 0,
					useTime: 0,
					interactivity: 0,
					useRate: 0,
				},
        active: false,
        markers:[],
        infoWindow:{
          show:false,
          info:{
            bandwidth: 0,
            cityCode: 0,
            code: 0,
            equipFailureRate: 0,
            equipRate:0,
            lat: 0,
            lng: 0,
            name: '',
            value: 0,
            orgId:''
          }
        },
        troubleHandleTime:0,
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
        sectionBarSeries:{
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
        barLineSeries2: {
        	xValue: [],
        	yValue: []
        },
        barLineSeries3: {
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
				topFiveList:[],
				n: 0
			}
		},
    watch: {
    	keywords(val) {
    		this.getMessageList()
    	},
    	$route(to,from){
        this.prevType = this.$route.query.prevType

        if(this.prevType != ''){
          this.preCityName = ''
        }else{
          this.preCityName = '全国'
        }
    		if(!this.$route.query.cityName){
    		  this.preCityName = ''
    		  this.getCode()
    		}else{
    		  this.currCityName = this.$route.query.cityName
    		  this.currCityCode = this.$route.query.cityCode
    		  this.currCodeType = this.$route.query.codeType
    		  this.iniMapInfo()
    		}

      }
    },
		mounted() {
      this.prevType = this.$route.query.prevType

      if(this.prevType == 0){
        this.preCityName = '全国'
      }
      if(this.prevType != ''){
        this.preCityName = ''
      }
      if(!this.$route.query.cityName){
        this.preCityName = ''
        this.getCode()
      }else{
        this.currCityName = this.$route.query.cityName
        this.currCityCode = this.$route.query.cityCode
        this.currCodeType = this.$route.query.codeType
        this.iniMapInfo()
      }
      //来自学校，查询省市信息
      if(this.prevType == 10){
        this.getProvinceCityByAreaCode()
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
		},
		//  activated () {
		//			this.resizeListener()
		//  },
		methods: {

			resizeListener() {

				if(this.$refs.proccbarLineChart1.chart) {
					this.$refs.proccbarLineChart1.chart.resize()
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
        if(this.$refs.procbarLineChart2.chart) {
        	this.$refs.procbarLineChart2.chart.resize()
        }
        if(this.$refs.procbarLineChart3.chart) {
        	this.$refs.procbarLineChart3.chart.resize()
        }
			},
      iniMapInfo(){
        let curtemp ={name:this.currCityName,code:this.currCityCode,type:this.currCodeType}
        if(this.currCodeType == 1){
          this.mapdata = 'province/'+this.currCityCode
          this.mapRouteArr = [curtemp,{},{}]
        }else if(this.currCodeType == 2){
          this.mapdata = 'city/'+this.currCityCode
          this.mapRouteArr =[curtemp]
        }else{
          this.mapdata = 'county/'+this.currCityCode
          this.mapRouteArr =[curtemp]
        }
        this.iniChartsData()
      },
      //查询省市区码
      getCode(){
        let that = this
        this.currCodeType = this.$route.query.codeType
        getCommHttpData({
        	url: 'country/getAreasInfo',
        	method: 'get',
        	contentType: 1,
          serverType:1,
        	data: {deptId:this.orgId,zorecode:window.SITE_CONFIG.zoreCode}
        }, function(data) {
          //if(that.currCodeType == 1){
            that.currCodeType = 1
            that.currCityName = data.info.province
            that.currCityCode = data.info.provinceid
          // }else if(that.currCodeType == 2){
          //   that.currCityName = data.info.city
          //   that.currCityCode = data.info.cityid
          // }else{
          //   that.currCityName = data.info.area
          //   that.currCityCode = data.info.areaid
          // }
          that.iniMapInfo()
        })
      },
      preInitData(){
        if(this.preCodeType == 5){
          this.$router.push({
          	name: 'diama-china-out',
          //  name: 'diama-china',
          	// query: {cityCode:this.currCityCode,codeType:1,cityName:this.currCityName}
          })
          return;
        }
        this.currCityName = this.preCityName
        this.currCityCode = this.preCityCode
        this.currCodeType = this.preCodeType
        let mIndex = 0
        if(this.currCodeType == 1){
          if(!this.$route.query.cityName){
            this.preCityName = ''
          }else{
            if(this.$route.query.prevType != ''){
              this.preCityName = ''
              this.preCodeType = ''
              if(this.$route.query.prevType == 10){
                this.preCityName = '全国'
                this.preCodeType = 5
              }
            }else{
              this.preCityName = '全国'
              this.preCodeType = 5
            }

          }
          this.mapdata = 'province/'+this.mapRouteArr[0].code

        }else {

          mIndex = 0
          this.mapdata = 'city/'+this.mapRouteArr[1].code



          this.preCityName = this.mapRouteArr[mIndex].name
          this.preCityCode = this.mapRouteArr[mIndex].code
          this.preCodeType = this.mapRouteArr[mIndex].type
        }
        this.iniChartsData()

      },
			iniChartsData() {
				let that = this
        that.pieRingsSeries ={
          xValue: ['差','中','良','优'],
          yValue: [2,15,18,65],
        }
        that.loading = true

        let httpUrl = '',dataParams = {},tempType = this.currCodeType

        if(tempType == 1){
          //省
          let cityArr = ['北京','上海','天津','重庆']

          if(cityArr.includes(this.currCityName)){
            httpUrl = 'cityscreen/infos'
            dataParams = {cityid:this.currCityCode}
          }else{
            //this.currCodeType =2
            httpUrl = 'proscreen/infos'
            dataParams = {provinceCode:this.currCityCode}
          }
        }else if(tempType == 2){
          //城市
          httpUrl = 'cityscreen/infos'
          dataParams = {cityid:this.currCityCode}
          let cityArr = ['北京','上海','天津','重庆']
          if(cityArr.includes(this.preCityName)){
            httpUrl = 'areascreen/infos'
            dataParams = {areaid:this.currCityCode}
          }
        }else{
          //区县
          httpUrl = 'areascreen/infos'
          dataParams = {areaid:this.currCityCode}
        }
				getCommHttpData({
					url: httpUrl,
					method: 'get',
					contentType: 1,
          serverType:1,
					data: dataParams
				}, function(data) {
					that.loading = false
					let kpiInfo = data.info
          if(kpiInfo.classroomRateXd.xValue && kpiInfo.classroomRateXd.xValue.length >0){
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
          }else{
            that.pieOneSeries1 = {
              xValue: [0, ''],
              yValue: 0
            }
            that.pieOneSeries2 = {
              xValue: [0, ''],
              yValue: 0
            }
            that.pieOneSeries3 = {
              xValue: [0, ''],
              yValue: 0
            }
            that.pieOneSeries4 = {
              xValue: [0, ''],
              yValue: 0
            }
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

          that.pieRoseSeriesSYS = kpiInfo.systemAnalyseMap
          that.pieRoseSeriesCPU = kpiInfo.cpuAnalyseMap
          that.pieRoseSeriesRAM = kpiInfo.ramAnalyseMap

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
            	name: '台',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'台'
            }]
          }

          let mapdataTemp = []
          let xValueNetWork = []
          let yValueNetWork = []
          // kpiInfo.everyProvince.yValue1.forEach((item,index)=>{
          //   if(item>0){
          //     yValueNetWork.push(item)
          //     xValueNetWork.push(kpiInfo.everyProvince.xValue[index])
          //   }

          // })
          let dataObj = []
          //排序降序，取前20个条数据
          if(kpiInfo.everyProvince.yValue1.length >0){
            kpiInfo.everyProvince.yValue1.forEach((item,index)=>{
              dataObj.push({name:kpiInfo.everyProvince.xValue[index],value:item})
            })
            dataObj.sort(compareDown(dataObj,'value'))
            dataObj.forEach((item,index)=>{
              yValueNetWork.push(item.value)
              xValueNetWork.push(item.name)
            })
          }


          if(kpiInfo.everyProvince.xValue.length > 0){
            that.barLineSeries1 = {
              xValue: xValueNetWork,
              yValue: [
                yValueNetWork
              ],
              seriaName: ['班均带宽(Mb/s)'],
              seriaType: ['bar'],
              yAxis: [{
                name: '',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:''
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
          if(that.$refs.proccbarLineChart1.chart) {
          	that.$refs.proccbarLineChart1.chart.resize()
          }
          if(kpiInfo.subjectAreaAnalyseMap.xValue.length > 0){


            that.barLineSeries2 = {
              xValue: kpiInfo.subjectAreaAnalyseMap.xValue,
              yValue: [
                  kpiInfo.subjectAreaAnalyseMap.yValue,
                  kpiInfo.subjectAreaAnalyseMap.yValue1
              ],
              seriaName: ['多媒体平均使用时长','教学率'],
              seriaType: ['bar','line'],
              yAxis: [{
                name: '分钟',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:'分钟'
              },{
                name: '%',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: '',
                tipLabel:'%'
              }]
            }
          }else{
            that.barLineSeries2 = {
              xValue: [],
              yValue: [],
              seriaName: [],
              yAxis:[]
            }
          }
          if(kpiInfo.gradeAnalyseMap.xValue.length > 0){
          that.barLineSeries3 = {
            xValue: kpiInfo.gradeAnalyseMap.xValue,
            yValue: [
                kpiInfo.gradeAnalyseMap.yValue,
                kpiInfo.gradeAnalyseMap.yValue1
              ],
              seriaName: ['多媒体平均使用时长','教学率'],
              seriaType: ['bar','line'],
              yAxis: [{
                name: '分钟',
                min: 0,
                max: null,
                interval: null,
                axisLabel: '',
                tipLabel:'分钟'
              },{
                name: '%',
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: '',
                tipLabel:'%'
              }]
          }
          }else{
            that.barLineSeries3 = {
              xValue: [],
              yValue: [],
              seriaName: [],
              seriaType: [],
              yAxis:[]
            }
          }

          let currRadarCityType = '',preRadarCityType=''
          if(that.currCodeType == 1){
            currRadarCityType = '省'
            preRadarCityType = '全国'
            that.cityTitle = '各市'
          }else if(that.currCodeType == 2){
            currRadarCityType = '市'
            preRadarCityType = '全省'
            that.cityTitle = '各区'
          }else{
            currRadarCityType = '区'
            preRadarCityType = '全市'
            that.cityTitle = '各校'
          }
          that.radarSeries = {
            xValue: ['使用时长', '交互度', '多样性', '教学率'],
            yValue: [[kpiInfo.useTime,kpiInfo.interactivity,kpiInfo.diversity,kpiInfo.useRate],[kpiInfo.useTimeOther,kpiInfo.interactivityOther,kpiInfo.diversityOther,kpiInfo.useRateOther]],
            seriaName: ['我'+currRadarCityType+'应用水平',preRadarCityType+'应用平均水平'],
            yAxis: [{
              max: 100,
              tipLabel: '%'
            }]
          }
          that.pieRoseSeries1 = kpiInfo.equipAppAnalyseMap

          that.sectionBarSeries = {
          	xValue: kpiInfo.teachAnalysisMap.xValue.slice(0,5),
          	yValue:
          		[kpiInfo.teachAnalysisMap.yValue.slice(0,5),kpiInfo.teachAnalysisMap.yValue1.slice(0,5)],
            seriaName: ['教学率','平均使用时长'],
            seriaType: ['bar'],
            yAxis: [{
            	name: '',
            	min: 0,
            	max: null,
            	interval: null,
              labelshow:true,
            	axisLabel: ['%','分钟'],
              tipLabel:''
            }]
          }

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
          //{name:'延安市',value:1,equipFailureRate:0,equipRate:0,bandwidth:0},{name:'西安市',value:100,equipFailureRate:0,equipRate:0,bandwidth:0},{name:'咸阳市',value:600,equipFailureRate:0,equipRate:0,bandwidth:0}
          let mapdata = [],tempName = '',tempCityCode =''
          let markers = []
          kpiInfo.equipInfoProvinceList.forEach((item,index)=>{
            if(tempType == 1){
              let cityArr = ['北京','上海','天津','重庆']
              if(cityArr.includes(that.currCityName)){
                tempName = item.area
                tempCityCode = item.areaid
              }else{
                tempName = item.city
                tempCityCode = item.cityid
              }
              mapdata.push({name:trimAll(tempName),value:parseInt(item.equipcount),cityCode:tempCityCode,equipFailureRate:item.equipfailurerate,equipRate:item.equiprate,bandwidth:item.bandwidth})

            }else if(tempType == 2){
              tempName = item.area
              tempCityCode = item.areaid
              mapdata.push({name:trimAll(tempName),value:parseInt(item.equipcount),cityCode:tempCityCode,equipFailureRate:item.equipfailurerate,equipRate:item.equiprate,bandwidth:item.bandwidth})
            }else{
              tempName = item.deptname
              tempCityCode = item.deptid
              mapdata.push({locations:item.locations,name:trimAll(tempName),orgId:item.deptId,value:parseInt(item.equipcount),cityCode:tempCityCode,equipFailureRate:item.equipfailurerate,equipRate:item.equiprate,bandwidth:item.bandwidth})
              markers.push({lng:item.locations[0],lat:item.locations[1],name:trimAll(tempName),code:item.deptId,orgId:item.deptId,value:parseInt(item.equipcount),cityCode:tempCityCode,equipFailureRate:item.equipfailurerate,equipRate:item.equiprate,bandwidth:item.bandwidth})
              that.markers = markers
            }
          })

          that.provinceMapSeries = mapdata
          console.log(that.$refs.diamaMapChinaChart)

					// that.$refs.tmapprovincechart1.chart.on('click', function (param) {

     //        if(Array.isArray(param.data)){
     //          //跳转学校页面
     //          //参数省市区行政码
     //          that.$router.push({
     //          	name: 'diama-school',
     //          	query: {orgId:param.data[3],orgName:param.data[7],isCity:1,
     //            cityName:that.mapRouteArr[1].name,cityName:that.mapRouteArr[1].code,cityName:that.mapRouteArr[2].type,
     //            provinceName:that.mapRouteArr[0].name,provinceName:that.mapRouteArr[0].code,provinceName:that.mapRouteArr[0].type,
     //            preCityName:that.currCityName,preCityCode:that.currCityCode,preCodeType:that.currCodeType}
     //          })
     //          return;
     //        }
     //        if(param.data.value == 0){
     //          //return
     //        }
     //        that.currCityName = param.data.name
     //        that.currCityCode = param.data.cityCode
     //        let mIndex=0
     //        if(that.currCodeType == 1){
     //          that.mapdata = 'city/'+param.data.cityCode
     //          that.currCodeType = 2
     //          that.mapRouteArr[1] = {name:param.data.name,code:param.data.cityCode,type:2},
     //          mIndex = 0
     //        }else{
     //          that.mapdata = 'county/'+param.data.cityCode
     //          that.currCodeType = 3
     //          that.mapRouteArr[2] = {name:param.data.name,code:param.data.cityCode,type:3},
     //          mIndex = 1
     //        }
     //        console.log(that.mapRouteArr)
     //        that.preCityName = that.mapRouteArr[mIndex].name
     //        that.preCityCode = that.mapRouteArr[mIndex].code
     //        that.preCodeType = that.mapRouteArr[mIndex].type

     //        that.iniChartsData()
				 //  });
					//that.resizeListener()
				})
			},
      refreshProvinceData(param){
        let that = this
        let clickIndex = 1
        that.currCityName = param.data.name
        that.currCityCode = param.data.cityCode
        let mIndex=0

        that.mapdata = 'city/'+param.data.cityCode
        that.mapRouteArr[1] = {name:param.data.name,code:param.data.cityCode,type:2},
        that.preCityName = that.mapRouteArr[mIndex].name
        that.preCityCode = that.mapRouteArr[mIndex].code
        that.preCodeType = that.mapRouteArr[mIndex].type
        that.currCodeType = 2
        console.log(that.mapRouteArr)
        that.iniChartsData()
      },
      refreshCityData(param){
        let that = this
        let clickIndex = 1
        that.currCityName = param.data.name
        that.currCityCode = param.data.cityCode
        let mIndex=0
        that.mapdata = 'county/'+param.data.cityCode
        that.mapRouteArr[2] = {name:param.data.name,code:param.data.cityCode,type:3},
        mIndex = 1
        that.preCityName = that.mapRouteArr[mIndex].name
        that.preCityCode = that.mapRouteArr[mIndex].code
        that.preCodeType = that.mapRouteArr[mIndex].type
        that.currCodeType = 3
        that.iniChartsData()
      },
      refreshAreaData(param){
        let that = this
        if(that.mapRouteArr.length == 1){
          that.$router.push({
          	name: 'diama-school',
          	query: {orgId:param.data[3],orgName:param.data[7],isCity:1,
            preCityName:that.currCityName,preCityCode:that.currCityCode,preCodeType:that.currCodeType}
          })
        }else{
          that.$router.push({
          	name: 'diama-school',
          	query: {orgId:param.data[3],orgName:param.data[7],isCity:1,
            cityName:that.mapRouteArr[1].name,cityName:that.mapRouteArr[1].code,cityName:that.mapRouteArr[2].type,
            provinceName:that.mapRouteArr[0].name,provinceName:that.mapRouteArr[0].code,provinceName:that.mapRouteArr[0].type,
            preCityName:that.currCityName,preCityCode:that.currCityCode,preCodeType:that.currCodeType}
          })
        }

      },
      //查看详情
      lookDetail(data, target){
          let that = this
          this.infoWindow.info=data;
          this.activeName = data.name;
          //为弹窗口标题添加title
          this.$nextTick(()=>{
              var win=document.querySelector(".BMap_bubble_title");
              win.title = this.activeName;
              console.log(data)
          })
          if(target=='left'){ //点击的是左侧列表项，则不需要滚动
              this.map.center={lng: data.lng, lat: data.lat};
              this.map.zoom = 13;
              return;
          }
          //滚动到指定元素位置
          this.$nextTick(()=>{
              var obj=document.querySelector(".active");
              var scrollTop=obj.offsetTop;
              this.$refs.box.scrollTop=scrollTop-180;
          })
          that.infoWindow.show =true;
      },
      infoWindowClose(){
        this.infoWindow.show = false
      },
      infoWindowOpen(){
        this.infoWindow.show = true
      },
      draw ({el, BMap, map}) {
        const pixel = map.pointToOverlayPixel(new BMap.Point(this.infoWindow.info.lng, this.infoWindow.info.lat))
        el.style.left = pixel.x - 60 + 'px'
        el.style.top = pixel.y - 20 + 'px'
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
