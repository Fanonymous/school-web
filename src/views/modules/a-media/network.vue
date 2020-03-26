<template>
  <div class="mod-demo-echarts">
  	<el-form ref="form" :model="form" label-width="80px">
		  <el-form-item label="统计日期">
		    <end-date-analysis @refreshChartsData="getDateData"></end-date-analysis>
		  </el-form-item>
		</el-form>
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">班级数量</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/useTime.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">班均出口带宽</div><div class="kpi-value">{{kpiData.useTime || 0}}分钟</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/interactivity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">上行带宽</div>
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
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/diversity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">下行带宽</div>
		    			<el-col :span="20" class="analy-progress">
		    				<el-progress :stroke-width="15" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
		    			</el-col>
		    			<el-col :span="4" class="analy-progress">
		    				<div>{{kpiData.diversity || 0}}</div>
		    			</el-col>
		    		</div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
    <el-row :gutter="20">
			<!--<el-col :span="12">
        <el-card>
          <chart-column ref="columnChart5" :id="'tcolumnChart5'" :title="'职称使用深度对比'" :series="columnSeries5"></chart-column>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column ref="columnChart5" :id="'tcolumnChart5'" :title="'职称使用深度对比'" :series="columnSeries5"></chart-column>
        </el-card>
      </el-col>-->
      <el-col :span="24">
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
  import EndDateAnalysis from '../common/end-date-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    EndDateAnalysis
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
			getCommHttpData({url:'multimemediaEquip/equipNet',method:'post',contentType:2,data:commParams},function(data){
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

			commParams['coomType'] = 4
			getAnalysisChartData({url:'multimemediaEquip/equipFlow',data:commParams},function(data){
		    	that.barLineSeries2={
		    		xValue:data.list.xValue,
		    		yValue:[data.list.yValue1,data.list.yValue2],
		    		seriaName:[that.$t('analysis.legendRate'),that.$t('analysis.legendTime')],
		    		seriaType:['line','bar'],
		    		yAxis:[{name: '%',min: 0,max: null,interval: 10,axisLabel:''},{name: '分钟',min: 0,max: null,interval: 5,axisLabel:''}]}
		    	that.columnSeries5={xValue:data.list.xValue,yValue:[data.list.yValue3,data.list.yValue4],seriaName:['交互度','多样性']}
		    })

      }
      
    }
  }
</script>
