<template>
  <div class="mod-demo-echarts">
  	
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text"><div class="kpi-text">多媒体教学率</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
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
    	<el-col :span="12">
        <el-card class="chart-box">
        	<media-kpi :id="'kpi-type'" @refreshChartsOne="getDataByKpiType"></media-kpi>
          <chart-bar :id="'ebarChart'" :title="'使用分析'" :height="'750px'"  :series="barSeries1"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-bar-line-zoom :id="'esbarLine'" :title="'使用趋势分析'" :series="barLineSeries1"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column :id="'ecolumnChart1'" :title="'使用深度趋势分析'" :series="columnSeries1"></chart-column>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <chart-column :id="'ecolumnChart2'" :title="'城乡教学率对比'" :series="columnSeries2"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-rings :id="'eringsChart'" :title="'城乡教学时长对比'" :series="ringsSeries"></chart-rings>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-bar :id="'ebarChart2'" :title="'城乡交互度对比'" :series="barSeries2"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-bar :id="'ebarChart3'" :title="'城乡多样性对比'" :series="barSeries3"></chart-bar>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <chart-column :id="'ecolumnChart3'" :title="'学段教学率对比'" :series="columnSeries3"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-bar :id="'ebarChart4'" :title="'学段教学时长对比'" :series="barSeries4"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-column :id="'ecolumnChart4'" :title="'学段使用深度对比'" :series="columnSeries4"></chart-column>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
	import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartArea from '@/components/charts/area'
  import ChartStackedArea from '@/components/charts/stacked-area'
  import ChartBasicLine from '@/components/charts/basic-line'
  import ChartBar from '@/components/charts/bar'
  import ChartRadar from '@/components/charts/radar'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartBarLine from '@/components/charts/bar-line'
  import ChartColumn from '@/components/charts/column'
  import ChartPie from '@/components/charts/pie'
  import ChartPieRing from '@/components/charts/pie-ring'
  import ChartRings from '@/components/charts/rings'
  import DateAnalysis from '../common/date-analysis'
  import MediaKpi from '../common/media-kpi'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  		ChartArea,
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    DateAnalysis,
  	    MediaKpi
    },
    data () {
      return {
      	unitId:this.GLOBAL.getOrgId(),
      	mediaKpiType:'1',
      	startDate:'',
      	endDate:'',
      	kpiType:'1',
      	kpiName:'',
      	kpiData:{
      		useRate:0,
	      	useCount:0,
	      	useTime:0,
	      	useTimeRate:0,
	      	diversity:0,
	      	interactivity:0,
      	},
      	columnSeries1:{xValue:[],yValue:[]},
      	columnSeries2:{xValue:[],yValue:[]},
      	columnSeries3:{xValue:[],yValue:[]},
      	columnSeries4:{xValue:[],yValue:[]},
      	barSeries1:{xValue:[],yValue:[]},
      	barSeries2:{xValue:[],yValue:[]},
      	barSeries3:{xValue:[],yValue:[]},
      	barSeries4:{xValue:[],yValue:[]},
      	ringsSeries:{xValue:[],yValue:[]},
      }
    },
    mounted () {
        this.iniChartsData();
    },
//  activated () {
//      //this.iniChartsData();
//  },
    methods: {
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		this.iniChartsData()
    	},
    	getDataByKpiType (kpiType,kpiName){
    		this.kpiType = kpiType
    		this.kpiName = kpiName
    		this.getBarRanking()
    	},
      iniChartsData (gradeId=null,subjectId=null){
        let that = this
				getCommHttpData({url:'multimemediaEquip/topCurMulmediaEquipInfo',method:'post',contentType:2,data:{unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:1}},function(data){
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
				this.getBarRanking()
				getAnalysisChartData({url:'multimemediaEquip/useTrendAnalysis',data:{unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:1}},function(data){
		    	that.barLineSeries1={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue1,data.list.yValue2],
		    		seriaName:[that.$t('analysis.legendRate'),that.$t('analysis.legendTime')],
		    		seriaType:['line','bar'],
		    		yAxis:[{name: '%',min: 0,max: null,interval: 10,axisLabel:''},{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''}]}
		    	that.columnSeries1={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性']}
		    })
				getAnalysisChartData({url:'multimemediaEquip/schoolAnalysis',data:{unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:1,coomType:2}},function(data){
		    	that.columnSeries2={xValue:data.list.xValue,yValue:[data.list.yValue1],seriaName:[that.$t('analysis.legendRate')],yAxis:[{tipLabel:'%',axisLabel:''}]}
		    	that.ringsSeries={xValue:data.list.xValue,yValue:data.list.yValue2,seriaName:[that.$t('analysis.legendTime')],
		    		yAxis:[{name: '分钟',min: 0,max: 45,interval: 1,axisLabel:'',tipLabel:'分钟'}]
		    	}
		    	that.barSeries2={xValue:data.list.xValue,yValue:[data.list.yValue3],seriaName:['交互度'],
		    		yAxis:[{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]
		    	}
		    	that.barSeries3={xValue:data.list.xValue,yValue:[data.list.yValue4],seriaName:['多样性'],
		    		yAxis:[{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]
		    	}
		   	}) 
				getAnalysisChartData({url:'multimemediaEquip/schoolAnalysis',data:{unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:1,coomType:1}},function(data){
		    	
		    	that.columnSeries3={xValue:data.list.xValue,yValue:[data.list.yValue1],seriaName:[that.$t('analysis.legendRate')],yAxis:[{tipLabel:'%',axisLabel:''}]}
		    	that.barSeries4={xValue:data.list.xValue,yValue:[data.list.yValue2],seriaName:[that.$t('analysis.legendTime')],
		    		yAxis:[{name: '分钟',min: 0,max: 45,interval: null,axisLabel:''}]
		    	}
		    	that.columnSeries4={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性']}
		    })
     },
     getBarRanking(){
     	  let that = this
     		getAnalysisChartData({url:'multimemediaEquip/ranking',data:{unitId:this.unitId,startDate:this.startDate,endDate:this.endDate,type:this.kpiType,coomType:6}},function(data){
					that.barSeries1={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()],
						seriaName:[that.kpiName],
		    		yAxis:that.getAxisDataByType(that.kpiType)
		    	}	
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
