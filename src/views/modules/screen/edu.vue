<template>
	<div class="mod-demo-echarts screen-charts-cont">
		<!--<el-row :gutter="0">
			<el-col :span="24">-->
		<!--<el-card shadow="hover">-->
		<div class="example-full-screen">
			<div class="screen-header">
				<el-row :gutter="0">
					<el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
						<span class="header-datetime">{{nowDate}}</span>
					</el-col>
					<el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
						<span class="screen-header-text">教育信息化</span>
					</el-col>
					<el-col :span="6" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
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
								<chart-pie-one ref="tPieOne1" :id="'tPieOne1'" height="280px" :isscreen="true" :series="pieOneSeries1"></chart-pie-one>
							</el-col>
							<el-col :span="12">
								<chart-pie-half ref="tPiehalf1" :id="'tPiehalf1'" height="140px" :colorBlue="false" :isscreen="true" :series="pieHalfSeries1"></chart-pie-half>
								<chart-pie-half ref="tPiehalf2" :id="'tPiehalf2'" height="140px" :colorBlue="true" :isscreen="true" :series="pieHalfSeries2"></chart-pie-half>
							</el-col>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学环境建设</div>
						<div class="chart-card-cont">
							<el-row :gutter="0">
								<el-col :span="12">
									<chart-pie-one ref="tPieOne2" :id="'tPieOne2'" height="180px" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
									<el-col :span="12">
										<chart-pie-half ref="tPiehalf3" :id="'tPiehalf3'" :colorBlue="false" height="90px" :isscreen="true" :series="pieHalfSeries3"></chart-pie-half>
									</el-col>
									<el-col :span="12">
										<chart-pie-half ref="tPiehalf4" :id="'tPiehalf4'" :colorBlue="true" height="90px" :isscreen="true" :series="pieHalfSeries4"></chart-pie-half>
									</el-col>

								</el-col>
								<el-col :span="12">
									<div style="margin-top:50px">
										<chart-bar-process ref="tBarProcess" :id="'tBarProcess'" :title="'生机比达标率'" height="200px" :isscreen="true" :series="barProcessSeries"></chart-bar-process>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">网络学习空间应用</div>
						<div class="chart-card-cont">
							<el-col :span="12">
								<chart-pie-one ref="tPieOne3" :id="'tPieOne3'" height="280px" :isscreen="true" :series="pieOneSeries3"></chart-pie-one>
							</el-col>
							<el-col :span="12">
								<div class="card-kpi-value">
									<font class="card-kpi-num1">{{kpiData.netspaceOpenUsers || 0}}</font>
									<font class="blue-grey-color">万</font>
									<div class="blue-grey-color">已开通人数</div>
								</div>

								<div class="card-kpi-value">
									<el-row :gutter="0">
										<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-2.png" /></el-col>
										<el-col :span="14">
											<font class="card-kpi-num">{{kpiData.netspaceOpenStuRat || 0}}</font>
											<font class="blue-grey-color">%</font>
											<div class="blue-grey-color">学生开通比例</div>
										</el-col>
									</el-row>
								</div>
								<div class="card-kpi-value">
									<el-row :gutter="0">
										<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-3.png" /></el-col>
										<el-col :span="14">
											<font class="card-kpi-num">{{kpiData.netspaceOpenTechRat || 0}}</font>
											<font class="blue-grey-color">%</font>
											<div class="blue-grey-color">教师开通比例</div>
										</el-col>
									</el-row>
								</div>
							</el-col>
						</div>
					</el-card>
				</el-col>
				<el-col :lg="8">
					<el-card class="chart-card kpi-card">
						<div class="text-center total-kpi-s kpi-left-top">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.schoolCount || 0}}</span></div>
							<div class="blue-grey-color">学校</div>
						</div>

						<div class="text-center total-kpi-s kpi-left-middle">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.teacherCount || 0}}</span></div>
							<div class="blue-grey-color">教职工</div>
						</div>

						<div class="text-center total-kpi-s kpi-left-bottom">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.kjCount || 0}}</span></div>
							<div class="blue-grey-color">课件</div>
						</div>

						<div class="text-center total-kpi-s kpi-right-top">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.softwareCount || 0}}</span></div>
							<div class="blue-grey-color">应用</div>
						</div>

						<div class="text-center total-kpi-s kpi-right-middle">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.tchFileCount || 0}}</span></div>
							<div class="blue-grey-color">教案</div>
						</div>

						<div class="text-center total-kpi-s kpi-right-bottom">
							<div><span class="totalkpi-dash" id="visits">{{kpiData.equipTotalCount || 0}}</span></div>
							<div class="blue-grey-color">装备</div>
						</div>

						<div class="text-center total-kpi-center">
							<div class="kpi-middle-middle">
								<div class="totalkpi-dash-40">智慧校园</div>
								<div class="totalkpi-dash-20">在校生总人数</div>
								<div><span class="totalkpi-dash-72" id="visits">{{kpiData.studentCount || 0}}</span><span class="totalkpi-dash-20">人</span></div>
								<div class="current-radio-screen"> 
									<current-radio :currScreen="'4'"></current-radio>
								</div>
							</div>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">多媒体教学装备学校比例情况</div>
						<div class="chart-card-cont">
							<div style="width: 98%; margin-top: 30px;">
								<!--<chart-bar-line ref="barLineChart1" :id="'barLineChart1'" height="280px" :isscreen="true" :series="barLineSeries1"></chart-bar-line>-->
								<chart-column ref="tcolumnchart1" :id="'tcolumnchart1'" height="280px" :isscreen="true" :series="columnSeries1"></chart-column>
							</div>

						</div>
					</el-card>
				</el-col>

				<el-col :lg="8">
					<el-card class="chart-card">
						<div class="chart-card-title">多媒体教学应用水平</div>
						<div class="chart-card-cont" style="height: 230px;">
							<el-row :gutter="0">
								<el-col :span="13">
									<div class="margin-20" style="margin-top: 40px;">
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
									<chart-liquid-fill ref="ttLiquidFill" :id="'tLiquidFill'" :title="'多媒体教学率'" height="230px" :isscreen="true" :series="liquidFillSeries"></chart-liquid-fill>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">学校信息化水平排名</div>
						<div class="chart-card-cont" style="height: 330px;">
							<div style="margin-right: 30px;">
								<chart-column ref="tcolumnchart" :id="'tcolumnchart'" height="330px" :isscreen="true" :series="columnSeries"></chart-column>
							</div>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">教学资源应用排行</div>
						<!--<div>
						<div class="inner-container1">
						  <p class="text" v-for="(text, index) in dataList" :key="index">{{text.deptName}}</p>
						</div>
					</div>-->
						<div class="chart-card-cont">
							<el-table class="inner-container" :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 20px;border-bottom: none;" size="mini">
								<el-table-column prop="deptName" header-align="center" align="center" label="学校名称">
									<template slot-scope="scope">
										<router-link :to="{name:'screen-school-sc',query:{id:scope.row.departId,currScreen:currScreen}}">{{scope.row.deptName}}</router-link>
									</template>
								</el-table-column>
								<el-table-column prop="uploadTotal" header-align="center" align="center" width="70" label="上传量">
								</el-table-column>
								<el-table-column prop="downloadTotal" header-align="center" align="center" width="70" label="下载量">
								</el-table-column>
								<el-table-column prop="uploadTchAvr" header-align="center" align="center" label="师均上传/下载">
									<template slot-scope="scope">
										{{scope.row.uploadTchAvr}}/{{scope.row.downloadTchAvr}}
									</template>
								</el-table-column>
							</el-table>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>
