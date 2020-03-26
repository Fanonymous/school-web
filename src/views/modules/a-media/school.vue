<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">多媒体教学率</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/useTime.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">多媒体教学时长</div><div class="kpi-value">{{kpiData.useTime || 0}}分钟</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/interactivity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">多媒体交互度</div>
		    			<el-col :span="24" class="analy-progress">
			    			<el-rate
								  v-model="kpiData.interactivityScore"
								  disabled
								  text-color="#ff9900">
								</el-rate>
							</el-col>
							<!--<el-col :span="4" class="analy-progress">
		    				<div>{{kpiData.interactivity || 0}}</div>
		    			</el-col>-->
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/diversity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">教学多样性</div>
		    			<el-col :span="24" class="analy-progress">
		    			  <div  class="analy-progress-pa">
		    			    <el-progress :stroke-width="15" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
		    			  </div>
		    			</el-col>
		    			<!--<el-col :span="4" class="analy-progress">
		    				<div>{{kpiData.diversity || 0}}</div>
		    			</el-col>-->
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
    <el-row :gutter="10">
    	<el-col :span="8">
        <el-card>
          <chart-radar ref="radarChart" :id="'radarChart'" :title="'使用分析'"  :series="radarSeries"></chart-radar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-box">
        	<media-kpi :id="'kpi-type1'" @refreshChartsOne="getGradeByType"></media-kpi>
          <chart-bar ref="barChartOne" :id="'barChart1-school'" :title="'使用年级排名'" :series="barSeriesOne"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-box">
        	<media-kpi :id="'kpi-type3'" @refreshChartsOne="getClassByType"></media-kpi>
          <chart-bar ref="barChartTwo" :id="'barChart2-school'" :title="'使用班级排名'" :series="barSeriesTwo"></chart-bar>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <chart-bar-line-zoom ref="barLineZoomChart" :id="'barLine'" :title="'使用趋势分析'" :series="barLineSeries"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column  ref="scolumChart" :id="'columnChart'" :title="'使用深度趋势分析'" :series="columnSeries"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="chart-box">
        	<media-kpi :id="'kpi-type3'" @refreshChartsOne="getSubjectByType"></media-kpi>
          <chart-area ref="areaChart" :id="'areaChart'" :title="'科目对比'" :series="areaSeries"></chart-area>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartArea from '@/components/charts/area'
  import ChartBar from '@/components/charts/bar'
  import ChartRadar from '@/components/charts/radar'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartColumn from '@/components/charts/column'
  import DateAnalysis from '../common/date-analysis'
  import MediaKpi from '../common/media-kpi'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  		ChartArea,
  	  ChartBar,
  	  ChartRadar,
  	  ChartBarLineZoom,
  	  ChartColumn,
  	  DateAnalysis,
  	  MediaKpi
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	kpiType1:1,
      	kpiType2:1,
      	kpiType3:1,
      	kpiName1:'',
      	kpiName2:'',
      	kpiName3:'',
      	startDate:'',
      	endDate:'',
      	kpiData:{
      		useRate:0,
	      	useCount:0,
	      	useTime:0,
	      	useTimeRate:0,
	      	diversity:0,
	      	interactivity:0,
      	},
      	radarSeries:{xValue:[],yValue:[],seriaName:[]},
      	barSeriesOne:{xValue:[],yValue:[]},
      	barSeriesTwo:{xValue:[],yValue:[]},
      	barLineSeries:{xValue:[],yValue:[]},
      	columnSeries:{xValue:[],yValue:[],seriaName:[]},
      	areaSeries:{xValue:[],yValue:[]}
      }
    },
    mounted () {
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
    },
    //activated() {
