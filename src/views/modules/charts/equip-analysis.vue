<template>
  <div class="mod-demo-echarts">
  	<date-week-analysis @refreshChartsData="getDateData"></date-week-analysis>
    <media-radio-analysis  v-if="userType == 4" :schoolTypeShow="true" @refreshChartsData="getFilterMediaData" ></media-radio-analysis>
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/useRate.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">使用率（%）</div>
              <!-- <div class="kpi-value">{{kpiData.useRate || 0}}%</div> -->
              <div stlye="text-align:center">{{kpiData.useRate}}</div>
              <el-progress :stroke-width="10" :percentage="kpiData.useRate" :format="format"></el-progress>
              <!-- <el-progress :text-inside="true" :stroke-width="20" :percentage="kpiData.useRate"></el-progress> -->
            </div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon red"><img src="~@/assets/img/useTime.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">使用时长（小时）</div>
              <!-- <div class="kpi-value">{{kpiData.useTime || 0}}分钟</div> -->
              <div stlye="text-align:center">{{kpiData.usetime}}</div>
              <el-progress :stroke-width="10" :percentage="kpiData.usetime/24*100" :format="format1"></el-progress>
              <!-- <el-progress :text-inside="true" :stroke-width="20" :percentage="kpiData.useTime"></el-progress> -->
            </div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/interactivity.png"/></div>
		    		<div class="body-text" ><div class="kpi-text">多媒体交互度</div>
		    			<!-- <el-col :span="24" class="analy-progress">
			    			<el-rate
								  v-model="kpiData.interactivityScore"
								  disabled
								  text-color="#ff9900">
								</el-rate>
							</el-col> -->
              <div stlye="text-align:center">{{kpiData.interactive}}</div>
              <el-progress :stroke-width="10" :percentage="kpiData.interactive*10" :format="format2"></el-progress>
              <!-- <el-progress :text-inside="true" :stroke-width="20" :percentage="kpiData.diversity"></el-progress> -->
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
              <div stlye="text-align:center">{{kpiData.diversity}}</div>
              <el-progress :stroke-width="10" :percentage="kpiData.diversity*10" :format="format3"></el-progress>
              <!-- <el-progress :text-inside="true" :stroke-width="20" :percentage="kpiData.interactive"></el-progress> -->
		    			<!-- <el-col :span="24" class="analy-progress">
                <div  class="analy-progress-pa">
                  <el-progress :stroke-width="15" :percentage="kpiData.diversity*10" :show-text="false"></el-progress>
                </div>
		    			</el-col> -->
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
          <chart-radar :id="'dradarChart2'" ref="acradarZoom" :title="'使用分析'"  :series="radarSeries"></chart-radar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card >
          <chart-line :id="'cbarLineChart'" ref="acbarLineZoom" :title="'使用趋势分析'" :series="lineSeries1"></chart-line>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card>
          <chart-line :id="'ccolumnChart'" ref="acccolumnChart"  :title="'设备使用时长分析'" :series="lineSeries2"></chart-line>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartLine from '@/components/charts/line'
  import ChartRadar from '@/components/charts/radar'
  import DateWeekAnalysis from '../common/date-week-analysis'
  import MediaAnalysis from '../common/media-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  import MediaRadioAnalysis from '../common/media-radio-analysis'
  export default {
  	components: {
  	  ChartLine,
  	  ChartRadar,
  	  MediaAnalysis,
      DateWeekAnalysis,
      MediaRadioAnalysis
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
        userType:this.GLOBAL.getUserType(),
      	gradeShow:true,
      	subjectShow:true,
      	startDate:'',
      	endDate:'',
      	schoolType:'',
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
        radarSeries:{xValue:[],yValue:[]},
      	lineSeries1:{xValue:[],yValue:[]},
      	lineSeries2:{xValue:[],yValue:[]}
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
      format(percentage) {
        return 100;
      },
      format1(percentage) {
        return 24;
      },
      format2(percentage) {
        return 10;
      },
      format3(percentage) {
        return 10;
      },
    	getDateData(startDate,endDate){
    		this.startDate = startDate
    		this.endDate = endDate
    		this.iniChartsData()
    	},
    	getFilterMediaData(jsonParams){
    	  this.schoolType = jsonParams.schoolType
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

      	let commParams ={startDate:this.startDate,endDate:this.endDate}
        if(this.userType == 4 && this.schoolType != '全部' && this.schoolType != '' ){
          commParams ={startDate:this.startDate,endDate:this.endDate,schoolType:this.schoolType}
        }
        // that.radarSeries = {
        //   xValue: ['45','4545','453445','4545dfd'],
        //   yValue: [[1,2,1,2]],
        //   seriaName: ['互动趋势'],
        //   yAxis: [{
        //     name: '%',
        //     min: 0,
        //     max: 100,
        //     interval: null,
        //     axisLabel: ''
        //   }]
        // }

        // that.lineSeries1 = {
        //   xValue: ['45','4545'],
        //   yValue: [[1,2],[10,20],[31,32],[81,82]],
        //   seriaName: ['互动趋势','互动趋势2','互动趋势33'],
        //   yAxis: [{
        //     name: '%',
        //     min: 0,
        //     max: 100,
        //     interval: null,
        //     axisLabel: ''
        //   }]
        // }

        // that.lineSeries2 = {
        //   xValue: ['45','4545'],
        //   yValue: [[1,2],[10,20],[31,32],[81,82]],
        //   seriaName: ['互动趋势','互动趋势1','2互动趋势'],
        //   yAxis: [{
        //     name: '%',
        //     min: 0,
        //     max: 100,
        //     interval: null,
        //     axisLabel: ''
        //   }]
        // }
        getCommHttpData({url:'equipAnalysis/equipUseComRate',method:'get',contentType:1,data:commParams},function(data){
        	if(data.list != null){
        		that.kpiData = data.list[0]
        		that.kpiData['interactivityScore'] = that.kpiData.interactivity/10*5

            that.radarSeries = {
              xValue: ['使用率','使用时长','交互度','多样性'],
              yValue: [[that.kpiData.useRate1,that.kpiData.usetime1,that.kpiData.interactive1,that.kpiData.diversity1]],
              seriaName: ['百分比'],
              yAxis: [{
                name: '%',
                min: 0,
                max: 100,
                interval: null,
                axisLabel: ''
              }]
            }
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
        getCommHttpData({url:'equipAnalysis/equipUsetime',method:'get',contentType:1,data:commParams},function(data){
        	that.lineSeries2 = {
        	  xValue: data.list.xValue,
        	  yValue: [data.list.yValue],
        	  seriaName: ['平均使用时长'],
        	  yAxis: [{
        	    name: '平均使用时长(时)',
        	    min: 0,
        	    max: 100,
        	    interval: null,
        	    axisLabel: '',
              tipLable:'小时'
        	  }]
        	}
        })

        getCommHttpData({url:'equipAnalysis/equipUseTrend',method:'get',contentType:1,data:commParams},function(data){
        	that.lineSeries1 = {
        	  xValue: data.list.xValue,
        	  yValue: [data.list.yValue],
        	  seriaName: ['平均使用时长'],
        	  yAxis: [{
        	    name: '平均使用时长(时)',
        	    min: 0,
        	    max: 100,
        	    interval: null,
        	    axisLabel: '',
              tipLable:'小时'
        	  }]
        	}
        })
      }

    }
  }
</script>
