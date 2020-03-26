<template>
  <div class="mod-demo-echarts">
  	<media-analysis v-if="userType == 2" :gradeShow="gradeShow" :classroomShow="classroomShow"  :subjectShow="subjectShow" @refreshChartsData="getFilterMediaData"></media-analysis>
  	<media-analysis v-if="userType == 4" :schoolTypeShow="gradeShow" :schoolSideTypeShow="gradeShow" :gradeShow="gradeShow" :subjectShow="subjectShow"  @refreshChartsData="getFilterMediaData"></media-analysis>

  	<el-row :gutter="12">
		  <el-col :span="8">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">专任老师</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="8">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/useTime.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">工勤人员</div><div class="kpi-value">{{kpiData.useTime || 0}}分钟</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="8">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/interactivity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">教辅人员</div>
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
          <chart-rings ref="ringsChart" :id="'tringsChart'" :title="'城乡对比'" :series="ringsSeries"></chart-rings>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-pie ref="basicPieChart1" :id="'basicPieChart1'" :title="'教职工来源分布'" :series="basicPieSeries1"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-pie ref="basicPieChart2" :id="'basicPieChart2'" :title="'年龄分布'" :series="basicPieSeries2"></chart-pie>
        </el-card>
      </el-col>
      
      
      <el-col :span="8">
        <el-card>
          <chart-column ref="basiccolumnChart1" :id="'basiccolumnChart1'" :title="'学历对比'" :series="basiccolumnSeries1"></chart-column>
        </el-card>
      </el-col>
      
       <el-col :span="8">
        <el-card>
          <chart-funnel ref="barChart3" :id="'tbarChart3'" :title="'岗位等级'" :series="funnelSeries"></chart-funnel>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-column ref="basiccolumnChart2" :id="'basiccolumnChart2'" :title="'性别分布'" :series="basiccolumnSeries2"></chart-column>
        </el-card>
      </el-col>
      

     
      <el-col :span="8">
        <el-card>
          <chart-column ref="basiccolumnChart3" :id="'basiccolumnChart3'" :title="'政治面貌'" :series="basiccolumnSeries3"></chart-column>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <chart-pie ref="basicPieChart3" :id="'basicPieChart3'" :title="'婚姻状况'" :series="basicPieSeries3"></chart-pie>
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
  import ChartFunnel from '@/components/charts/funnel'
  import ChartPie from '@/components/charts/pie'
  import MediaAnalysis from '../common/media-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    ChartFunnel,
  	    MediaAnalysis,
  	    ChartPie
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
      	basiccolumnSeries1:{xValue:[],yValue:[]},
      	basiccolumnSeries2:{xValue:[],yValue:[]},
      	basiccolumnSeries3:{xValue:[],yValue:[]},
      	basicPieSeries1:{xValue:[], yValue:[]},
      	basicPieSeries2:{xValue:[],yValue:[]},
      	basicPieSeries3:{xValue:[],yValue:[]},
      	ringsSeries:{xValue:[],yValue:[]},
      	funnelSeries:{xValue:[],yValue:[]}
      }
    },
    mounted () {
    	this.iniChartsData()
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
    },
//  activated () {
//			this.resizeListener()
//  },
    methods: {
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
        	
        	
        	that.funnelSeries={xValue:['展现','点击','访问','咨询','订单'],yValue:[60,40,20,80,100]}
        	that.basicPieSeries1={xValue:['展现','点击','访问','咨询','订单'],yValue:[60,40,20,80,100]}
        	that.basicPieSeries2={xValue:['展现','点击','访问','咨询','订单'],yValue:[60,40,20,80,100]}
        	that.basicPieSeries3={xValue:['展现','点击','访问','咨询','订单'],yValue:[60,40,20,80,100]}
        	that.ringsSeries={xValue:['展现','点击','访问','咨询'],yValue:[60,40,20,80],seriaName:['使用时长']}
        	
        	that.basiccolumnSeries1={xValue:['展现','点击','访问','咨询','订单'],yValue:[[60,40,20,80,100]],seriaName:['多样性'],
		    		yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
        	that.basiccolumnSeries2={xValue:['展现','点击','访问','咨询','订单'],yValue:[[60,40,20,80,100]],seriaName:['多样性'],
		    		yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
        	that.basiccolumnSeries3={xValue:['展现','点击','访问','咨询','订单'],yValue:[[60,40,20,80,100]],seriaName:['多样性'],
		    		yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:''}]}
        	
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
			

      }
      
    }
  }
</script>
