<template>
	<div class="mod-demo-echarts screen-charts-cont " >
		<div class="example-full-screen">
		<div class="screen-header">
			<el-row :gutter="0">
				<el-col :span="6" style="text-align: left;padding-top: 0px;padding-bottom: 0px;">
					<span class="header-datetime">{{nowDate}}</span>
				</el-col>
				<el-col :span="12" style="padding-top: 0px;padding-bottom: 0px;">
					<span class="screen-header-text">学校智慧校园</span>
				</el-col>
				<el-col :span="6" style="text-align: right;padding-top: 0px;padding-bottom: 0px;">
					<span class="header-datetime">{{nowTime}}</span>
					<!--<router-link to="/screen-link-s" target="_blank">-->
						<img :src="fullPic"  @click="fullToggle"/>
					<!--</router-link>-->
					
				</el-col>
			</el-row>
		</div>
		<el-row :gutter="0">
			<el-col :lg="8" >
				<el-card class="chart-card">
					<div class="chart-card-title">基础设施</div>
					<div class="chart-card-cont">
						<el-col :span="22" :offset="1"> 
							<div class="card-kpi-value" style="margin-top: 15px; margin-bottom: 20px;">
								<el-col :span="12">
									<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-4.png" /></el-col>
									<el-col :span="14">
										<font class="card-kpi-num1">{{kpiData.equipTotalCount}}</font>
										<div class="blue-grey-color">装备总数</div>
									</el-col>
								</el-col>
								<el-col :span="12">
									<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-5.png" /></el-col>
									<el-col :span="14">
										<font class="card-kpi-num1">{{kpiData.equipTotalUseCount}}</font>
										<div class="blue-grey-color">在用装备</div>
									</el-col>
								</el-col>
							</div>
						</el-col>
						<el-col :span="12">
							<chart-pie-one ref="sctPieOne1" :id="'sctPieOne1'" height="140px" :isscreen="true" :series="pieOneSeries1"></chart-pie-one>
						</el-col>
						<el-col :span="12">
							<chart-bar-process ref="sctbarProcessChart1" :title="'年级可用率TOP3'"  :id="'sctbarProcessChart1'" height="140px" :isscreen="true" :series="barProcessSeries1"></chart-bar-process>
						</el-col>
					</div>
				</el-card>
				<el-card class="chart-card">
					<div class="chart-card-title">智慧环境</div>
					<div class="chart-card-cont">
						<el-col :span="12">
							<chart-pie-one ref="sctPieOne2" :id="'sctPieOne2'" height="280px" :isscreen="true" :series="pieOneSeries2"></chart-pie-one>
						</el-col>
						<el-col :span="10">
							<div class="card-kpi-value margin-10" style="margin-top: 40px;">
								<!--<el-row :gutter="0">-->
									<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-2.png" /></el-col>
									<el-col :span="14">
										<font class="card-kpi-num1">{{kpiData.stuEquipRat}}</font>
										<div class="blue-grey-color">生机比</div>
									</el-col>
								<!--</el-row>-->
							</div>
							<div class="card-kpi-value margin-10">
								<!--<el-row :gutter="0">-->
									<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-3.png" /></el-col>
									<el-col :span="14">
										<font class="card-kpi-num1">{{kpiData.teacherEquipRat}}</font>
										<div class="blue-grey-color">师机比</div>
									</el-col>
								<!--</el-row>-->
							</div>
						</el-col>
					</div>

				</el-card>
				<el-card class="chart-card">
					<div class="chart-card-title">数字资源平台</div>
					<div class="chart-card-cont">
						<el-col :span="12">
							<chart-pie ref="sctPieChart" :id="'sctPieChart'" height="280px" :isscreen="true" :series="pieSeries"></chart-pie>
						</el-col>
						<el-col :span="10">
							<div class="card-kpi-value margin-10">
								<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-7.png" /></el-col>
								<el-col :span="14">
									<font class="card-kpi-num1">{{kpiData.fileNum.countFileNum}}</font><font class="blue-grey-color">万条</font>
									<div class="blue-grey-color">累计生成资源</div>
								</el-col>
								
							</div>
							<div class="card-kpi-value margin-10">
								
								<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-1.png" /></el-col>
								<el-col :span="14">
									<font class="card-kpi-num1">{{kpiData.fileNum.nowMonthFileNum}}</font><span class="blue-grey-color">条</span>
									<div class="blue-grey-color">本学期新增</div>
								</el-col>
								
							</div>
							<div class="card-kpi-value margin-10">
								<el-col :span="10" style="text-align: right;"><img src="~@/assets/img/icons/db-6.png" /></el-col>
								<el-col :span="14">
									<font class="card-kpi-num1">{{kpiData.fileNum.countVolume}}</font> <span class="blue-grey-color">人次</span>
									<div class="blue-grey-color">资源使用人次</div>
								</el-col>
								
							</div>
						</el-col>
					</div>

				</el-card>
			</el-col>
			<el-col :lg="8">
				<el-card class="chart-card kpi-card">
					
					<div class="text-center total-kpi-s kpi-left-top">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.classCount}}</span></div>
						<div class="blue-grey-color">班级</div>
					</div>

					<div class="text-center total-kpi-s kpi-left-middle">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.teacherCount}}</span></div>
						<div class="blue-grey-color">教职工</div>
					</div>

					<div class="text-center total-kpi-s kpi-left-bottom">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.kjCount}}</span></div>
						<div class="blue-grey-color">课件</div>
					</div>

					<div class="text-center total-kpi-s kpi-right-top">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.softwareCount}}</span></div>
						<div class="blue-grey-color">应用</div>
					</div>

					<div class="text-center total-kpi-s kpi-right-middle">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.tchFileCount}}</span></div>
						<div class="blue-grey-color">教案</div>
					</div>

					<div class="text-center total-kpi-s kpi-right-bottom">
						<div><span class="totalkpi-dash" id="visits">{{kpiData.equipTotalCount}}</span></div>
						<div class="blue-grey-color">装备</div>
					</div>
					<div class="text-center total-kpi-center">
						<div class="kpi-middle-middle">
							<div class="totalkpi-dash-40">智慧校园</div>
							<div class="totalkpi-dash-20">在校生总人数</div>
							<div><span class="totalkpi-dash-72" id="visits">{{kpiData.studentCount}}</span><span class="totalkpi-dash-20">人</span></div>
						</div>
						<div class="current-radio-screen"> 
							<current-radio :currScreen="'5'"></current-radio>
						</div>
					</div>
				</el-card>
				
				<el-card class="chart-card">
					<div class="chart-card-title">智慧校园网络分析</div>
					<div class="chart-card-cont">
						<div style="margin-right: 20px;margin-top: 10px;">
							<chart-stacked-area ref="sctstackedAreaChart1" :id="'tstackedAreaChart1'" height="280px" :isscreen="true" :series="stackedAreaSeries1"></chart-stacked-area>
						</div>
						
					</div>
				</el-card>
			</el-col>

			<el-col :lg="8">
				<el-card class="chart-card">
					<div class="chart-card-title">多媒体教学应用水平</div>
					<div class="chart-card-cont">
						<!--<el-row :gutter="0">-->
							<el-col :span="13">
								<div class="margin-10" style="margin-top: 70px;">
									<el-row :gutter="0">
										<el-col :span="8" class="no-padding">
											<span class="blue-grey-color" style="display:inline-block;margin-top: 30px;">教学时长</span>
										</el-col>
										<el-col :span="16" class="no-padding">
											<font class="card-kpi-num1">{{kpiData.mediaTopRat.useTime || 0}}</font>
											<font>分钟/节</font>
										</el-col>
									</el-row>
								</div>
								<div class="margin-10">
									<el-row :gutter="0">
										<el-col :span="8" class="no-padding">
											<span class="blue-grey-color">交互度</span>
										</el-col>
										<el-col :span="16" class="no-padding">
											<el-rate v-model="kpiData.mediaTopRat.interactivity/10*5 || 0" allow-half disabled text-color="#40c2ee" void-color="#02e3fc" void-icon-class="icon-rate-face-off" :colors="['#02e3fc','#02e3fc','#02e3fc']">
											</el-rate>
										</el-col>
									</el-row>
								</div>
								<div class="margin-10">
									<el-row :gutter="0">
										<el-col :span="8" class="no-padding">
											<span class="blue-grey-color">多样性</span>
										</el-col>
										<el-col :span="16" class="analy-progress no-padding">
											<el-progress :stroke-width="15" color="#02e3fc" :percentage="kpiData.mediaTopRat.diversity*10" :show-text="false"></el-progress>
										</el-col>
									</el-row>
								</div>
							</el-col>
							<el-col :span="11">
								<chart-liquid-fill ref="scttLiquidFill" :id="'sctLiquidFill'" :title="'多媒体教学率'"  height="280px" :isscreen="true" :series="liquidFillSeries"></chart-liquid-fill>
							</el-col>
						<!--</el-row>-->
					</div>
				</el-card>
				<el-card class="chart-card" style="margin-bottom: 20px;">
					<el-col :span="12">
						<div class="chart-card-title">信息化应用排行TOP10</div>
						<div class="chart-card-cont">
							<chart-bar-top ref="sctbarProcessChart2" :id="'sctbarProcessChart2'" height="280px" :isscreen="true" :series="barProcessSeries2"></chart-bar-top>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="chart-card-title">多样性分布情况</div>
						<div class="chart-card-cont">
							<chart-radar-area ref="scdradarChart" :id="'scdradarChart'" height="280px" :isscreen="true" :series="radarSeries"></chart-radar-area>
						</div>
					</el-col>
				</el-card>
				<!--<el-card class="chart-card">
					<div class="chart-card-title">信息化应用排行TOP10</div>
					<div class="chart-card-cont">
						<el-col :span="12">
							<chart-bar-top ref="tbarProcessChart2" :id="'tbarProcessChart2'" height="280px" :isscreen="true" :series="barProcessSeries2"></chart-bar-top>
						</el-col>
						<el-col :span="12">
							<chart-radar-area  ref="dradarChart" :id="'dradarChart'"  height="280px" :isscreen="true" :series="radarSeries"></chart-radar-area>
						</el-col>
					</div>
				</el-card>-->
				<el-card class="chart-card">
					<div class="chart-card-title">教师多媒体应用习惯</div>
					<div class="chart-card-cont" style="height: 290px;">
						<div class="heatmap-bg" >
							<img src="~@/assets/img/charts/heatmap.png" />
							<!--<chart-heat-map ref="theatMapChart" :id="'theatMapChart'" height="280px" :isscreen="true" :series="heatMapSeries"></chart-heat-map>-->
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
	import ChartBarTop from '@/components/charts/bar-top'
	import ChartBarProcess from '@/components/charts/bar-process'
	import ChartPieOne from '@/components/charts/pie-ring-one-s'
	import ChartPie from '@/components/charts/pie-s'
	import ChartColumn from '@/components/charts/column'
	import ChartDashBoard from '@/components/charts/dash-board'
	import ChartLiquidFill from '@/components/charts/liquidfill'
	import ChartHeatMap from '@/components/charts/heat-map'
	import ChartRadarArea from '@/components/charts/radar-area'
	import ChartStackedArea from '@/components/charts/stacked-area'
	import CurrentRadio from './com/current-radio'
	import { getCommHttpData, getAnalysisChartData,getNowDate,getNowTime} from '@/utils/common'
