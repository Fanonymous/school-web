<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">知识点增长率</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/useTime.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">综合难易度</div><div class="kpi-value">{{kpiData.useCount || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/interactivity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">科目覆盖率</div>
		    			<div class="kpi-value">{{kpiData.useTime || 0}}%</div>
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/diversity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">知识点掌握度</div>
		    		  <el-col :span="20" class="analy-progress">
			    			<el-rate
								  v-model="kpiData.interactivityScore || 0"
								  disabled
								  text-color="#ff9900">
								</el-rate>
							</el-col>
							<el-col :span="4" class="analy-progress">
		    				<div>{{kpiData.interactivity || 0}}</div>
		    			</el-col>
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
    <el-row :gutter="10">
    	
      <el-col :span="8">
        <el-card>
          <chart-radar ref="radarChart" :id="'radarChart'" :title="'学校知识点综合掌握水平'"  :series="radarSeries"></chart-radar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-stacked-bar ref="stackedBarChart3" :id="'tstackedBarChart3'" :title="'科目难易度分布'" :series="stackedBarSeries3"></chart-stacked-bar>
        </el-card>
      </el-col>
      <el-col :span="8">
      <el-card >
          <chart-bar-line-zoom :id="'cbarLineChart'" ref="barLineZoom" :title="'题型准确率分析'" :series="barLineSeries"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height:392px ;">
        	<div class="table-title margin-bottom-20">知识点掌握热度排行榜</div>
        	<div class="progress-box">
	        	<div class="progress-title-text">几何体画三视图</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="98"></el-progress>
	          <div class="progress-title-text">图像和倍数的意义</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="95" ></el-progress>
	          <div class="progress-title-text">求一个数因数</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="88" status="success"></el-progress>
	          <div class="progress-title-text">求函数解答式</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="75" status="warning"></el-progress>
	          <div class="progress-title-text">化学公式</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="69" status="exception"></el-progress>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height:392px ;">
        	<div class="table-title margin-bottom-20">科目知识点掌握排行榜</div>
        	<div class="progress-box">
	        	<div class="progress-title-text">语文</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="98"></el-progress>
	          <div class="progress-title-text">数学</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="89"></el-progress>
	          <div class="progress-title-text">英语</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="85" status="success"></el-progress>
	          <div class="progress-title-text">物理</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="75" status="warning"></el-progress>
	          <div class="progress-title-text">化学</div>
	          <el-progress :text-inside="true" :stroke-width="26" :percentage="65" status="exception"></el-progress>
	        </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-pie ref="ispieChart1" :id="'ispieChart1'" :title="'错因解析分布'" :series="pieSeries1"></chart-pie>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>
<style>
	.progress-box{
		margin: 0px 20px;
	}
	.progress-title-text{
		margin: 10px 0px;
	}
</style>
<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import ChartBar from '@/components/charts/bar'
	import ChartStackedBar from '@/components/charts/stacked-bar'
  import DateAnalysis from '../common/date-analysis'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartRadar from '@/components/charts/radar'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
				ChartPie,
  	    DateAnalysis,
  	    ChartBar,
  	    ChartStackedBar,
  	    ChartBarLineZoom,
  	    ChartRadar
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	userType:this.GLOBAL.getUserType(),
      	kpiData:{
      		useRate:30,
	      	useCount:65,
	      	useTime:98,
	      	useTimeRate:9,
	      	interactivityScore:4.5,
	      	interactivity:9,
      	},
      	startDate:'',
      	endDate:'',
      	radarSeries:{xValue:[],yValue:[],seriaName:[]},
      	barLineSeries:{xValue:[],yValue:[]},
				tbarChart1:{xValue:[],yValue:[]},
				stackedBarSeries3:{xValue:[],yValue:[]},
				barSeries1:{xValue:[],yValue:[]},
      	pieSeries1:{xValue:[],yValue:[]},
      	pieSeries2:{xValue:[],yValue:[]},
      	pieSeries3:{xValue:[],yValue:[]},
				dataList:[{name:'office',rate:'29.4%',step:'-5'},{name:'360浏览器',rate:'15.2%',step:'3'},{name:'优酷视频',rate:'9.5%',step:'1'},{name:'QQ音乐',rate:'8.4%',step:'0'},{name:'多媒体教学大师',rate:'8%',step:'6'},{name:'输入法',rate:'8%',step:'-1'},{name:'电脑管家',rate:'6%',step:'7'}],
				appDownList:[{name:'腾讯视频',rate:'36次'},{name:'纳智助手',rate:'23次'},{name:'WPS',rate:'12次'},{name:'opera浏览器',rate:'7次'},{name:'作业帮',rate:'2次'},{name:'输入法',rate:'2次'},{name:'电脑管家',rate:'1次'}]
      }
    },
    mounted () {
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
    },
//  activated () {
//			this.resizeListener()
//  },
    methods: {
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		setTimeout(() => {
    			this.iniChartsData()
    		}, 1000)
    		
    	},
    	resizeListener(){
    		
	    
	    	if (this.$refs.ispieChart1.chart) {
	        this.$refs.ispieChart1.chart.resize()
	      }
	    	if (this.$refs.ispieChart2.chart) {
	        this.$refs.ispieChart2.chart.resize()
	      }
	    	if (this.$refs.ispieChart3.chart) {
	        this.$refs.ispieChart3.chart.resize()
	      }
	    	if (this.$refs.stackedBarChart3.chart) {
	        this.$refs.stackedBarChart3.chart.resize()
	      }

    	},
      iniChartsData (){
      	 	this.radarSeries = {xValue:['知识点增长率','综合难易度','科目覆盖率','知识点掌握度','知识点均衡度'],yValue:[[30,40,50,60,70]],seriaName:['综合均衡度']},
      	  this.barLineSeries = {
						xValue: ['单选题','多选题','判断题'],
						yValue: [
							[85,56,75],
							[88,75,95]
						],
						seriaName: ['题数', '正确率'],
						seriaType: [ 'bar','line'],
						yAxis: [{
							name: '',
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
      	 
      	  this.pieSeries1={xValue:['知识点混淆','题目看错','理解有误','不理解','没学过','其他'],yValue:[18.1,16.2,52,10,10,13.2]},
        	this.stackedBarSeries3 = {
						xValue: ['语文','数学','英语','物理','生物','化学'].reverse(),
						yValue: [
								[31,24,14,24,27,29],
								[50,43,35,45,41,47],
								[12,8,17,6,5,8],
								[25,30,19,19,20,13],

						],
						seriaName: ['简单','正常','复杂','很难'],
						yAxis: [{
							name: '',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]
					}
			

      }
      
    }
  }
</script>
