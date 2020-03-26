<template>
	<div class="mod-demo-echarts">
		<el-form label-width="80px">
			<el-form-item label="截止日期">
				<end-date-analysis @refreshChartsData="getDateData"></end-date-analysis>
			</el-form-item>
		</el-form>

		<el-row :gutter="10">
			<el-col :span="8">
				<el-card  style="height:392px;" shadow="hover">
					<div class="chart-title">网络分析</div>
					<el-col :span="8">
				    <el-card shadow="hover">
				    	<div class="chart-body1 text-center">
				    		<div class="body-text" ><div class="kpi-value">{{totalNum}}</div><div class="kpi-text" >已建设学校数</div></div>
				    	</div>
				    </el-card>
				  </el-col>
				  <el-col :span="8">
				    <el-card shadow="hover">
				      <div class="chart-body1 text-center">
				    		<div class="body-text" ><div class="kpi-value">{{standardNum}}</div><div class="kpi-text">班均带宽达标学校数</div></div>

				    	</div>
				    </el-card>
				  </el-col>
				  <el-col :span="8">
				    <el-card shadow="hover">
				      <div class="chart-body1 text-center">
				    		<div class="body-text" ><div class="kpi-value">{{noStandardNum}}</div><div class="kpi-text">未达标学校数</div></div>
				    	</div>
				    </el-card>
				  </el-col>
				  <el-col :span="12">
            <div class="text-center">
              <div class="chart-title net-title">班均带宽达标率</div>
              <el-progress type="circle" :percentage="standardRate" :stroke-width="15"></el-progress>
            </div>
				  </el-col>
				  <el-col :span="12">
            <div class="text-center">
              <div class="chart-title net-title">多媒体教室比例</div>
              <el-progress type="circle" :percentage="mediaClassroom" :stroke-width="15"></el-progress>
            </div>
				  </el-col>
					
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<chart-pie-ring-one ref="ispieRingChart1" :id="'ispieRingChart1'" :title="'班级教室配备率'" :series="pieRingSeries1"></chart-pie-ring-one>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<chart-pie-ring-one ref="ispieRingChart2" :id="'ispieRingChart2'" :title="'功能教室配备率'" :series="pieRingSeries2"></chart-pie-ring-one>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card shadow="hover">
					<chart-pie ref="ispieChart1" :id="'ispieChart1'" :title="'装备情况'" :series="pieSeries1"></chart-pie>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<router-link to="/infor-detail">
					<chart-pie ref="ispieChart2" :id="'ispieChart2'" :title="'城乡对比'" :series="pieSeries2"></chart-pie>
					</router-link>
				</el-card>
			</el-col>
			<el-col :span="8">
				<el-card shadow="hover">
					<chart-bar ref="iscolumnChart1" :id="'iscolumnChart1'" :title="'学段对比'" :series="barSeries1"></chart-bar>
				</el-card>
			</el-col>

			<!--<el-col :span="24">
				<el-card>
					<chart-column ref="iscolumnChart2" :id="'iscolumnChart2'" :title="'学校装备运行时长TOP10'" :series="columnSeries2"></chart-column>
				</el-card>
			</el-col>-->
			<el-col :span="24">
				<el-table border :data="dataList" v-loading="dataListLoading" style="width: 100%;">
					<el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
						<template slot-scope="scope">
							{{scope.$index+1+pageSize*(pageIndex-1)}}
						</template>
					</el-table-column>
					<el-table-column prop="schoolName" header-align="center" align="center" label="学校名称">
					</el-table-column>
					<el-table-column prop="equipTotal" header-align="center" align="center" label="装备数量(台)">
					</el-table-column>
					<el-table-column prop="mediaClassroom" header-align="center" align="center" label="多媒体教学比例(%)">
					</el-table-column>
					<el-table-column prop="classroom" header-align="center" align="center" label="班级教室配备率(%)">
					</el-table-column>
					<el-table-column prop="funClassroom" header-align="center" align="center" label="功能教室配备率(%)">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import ChartBar from '@/components/charts/bar'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartBarLine from '@/components/charts/bar-line'
	import ChartColumn from '@/components/charts/column'
	import ChartPie from '@/components/charts/pie'
	import ChartPieRingOne from '@/components/charts/pie-ring-text'
	import EndDateAnalysis from '../common/end-date-analysis'
	import { getCommHttpData, getAnalysisChartData } from '@/utils/common'
	export default {
		components: {
			ChartBar,
			ChartBarLineZoom,
			ChartColumn,
			EndDateAnalysis,
			ChartPie,
			ChartPieRingOne
		},
		data() {
			return {
				orgId: this.GLOBAL.getOrgId(),
				userType: this.GLOBAL.getUserType(),
				startDate: '',
				mediaClassroom: 0,
				noStandardNum: 0,
				standardNum: 0,
				standardRate: 0,
				totalNum: 0,
				bytesReceived:0,
				
				dataList:null,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				
				pieRingSeries1: {
					xValue: [],
					yValue: []
				},
				pieRingSeries2: {
					xValue: [],
					yValue: []
				},
				pieSeries1: {
					xValue: [],
					yValue: []
				},
				pieSeries2: {
					xValue: [],
					yValue: []
				},
				barSeries1: {
					xValue: [],
					yValue: []
				},
				columnSeries2: {
					xValue: [],
					yValue: []
				}
			}
		},
		mounted() {
			this.resizeListener()
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
		},
//		activated() {
//			this.resizeListener()
//		},
		methods: {
			getDateData(startDate, endDate) {
				this.startDate = startDate
				this.iniChartsData()
				this.getDataList()
			},
			resizeListener() {
				if(this.$refs.ispieRingChart1.chart) {
					this.$refs.ispieRingChart1.chart.resize()
				}
				if(this.$refs.ispieRingChart2.chart) {
					this.$refs.ispieRingChart2.chart.resize()
				}
				if(this.$refs.ispieChart1.chart) {
					this.$refs.ispieChart1.chart.resize()
				}
				if(this.$refs.ispieChart2.chart) {
					this.$refs.ispieChart2.chart.resize()
				}

				if(this.$refs.iscolumnChart1.chart) {
					this.$refs.iscolumnChart1.chart.resize()
				}
				if(this.$refs.iscolumnChart2.chart) {
					this.$refs.iscolumnChart2.chart.resize()
				}

			},
			iniChartsData() {
				let that = this
				let commParams = {
					date: this.startDate,
					unitId:this.orgId
				}
				getCommHttpData({
					url: 'multimemediaEquip/equipRatio',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.mediaClassroom=data.list.mediaClassroom
					that.noStandardNum=data.list.noStandardNum
					that.standardNum=data.list.standardNum
					that.standardRate=data.list.standardRate
					that.totalNum=data.list.totalNum
				})
				getCommHttpData({
					url: 'multimemediaEquip/classEquipment',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.pieRingSeries1 = {
						xValue: [data.list.xValue[0], ''],
						yValue: [data.list.yValue[0], 100 - data.list.yValue[0]],
						yAxis:[{
							name1: '班级教室',
							name2: '总班级教室',
							classNum: data.list.yValue2[0],
							classTotal: data.list.yValue1[0] 
						}]
					}
					that.pieRingSeries2 = {
						xValue: [data.list.xValue[1], ''],
						yValue: [data.list.yValue[1], 100 - data.list.yValue[1]],
						yAxis:[{
							name1: '功能部室',
							name2: '总功能部室',
							classNum: data.list.yValue2[1],
							classTotal: data.list.yValue1[1] 
						}]
					}
				})

				//装备情况
				commParams['coomType'] = 1
				getAnalysisChartData({
					url: 'multimemediaEquip/equipDevice',
					data: commParams
				}, function(data) {
					that.pieSeries1 = {
						xValue: data.list.xValue,
						yValue: data.list.yValue,
            yAxis: [{
            	name: '',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'台'
            }]
					}
				})
				//城乡对比
				commParams['coomType'] = 2
				getAnalysisChartData({
					url: 'multimemediaEquip/equipDevice',
					data: commParams
				}, function(data) {
					that.pieSeries2 = {
						xValue: data.list.xValue,
						yValue: data.list.yValue,
            yAxis: [{
            	name: '',
            	min: 0,
            	max: null,
            	interval: null,
            	axisLabel: '',
              tipLabel:'台'
            }]

					}
				})
				//学段对比
				commParams['coomType'] = 3
				getAnalysisChartData({
					url: 'multimemediaEquip/equipDevice',
					data: commParams
				}, function(data) {
					that.barSeries1 = {
						xValue: data.list.xValue,
						yValue: [data.list.yValue],
						seriaName: ['4545'],
						yAxis: [{
							name: '(台)',
							min: 0,
							max: null,
							interval: null,
							axisLabel: '',
							tipLabel:'台'
						}]
					}
				})
				delete commParams['coomType']

				//开机时长
//				getAnalysisChartData({
//					url: 'multimemediaEquip/equipBootLength',
//					data: commParams
//				}, function(data) {
//					that.columnSeries2 = {
//						xValue: data.list.xValue,
//						yValue: [data.list.yValue],
//						seriaName: ['交互度'],
//						yAxis: [{
//							name: '',
//							min: 0,
//							max: null,
//							interval: null,
//							axisLabel: '小时'
//						}]
//					}
//				})

			},
			
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				var that = this
				getCommHttpData({
					url: 'multimemediaEquip/equipRate',
					method: 'get',
					contentType: 1,
					data: {
						date:this.startDate,
						unitId:this.orgId,
						page: this.pageIndex,
						limit: this.pageSize,
						tagMsg: this.keywords 
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.dataListLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			}

		}
	}
</script>