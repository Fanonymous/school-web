<template>
	<div class="analysis-echarts">
		<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/icons/icon7.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">数据填报比例</div><div class="kpi-value">{{kpiData.reportProportion || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/icons/icon8.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">回收量</div><div class="kpi-value">{{kpiData.recoveryCount || 0}}</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/icons/icon9.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">浏览量</div><div class="kpi-value">{{kpiData.viewCount || 0}}</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/icons/icon10.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">回收率</div><div class="kpi-value">{{kpiData.recoveryRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
		
		<el-row :gutter="12">
			<el-col :span="12" class="margin-bottom-10">
				<el-card>
					<chart-pie ref="aspieChart" :id="'aspieChart'" :title="'问卷调查人群分布'" :series="pieSeries"></chart-pie>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card>
					<chart-line ref="aslineChart" :id="'aslineChart'" :title="'回收量统计趋势分析'" :series="asLineSeries"></chart-line>
				</el-card>
			</el-col>
			<el-col :span="24">
				<el-card>
					<chart-bar ref="asbarChart" :id="'asbarChart'" :title="'各问卷回收概况'" :series="asBarSeries"></chart-bar>
				</el-card>
			</el-col>
		</el-row>
		
	</div>
</template>

<script>
	import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import ChartLine from '@/components/charts/line'
	import ChartBar from '@/components/charts/bar'
	import { getCommHttpData, getAnalysisChartData,getIntervalByArr} from '@/utils/common'
	export default {
		components: {
			ChartPie,
			ChartLine,
			ChartBar
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				kpiData: {
					reportProportion: 0,
					recoveryCount: 0,
					viewCount: 0,
					recoveryRate: 0
				},
				dataListLoading:false,
				asLineSeries: {
					xValue: [],
					yValue: []
				},
				asBarSeries: {
					xValue: [],
					yValue: []
				},
				pieSeries: {
					xValue: [],
					yValue: []
				}
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
			this.iniChartsData();
		},
		
		methods: {
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
			iniChartsData() {

				let that = this;
				
				//头部
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getSchoolTab',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					that.kpiData = data.list
				})	
				//人群分布
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getPopulationDistribution',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					setTimeout(() => {
						that.pieSeries = {xValue:data.list.xValue,yValue:data.list.yValue}
					}, 1000)
				})
				//回收量统计趋势分析
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getRecoveryAnalysis',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					let interval = getIntervalByArr(data.list.yValue)
					that.asLineSeries = {
						xValue:data.list.xValue,
						yValue:[data.list.yValue],
						seriaName: ['回收量'],
						yAxis: [{
							name: '',
							min: 0,
							max: null,
							interval: interval==0?10:interval,
							axisLabel: ''
						}]
					}
				})	
				//问卷回收概况
				getCommHttpData({
					url: 'assess/collectDataAnalysis/getRecoverySummarize',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					
					that.asBarSeries = {
						xValue:data.list.yValue,
						yValue:[data.list.xValue,data.list.xValue1],
						seriaName:['回收量','浏览量'],
			    		yAxis:[{name: '',min: 0,max: null,interval: getIntervalByArr(data.list.xValue1),axisLabel:''}]
			    	}
				})
				
				
//				that.asLineSeries = {
//					xValue:['1','2','3'],
//					yValue:[[1,2,3]],
//					seriaName: ['运行时长'],
//					yAxis: [{
//						name: '分钟',
//						min: 0,
//						max: null,
//						interval: null,
//						axisLabel: ''
//					}]
//				}
//				
//				that.asBarSeries = {
//					xValue:['东方闪电555555555555555555555555555555555555555','东方闪电555555555555555555555555555555555555555','东方闪电555555555555555555555555555555555555555'],
//					yValue:[[1,2,3],[56,45,45]],
//					seriaName:['回收量','浏览量'],
//		    		yAxis:[{name: '5656',min: 0,max: null,interval: null,axisLabel:''}]
//		    	}
//				
//				that.pieSeries = {xValue:['1','2','3'],yValue:[1,2,3]}

			}
		}
	}
</script>