//		this.resizeListener()
//	},
    methods: {
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		this.iniChartsData()
    	},
    	getGradeByType (kpiType1,name1){
    		this.kpiType1 = kpiType1
    		this.kpiName1 = name1
    		this.getBarGradeRanking()
    	},
    	getClassByType (kpiType2,name2){
    		this.kpiType2 = kpiType2
    		this.kpiName2 = name2
    		this.getBarRanking(2)
    	},
    	getSubjectByType (kpiType3,name3){
    		this.kpiType3 = kpiType3
    		this.kpiName3 = name3
    		this.getAreaRanking()
    	},
    	resizeListener(){
    		if (this.$refs.radarChart.chart) {
	        this.$refs.radarChart.chart.resize()
	      }
	    	if (this.$refs.barChartOne.chart) {
	        this.$refs.barChartOne.chart.resize()
	      }
	    	if (this.$refs.barChartTwo.chart) {
	        this.$refs.barChartTwo.chart.resize()
	      }
	    	if (this.$refs.barLineZoomChart.chart) {
	        this.$refs.barLineZoomChart.chart.resize()
	      }
	    	if (this.$refs.scolumChart.chart) {
	        this.$refs.scolumChart.chart.resize()
	      }
	    	if (this.$refs.areaChart.chart) {
	        this.$refs.areaChart.chart.resize()
	      }
    	},
    	iniChartsData (){
    		let that = this;

			  getCommHttpData({url:'multimemediaEquip/topCurMulmediaEquipInfo',method:'post',contentType:2,data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:1}},function(data){
		    	if(data.data != null){
		    		that.kpiData = data.data
		    		that.kpiData['interactivityScore'] = that.kpiData.interactivity/10*5
		    	}else{
		    		that.kpiData ={
		    		useRate:0,
			      	useCount:0,
			      	useTime:0,
			      	useTimeRate:0,
			      	diversity:0,
			      	interactivity:0
		    		}
		    	}
		    })

			  getAnalysisChartData({url:'multimemediaEquip/usageDistribution',data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:1,coomType:3}},function(data){
		    	that.radarSeries={xValue:data.list.xValue,yValue:[data.list.yValue],seriaName:[''],yAxis:[{max:100}]}
		    	that.resizeListener()
		    })
			  this.getBarGradeRanking()
		    this.getBarRanking(0)
		    this.getAreaRanking()
		    getAnalysisChartData({url:'multimemediaEquip/useTrendAnalysis',data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate}},function(data){
		    	that.barLineSeries={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue2,data.list.yValue1],
		    		seriaName:[that.$t('analysis.legendTime'),that.$t('analysis.legendRate')],
		    		seriaType:['bar','line'],
		    		yAxis:[{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''},{name: '%',min: 0,max: null,interval: 10,axisLabel:''}]}
		    	that.columnSeries={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性'],yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
		    	that.resizeListener()
		    })
		 },
		 getBarRanking(type){
		 	  let that = this;
		 	  var kpItype = 1
		 	  if(type ==1){
		 	  	kpItype = this.kpiType1
		 	  }else if(type ==2){
		 	  	kpItype = this.kpiType2
		 	  }
		 	  getAnalysisChartData({url:'multimemediaEquip/classAnalysis',data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:kpItype}},function(data){
		    	if(type ==1){
		    		//that.barSeriesOne={xValue:data.list.xValue,yValue:data.list.yValue}
		    	}else if(type ==2){
		    		that.barSeriesTwo={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()],seriaName:[that.kpiName2],
		    		yAxis:that.getAxisDataByType(kpItype)}
		    	}else{
		    		//that.barSeriesOne={xValue:data.list.xValue,yValue:data.list.yValue}
		    		that.barSeriesTwo={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()],seriaName:[that.kpiName2],
		    		yAxis:that.getAxisDataByType(kpItype)}
		    	}
		    	that.resizeListener()

		    })
		 },
		 //coomType 3 科目
		 getAreaRanking(){
		 	  let that = this;
		 		getAnalysisChartData({url:'multimemediaEquip/ranking',data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:this.kpiType3,coomType:3}},function(data){
		    	that.areaSeries={xValue:data.list.xValue,yValue:data.list.yValue,name:'',yAxis:that.getAxisDataByType(that.kpiType3)}
		    	that.resizeListener()
		    })
		 },
		 //coomType 1 年级
		 getBarGradeRanking(){
		 	  let that = this;

		 		getAnalysisChartData({url:'multimemediaEquip/ranking',data:{schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:this.kpiType1,coomType:1}},function(data){
		    	that.barSeriesOne={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()],
		    		seriaName:[that.kpiName1],
		    		yAxis:that.getAxisDataByType(that.kpiType1)
		    	}
		    	that.resizeListener()
		    })
		 },
		 getAxisDataByType(type){
		 	  let yAxis = [];
		 	  if(type == 1){
		 	  	yAxis = [{name: '%',min: 0,max: 100,interval: 10,axisLabel:''}]
		 	  }else if(type == 2){
		 	  	yAxis = [{name: '分钟',min: 0,max: 45,interval: 5,axisLabel:''}]
		 	  }else if(type == 3){
		 	  	yAxis = [{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]
		 	  }else{
		 	  	yAxis = [{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]
		 	  }
		 	  return yAxis;
		 }
    }
  }
</script>
