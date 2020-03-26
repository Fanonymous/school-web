<template>
	
	<div class="analysis-echarts">
		<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<!--	<media-analysis :gradeShow=true @refreshChartsData="getFilterMediaData"></media-analysis>-->
		<classroom-analysis :gradeShow=true @refreshChartsData="getFilterMediaData"></classroom-analysis>
		<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/icons/icon13.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">课堂回答率</div><div class="kpi-value">{{kpiData.responseRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/icons/icon12.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">回答被奖率</div><div class="kpi-value">{{kpiData.praiseRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/icons/icon14.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">练习正确率</div><div class="kpi-value">{{kpiData.correctRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/icons/icon11.png"/></div>
		    		<div class="body-text" >
		    			<div class="kpi-text">互动均衡度</div>
		    			<el-col :span="24" class="analy-progress">
			    			<el-rate
							  v-model="kpiData.interactRate || 0"
							  disabled
							  text-color="#ff9900">
							</el-rate>
						
		    			</el-col>
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
		
		<el-row :gutter="12">
			<el-col :span="12" class="margin-bottom-10">
				<el-card v-if="isBar">
					<chart-bar ref="cstupieChart" :id="'cstupieChart'" :title="'课堂综合素养水平排行榜'" :series="cstuBarSeries"></chart-bar>
				</el-card>
				<el-card v-else>
					<chart-radar ref="stusradarChart" :id="'stusradarChart'" :title="'课堂综合表现'"  :series="radarSeries"></chart-radar>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card>
					<chart-stacked-column ref="cstuStackedColumnChart" :id="'cstuStackedColumnChart'" :title="'综合评价分析'" :series="asStackedColumnSeries"></chart-stacked-column>
				</el-card>
			</el-col>
			<el-col :span="24">
				<el-card>
					<chart-bar-line-zoom :id="'cbarLineChart'" ref="barLineZoom" :title="'课堂互动趋势分析'" :series="cstuBarLineSeries"></chart-bar-line-zoom>
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
	import ChartRadar from '@/components/charts/radar'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartStackedColumn from '@/components/charts/stacked-column'
	import DateAnalysis from '../common/date-analysis'
    import MediaAnalysis from '../common/media-analysis'
    import ClassroomAnalysis from '../common/classroom-analysis'
	import { getCommHttpData, getAnalysisChartData,getIntervalByArr} from '@/utils/common'
	export default {
		components: {
			ChartPie,
			ChartLine,
			ChartBar,
			ChartRadar,
			ChartBarLineZoom,
			ChartStackedColumn,
			DateAnalysis,
			MediaAnalysis,
			ClassroomAnalysis
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				isBar:true,
				startDate:'',
		      	endDate:'',
		      	gradeIds:[],
				kpiData: {
					correctRate: 0,
					interactRate: 0,
					praiseRate: 0,
					responseRate: 0,
					totalNum: 0
				},
				dataListLoading:false,
				cstuBarSeries: {
					xValue: [],
					yValue: []
				},
				radarSeries:{
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
				}
			}
		},
		mounted() {
			window.addEventListener('resize', () => {
				this.resizeListener()
			})
//			this.iniChartsData();
		},
		
		methods: {
			getDateData(startDate,endDate){
	    		this.startDate = startDate
	    		this.endDate = endDate
	    		this.iniChartsData()
	    	},
	    	getFilterMediaData(jsonParams){
	    		this.gradeIds = jsonParams.gradeIds
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
			iniChartsData() {

				let that = this;
		      	let commParams ={schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate}
		      	if(this.gradeIds.length!=0){
		      		commParams['gradeId'] = this.gradeIds
		      	}
				//头部和排行榜
				getCommHttpData({
					url: 'webStudy/mySchool',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					that.kpiData = data.list
					that.kpiData.interactRate = data.list.interactRate/2
					let interval = getIntervalByArr(data.list.yValue)
					if(data.list.xValue.length == 1){
						that.isBar = false
						setTimeout(() => {
							that.radarSeries = {
								xValue: ['课堂回答率','回答被奖率','练习正确率','互动均衡度'],
								yValue: [[data.list.responseRate,data.list.praiseRate,data.list.correctRate,that.kpiData.interactRate*20]],
								seriaName:['综合评分'],
								yAxis:[{max:100,tipLabel:'%'}]
							}
						}, 2000)
					}else{
						that.isBar = true
						setTimeout(() => {
							that.cstuBarSeries = {
								xValue: data.list.xValue.reverse(),
								yValue: [
									data.list.yValue.reverse()
								],
								seriaName: [''],
								yAxis: [{
									name: '综合得分',
									min: 0,
									max: null,
									interval: interval == 0 ? 10:interval,
									axisLabel: '',
									tipLabel:'分'
								}]
							}
						}, 2000)
					}
					
					
					
					
				})	
				//趋势分析
				getCommHttpData({
					url: 'webStudy/interactionTrend',
					method: 'get',
					contentType: 1,
					data: commParams
				}, function(data) {
					setTimeout(() => {
						that.cstuBarLineSeries={
				    		xValue:data.list.xValue,
				    		yValue:[data.list.yValue1,data.list.yValue2],
				    		seriaName:['互动人数','互动率'],
				    		seriaType:['bar','line'],
				    		yAxis:[{name: '人',min: 0,max: null,interval: getIntervalByArr(data.list.yValue1),axisLabel:''},{name: '%',min: 0,max: 100,interval: 10,axisLabel:''}]
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
					that.asStackedColumnSeries={
						xValue:data.list.xValue,
				    	yValue:[data.list.yValue,data.list.yValue1],
						seriaName:['评价加分','评价减分'],
						yAxis:[{name: '单位：分',min: null,max: null,interval: getIntervalByArr(data.list.yValue1),axisLabel:'',tipLabel:'分'}]
			    	}
				})	
				
				
//				that.cstuBarSeries = {
//					xValue: ['东方闪电55555', '东方闪电55555555', '东方闪电555'],
//					yValue: [
//						[1, 2, 3]
//					],
//					seriaName: ['多样性'],
//					yAxis: [{
//						name: '5656',
//						min: 0,
//						max: null,
//						interval: null,
//						axisLabel: ''
//					}]
//				}
//				that.cstuBarLineSeries={
//		    		xValue:['东方闪电55555', '东方闪电55555555', '东方闪电555'],
//		    		yValue:[[1, 2, 3],[1, 2, 3]],
//		    		seriaName:['使用时长','使用率'],
//		    		seriaType:['bar','line'],
//		    		yAxis:[{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''},{name: '%',min: 0,max: 100,interval: 10,axisLabel:''}]
//		    	}
//				that.asStackedColumnSeries={
//		    		xValue: ['语文','数学','英语','物理','生物','化学','历史'].reverse(),
//					yValue: [
//							[31,24,14,24,27,29,31],
//							[-50,-43,-35,-45,-41,-47,-43]
//					],
//					seriaName:['使用时长1','使用时长2']
//		    	}
				
			}
		}
	}
</script>