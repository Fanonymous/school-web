<template>

	<div class="analysis-echarts">

		<el-row :gutter="10">
			<el-col :span="12">
				<el-card shadow="hover">
					<!-- <div class="table-title margin-bottom-10">
              多媒体用途分析 
             <el-tooltip class="item" effect="dark" content="请您添加正确的采购时间以保证使用年份的准确性。注：未录入采购时间时，平台将自动获取入库时间。" placement="bottom-start">
                <i class="el-icon-info i-index-question"></i>
              </el-tooltip>
            </div> -->
					<chart-pie :id="'stbarPieRingChart'" ref="stPieRingZoom" :title="'多媒体用途分析'" :series="stPieRingSeries"></chart-pie>
				</el-card>
			</el-col>
			<el-col :span="12" class="margin-bottom-10">
				<el-card shadow="hover">
					<div class="table-title margin-bottom-10">教学设备配备
						<el-select v-model="deviceType1" v-if="dataTypeList1.length>1" size="mini" value-key="id" placeholder="请选择类型" @change="getPieRings" class="right">
							<el-option v-for="item in dataTypeList1" :label="item.name" :key="item.name" :value="item.name"></el-option>
						</el-select>
					</div>
					<template v-if="pieRingClass != 0 || pieRingFunction!=0">
						<el-col :span="pieRingClass">
							<chart-pie-ring-one ref="ispieRingChart1" :height="'342px'" :id="'ispieRingChart1'" :title="''" :series="pieRingSeries1"></chart-pie-ring-one>
						</el-col>
						<el-col :span="pieRingFunction">
							<chart-pie-ring-one ref="ispieRingChart2" :height="'342px'" :id="'ispieRingChart2'" :title="''" :series="pieRingSeries2"></chart-pie-ring-one>
						</el-col>
					</template>
					<template v-else>
						<el-col style="height: 342px;text-align: center;">
							<img src="~@/assets/img/nodata.png" width="180px" style="margin-top: 60px;" />
						</el-col>
					</template>

				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" style="height: 350px;">
					<div class="table-title margin-bottom-10">教师设备配备</div>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/8.png" />
							<div class="text-title margin-bottom-20">师机比</div>
							<div><span class="text-key1">{{teacherRate}} : 1</span></div>
						</div>
					</el-col>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/7.png" />
							<div class="margin-bottom-20"><span class="text-key">{{teacherTotal}}</span>人</div>
							<div class="text-title1">教师数</div>
						</div>
					</el-col>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/6.png" />
							<div class="margin-bottom-20"><span class="text-key">{{teacherEquip}}</span>台</div>
							<div class="text-title1">教师设备数 </div>
						</div>
					</el-col>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" style="height: 350px;">
					<div class="table-title margin-bottom-10">学生设备配备
						<el-select v-model="deviceType" size="mini" v-if="dataTypeList.length>1" clearable value-key="id" placeholder="请选择类型" @change="getStudentRateInfo" class="right">
							<el-option v-for="item in dataTypeList" :label="item.name" :key="item.name" :value="item.name"></el-option>
						</el-select>
					</div>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/9.png" />
							<div class="text-title margin-bottom-20">全校生机比 </div>
							<div><span class="text-key1">{{studentRate}} : 1</span></div>
						</div>
					</el-col>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/5.png" />
							<div class="margin-bottom-20"><span class="text-key">{{studentTotal}}</span>人</div>
							<div class="text-title1">学生数 </div>
						</div>
					</el-col>
					<el-col :span="8" class="text-body">
						<div><img src="~@/assets/img/brand/6.png" />
							<div class="margin-bottom-20"><span class="text-key">{{studentEquip}}</span>台</div>
							<div class="text-title1">学生设备数</div>
						</div>
					</el-col>
				</el-card>
			</el-col>

		</el-row>

	</div>
