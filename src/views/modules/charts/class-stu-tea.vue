<template>

	<div class="analysis-echarts">
		<date-analysis @refreshChartsData="getDateData" :isDefault="false"></date-analysis>
		<classroom-analysis :startDate="startDate" :endDate="endDate" :gradeShow=true :classShow=true @refreshChartsData="getFilterMediaData"></classroom-analysis>
		<el-row :gutter="12">
			<el-col :span="4">
				<el-col :span="24">
					<el-card shadow="hover">
						<div class="margin-bottom-10"> 学生/整个班级</div>
						<el-input v-model="keywords" class="margin-bottom-10" clearable placeholder="请输入姓名搜索"><i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
						<div style="height: 775px; overflow: auto;">
							<template v-for="(sList,index) in studentList">
								<div id="" class="" style="background-color:#dce8f6 ;">
									<span style="display: inline-block;margin-left: 15px;">{{index}}</span>
								</div>
								<div v-for="stuItem in sList"  id="" @click="getStudentId(stuItem.stuId)" class="student-item" style="margin: 10px 0px;cursor: pointer;">
									<div v-if="studentId == stuItem.stuId" class="active-item" >
										<img :src="defaultPic" v-real-img="imgUrl+stuItem.icon" style=" border-radius: 50%;" width="35px" height="35px" /> {{stuItem.name}}
									</div>
									<div v-else>
										<img :src="defaultPic"v-real-img="imgUrl+stuItem.icon" style=" border-radius: 50%;" width="35px" height="35px" /> {{stuItem.name}}
									</div>
								</div>
							</template>
							<template v-if="studentList == null">
								<div style="color: #CCCCCC;text-align: center;">暂无学生数据</div>
							</template>
							
						</div>
					</el-card>
				</el-col>
			</el-col>	
			<el-col :span="20">
				<el-row :gutter="12">
				<el-col :span="6">
					<el-card shadow="hover">
						<div class="analysis-body">
							<div class="body-icon primary"><img src="~@/assets/img/icons/icon13.png" /></div>
							<div class="body-text">
								<div class="kpi-text">课堂回答率</div>
								<div class="kpi-value">{{kpiData.responseRate || 0}}%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover">
						<div class="analysis-body">
							<div class="body-icon red"><img src="~@/assets/img/icons/icon12.png" /></div>
							<div class="body-text">
								<div class="kpi-text">回答被奖率</div>
								<div class="kpi-value">{{kpiData.praiseRate || 0}}%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover">
						<div class="analysis-body">
							<div class="body-icon blue"><img src="~@/assets/img/icons/icon14.png" /></div>
							<div class="body-text">
								<div class="kpi-text">练习正确率</div>
								<div class="kpi-value">{{kpiData.correctRate || 0}}%</div>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="6">
					<el-card shadow="hover">
						<div class="analysis-body">
							<div class="body-icon green"><img src="~@/assets/img/icons/icon11.png" /></div>
							<div class="body-text">
								<div class="kpi-text">互动均衡度</div>
								<el-col :span="24" class="analy-progress">
									<el-rate v-model="kpiData.interactRate || 0" disabled text-color="#ff9900">
									</el-rate>
								</el-col>
								<!--<el-col :span="4" class="analy-progress">
									<div>{{kpiData.interactRate || 0}}</div>
								</el-col>-->
							</div>
						</div>
					</el-card>
				</el-col>
				</el-row>
			
			<el-row :gutter="12">
				<el-col :span="12">
					<el-card>
						<chart-stacked-column ref="cstuStackedColumnChart" :id="'cstuStackedColumnChart'" :title="'综合评价分析'" :series="asStackedColumnSeries"></chart-stacked-column>
					</el-card>
				</el-col>
				<el-col :span="12" class="margin-bottom-10">
					<el-card>
						<chart-radar ref="cstradarChart" :id="'radarChart'" :title="'课堂综合表现'"  :series="cstradarSeries"></chart-radar>
					</el-card>
				</el-col>
				<el-col :span="12">
					<el-card>
						<chart-bar-line-zoom :id="'cbarLineChart'" ref="barLineZoom" :title="'课堂测试准确率分析'" :series="cstuBarLineSeries"></chart-bar-line-zoom>
					</el-card>
				</el-col>
				<el-col :span="12">
					<el-card  v-if="this.studentId == undefined" >
						<chart-pie :id="'stbarPieRingChart'" ref="stPieRingZoom" :title="'课堂综合素养等级占比'" :series="stPieRingSeries"></chart-pie>
					</el-card>
					<el-card  v-else >
						<chart-line :id="'stLineChart'" ref="stLineZoom" :title="'课堂互动趋势分析'" :series="stLineSeries"></chart-line>
					</el-card>
				</el-col>
				<!--<el-col :span="12">
					<el-card>
						<chart-line :id="'cbarLineChart'" ref="barLineZoom" :title="'课堂互动趋势分析'" :series="cstuBarLineSeries"></chart-line>
					</el-card>
				</el-col>-->
			</el-row>
			</el-col>
		</el-row>

	</div>
