<template>
	<div class="mod-demo-echarts screen-charts-cont">
		<!--<el-row :gutter="0">
			<el-col :span="24">-->
		<!--<el-card shadow="hover">-->
		<div class="example-full-screen">
			<div class="screen-header">
				<el-row :gutter="0">
					<el-col :span="8" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
						<!--<iframe name="weather_inc" style="color:#FFFFFF" src="http://i.tianqi.com/index.php?c=code&id=52&icon=1&num=3" width="150" height="25" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>-->
						<span class="header-datetime">{{nowDate}}</span>
					</el-col>
					<el-col :span="8" style="padding-top: 0px;padding-bottom: 0px;">
						<span class="screen-header-text">{{cityName}}教育信息化</span>
					</el-col>
					<el-col :span="8" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
						<span class="header-datetime">{{nowTime}}</span>
						<img :src="fullPic" @click="fullToggle" />
					</el-col>
				</el-row>
			</div>
			<!--</el-card>-->
			<!--</el-col>
		</el-row>-->
			<el-row :gutter="0">
				<el-col :lg="8">
					<el-card class="chart-card">
						<div class="chart-card-title">信息化网络建设</div>
						<div class="chart-card-cont">
							<el-col :span="12">
								<chart-pie-one ref="ctPieOne1" :id="'ctPieOne1'" height="280px" :isscreen="true" :series="pieOneSeries1"></chart-pie-one>
							</el-col>
							<el-col :span="12">
								<chart-pie-half ref="ctPiehalf1" :id="'ctPiehalf1'" height="140px" :colorBlue="false" :isscreen="true" :series="pieHalfSeries1"></chart-pie-half>
								<chart-pie-half ref="ctPiehalf2" :id="'ctPiehalf2'" height="140px" :colorBlue="true" :isscreen="true" :series="pieHalfSeries2"></chart-pie-half>
							</el-col>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学环境建设</div>
						<div class="chart-card-cont" style="height:350px">
							<el-row :gutter="0" style="margin-top: 20px;">
								<el-col :span="12">
									<chart-pie-one ref="ctPieOne2" :id="'ctPieOne2'" height="180px" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
								</el-col>
								<el-col :span="12">
									<chart-pie-half ref="ctPiehalf3" :id="'ctPiehalf3'" :colorBlue="false" height="90px" :isscreen="true" :series="pieHalfSeries3"></chart-pie-half>
									<chart-pie-half ref="ctPiehalf4" :id="'ctPiehalf4'" :colorBlue="true" height="90px" :isscreen="true" :series="pieHalfSeries4"></chart-pie-half>
								</el-col>
								<el-col :span="20" :offset="2">
									<div>
										<chart-bar-process ref="ctBarProcess" :id="'ctBarProcess'" :title="''" height="150px" :isscreen="true" :series="barProcessSeries"></chart-bar-process>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">数字资源建设</div>
						<div class="chart-card-cont" style="height: 220px;">
							<el-col :span="11">
								<chart-pie ref="tPieChart" :id="'tPieChart'" height="220px" :isscreen="true" :series="pieSeries"></chart-pie>
							</el-col>
							<el-col :span="12">
								<div class="card-kpi-value-s" style="margin-top: 20px;">
									<el-col :span="5" :offset="5" class="kpi-bottom" style="text-align: right;"><img src="~@/assets/img/icons/db-7.png" /></el-col>
									<el-col :span="14" class="kpi-bottom">
										<font class="card-kpi-num2">{{kpiData.fileNum.countFileNum}}</font>
										<font class="blue-grey-color">万条</font>
										<div class="blue-grey-color">累计生成资源</div>
									</el-col>
								</div>
								<div class="card-kpi-value-s">
									
									<el-col :span="5" :offset="5" class="kpi-bottom" style="text-align: right;"><img src="~@/assets/img/icons/db-1.png" /></el-col>
									<el-col :span="14" class="kpi-bottom">
										<font class="card-kpi-num2">{{kpiData.fileNum.nowMonthFileNum}}</font><span class="blue-grey-color">条</span>
										<div class="blue-grey-color">本学期新增</div>
									</el-col>
								</div>
								<div class="card-kpi-value-s">
									<el-col :span="5" :offset="5" style="text-align: right;"><img src="~@/assets/img/icons/db-6.png" /></el-col>
									<el-col :span="14">
										<font class="card-kpi-num2">{{kpiData.fileNum.countVolume}}</font> <span class="blue-grey-color">万人次</span>
										<div class="blue-grey-color">资源使用人次</div>
									</el-col>
									
								</div>
							</el-col>
						</div>
					</el-card>
				</el-col>
				<el-col :lg="8">
					<el-card class="chart-card kpi-card">
						<div class="text-center total-kpi-s kpi-top-left">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.schoolCount || 0}}</span></div>
							<div class="blue-grey-color">学校总数</div>
						</div>
						<div class="text-center total-kpi-s kpi-top-middle"> 
							<div><span class="totalkpi-dash" id="visits">{{kpiData.studentCount || 0}}</span></div>
							<div class="blue-grey-color">学生数</div>
						</div>
						<div class="text-center total-kpi-s kpi-top-right">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.teacherCount || 0}}</span></div>
							<div class="blue-grey-color">教师数</div>
						</div>
						<div class="current-radio-screen"> 
							<current-radio :currScreen="'3'"></current-radio>
						</div>
						<div class="text-center" style="margin-top: 40px;">
							<chart-map-city ref="ctmapcitychart1" :id="'tmapcitychart1'" height="560px" :isscreen="true" :series="mapSeries"></chart-map-city>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">各区教育信息化设施分析</div>
						<div class="chart-card-cont">
							<div style="width: 98%; margin-top: 10px;">
								<!--<chart-bar-line ref="barLineChart1" :id="'barLineChart1'" height="280px" :isscreen="true" :series="barLineSeries1"></chart-bar-line>-->
								<chart-column ref="ctcolumnchart1" :id="'tcolumnchart1'" height="270px" :isscreen="true" :series="columnSeries1"></chart-column>
							</div>
						</div>
					</el-card>
				</el-col>

				<el-col :lg="8">
					<el-card class="chart-card">
						<div class="chart-card-title">教育信息化应用</div>
						<div class="chart-card-cont" style="height:170px">
							<el-row :gutter="0">
								<el-col :span="13">
									<div class="margin-20">
										<el-row :gutter="0">
											<el-col :span="8" class="no-padding">
												<span class="blue-grey-color" style="display:inline-block;margin-top: 30px;">教学时长</span>
											</el-col>
											<el-col :span="16" class="no-padding">
												<font class="card-kpi-num1">{{kpiData.useTime || 0}}</font>
												<font>分钟/节</font>
											</el-col>
										</el-row>
									</div>
									<div class="margin-20">
										<el-row :gutter="0">
											<el-col :span="8" class="no-padding">
												<span class="blue-grey-color">交互度</span>
											</el-col>
											<el-col :span="16" class="no-padding">
												<el-rate v-model="kpiData.interactivity/10*5 || 0" allow-half disabled text-color="#40c2ee" void-color="#02e3fc" void-icon-class="icon-rate-face-off" :colors="['#02e3fc','#02e3fc','#02e3fc']">
												</el-rate>
											</el-col>
										</el-row>
									</div>
									<div class="margin-20">
										<el-row :gutter="0">
											<el-col :span="8" class="no-padding">
												<span class="blue-grey-color">多样性</span>
											</el-col>
											<el-col :span="16" class="analy-progress no-padding">
												<el-progress :stroke-width="15" color="#02e3fc" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
											</el-col>
										</el-row>
									</div>
								</el-col>
								<el-col :span="11">
									<chart-liquid-fill ref="cttLiquidFill" :id="'ctLiquidFill'" :title="'多媒体教学率'" height="170px" :isscreen="true" :series="liquidFillSeries"></chart-liquid-fill>
								</el-col>
							</el-row>

						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">教育信息化应用TOP5</div>
						<div class="chart-card-cont" style="height:230px">
							<div style="margin-right: 30px; margin-top: 10px;">
								<chart-bar-top ref="ctbarProcessChart2" :id="'ctbarProcessChart2'" height="230px" :isscreen="true" :series="barProcessSeries2"></chart-bar-top>
							</div>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">多样性分布情况</div>
						<div class="chart-card-cont" style="height:220px">
							<div style="margin-right: 30px;">
								<chart-radar-area ref="cdradarChart" :id="'cdradarChart'" height="245px" :isscreen="true" :series="radarSeries"></chart-radar-area>
							</div>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">网络学习空间应用</div>
						<div class="chart-card-cont" style="height:190px">
							<el-col :span="9">
								<chart-pie-one ref="ctPieOne3" :id="'ctPieOne3'" height="190px" :isscreen="true" :series="pieOneSeries3"></chart-pie-one>
							</el-col>
							<el-col :span="15">
								<el-col :span="20" :offset="2">
									<div class="card-kpi-value" style="margin-top: 20px;">
										<font class="card-kpi-num1">{{kpiData.netspaceOpenUsers || 0}}</font>
										<font class="blue-grey-color">万</font>
										<div class="blue-grey-color">已开通人数</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="card-kpi-value-nop">
										<el-row :gutter="0">
											<el-col :span="9" class="no-padding" style="text-align: right;"><img src="~@/assets/img/icons/db-2.png" /></el-col>
											<el-col :span="13" :offset="1" class="no-padding">
												<font class="card-kpi-num">{{kpiData.netspaceOpenStuRat || 0}}</font>
												<font class="blue-grey-color">%</font>
												<div class="blue-grey-color">学生开通比例</div>
											</el-col>
										</el-row>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="card-kpi-value-nop">
										<el-row :gutter="0">
											<el-col :span="9" class="no-padding" style="text-align: right;"><img src="~@/assets/img/icons/db-3.png" /></el-col>
											<el-col :span="13" :offset="1" class="no-padding">
												<font class="card-kpi-num">{{kpiData.netspaceOpenTechRat || 0}}</font>
												<font class="blue-grey-color">%</font>
												<div class="blue-grey-color">教师开通比例</div>
											</el-col>
										</el-row>
									</div>
								</el-col>
							</el-col>

						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import macaronsScreen from 'macaronsScreen'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBar from '@/components/charts/bar'
	import ChartBarLine from '@/components/charts/bar-line-zoom'
	import ChartBarProcess from '@/components/charts/bar-process'
	import ChartPieOne from '@/components/charts/pie-ring-one-s'
	import ChartPieHalf from '@/components/charts/pie-ring-half'
	import ChartColumn from '@/components/charts/column'
	import ChartDashBoard from '@/components/charts/dash-board'
	import ChartLiquidFill from '@/components/charts/liquidfill'
	import ChartMapCity from '@/components/charts/map-city'
	import ChartRadarArea from '@/components/charts/radar-area'
	import ChartPie from '@/components/charts/pie-s'
	import ChartBarTop from '@/components/charts/bar-top'
	import CurrentRadio from './com/current-radio'
	import { getCommHttpData, getAnalysisChartData, getNowDate, getNowTime } from '@/utils/common'
	const fullS = require('../../../assets/img/icons/full-s.png')
	const fullE = require('../../../assets/img/icons/full-e.png')
	export default {
		components: {
			ChartBar,
			ChartPieOne,
			ChartPieHalf,
			ChartColumn,
			ChartDashBoard,
			ChartLiquidFill,
			ChartBarProcess,
			ChartBarLine,
			ChartMapCity,
			ChartRadarArea,
			ChartPie,
			ChartBarTop,
			CurrentRadio
		},
		data() {
			return {
				nowDate: '--:--:--',
				nowTime: '--:--:--',
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
				fullPic:fullS,
				cityName:'',
				kpiData: {
					schoolCount: 0,
					teacherCount: 0,
					studentCount: 0,
					equipTotalCount: 0,
					tchFileCount: 0,
					softwareCount: 0,
					kjCount: 0,
					//网络建设
					//资源
					fileNum:{
						countFileNum: 0,
						countVolume: 0,
						nowMonthFileNum: 0,
					},
					schoolNetinRat: 0,
					schoolNetinCityRat: 0,
					schoolNetinVillageRat: 0,
					schoolNetinTotal: 0,
					schoolNetoutTotal: 0,

					//教学环境建设
					mediaClassroomRat: 0,
					mediaClassroomRatCs: 0,
					mediaClassroomRatNc: 0,

					primarySchoolEquipRet: 0,
					mediaSchoolEquipRet: 0,
					hightSchoolEquipRet: 0,

					//网络
					netspaceOpenStuRat: 0,
					netspaceOpenTechRat: 0,
					netspaceOpenUsers: 0,
					netspaceRegistRat: 0,

					//多媒体
					diversity: 0,
					useTime: 0,
					interactivity: 0,
					useRate: 0,
					mediaTeachRat: 0,
					mediaClassroomRat: 0
					//top10  //infoLevelList
					//table  fileLevelList

				},
				barLineSeries1: {
					xValue: [],
					yValue: []
				},
				columnSeries: {
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
				pieSeries: {
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
				liquidFillSeries: {
					xValue: [],
					yValue: 0
				},
				pieHalfSeries1: {
					xValue: [],
					yValue: []
				},
				pieHalfSeries2: {
					xValue: [],
					yValue: []
				},
				pieHalfSeries3: {
					xValue: [],
					yValue: []
				},
				pieHalfSeries4: {
					xValue: [],
					yValue: []
				},
				barProcessSeries: {
					xValue: [],
					yValue: []
				},
				radarSeries: {
					xValue: [],
					yValue: []
				},
				barProcessSeries2: {
					xValue: [],
					yValue: []
				},
				mapSeries:[],
				n: 0
			}
		},
		mounted() {
			this.cityName = this.$route.query.cityName
			this.iniChartsData()
			//			window.addEventListener('resize', () => {
			//				this.resizeListener()
			//			})
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
			fullToggle () {
		      this.$fullscreen.toggle(this.$el.querySelector('.example-full-screen'), {
		        wrap: false,
		        callback: this.fullscreenChange
		      })
		    },
		    fullscreenChange (fullscreen) {
		    	if(fullscreen){
		    		this.fullPic=fullE
		    	}else{
		    		this.fullPic=fullS
		    	}
		      this.fullscreen = fullscreen
		    },
			resizeListener() {

				if(this.$refs.ctPieOne1.chart) {
					this.$refs.ctPieOne1.chart.resize()
				}
				if(this.$refs.ctPieOne2.chart) {
					this.$refs.ctPieOne2.chart.resize()
				}
				if(this.$refs.ctPieOne3.chart) {
					this.$refs.ctPieOne3.chart.resize()
				}

				if(this.$refs.ctPiehalf1.chart) {
					this.$refs.ctPiehalf1.chart.resize()
				}
				if(this.$refs.ctPiehalf2.chart) {
					this.$refs.ctPiehalf2.chart.resize()
				}
				if(this.$refs.ctPiehalf3.chart) {
					this.$refs.ctPiehalf3.chart.resize()
				}
				if(this.$refs.ctPiehalf4.chart) {
					this.$refs.ctPiehalf4.chart.resize()
				}
				if(this.$refs.ctBarProcess.chart) {
					this.$refs.ctBarProcess.chart.resize()
				}
				if(this.$refs.ctbarProcessChart2.chart) {
					this.$refs.ctbarProcessChart2.chart.resize()
				}
				
				if(this.$refs.ctcolumnchart1.chart) {
					this.$refs.ctcolumnchart1.chart.resize()
				}
				if(this.$refs.cdradarChart.chart) {
					this.$refs.cdradarChart.chart.resize()
				}
				

			},
			iniChartsData() {
				let that = this

				getCommHttpData({
					url: 'schoolScreen/getAreaByDept',
					method: 'post',
					contentType: 2,
					data: {}
				}, function(data) {
					if(that.$route.query.cityName == undefined){
						that.cityName = data.daptInfo.city
					}
					
					getCommHttpData({
						url: 'cityscreen/info',
						method: 'get',
						contentType: 1,
						data: {
							cityid: data.daptInfo.cityid
						}
					}, function(data) {
						
						let kpiInfo = data.info
						that.kpiData = kpiInfo
						that.dataList = kpiInfo.fileLevelList

						that.pieOneSeries1 = {
							xValue: ['学校互联网接入率', ''],
							yValue: kpiInfo.schoolNetinRat == null ? 0 : kpiInfo.schoolNetinRat
						}
						that.pieOneSeries2 = {
							xValue: ['多媒体教室建设率', ''],
							yValue: kpiInfo.mediaClassroomRat == null ? 0 : kpiInfo.mediaClassroomRat
						}
						that.pieOneSeries3 = {
							xValue: ['网络空间注册率', ''],
							yValue: kpiInfo.netspaceRegistRat == null ? 0 : kpiInfo.netspaceRegistRat
						}
						that.pieHalfSeries1 = {
							xValue: '城市',
							yValue: kpiInfo.schoolNetinCityRat
						}
						that.pieHalfSeries2 = {
							xValue: '农村',
							yValue: kpiInfo.schoolNetinVillageRat
						}
						that.pieHalfSeries3 = {
							xValue: '城市',
							yValue: kpiInfo.mediaClassroomRatCs
						}
						that.pieHalfSeries4 = {
							xValue: '农村',
							yValue: kpiInfo.mediaClassroomRatNc
						}
						that.liquidFillSeries = {
							xValue: ['多媒体教学率'],
							yValue: kpiInfo.useRate / 100
						}
						that.pieSeries = kpiInfo.fileTypeAcc
						that.barProcessSeries = {
							xValue: ['小学生机比达标率', '初中生机比达标率', '高中生机比达标率'],
							yValue: [
								kpiInfo.primarySchoolEquipRet == null ? 0 : kpiInfo.primarySchoolEquipRet,
								kpiInfo.mediaSchoolEquipRet == null ? 0 : kpiInfo.mediaSchoolEquipRet,
								kpiInfo.hightSchoolEquipRet == null ? 0 : kpiInfo.hightSchoolEquipRet
							],
							seriaName: ['生机比'],
							yAxis: [{
								name: '',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}]
						}
						that.columnSeries = {
							xValue: kpiInfo.infoLevelList.xValue,
							yValue: [kpiInfo.infoLevelList.yValue],
							seriaName: ['学校信息化素养'],
							yAxis: [{
								name: '',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}]
						}
						let regionInfo = new Array()
						for(var i in kpiInfo.regionInfo){
							regionInfo.push({name: kpiInfo.regionInfo[i].area,
								cityid: kpiInfo.regionInfo[i].cityid,
								value: kpiInfo.regionInfo[i].schoolCount,
								schoolNetinRat: kpiInfo.regionInfo[i].schoolNetinRat,
								studentCount: kpiInfo.regionInfo[i].studentCount,
								teacherCount: kpiInfo.regionInfo[i].teacherCount})
						}

						that.mapSeries = regionInfo
						
						let infoLevelyValue = new Array()
						for(let i in kpiInfo.infoLevelList.yValue){
							infoLevelyValue.push(kpiInfo.infoLevelList.yValue[i].value)
						}
						
						let areaInfoAccyValue1 = new Array()
						let areaInfoAccyValue2 = new Array()
						let areaInfoAccyValue3 = new Array()
						for(let i in kpiInfo.areaInfoAcc.yValue){
							areaInfoAccyValue1.push(kpiInfo.areaInfoAcc.yValue[i].schoolNetin_rat)
							areaInfoAccyValue2.push(kpiInfo.areaInfoAcc.yValue[i].mediaClassroom_rat)
							areaInfoAccyValue3.push(kpiInfo.areaInfoAcc.yValue[i].downlink)
						}
						that.columnSeries1 = {
							xValue: kpiInfo.areaInfoAcc.xValue,
							yValue: [
								areaInfoAccyValue1,
								areaInfoAccyValue2,
								areaInfoAccyValue3
							],
							seriaName: ['互联网接入率','多媒体教室比例','网络带宽达标率'],
							yAxis: [{
								name: '%',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}]
						}
						that.barProcessSeries2 = {
							xValue: kpiInfo.infoLevelList.xValue.reverse(),
							yValue: [
								infoLevelyValue.reverse()
							],
							seriaName: [''],
							yAxis: [{
								name: '',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}]
						}
						let max = Math.max.apply(null, kpiInfo.dibersityRat.yValue);	
						that.radarSeries = {
							xValue: kpiInfo.dibersityRat.xValue,
							yValue: [kpiInfo.dibersityRat.yValue],
							seriaName: [''],
							max:max
						}
						that.$refs.ctmapcitychart1.chart.on('click', function (param) {
							if(param.name == '彬县'){
						        that.$router.push({
									name: 'screen-edu-sc',
									query: {provinceName:param.name}
								})
						        
						        //页面外
//						        that.$router.push({
//									name: 'screen-link-e',
//									query: {provinceName:param.name}
//								})
						    }
					    });
						that.resizeListener()

					})
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