<style>
  .inner-container th, .inner-container tr{
        background-color: transparent !important;
  }
</style>
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
			CurrentRadio
		},
		data() {
			return {
				nowDate: '--:--:--',
				nowTime: '--:--:--',
				arr: [

				],

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
				kpiData: {
					schoolCount: 0,
					teacherCount: 0,
					studentCount: 0,
					equipTotalCount: 0,
					tchFileCount: 0,
					softwareCount: 0,
					kjCount: 0,
					//网络建设

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
					yValue: []
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
			this.currScreen = this.$route.query.currScreen
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

				if(this.$refs.barLineChart1.chart) {
					this.$refs.barLineChart1.chart.resize()
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

				if(this.$refs.tPiehalf1.chart) {
					this.$refs.tPiehalf1.chart.resize()
				}
				if(this.$refs.tPiehalf2.chart) {
					this.$refs.tPiehalf2.chart.resize()
				}
				if(this.$refs.tPiehalf3.chart) {
					this.$refs.tPiehalf3.chart.resize()
				}
				if(this.$refs.tPiehalf4.chart) {
					this.$refs.tPiehalf4.chart.resize()
				}
				if(this.$refs.tBarProcess.chart) {
					this.$refs.tBarProcess.chart.resize()
				}
				if(this.$refs.tcolumnchart.chart) {
					this.$refs.tcolumnchart.chart.resize()
				}
				if(this.$refs.columnChart1.chart) {
					this.$refs.columnChart1.chart.resize()
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
					getCommHttpData({
						url: 'unitscreen/info',
						method: 'get',
						contentType: 1,
						data: {
							areaid: data.daptInfo.areaid
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

						that.barProcessSeries = {
							xValue: ['小学', '初中', '高中'],
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

						that.columnSeries1 = {
							xValue: kpiInfo.mediaEquipList.xValue,
							yValue: [kpiInfo.mediaEquipList.yValue],
							seriaName: ['多媒体'],
							yAxis: [{
								name: '%',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}]
						}
						that.$refs.tcolumnchart.chart.on('click', function(params) {
							console.log(params)
//							that.$router.push({
//								name: 'screen-school-sc',
//								query: {
//									id: params.data.id
//								}
//							})
							
							//页面外
					        that.$router.push({
								name: 'screen-link-s',
								query: {id: params.data.id}
							})

						})
						that.$refs.columnChart1.chart.on('click', function(params) {
//							that.$router.push({
//								name: 'screen-school-sc',
//								query: {
//									id: params.data.id
//								}
//							})
							//页面外
					        that.$router.push({
								name: 'screen-link-s',
								query: {id: params.data.id}
							})
						})
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