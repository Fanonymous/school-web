<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	<media-analysis v-if="userType == 2" :gradeShow="gradeShow"  :subjectShow="subjectShow" @refreshChartsData="getFilterMediaData"></media-analysis>
  	<media-analysis v-if="userType == 4" :schoolTypeShow="gradeShow" :schoolSideTypeShow="gradeShow" :gradeShow="gradeShow" :subjectShow="subjectShow"  @refreshChartsData="getFilterMediaData"></media-analysis>

  	<el-row :gutter="10">
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
    	<el-col :span="12">
        <el-card>
          <chart-bar-line-zoom ref="ttbarLineZoom1" :id="'tbarLine'" :title="'年龄使用趋势分析'" :series="barLineSeries1"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column ref="columnChart1" :id="'tcolumnChart1'" :title="'年龄使用深度趋势对比'" :series="columnSeries1"></chart-column>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card>
          <chart-column ref="columnChart2" :id="'tcolumnChart2'" :title="'性别教学率对比'" :series="columnSeries2"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-rings ref="ringsChart" :id="'tringsChart'" :title="'性别教学时长对比'" :series="ringsSeries"></chart-rings>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-bar ref="barChart2" :id="'tbarChart2'" :title="'性别交互度对比'" :series="barSeries2"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <chart-bar ref="barChart1" :id="'tbarChart1'" :title="'性别多样性对比'" :series="barSeries1"></chart-bar>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <chart-column ref="columnChart3" :id="'tcolumnChart3'" :title="'学历教学率对比'" :series="columnSeries3"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-bar ref="barChart3" :id="'tbarChart3'" :title="'学历教学时长对比'" :series="barSeries3"></chart-bar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-column ref="columnChart4" :id="'tcolumnChart4'" :title="'学历使用深度对比'" :series="columnSeries4"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-bar-line-zoom ref="ttbarLineZoom2" :id="'tbarLineChart2'" :title="'职称使用趋势对比'" :series="barLineSeries2"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column ref="columnChart5" :id="'tcolumnChart5'" :title="'职称使用深度对比'" :series="columnSeries5"></chart-column>
        </el-card>
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartBar from '@/components/charts/bar'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartBarLine from '@/components/charts/bar-line'
  import ChartColumn from '@/components/charts/column'
  import ChartRings from '@/components/charts/rings'
  import DateAnalysis from '../common/date-analysis'
  import MediaAnalysis from '../common/media-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    DateAnalysis,
  	    MediaAnalysis
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	userType:this.GLOBAL.getUserType(),
      	startDate:'',
      	endDate:'',
      	gradeShow:true,
      	subjectShow:true,
      	classroomShow:true,
      	gradeIds:[],
      	subjectIds:[],
      	classroomIds:[],
      	schoolSideType:'',
      	schoolType:'',
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
      	columnSeries5:{xValue:[],yValue:[]},
      	barSeries1:{xValue:[],yValue:[]},
      	barSeries2:{xValue:[],yValue:[]},
      	barSeries3:{xValue:[],yValue:[]},
      	ringsSeries:{xValue:[],yValue:[]},
      	barLineSeries1:{xValue:[],yValue:[]},
      	barLineSeries2:{xValue:[],yValue:[]},
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
    		this.iniChartsData()
    	},
    	getFilterMediaData(jsonParams){
    		this.subjectIds = jsonParams.subjectIds
    		this.gradeIds = jsonParams.gradeIds
    		this.classroomIds = jsonParams.classroomIds
    		this.schoolSideType = jsonParams.schoolSideType
    		this.schoolType = jsonParams.schoolType
    		this.iniChartsData()
    	},
    	resizeListener(){
    		if (this.$refs.ttbarLineZoom1.chart) {
	        this.$refs.ttbarLineZoom1.chart.resize()
	      }
    		if (this.$refs.ttbarLineZoom2.chart) {
	        this.$refs.ttbarLineZoom2.chart.resize()
	      }
	    	if (this.$refs.columnChart1.chart) {
	        this.$refs.columnChart1.chart.resize()
	      }
	    	if (this.$refs.columnChart2.chart) {
	        this.$refs.columnChart2.chart.resize()
	      }
	    	if (this.$refs.columnChart3.chart) {
	        this.$refs.columnChart3.chart.resize()
	      }
	    	if (this.$refs.columnChart4.chart) {
	        this.$refs.columnChart4.chart.resize()
	      }
	    	if (this.$refs.columnChart5.chart) {
	        this.$refs.columnChart5.chart.resize()
	      }
	    	if (this.$refs.ringsChart.chart) {
	        this.$refs.ringsChart.chart.resize()
	      }
	    	if (this.$refs.barChart1.chart) {
	        this.$refs.barChart1.chart.resize()
	      }
	    	if (this.$refs.barChart2.chart) {
	        this.$refs.barChart2.chart.resize()
	      }
	    	if (this.$refs.barChart3.chart) {
	        this.$refs.barChart3.chart.resize()
	      }
    	},
        iniChartsData (){
        	let that = this
      		let commParams ={startDate:this.startDate,endDate:this.endDate,type:1}
	      	if(this.userType ==2 ){
	      		commParams['schoolId'] = this.schoolId
	      	}else{
	      		commParams['unitId'] = this.schoolId
	      	}
	      	if(this.gradeIds.length!=0){
	      		commParams['gradeIds'] = this.gradeIds
	      	}
	      	if(this.subjectIds.length!=0){
	      		commParams['subjectIds'] = this.subjectIds
	      	}
	      	if(this.classroomIds.length!=0){
	      		commParams['classroomIds'] = this.classroomIds
	      	}
	      	if(this.schoolSideType!=''){
	      		commParams['schoolSideType'] = this.schoolSideType
	      	}
	      	if(this.schoolType!=''){
	      		commParams['schoolType'] = this.schoolType
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
			  commParams['coomType'] = 1
			getAnalysisChartData({url:'multimemediaEquip/teacherTotalAnalysis',data:commParams},function(data){
		    	that.barLineSeries1={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue2,data.list.yValue1],
		    		seriaName:[that.$t('analysis.legendTime'),that.$t('analysis.legendRate')],
		    		seriaType:['bar','line'],
		    		yAxis:[{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''},{name: '%',min: 0,max: null,interval: 10,axisLabel:''}]}
		    	that.columnSeries1={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性'],yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:'',tipLabel:''}]}
		  		that.resizeListener()
			})
			commParams['coomType'] = 2
			getAnalysisChartData({url:'multimemediaEquip/teacherTotalAnalysis',data:commParams},function(data){
		    	that.columnSeries2={xValue:data.list.xValue,yValue:[data.list.yValue1],seriaName:[that.$t('analysis.legendRate')],yAxis:[{name: '%',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'%'}]}
		    	that.ringsSeries={xValue:data.list.xValue,yValue:data.list.yValue2,seriaName:[that.$t('analysis.legendTime')],yAxis:[{name: '分钟',min: 0,max: 45,interval: 1,axisLabel:'',tipLabel:'分钟'}]}
		    	that.barSeries1={xValue:data.list.xValue,yValue:[data.list.yValue3],seriaName:['多样性'],
		    		yAxis:[{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]}
		    	that.barSeries2={xValue:data.list.xValue,yValue:[data.list.yValue4],seriaName:['交互度'],
		    		yAxis:[{name: '',min: 0,max: 10,interval: 1,axisLabel:''}]
		    	}
		    	that.resizeListener()
		   })
		   commParams['coomType'] = 3
			getAnalysisChartData({url:'multimemediaEquip/teacherTotalAnalysis',data:commParams},function(data){

		    	that.columnSeries3={xValue:data.list.xValue,yValue:[data.list.yValue1],seriaName:[that.$t('analysis.legendRate')],yAxis:[{name: '%',min: 0,max: 100,interval: null,axisLabel:'',tipLabel:'%'}]}
		    	that.barSeries3={xValue:data.list.xValue,yValue:[data.list.yValue2],seriaName:[that.$t('analysis.legendTime')],yAxis:[{name: '分钟',min: 0,max: 45,interval: 5,axisLabel:''}]}
		    	that.columnSeries4={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性'],yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:'',tipLabel:''}]}
		  		that.resizeListener()
			})
			
			commParams['coomType'] = 4
			getAnalysisChartData({url:'multimemediaEquip/teacherTotalAnalysis',data:commParams},function(data){
		    	that.barLineSeries2={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue1,data.list.yValue2],
		    		seriaName:[that.$t('analysis.legendRate'),that.$t('analysis.legendTime')],
		    		seriaType:['line','bar'],
		    		yAxis:[{name: '%',min: 0,max: null,interval: 10,axisLabel:''},{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''}]}
		    	that.columnSeries5={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性'],yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
		  		that.resizeListener()  
			})

      }
      
    }
  }
</script>
