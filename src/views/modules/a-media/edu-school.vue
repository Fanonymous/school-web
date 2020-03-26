<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<media-analysis :schoolTypeShow="schoolTypeShow" :schoolSideTypeShow="schoolSideTypeShow" :gradeShow="gradeShow"  @refreshChartsData="getFilterMediaData"></media-analysis>

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
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <chart-bar-line-zoom :id="'eschool-barLine'" :title="'使用趋势分析'" :series="esbarLineSeries"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <chart-column :id="'escolumnChart'" :title="'使用深度趋势分析'" :series="columnSeries"></chart-column>
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
      	unitId:this.GLOBAL.getOrgId(),
      	schoolTypeShow:true,
      	schoolSideTypeShow:true,
      	gradeShow:true,
      	gradeIds:[],
      	schoolSideType:'',
      	schoolType:'',
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
      	esbarLineSeries:{xValue:[],yValue:[]},
      	columnSeries:{xValue:[],yValue:[]}
      }
    },
    mounted () {
	    //this.iniChartsData();
    },
    activated () {
			//this.iniChartsData();
    },
    methods: {
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		this.iniChartsData()
    	},
    	getFilterMediaData(jsonParams){
    		this.gradeIds = jsonParams.gradeIds
    		this.schoolSideType = jsonParams.schoolSideType
    		this.schoolType = jsonParams.schoolType
    		this.iniChartsData()
    	},
      iniChartsData (){
      	let that = this;
      	let commParams ={unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:1}
      	if(this.gradeIds.length!=0){
      		commParams['gradeIds'] = this.gradeIds
      	}
      	if(this.schoolSideType!=''){
      		commParams['schoolSideType'] = this.schoolSideType
      	}
      	if(this.schoolType!=''){
      		commParams['schoolType'] = this.schoolType
      	}
      	
      	console.log(commParams)
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
      	commParams['coomType'] = 3
		    getAnalysisChartData({url:'multimemediaEquip/cssAnalysis',data:commParams},function(data){
		    	that.esbarLineSeries={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue1,data.list.yValue2],
		    		seriaName:[that.$t('analysis.legendRate'),that.$t('analysis.legendTime')],
		    		seriaType:['line','bar'],
		    		yAxis:[{name: '%',min: 0,max: null,interval: 10,axisLabel:''},{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''}]}
		    	  that.columnSeries={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性']}
		    })
      }
      
    }
  }
</script>