//	import screenfull from 'screenfull'
	const fullS = require('../../../assets/img/icons/full-s.png')
	const fullE = require('../../../assets/img/icons/full-e.png')
	export default {
		components: {
			ChartBar,
			ChartPieOne,
			ChartPie,
			ChartColumn,
			ChartDashBoard,
			ChartLiquidFill,
			ChartBarProcess,
			ChartBarTop,
			ChartHeatMap,
			ChartRadarArea,
			ChartStackedArea,
			CurrentRadio
		},
		data() {
			return {
				nowDate:'--:--:--',
				nowTime:'--:--:--',
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
					teacherCount: 0,
					studentCount: 0,
					equipTotalCount: 0,
					tchFileCount: 0,
					softwareCount: 0,
					kjCount:0,
					classCount:0,
					//多媒体
					equipTotalUseCount: 0,
					equipRat: 0,
					gradeTop3: [],

					//资源
					fileNum:{
						countFileNum: 0,
						countVolume: 0,
						nowMonthFileNum: 0,
					},

					//多媒体
					mediaTopRat:{
						diversity: 0,
						useTime: 0,
						interactivity: 0,
						useRate: 0,
					},
					mediaTeachRat: 0,
					mediaClassroomRat: 0,
					stuEquipRat: '16:1',
					teacherEquipRat: '5:1'
				},

				columnSeries: {
					xValue: [],
					yValue: []
				},
				columnSeries1: {
					xValue: [],
					yValue: []
				},
				pieOneSeries1: {
					xValue: [0],
					yValue: [0]
				},
				pieOneSeries2: {
					xValue: [0],
					yValue : [0]
				},
				pieSeries:{
					xValue: [],
					yValue : []
				},
				liquidFillSeries: {
					xValue: [],
					yValue: 0
				},
				barProcessSeries1: {
					xValue: [],
					yValue: []
				},
				barProcessSeries2: {
					xValue: [],
					yValue: []
				},
				radarSeries: {
					xValue: [],
					yValue: []
				},
				heatMapSeries: {
					xValue: [],
					yValue: []
				},
				stackedAreaSeries1:{
					xValue: [],
					yValue: []
				},
				fullscreen: false,
				isFullscreen: false
				
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
			setInterval(function(){
				that.dateData =  getNowDate()
				that.nowTime = getNowTime()
			},1000)
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
//				if(this.$refs.ttbarLineZoom1.chart) {
//					this.$refs.ttbarLineZoom1.chart.resize()
//				}
				if(this.$refs.sctbarProcessChart2.chart) {
					this.$refs.sctbarProcessChart2.chart.resize()
				}
				if(this.$refs.scdradarChart.chart) {
					this.$refs.scdradarChart.chart.resize()
				}
				if(this.$refs.sctheatMapChart.chart) {
					this.$refs.sctheatMapChart.chart.resize()
				}
				if(this.$refs.sctstackedAreaChart1.chart) {
					this.$refs.sctstackedAreaChart1.chart.resize()
				}
			},
			getFullCreeen(){
				if (!screenfull.enabled) { // 如果不允许进入全屏，发出不允许提示
		        this.$message({
			          message: '不支持全屏',
			          type: 'warning'
			        })
			        return false
			    }
		        screenfull.toggle()
		        this.$message({
		            message: '全屏啦',
		            type: 'success'
		        })
			},
			iniChartsData() {
				let that = this
				if(this.$route.query.id != undefined){
					this.orgId = this.$route.query.id
				}
				
				that.heatMapSeries = { 
//					xValue: ['学校1', '学校2', '学校3'],
//						yValue: [
//							[50, 60, 4]
//						],
//						seriaName: ['交互度'],
//						yAxis: [{
//							name: '',
//							min: 0,
//							max: null,
//							interval: null,
//							axisLabel: '小时'
//						}]
				}
//				getCommHttpData({
//					url: 'schoolScreen/thermalMap',
//					method: 'post',
//					contentType: 2,
//					data: {deptId:this.orgId}
//				}, function(data) {
//					
//				})
				getCommHttpData({
					url: 'schoolScreen/info',
					method: 'post',
					contentType: 2,
					data: {deptId:this.orgId}
				}, function(data) {
					let kpiInfo = data.schoolScreen
					that.kpiData = kpiInfo

					that.pieOneSeries1 = {
						xValue: ['可用率', ''],
						yValue: kpiInfo.equipRat
					}
					that.pieOneSeries2 = {
						xValue: ['多媒体教室比例', ''],
						yValue: kpiInfo.mediaClassroomRat == null?0:kpiInfo.mediaClassroomRat
					}

					that.liquidFillSeries = {
						xValue: ['多媒体教学率'],
						yValue: kpiInfo.mediaTopRat.useRate/100
					}
					that.columnSeries = {
						xValue: ['学校1', '学校2', '学校3'],
						yValue: [
							[50, 60, 4]
						],
						seriaName: ['交互度'],
						yAxis: [{
							name: '',
							min: 0,
							max: null,
							interval: null,
							axisLabel: '小时'
						}]
					}
					//bytesReceived 下行 bytesSent上行 total 总量
					let areaSeries1=new Array(),areaSeries2=new Array(),areaSeries3=new Array()
					for(let i in kpiInfo.netAlys.yValue){
						areaSeries1.push(kpiInfo.netAlys.yValue[i].bytesReceived)
						areaSeries2.push(kpiInfo.netAlys.yValue[i].bytesSent)
						areaSeries3.push(kpiInfo.netAlys.yValue[i].total)
					}
					that.pieSeries={
						xValue:kpiInfo.fileTypeAcc.xValue,
						yValue:kpiInfo.fileTypeAcc.yValue
					}
					that.stackedAreaSeries1 = {
						xValue: kpiInfo.netAlys.xValue,
						yValue: [ 
							areaSeries3,areaSeries2,areaSeries1
						],
						seriaName: ['总流量','上行流量', '下行流量'],
						legendData:[{name:'总流量',icon:'circle'},
				                {name:'上行流量',icon:'circle'},
				                {name:'下行流量',icon:'circle'}],
						xAxis:[{
							name: '小时',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}],
						yAxis: [{
							name: 'MB',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]
					}
					let gradeArrY = new Array()
					let gradeArrX = new Array()
					if(kpiInfo.gradeTop3 != null){
						for(let i in kpiInfo.gradeTop3){
							gradeArrX.push(kpiInfo.gradeTop3[i].gradName)
							gradeArrY.push(kpiInfo.gradeTop3[i].rat)
						}
						that.barProcessSeries1={
							xValue:gradeArrX,
							yValue:gradeArrY,
				    		seriaName:[''],
				    		yAxis:[{name: '%',min: 0,max: null,interval: null,axisLabel:''}]
				    	}
					}
					if(kpiInfo.infoTop10 != null){
						that.barProcessSeries2={
							xValue:kpiInfo.infoTop10.xValue.reverse(),
							yValue:[kpiInfo.infoTop10.yValue.reverse()],
				    		seriaName:[''],
				    		yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]
				    	}
					}
					let max = Math.max.apply(null, kpiInfo.dibersityRat.yValue);	
					that.radarSeries = {
						xValue: kpiInfo.dibersityRat.xValue,
						yValue: [kpiInfo.dibersityRat.yValue],
						seriaName:[''],
						max:max
					}
					that.resizeListener()
					that.$refs.tstackedAreaChart1.chart.resize()
				})
			}
		}
	}
</script>