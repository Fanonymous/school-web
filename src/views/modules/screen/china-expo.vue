<template>
	<div class="mod-demo-echarts screen-charts-cont" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
		<!--<el-row :gutter="0">
			<el-col :span="24">-->
		<!--<el-card shadow="hover">-->
		<div class="example-full-screen" style="padding: 20px 0px;">
			<div class="screen-header" >
				<el-row :gutter="0">
					<el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
						<span class="header-datetime">{{nowDate}}</span>
					</el-col>
					<el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
						<!--<span class="screen-header-text">全国教育信息化动态</span>-->
						<span class="screen-header-text"><router-link to="screen-link-ch" target="_blank" style="color: #FFFFFF;">全国教育信息化动态</router-link></span>
					</el-col> 
					<el-col :span="6" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
						<span class="header-datetime">{{nowTime}}</span>
						<img :src="fullPic" @click="fullToggle" id="changeFullScreeSrc" />
						<!--<full-screen></full-screen >-->
					</el-col>
				</el-row>
			</div>
			<!--</el-card>-->
			<!--</el-col>
		</el-row>-->
			<el-row :gutter="0">
				<el-col :lg="5">
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
						<div class="chart-card-title">区域分布</div>
						<div class="chart-card-cont" style="height:200px">
							<chart-stacked-bar ref="tcolumnchart1" :id="'tcolumnchart1'" height="230px" :isscreen="true" :series="stackedBarSeries"></chart-stacked-bar>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">信息化教学环境建设</div>
						<div class="chart-card-cont" style="height:370px">
							<el-row :gutter="0" style="margin-top: 20px;">
								<el-col :span="12">
									<chart-pie-one ref="tPieOne2" :id="'chinatPieOne2'" height="180px" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
								</el-col>
								<el-col :span="12">
									<chart-pie-half ref="tPiehalf3" :id="'chinatPiehalf3'" :colorBlue="false" height="90px" :isscreen="true" :series="pieHalfSeries3"></chart-pie-half>
									<chart-pie-half ref="tPiehalf4" :id="'chinatPiehalf4'" :colorBlue="true" height="90px" :isscreen="true" :series="pieHalfSeries4"></chart-pie-half>
								</el-col>
								<el-col :span="20" :offset="2">
									<div style="margin-top:5px">
										<chart-bar-process ref="tBarProcess" :id="'chinatBarProcess'" :title="''" height="150px" :isscreen="true" :series="barProcessSeries"></chart-bar-process>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-card>
				</el-col>
				<el-col :lg="4">
					<el-card class="chart-card">
						<div class="chart-card-title">出口带宽达标率</div>
						<div class="chart-card-cont" style="height: 240px;">
							<chart-pie-one ref="chinatPieOne2" :id="'chinatPieOneCol2'" height="160px" :isscreen="true" :series="pieOneSeriesCol2"></chart-pie-one>
							<div style="text-align: center;">	
								<table width="100%">
									<thead>
									<tr>
										<th>小学</th>
										<th>初中</th>
										<th>高中</th>
									</tr>
									</thead>
									<tbody>
										<tr v-for="(item,index) in dataList" style="height: 30px;">
											<td>{{item.num1}}</td>
											<td>{{item.num2}}</td>
											<td>{{item.num3}}</td>
										</tr>
									</tbody>
								</table>
							</div>
								<!--<el-table :data="dataList" :border=false  fit highlight-current-row :show-header=false>
									<el-table-column prop="num1" align="center" label="目标用户">
									</el-table-column>
									<el-table-column prop="num2" align="center" label="创建日期">
									</el-table-column>
									<el-table-column prop="num3" align="center" label="创建日期">
									</el-table-column>
								</el-table>-->
							
						</div>
					</el-card>
					
					<el-card class="chart-card">
						<div class="chart-card-title">多媒体教育装备统计</div>
						<div class="chart-card-cont" style="height: 240px;">
							<chart-pie ref="chinaPieChart2" :id="'chinaPieChartCol2'" height="240px" :isscreen="true" :series="chinaPieSeriesCol2"></chart-pie>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">百名学生教学终端比例</div>
						<div class="chart-card-cont" style="height: 370px;">
							<div style="margin-top: 20px;">
								<chart-dash-board-s ref="chinaDashBoardchart1" :id="'chinaDashBoardchart1'" height="180px" :isscreen="true" :series="chinaDashBoardSeries1"></chart-dash-board-s>
							</div>
							<div>
								<chart-dash-board-s ref="chinaDashBoardchart2" :id="'chinaDashBoardchart2'" height="160px" :isscreen="true" :series="chinaDashBoardSeries2"></chart-dash-board-s>
							</div>
						</div>
					</el-card>
					<!--<el-card class="chart-card">
						<div class="chart-card-title">百名学生拥有多媒体比例</div>
						<div class="chart-card-cont" style="height: 200px;">
							<div style="margin-top: 20px;">
								<chart-dash-board-s ref="chinaDashBoardchart2" :id="'chinaDashBoardchart2'" height="200px" :isscreen="true" :series="chinaDashBoardSeries2"></chart-dash-board-s>
							</div>
						</div>
					</el-card>-->
				</el-col>
				<el-col :lg="6">
					<el-card class="chart-card kpi-card">
						<div class="screen-map-title">教育信息化发展情况</div>
						<div>
							<chart-map-china ref="tmapchinachart1" :id="'tmapchinachart1'" height="560px" :isscreen="true" :series="chinaMapSeries"></chart-map-china>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">历年来我国教育装备分析</div>
						<div class="chart-card-cont">
							<div style="width: 98%; margin-top: 20px;">
								<chart-bar-line ref="ccbarLineChart1" :id="'ccbarLineChart1'" height="280px" :isscreen="true" :series="barLineSeries1"></chart-bar-line>
							</div>
						</div>
					</el-card>
				</el-col>

				<el-col :lg="5">
					<el-card class="chart-card">
						<div class="chart-card-title">教育信息化应用</div>
						<div class="chart-card-cont" style="height:170px">
							<el-row :gutter="0">
								<el-col :span="14">
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
											<el-col :span="7" class="no-padding">
												<span class="blue-grey-color">交互度</span>
											</el-col>
											<el-col :span="17" class="no-padding">
												<el-rate v-model="kpiData.interactivity/10*5 || 0" allow-half disabled text-color="#40c2ee" void-color="#02e3fc" void-icon-class="icon-rate-face-off" :colors="['#02e3fc','#02e3fc','#02e3fc']">
												</el-rate>
											</el-col>
										</el-row>
									</div>
									<div class="margin-20">
										<el-row :gutter="0">
											<el-col :span="7" class="no-padding">
												<span class="blue-grey-color">多样性</span>
											</el-col>
											<el-col :span="17" class="analy-progress no-padding">
												<el-progress :stroke-width="15" color="#02e3fc" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
											</el-col>
										</el-row>
									</div>
								</el-col>
								<el-col :span="10">
									<chart-liquid-fill ref="ttLiquidFill" :id="'tLiquidFill'" :title="'多媒体教学率'" height="170px" :isscreen="true" :series="liquidFillSeries"></chart-liquid-fill>
								</el-col>
							</el-row>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">教育信息化应用TOP5</div>
						<div class="chart-card-cont" style="height: 245px;">
							<div style="margin-top: 30px;text-align: center;">
								<table width="100%">
									<thead>
									<tr>
										<th>省份</th>
										<th>应用率</th>
										<th>互动度</th>
										<th>多样性</th>
										<th>综合评分</th>
									</tr>
									</thead>
									<tbody>
										<tr v-for="(item,index) in topFiveList.xValue" style="height: 35px;">
											<td><img src="~@/assets/img/charts/top1.png" v-if="index == 0"/>
											<img src="~@/assets/img/charts/top2.png"  v-else-if="index == 1"/>
											<img src="~@/assets/img/charts/top3.png" v-else-if="index==2"/>
												{{item}}</td>
											<td>{{topFiveList.yValue[index].userRate}}%</td>
											<td>{{topFiveList.yValue[index].interactivity}}</td>
											<td><el-progress :stroke-width="15" color="#02e3fc" :percentage="topFiveList.yValue[index].diversity*10" :show-text="false"></el-progress></td>
											<td>{{topFiveList.yValue[index].rank}}</td>
										</tr>
									</tbody>
								</table>
									
								<chart-column ref="tcolumnchart" :id="'tcolumnchart'" height="245px" :isscreen="true" :series="columnSeries"></chart-column>
							</div>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">网络学习空间应用</div>
						<div class="chart-card-cont" style="height:190px">
							<el-col :span="9">
								<chart-pie-one ref="tPieOne3" :id="'tPieOne3'" height="190px" :isscreen="true" :series="pieOneSeries3"></chart-pie-one>
							</el-col>
							<el-col :span="13">
								<div class="card-kpi-value" style="margin-top: 20px;">
									<font class="card-kpi-num1">{{kpiData.netspaceOpenUsers || 0}}</font>
									<font class="blue-grey-color">万</font>
									<div class="blue-grey-color">已开通人数</div>
								</div>
								<el-col :span="12">
									<div class="card-kpi-value-nop">
										<el-row :gutter="0">
											<el-col :span="10" class="no-padding" style="text-align: right;"><img src="~@/assets/img/icons/db-2.png" /></el-col>
											<el-col :span="14" class="no-padding">
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
											<el-col :span="10" class="no-padding" style="text-align: right;"><img src="~@/assets/img/icons/db-3.png" /></el-col>
											<el-col :span="14" class="no-padding">
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
					<el-card class="chart-card">
						<div class="chart-card-title">数字资源建设</div>
						<div class="chart-card-cont" style="height: 200px;">
							<el-col :span="12">
								<chart-pie ref="tPieChart" :id="'tPieChart'" height="180px" :isscreen="true" :series="pieSeries"></chart-pie>
							</el-col>
							<el-col :span="12">
								<div class="card-kpi-value-s" style="margin-top: 20px;">
									<el-col :span="5" :offset="3" class="kpi-bottom" style="text-align: right;"><img src="~@/assets/img/icons/db-7.png" /></el-col>
									<el-col :span="13" class="kpi-bottom">
										<font class="card-kpi-num2">{{kpiData.fileNum.countFileNum}}</font>
										<font class="blue-grey-color">万条</font>
										<div class="blue-grey-color">累计生成资源</div>
									</el-col>
								</div>
								<div class="card-kpi-value-s">
									<el-col :span="5" :offset="3" class="kpi-bottom" style="text-align: right;"><img src="~@/assets/img/icons/db-1.png" /></el-col>
									<el-col :span="13" class="kpi-bottom">
										<font class="card-kpi-num2">{{kpiData.fileNum.nowMonthFileNum}}</font><span class="blue-grey-color">条</span>
										<div class="blue-grey-color">本学期新增</div>
									</el-col>
								</div>
								<div class="card-kpi-value-s">
									<el-col :span="5" :offset="3" style="text-align: right;"><img src="~@/assets/img/icons/db-6.png" /></el-col>
									<el-col :span="13">
										<font class="card-kpi-num2">{{kpiData.fileNum.countVolume}}</font> <span class="blue-grey-color">万人次</span>
										<div class="blue-grey-color">资源使用人次</div>
									</el-col>
								</div>
							</el-col>
						</div>
					</el-card>
					
				</el-col>
				<el-col :lg="4">
					
					<el-card class="chart-card">
						<div class="chart-card-title">课堂授课类型</div>
						<div class="chart-card-cont"  style="height: 200px;">
							<chart-pie ref="chinaPieChart2" :id="'chinaPieChart2'" style="margin-right: 30px;" height="200px" :isscreen="true" :series="chinaPieSeries2"></chart-pie>
						</div>
					</el-card>
					
					<el-card class="chart-card">
						<div class="chart-card-title">课堂行为雷达分析预览图</div>
						<div class="chart-card-cont" style="height: 200px;">
							<chart-radar-area ref="chinaRadarChart":id="'chinaRadarChart'" height="200px" :isscreen="true" :series="radarAreaSeries1"></chart-radar-area>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">课堂使用软件分布</div>
						<div class="chart-card-cont" style="height: 208px;">
							<chart-column ref="chinaColumnchart1" :id="'chinaColumnchart1'" height="208px" :isscreen="true" :series="chinaColumnSeries2"></chart-column>
						</div>
					</el-card>
					<el-card class="chart-card">
						<div class="chart-card-title">教师多媒体应用习惯</div>
						<div class="chart-card-cont" style="height: 200px;">
							<div class="heatmap-bg" >
								<img src="~@/assets/img/charts/heatmap.png" />
							</div>
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
	import ChartStackedBar from '@/components/charts/stacked-bar'
	import ChartPie from '@/components/charts/pie-s'
	import ChartMapChina from '@/components/charts/map-china'
	import ChartDashBoardS from '@/components/charts/dash-board-s'
	import FullScreen from '../common/full-screen'
	import CurrentRadio from './com/current-radio'
	import ChartRadarArea from '@/components/charts/radar-area'
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
			ChartStackedBar,
			ChartPie,
			ChartMapChina,
			FullScreen,
			CurrentRadio,
			ChartRadarArea,
			ChartDashBoardS
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
				dataList:[{num1:'92%',num2:'89%',num3:'87%'}],
				fullPic: fullS,
				chinaMapSeries:[],
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
				chinaPieSeries2:{
					xValue: [],
					yValue: []
				},
				radarAreaSeries1:{
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
				chinaColumnSeries2:{
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
				stackedBarSeries: {
					xValue: [],
					yValue: []
				},
				topFiveList:[],
				pieOneSeriesCol2:{
					xValue: [],
					yValue: []
				},
				chinaPieSeriesCol2:{
					xValue: [],
					yValue: []
				},
				chinaDashBoardSeries1:{
					xValue: [''],
					yValue: [0]
				},
				chinaDashBoardSeries2:{
					xValue: [''],
					yValue: [0]
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

		},
		//  activated () {
		//			this.resizeListener()
		//  },
		methods: {
			fullToggle() {
				this.$fullscreen.toggle(this.$el.querySelector('.example-full-screen'), {
					wrap: false,
					callback: this.fullscreenChange
				})
			},
			fullscreenChange(fullscreen) {
				if(fullscreen) {
					this.fullPic = fullE
				} else {
					this.fullPic = fullS
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
				if(this.$refs.stackedBarSeries.chart) {
					this.$refs.stackedBarSeries.chart.resize()
				}
				
				if(this.$refs.chinaPieChart2.chart) {
					this.$refs.chinaPieChart2.chart.resize()
				}
				
				if(this.$refs.chinaRadarChart.chart) {
					this.$refs.chinaRadarChart.chart.resize()
				}
				
				if(this.$refs.chinaColumnchart1.chart) {
					this.$refs.chinaColumnchart1.chart.resize()
				}
			},
			iniChartsData() {
				let that = this
				
				
				that.barLineSeries1 = {
					xValue: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018'],
					yValue: [
						[1023,1235,1445,1713,2112,2545,3212,3820],
						[20.72,17,18.54,23.29,20.50,26.32,18.67,16]
					],
					seriaName: ['装备数', '增长率'],
					seriaType: ['bar', 'line'],
					yAxis: [{
						name: '万台',
						min: 0,
						max: null,
						interval: null,
						axisLabel: ''
					}, {
						name: '%',
						min: 0,
						max: null,
						interval: null,
						axisLabel: ''
					}]
				}
				this.loading = true
				getCommHttpData({
					url: 'country/info',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.loading = false
					let kpiInfo = data.info
					that.kpiData = kpiInfo
//					that.dataList = kpiInfo.fileLevelList

					that.pieOneSeries1 = {
						xValue: ['学校互联网接入率', ''],
						yValue: kpiInfo.schoolNetinRat == null ? 0 : kpiInfo.schoolNetinRat
					}
					that.pieOneSeriesCol2 = {
						xValue: ['达标率', ''],
						yValue: 89
					}
					that.chinaPieSeriesCol2 = {
						xValue: ['电脑', '投影仪','触控一体机','电子白板'],
						yValue: [25,45,5,35]
					}
					that.chinaDashBoardSeries1 = {
						xValue: ['/百人'],
						yValue: [15.7]
					}
					that.chinaDashBoardSeries2 = {
						xValue: ['间/百人'],
						yValue: [2.21,]
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
					that.stackedBarSeries = {
						xValue: kpiInfo.regionalCount.xValue.reverse(),
						yValue: [
							kpiInfo.regionalCount.yValue.reverse(),
							kpiInfo.regionalCount.yValue1.reverse()
						],
						seriaName: ['已接入数', '未接入数'],
						yAxis: [{
							name: '',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]
					}
					that.topFiveList = kpiInfo.infoLevelList
					that.chinaPieSeries2 = {
						xValue: ['讲授型','练习型','混合型','对话型'],
						yValue: [36.5,28.5,24.5,10.5]
					}
					
					that.radarAreaSeries1 = {
						xValue: ['师生互动','应答','读写','听讲','举手','生生互动','讲授','板书'],
						yValue: [
							[40,40,60,60,50,20,90,50,40]
						],
						seriaName: ['']
					}
					that.chinaColumnSeries2 = {
						xValue: ['PPT','视频','音频','文档','网页','其他'],
						yValue: [
							[80,90,60,45,35,20]
						],
						seriaName: ['互联网接入率'],
						yAxis: [{
							name: '%',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]
					}
					that.$refs.tmapchinachart1.chart.on('click', function (param) {
						
						if(param.name == '陕西'){
					        that.$router.push({
								name: 'screen-province-sc',
								query: {provinceName:param.name}
							})
					    }
				    });
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