</template>
<style>
	.student-item:hover{
		background-color:#f5f8fb ;
	}
	.active-item{
		background-color:#e9eff5 ;
	}
</style>
<script>
	import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import ChartPieRing from '@/components/charts/pie-ring'
	import ChartLine from '@/components/charts/line'
	import ChartRadar from '@/components/charts/radar'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartStackedColumn from '@/components/charts/stacked-column'
	import DateAnalysis from '../common/date-analysis'
//	import MediaAnalysis from '../common/media-analysis'
	import ClassroomAnalysis from '../common/classroom-analysis'
	import { getCommHttpData, getAnalysisChartData, getIntervalByArr ,getDateStr} from '@/utils/common'
	import errorImgUrl from '@/assets/img/pic_avatar.jpg'
	export default {
		components: {
			ChartPie,
			ChartPieRing,
			ChartRadar,
			ChartLine,
			ChartBarLineZoom,
			ChartStackedColumn,
			DateAnalysis,
//			MediaAnalysis,
			ClassroomAnalysis
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				startDate: getDateStr(-7),
				endDate: getDateStr(-1),
				gradeIds: [],
				classIds: [],
				subjectIds:[],
				keywords:'',
				studentList:null,
				defaultPic:errorImgUrl,
				studentId:undefined,
				kpiData: {
					correctRate: 0,
					interactRate: 0,
					praiseRate: 0,
					responseRate: 0,
					totalNum: 0
				},
				dataListLoading: false,
				cstuBarSeries: {
					xValue: [],
					yValue: []
				},
				cstradarSeries:{
					xValue: [],
					yValue: []
				},
				cstuBarLineSeries: {
					xValue: [],
					yValue: []
				},
				asStackedColumnSeries: {
					xValue: [],
					yValue: []
				},
				stPieRingSeries:{
					xValue: [],
					yValue: []
				},
				stLineSeries:{
					xValue: [],
					yValue: []
				}
			}
		},
		watch: {
			keywords(val) {
				this.getStudentList()
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
			//			this.iniChartsData();
		},
			
		methods: {
			getDateData(startDate, endDate) {
				this.startDate = startDate
				this.endDate = endDate
				this.iniChartsData()
			},
			getFilterMediaData(jsonParams) {
				this.gradeIds = jsonParams.gradeIds
				this.subjectIds = jsonParams.subjectIds
				this.classIds = jsonParams.classIds
				this.iniChartsData()
			},
			resizeListener() {
				if(this.$refs.aspieChart.chart) {
					this.$refs.aspieChart.chart.resize()
				}
				if(this.$refs.aslineChart.chart) {
					this.$refs.aslineChart.chart.resize()
				}
				if(this.$refs.asbarChart.chart) {
					this.$refs.asbarChart.chart.resize()
				}

			},
			getStudentId(id){
				if(this.studentId == id){
					this.studentId = undefined
				}else{
					this.studentId = id
				}
				this.iniChartsData()
			},
			getStudentList(){
				let that = this;
				let commJson = {
					schoolId: this.schoolId,
					startDate: this.startDate,
					endDate: this.endDate,
					gradeId:this.gradeIds,
					classId:this.classIds
				}
				if(this.keywords != ''){
					commJson['keywords'] = this.keywords
				}
				getCommHttpData({
					url: 'common/queryStudent',
					method: 'get',
					contentType: 1,
					data: commJson
				}, function(data) {
					that.studentList = data.list
				})
			},
			iniChartsData() {

				let that = this;
				let commParams = {
					schoolId: this.schoolId,
					startDate: this.startDate,
					endDate: this.endDate
				}
				if(this.gradeIds.length != 0) {
					commParams['gradeId'] = this.gradeIds
				}
				if(this.classIds.length != 0) {
					commParams['classId'] = this.classIds
				}
				if(this.classIds.length != 0) {
					commParams['subjectId'] = this.subjectIds
				}
				if(this.studentId != '') {
					commParams['stuId'] = this.studentId
				}
				
				this.getStudentList(commParams)
				
				//头部、雷达图
				getCommHttpData({
					url: 'webStudy/classroomAnalyse',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.kpiData = data.list
					that.kpiData.interactRate = data.list.interactRate/2
					setTimeout(() => {
						that.cstradarSeries = {
							xValue: ['课堂回答率','回答被奖率','练习正确率','互动均衡度'],
							yValue: [[data.list.responseRate,data.list.praiseRate,data.list.correctRate,that.kpiData.interactRate*20]],
							seriaName:['综合评分'],
							yAxis:[{max:100,tipLabel:'%'}]
						}
					}, 1000)
				})
				
				//综合评价分析
				getCommHttpData({
					url: 'webStudy/comprehensivePraise',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.asStackedColumnSeries = {
						xValue: data.list.xValue,
						yValue: [data.list.yValue, data.list.yValue1],
						seriaName: ['评价加分', '评价减分'],
						yAxis:[{name: '单位：分',min: null,max: null,interval: getIntervalByArr(data.list.yValue1),axisLabel:'',tipLabel:'分'}]
					}
				})
				
				//课堂测试准确率分析
				getCommHttpData({
					url: 'webStudy/classroomAccuracyRate',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					setTimeout(() => {
						that.cstuBarLineSeries={
				    		xValue:data.list.xValue,
				    		yValue:[data.list.yValue1,data.list.yValue],
				    		seriaName:['题型数量','平均正确率'],
				    		seriaType:['bar','line'],
				    		yAxis:[{name: '个',min: 0,max: null,interval: getIntervalByArr(data.list.yValue),axisLabel:''},{name: '%',min: 0,max: 100,interval: 10,axisLabel:''}]
				    	}
					}, 1000)
				})
				
				//占比
				getCommHttpData({
					url: 'webStudy/classroomAccuracyRatio',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					data.list.yValue1 = data.list.yValue1.length==0?[0,0,0,0,0,0]:data.list.yValue1
					setTimeout(() => {
						that.stPieRingSeries={
							xValue:data.list.xValue,
							yValue:data.list.yValue1,
							seriaName:data.list.xValue,
				    		yAxis:[{name: '等级占比',min: 0,max: null,interval: 0,axisLabel:''}]
				    	}
					}, 1000)
				})
				
				if(this.studentId != undefined){
					//趋势
					getCommHttpData({
						url: 'webStudy/stuTrend',
						method: 'get',
						contentType: 1,
						data: commParams
					}, function(data) {
						setTimeout(() => {
							
							that.stLineSeries = {
								xValue: data.list.xValue,
								yValue: [data.list.yValue],
								seriaName: ['互动趋势'],
								yAxis: [{
									name: '%',
									min: 0,
									max: 100,
									interval: null,
									axisLabel: '',
                  tipLabel:'分钟'
								}]
							}
							
						}, 2000)
					})
				}
				
			}
		}
	}
</script>