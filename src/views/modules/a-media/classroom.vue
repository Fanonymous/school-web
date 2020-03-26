<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<media-analysis :gradeShow="gradeShow" @refreshChartsData="getFilterMediaData"></media-analysis>

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
      <el-col :span="24">
        <el-card >
          <chart-bar-line-zoom :id="'cbarLineChart'" ref="acbarLineZoom" :title="'教室使用对比'" :series="barLineSeries"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <chart-column :id="'ccolumnChart'" ref="acccolumnChart"  :title="'教室使用深度对比'" :series="columnSeries"></chart-column>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartColumn from '@/components/charts/column'
  import DateAnalysis from '../common/date-analysis'
  import MediaAnalysis from '../common/media-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  	  ChartBarLineZoom,
  	  ChartColumn,
  	  DateAnalysis,
  	  MediaAnalysis
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	gradeShow:true,
      	subjectShow:true,
      	startDate:'',
      	endDate:'',
      	gradeIds:[],
      	subjectIds:[],
      	kpiData:{
      		useRate:0,
	      	useCount:0,
	      	useTime:0,
	      	useTimeRate:0,
	      	diversity:0,
	      	interactivity:0,
      	},
      	barLineSeries:{xValue:[],yValue:[]},
      	columnSeries:{xValue:[],yValue:[]}
      }
    },
    mounted () {
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
	    this.iniChartsData();
    },
//  activated () {
//  	this.resizeListener()
//
//  },
    methods: {
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		this.iniChartsData()
    	},
    	getFilterMediaData(jsonParams){
    		this.subjectIds = jsonParams.subjectIds
    		this.gradeIds = jsonParams.gradeIds
    		this.iniChartsData()
    	},
    	resizeListener(){
    		if (this.$refs.acbarLineZoom.chart!= undefined && this.$refs.acbarLineZoom.chart) {
	        this.$refs.acbarLineZoom.chart.resize()
	      }
	    	if (this.$refs.acccolumnChart.chart!= undefined && this.$refs.acccolumnChart.chart) {
	        this.$refs.acccolumnChart.chart.resize()
	      }
    	},
      iniChartsData (){
      	
      	let that = this;
      	let commParams ={schoolId:this.schoolId,startDate:this.startDate,endDate:this.endDate,type:1}
      	if(this.gradeIds.length!=0){
      		commParams['gradeIds'] = this.gradeIds
      	}
      	if(this.subjectIds.length!=0){
      		commParams['subjectIds'] = this.subjectIds
      	}
      	getCommHttpData({url:'multimemediaEquip/topCurMulmediaEquipInfo',method:'post',contentType:2,data:commParams},function(data){
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
      	delete commParams['type']
      	commParams['coomType'] = 1
		    getAnalysisChartData({url:'multimemediaEquip/cssAnalysis',data:commParams},function(data){
		    	that.barLineSeries={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue2,data.list.yValue1],
		    		seriaName:[that.$t('analysis.legendTime'),that.$t('analysis.legendRate')],
		    		seriaType:['bar','line'],
		    		yAxis:[{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''},{name: '%',min: 0,max: null,interval: 10,axisLabel:''}]}
		    	that.columnSeries={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性'],
		    	yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
		    	that.resizeListener()
		    })

      }
      
    }
  }
</script>
