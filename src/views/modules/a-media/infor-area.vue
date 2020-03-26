<template>
	<div class="analysis-echarts">

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="数据填报进度" name="first">
				<template>
					<select-org-list @refreshDataList="getDeptId1"></select-org-list>
					<!--<el-card>-->
					<el-row :gutter="12">
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon primary"><img src="~@/assets/img/icons/icon7.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">已完成填报学校数</div><div class="kpi-value">{{kpiData.completeReportSchool || 0}}所</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon red"><img src="~@/assets/img/icons/icon8.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">未填报学校数</div><div class="kpi-value">{{kpiData.noReportSchool || 0}}所</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon blue"><img src="~@/assets/img/icons/icon9.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">填报完成率</div><div class="kpi-value">{{kpiData.reportCompleteRate || 0}}%</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon green"><img src="~@/assets/img/icons/icon10.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">平均填报比例</div><div class="kpi-value">{{kpiData.avgReportRate || 0}}%</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					</el-row>
					<el-row :gutter="12">
						<el-col :span="12">
							<el-card v-loading="ispieChartLoading">
								<chart-pie ref="ispieChart1" :id="'ispieChart1'" :title="'数据填报占比'" :series="pieSeries1"></chart-pie>
							</el-card>
						</el-col>
						<el-col :span="12">
							<el-card>
								<chart-bar ref="iabarChart" :id="'iabarChart'" :title="'填报比例分布'" :series="barSeries"></chart-bar>
							</el-card>
						</el-col>
					</el-row>
					<el-card>
					<div class="margin-bottom-20"><span class="table-title">数据填报整体情况</span>
						<el-button type="primary" size="mini" class="right" @click="exportData(1)">导出</el-button>
					</div>
					<el-table :data="dataList" border v-loading="dataListLoading" @sort-change="sortChange" style="width: 100%;" :default-sort="{prop: 'reportRate', order: 'descending'}">
						<el-table-column align="center" type="index" label='序号' width="95">
							<template slot-scope="scope">
								{{scope.$index+1+pageSize*(pageIndex-1)}}
							</template>
						</el-table-column>
						<el-table-column header-align="center" prop="schoolName" align="center" label="学校名称">
							<template slot-scope="scope">
								<span>{{scope.row.schoolName}}</span>
							</template>
						</el-table-column>
						<el-table-column header-align="center"  prop="reportStatus"  sortable align="center" label="填报状态">
							<template slot-scope="scope">
								<span v-if="scope.row.reportStatus == '未填报'" style="color: red;">{{scope.row.reportStatus}}</span>
								<span v-else>{{scope.row.reportStatus}}</span>
							</template>
						</el-table-column>
						
						<el-table-column header-align="center"  prop="reportRate"  sortable align="center" label="填报比例">
							<template slot-scope="scope">
								{{scope.row.reportRate || 0}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" prop="contactMan" align="center" label="联系人">
						</el-table-column>
						<el-table-column header-align="center" prop="telphone"  align="center" width="150" label="联系电话">
						</el-table-column>
					</el-table>
					<!--<el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
						<el-table-column align="center" type="index" label='序号' width="95">
							<template slot-scope="scope">
								{{scope.$index+1+pageSize*(pageIndex-1)}}
							</template>
						</el-table-column>
						<el-table-column header-align="center" align="center" label="县区">
							<template slot-scope="scope">
								{{scope.row.countyArea}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" align="center" label="学校数（所）">
							<template slot-scope="scope">
								{{scope.row.schoolCount}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" sortable align="center" label="已完成填报（所）">
							<template slot-scope="scope">
								{{scope.row.finishSchoolCount}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" sortable align="center" label="未填报（所）">
							<template slot-scope="scope">
								{{scope.row.noSchoolCount}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" sortable align="center" width="150" label="完成率">
							<template slot-scope="scope">
								{{scope.row.finishRate}}%
							</template>
						</el-table-column>
						<el-table-column header-align="center" sortable align="center" width="150" label="填报比例">
							<template slot-scope="scope">
								{{scope.row.questionCollectD}}%
							</template>
						</el-table-column>
					</el-table>-->
					<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
					</el-pagination>
					</el-card>
				</template>
			</el-tab-pane>
			<el-tab-pane label="问卷调查进度" name="second">
				<template>
					<select-org-list @refreshDataList="getDeptId2"></select-org-list>
					<el-row :gutter="12">
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon primary"><img src="~@/assets/img/icons/icon15.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">回收量</div><div class="kpi-value">{{kpiData.recoveryCount || 0}}</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon red"><img src="~@/assets/img/icons/icon17.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">浏览量</div><div class="kpi-value">{{kpiData.viewCount || 0}}</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon blue"><img src="~@/assets/img/icons/icon16.png"/></div>
					    		<div class="body-text" ><div class="kpi-text">回收率</div><div class="kpi-value">{{kpiData.recoveryRate || 0}}%</div></div>
					    	</div>
					    </el-card>
					  </el-col>
					  <el-col :span="6">
					    <el-card shadow="hover">
					    	<div class="analysis-body">
					    		<div class="body-icon green"><img src="~@/assets/img/icons/icon18.png"/></div>
					    		<div class="body-text" >
					    			<div class="kpi-text">平均完成时间</div>
					    			<div class="kpi-value">
					    				<span v-if="kpiData.avgHours >0">{{kpiData.avgHours}}小时</span>
					    				<span v-else-if="kpiData.avgMinutes >0">{{kpiData.avgMinutes}}分钟</span>
					    				<span v-else>{{kpiData.avgSecond}}秒</span>
					    			</div>
					    		</div>
					    	</div>
					    </el-card>
					  </el-col>
					</el-row>
					<el-row :gutter="12">
						<el-col :span="24">
							<el-card>
								<chart-bar-line-zoom :id="'iabarLineChart'" ref="barLineZoom" :title="'问卷调查数据统计'" :series="barLineSeries"></chart-bar-line-zoom>
							</el-card>
						</el-col>
					</el-row>
					<el-card>
						<div class="margin-bottom-20"><span class="table-title">问卷调查整体情况</span>
							<el-button type="primary" size="mini" class="right" @click="exportData(2)">导出</el-button>
						</div>
						<el-table :data="dataList2" v-if="activeName == 'second'" border v-loading="dataListLoading"  @sort-change="sortChange" style="width: 100%;" :default-sort="{prop: 'recoveryRate', order: 'descending'}">
							<el-table-column align="center" type="index" label='序号' width="95">
								<template slot-scope="scope">
									{{scope.$index+1+pageSize2*(pageIndex2-1)}}
								</template>
							</el-table-column>
							<el-table-column header-align="center" prop="schoolName" align="center" label="学校名称">
									<!--<router-link :to="{name:'a-media-infor-area-s',query:{deptId:scope.row.schoolName}}">{{scope.row.schoolName}}</router-link>-->
							</el-table-column>
							<el-table-column header-align="center" prop="recoveryCount"  sortable align="center" label="回收量">
							</el-table-column>
							<el-table-column header-align="center"  prop="viewCount"  sortable align="center" label="浏览量">
							</el-table-column>
							<el-table-column header-align="center"  prop="recoveryRate"  align="center" sortable label="回收率">
								<template slot-scope="scope">
									{{scope.row.recoveryRate || 0}}%
								</template>
							</el-table-column>
							<el-table-column header-align="center" prop="contactMan" align="center" label="联系人">
							</el-table-column>
							<el-table-column header-align="center" prop="telphone"  align="center" width="150" label="联系电话">
							</el-table-column>
						</el-table>
						<!--<el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
							<el-table-column align="center" type="index" label='序号' width="95">
								<template slot-scope="scope">
									{{scope.$index+1+pageSize*(pageIndex-1)}}
								</template>
							</el-table-column>
							<el-table-column header-align="center" align="center" label="县区">
								<template slot-scope="scope">
									{{scope.row.countyArea}}%
								</template>
							</el-table-column>
							<el-table-column header-align="center" align="center" label="学校数（所）">
								<template slot-scope="scope">
									{{scope.row.schoolCount}}%
								</template>
							</el-table-column>
							<el-table-column header-align="center" sortable align="center" label="回收量">
								<template slot-scope="scope">
									{{scope.row.recoveryCount}}%
								</template>
							</el-table-column>
							<el-table-column header-align="center" sortable align="center" label="浏览量">
								<template slot-scope="scope">
									{{scope.row.viewCount}}%
								</template>
							</el-table-column>
							<el-table-column header-align="center" sortable align="center" width="150" label="回收率">
								<template slot-scope="scope">
									{{scope.row.recoveryRate}}%
								</template>
							</el-table-column>
						</el-table>-->
						<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex2" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize2" :total="totalPage2" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</el-card>

				</template>
			</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import ChartBar from '@/components/charts/bar'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import { getCommHttpData, getAnalysisChartData,getExportFile,getIntervalByArr} from '@/utils/common'
	import SelectOrgList from '../common/org-list'
	export default {
		components: {
			ChartPie,
			ChartBar,
			ChartBarLineZoom,
			SelectOrgList
		},
		data() {
			return {
				deptId1:this.GLOBAL.getOrgId(),
				deptId2:this.GLOBAL.getOrgId(),
				activeName: 'first',
				gradeShow: true,
				subjectShow: true,
				startDate: '',
				endDate: '',
				gradeIds: [],
				subjectIds: [],
				kpiData: {
					reportCompleteRate: 0,
					avgReportRate: 0,
					completeReportSchool: 0,
					noReportSchool: 0,
				
					avgComplete: 0,
					recoveryCount: 0,
					recoveryRate: 0,
					viewCount: 0,
					avgHours:0,
					avgMinutes:0,
					avgSecond:0
				},
				dataListLoading: false,
				pieSeries1: {
					xValue: [],
					yValue: []
				},
				pieRingSeries1: {
					xValue: [],
					yValue: []
				},
				barSeries: {
					xValue: [],
					yValue: []
				},
				barLineSeries: {
					xValue: [],
					yValue: []
				},
				dataList: [],
				dataList2: [],
				pageSize: 10,
				pageIndex: 1,
				totalPage: 0,
				pageSize2: 10,
				pageIndex2: 1,
				totalPage2: 0,
				column1:{
					prop:'reportRate',
					order:'descending'
				},
				column2:{
					prop:'recoveryRate',
					order:'descending'
				},
				ispieChartLoading:false,
				
			}
		},

		mounted() {
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
			this.iniChartsData(1)
		},
		methods: {
			handleClick(tab, event) {
				if(tab.name == 'first') {
					this.iniChartsData(1)
				}
				if(tab.name == 'second') {
					this.iniChartsData(2)
				}

			},
			resizeListener() {
				if(this.$refs.ispieChart1.chart) {
					this.$refs.ispieChart1.chart.resize()
				}
				if(this.$refs.iabarChart.chart) {
					this.$refs.iabarChart.chart.resize()
				}
			},
			iniChartsData(type) {
				let that = this;
				this.getTableDataList(type)
				//头部
				let deptId = this.deptId1
				if(type == 2){
					deptId = this.deptId2
				}
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getRegionalTab',
					method: 'get',
					contentType: 1,
					data: {type:type,deptId:deptId}
				}, function(data) {
					that.kpiData = data.list
//					that.kpiData.avgHours = parseInt(data.list.avgComplete/60)
//					that.kpiData.avgMinutes =parseInt(data.list.avgComplete%60)
					
					//小时 分钟 秒
					let avgComplete = parseInt(data.list.avgComplete)
					that.kpiData.avgHours = parseInt(avgComplete/3600)
					that.kpiData.avgMinutes =parseInt(avgComplete%3600/60)
					that.kpiData.avgSecond =parseInt(avgComplete%3600%60)
				})
				
				
				if(type == 1) {
					//数据填报占比
					getCommHttpData({
						url: 'assess/collectDataAnalysis/getReportRatio',
						method: 'get',
						contentType: 1,
						data: {deptId:deptId}
					}, function(data) {
						setTimeout(() => {
							that.pieSeries1 = {
								xValue: data.list.xValue,
								yValue: data.list.yValue
							}
						}, 1000)
					})
					
					//填写比例分布
					getCommHttpData({
						url: 'assess/collectDataAnalysis/getReportDistribution',
						method: 'get',
						contentType: 1,
						data: {deptId:deptId}
					}, function(data) {
						setTimeout(() => {
			    			that.barSeries = {
								xValue: data.list.yValue,
								yValue: [
									data.list.xValue
								],
								seriaName: ['比例分布'],
								yAxis: [{
									name: '单位：(所)',
									min: 0,
									max: null,
									interval: getIntervalByArr(data.list.xValue),
									axisLabel: ''
								}]
							}
			    		}, 1000)
					})
					
				} else {
					//问卷调查数据统计
					getCommHttpData({
						url: 'assess/collectDataAnalysis/getQuestionnaireAnalysis',
						method: 'get',
						contentType: 1,
						data: {deptId:deptId}
					}, function(data) {
						that.barLineSeries = {
							xValue: data.list.xValue,
							yValue: [
								data.list.yValue,
								data.list.yValue1,
								data.list.yValue2
							],
							seriaName: ['回收量', '浏览量', '回收率'],
							seriaType: [ 'bar', 'bar','line'],
              tipLabel:['','','%'],
							yAxis: [{
								name: '',
								min: 0,
								max: null,
								interval: null,
								axisLabel: ''
							}, {
								name: '%',
								min: 0,
								max: 100,
								interval: null,
								axisLabel: ''
							}]
						}
					})
				}
				
			},
			//列表数据
			getTableDataList(type){
				let that = this
				that.dataListLoading = true
				//that.ispieChartLoading = true
				let dataType = 1,deptId,column={},pageIndex,pageSize
				
				if(this.activeName == 'first'){
					deptId = this.deptId1
					dataType = 1
					column = this.column1
					pageSize = this.pageSize
					pageIndex = this.pageIndex
					
				}else{
					deptId = this.deptId2
					dataType = 2
					column = this.column2
					pageSize = this.pageSize2
					pageIndex = this.pageIndex2
				}
				 
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getReportAllSituation',
					method: 'post',
					contentType: 2,
					data: {
						type: dataType,
						page: pageIndex,
						limit: pageSize,
						sidx: column.order =='ascending'?'asc':'desc',
						order: column.prop,
						deptId: deptId,
						
					}
				}, function(data) {
					that.dataListLoading = false
					//that.ispieChartLoading = false
					if(data && data.code == 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							if(that.activeName == 'first'){
								that.pageIndex = 1
							}else{
								that.pageIndex2 = 1
							}
							
							that.getDataList()
						}
						
						
						if(that.activeName == 'first'){
							that.dataList = data.page.list
							that.totalPage = data.page.totalCount
						}else{
							that.dataList2 = data.page.list
							that.totalPage2 = data.page.totalCount
						}
						
					} else {
						
						if(that.activeName == 'first'){
							that.dataList = []
							that.totalPage = 0
						}else{
							that.dataList2 = []
							that.totalPage2 = 0
						}
						
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				if(this.activeName == 'first'){
					this.pageSize = val
					this.pageIndex = 1
				}else{
					this.pageSize2 = val
					this.pageIndex2 = 1
				}
				
				this.getTableDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				if(this.activeName == 'first'){
					this.pageIndex = val
				}else{
					this.pageIndex2 = val
				}
				
				this.getTableDataList()
			},
			//排序,点击排序回到第一页
			sortChange(column){
				
				if(this.activeName  == 'first'){
					this.column1 = column
				
				}else{
					this.column2 = column
				}
				
				this.getTableDataList()
			},
			getDeptId1(deptId) {
				if(deptId != this.deptId1){
					this.deptId1 = deptId
					this.iniChartsData(1)
				}
				
			},
			getDeptId2(deptId) {
				if(deptId != this.deptId2){
					this.deptId2 = deptId
					this.iniChartsData(2)
				}
				
			},
			//导出
			exportData(type){
				let deptId = this.deptId2
				if(type == 1){
					deptId = this.deptId1
				}
				getExportFile(this,'assess/collectDataAnalysis/downloadUnitInfo',{ deptId:deptId,type:type})
			}
		}
	}
</script>