</template>
<style>
	.student-item:hover {
		background-color: #f5f8fb;
	}

	.active-item {
		background-color: #e9eff5;
	}

	.text-body {
		text-align: center;
		margin-top: 40px;
		color: #606266;
	}

	.text-title {
		font-size: 18px;
		font-weight: bold;
	}

	.text-title1 {
		/* font-size: 16px; */
		/* font-weight: bold; */
	}

	.text-key {
		font-size: 30px;
	}

	.text-key1 {
		font-size: 30px;
		color: #2ebbad;
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
	import ChartPieRingOne from '@/components/charts/pie-ring-one'
	import DateAnalysis from '../common/date-analysis'
	//	import MediaAnalysis from '../common/media-analysis'
	import ClassroomAnalysis from '../common/classroom-analysis'
	import {
		getCommHttpData,
		getAnalysisChartData,
		getIntervalByArr,
		getDateStr
	} from '@/utils/common'
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
			ClassroomAnalysis,
			ChartPieRingOne,

		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				startDate: getDateStr(-7),
				endDate: getDateStr(-1),
				gradeIds: [],
				classIds: [],
				subjectIds: [],
				keywords: '',
				studentList: null,
				defaultPic: errorImgUrl,
				studentId: undefined,
				kpiData: {
					correctRate: 0,
					interactRate: 0,
					praiseRate: 0,
					responseRate: 0,
					totalNum: 0
				},
				teacherTotal: 0,
				teacherEquip: 0,
				teacherRate: 0,
				studentTotal: 0,
				studentEquip: 0,
				studentRate: 0,
				dataListLoading: false,
				stPieRingSeries: {
					xValue: [],
					yValue: []
				},
				pieRingSeries1: {
					xValue: [],
					yValue: []
				},
				pieRingSeries2: {
					xValue: [],
					yValue: []
				},
				dataTypeList1: [],
				dataTypeList: [],
				deviceType: '',
				deviceType1: '',
				pieRingClass: 12,
				pieRingFunction: 12
			}
		},
		watch: {

		},
		mounted() {
			let that = this
			// that.stPieRingSeries={
			// 	xValue:['3','1'],
			// 	yValue:[3,4],
			// 	seriaName:['3','4'],
			//   		yAxis:[{name: '等级占比',min: 0,max: null,interval: 0,axisLabel:''}]
			//   	}
			// that.pieRingSeries1 ={xValue:['58',''],yValue:[69,100-45]}
			//    that.pieRingSeries2 ={xValue:['80',''],yValue:[45,100-45]}
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
			this.getDeviceTypeList()
			this.iniChartsData();
		},

		methods: {
			getDeviceTypeList() {
				let that = this
				getCommHttpData({
					url: 'equipAnalysis/equipType',
					method: 'get',
					contentType: 1,
					data: {
						coomType: 2
					}
				}, function(data) {
					if (data && data.code === 0) {
						that.dataTypeList = data.list

					}
				})
				getCommHttpData({
					url: 'equipAnalysis/equipType',
					method: 'get',
					contentType: 1,
					data: {
						coomType: 3
					}
				}, function(data) {
					if (data && data.code === 0) {
						that.dataTypeList1 = data.list
						that.deviceType1 = data.list.length > 0 ? data.list[0].name : ''
						that.getPieRings()
					}
				})
			},
			getDateData(startDate, endDate) {
				this.startDate = startDate
				this.endDate = endDate
				this.iniChartsData()
			},

			resizeListener() {
				if (this.$refs.aspieChart.chart) {
					this.$refs.aspieChart.chart.resize()
				}
				if (this.$refs.aslineChart.chart) {
					this.$refs.aslineChart.chart.resize()
				}
				if (this.$refs.asbarChart.chart) {
					this.$refs.asbarChart.chart.resize()
				}

			},


			iniChartsData() {

				let that = this;


				//综合评价分析
				getCommHttpData({
					url: 'equipAnalysis/groupByUse',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.stPieRingSeries = {
						xValue: data.page.xValue,
						yValue: data.page.yValue,
						seriaName: data.page.xValue,
						yAxis: [{
							name: '百分比',
							min: 0,
							max: null,
							interval: 0,
							axisLabel: ''
						}]
					}
				})



				//占比
				getCommHttpData({
					url: 'equipAnalysis/tea',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {

					that.teacherTotal = data.page.teaNum
					that.teacherEquip = data.page.equipNum
					that.teacherRate = data.page.equipNum > 0 ? Math.round(data.page.teaNum / data.page.equipNum * 10) / 10 : 0
				})
				// this.getPieRings()
				this.getStudentRateInfo()
			},
			getPieRings() {
				let that = this;
				getCommHttpData({
					url: 'equipAnalysis/teaching',
					method: 'get',
					contentType: 1,
					data: {
						name: this.deviceType1
					}
				}, function(data) {
					let temp1 = parseInt(data.list[0].totalNum)
					let yValue1 = Math.round(parseInt(data.list[0].isNum) / parseInt(data.list[0].totalNum) * 100 * 10) / 10
					let yValue2 = Math.round(parseInt(data.list[1].isNum) / parseInt(data.list[1].totalNum) * 100 * 10) / 10
					console.log(parseInt(data.list[0].isNum) / parseInt(data.list[0].totalNum),'dhhhhhhhhhhhhhhhhhhhhh')
					let yValue3 = 100 - yValue1
					let yValue4 = 100 - yValue2
					if (data.list[0].totalNum > 0 && data.list[1].totalNum > 0) {
						that.pieRingClass = 12
						that.pieRingFunction = 12
					} else if (data.list[0].totalNum == 0 && data.list[1].totalNum == 0) {
						that.pieRingClass = 0
						that.pieRingFunction = 0
					} else if (data.list[0].totalNum > 0 && data.list[1].totalNum == 0) {
						that.pieRingClass = 24
						that.pieRingFunction = 0
					} else if (data.list[0].totalNum == 0 && data.list[1].totalNum > 0) {
						that.pieRingClass = 0
						that.pieRingFunction = 24
					}

					that.pieRingSeries1 = {
						xValue: ['班级教室', ''],
						yValue: [yValue1, yValue3]
					}
					that.pieRingSeries2 = {
							xValue: ['功能部室', ''],
							yValue: [yValue2, yValue4]
						},
						that.$nextTick(()=>{
							if (that.$refs.ispieRingChart2) {
								that.$refs.ispieRingChart2.chart.resize()
							}
							if (that.$refs.ispieRingChart1) {
								that.$refs.ispieRingChart1.chart.resize()
							}
							// that.$refs.ispieRingChart2.chart.resize()
							// that.$refs.ispieRingChart1.chart.resize()
						})
						// setTimeout(() => {
						// }, 500)
				})
			},
			getStudentRateInfo() {
				let that = this;
				getCommHttpData({
					url: 'equipAnalysis/stu',
					method: 'get',
					contentType: 1,
					data: {
						name: this.deviceType
					}
				}, function(data) {
					that.studentTotal = data.page.stuNum
					that.studentEquip = data.page.equipNum
					let temp = 0
					if (data.page.equipNum > 0) {
						temp = data.page.stuNum / data.page.equipNum
						temp = Math.round(temp * 10) / 10
					}
					that.studentRate = temp
				})
			}
		}
	}
</script>
