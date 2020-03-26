<template>
  <div class="mod-demo-echarts">
  	<date-analysis @refreshChartsData="getDateData"></date-analysis>
  	
    <el-row :gutter="10">
    	<el-col :span="8">
        <el-card>
        	<div class="" style="height:350px">
        		<div class="chart-title margin-bottom-10">活跃排行（启动次数）</div>
        		<el-table :data="dataList" fit highlight-current-row :show-header=false>
							<el-table-column align="center" label="序号" width="50px">
								<template slot-scope="scope">
									{{scope.$index+1}}
								</template>
							</el-table-column>
							<el-table-column prop="name" align="center" label="目标用户">
							</el-table-column>
							<el-table-column prop="rate" align="center" label="创建日期">
							</el-table-column>
							<el-table-column prop="step" align="center" label="创建日期">
								<template slot-scope="scope">
									<font v-if="scope.row.step>=0" color="green">↑ {{scope.row.step}}%</font>
									<font v-else color="red">↓ {{Math.abs(scope.row.step)}}%</font>
								</template>
							</el-table-column>
						</el-table>
        	</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-bar ref="tbarChart1" :id="'tbarChart1'" :title="'使用深度排行（时长）'" :series="barSeries1"></chart-bar>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
        	<div class="" style="height:350px">
        		<div class="chart-title margin-bottom-10">最近下载软件排行</div>
        		<el-table :data="appDownList" fit highlight-current-row  :show-header=false>
							<el-table-column align="center" label="序号" width="50px">
								<template slot-scope="scope">
									{{scope.$index+1}}
								</template>
							</el-table-column>
							<el-table-column prop="name" align="center" label="目标用户">
							</el-table-column>
							<el-table-column prop="rate" align="center" label="创建日期">
							</el-table-column>
						</el-table>
        	</div>
          
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
          <chart-pie ref="ispieChart1" :id="'ispieChart1'" :title="'应用分类（启动个数）'" :series="pieSeries1"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-pie ref="ispieChart2" :id="'ispieChart2'" :title="'用户偏好（使用时长）'" :series="pieSeries2"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-pie ref="ispieChart3" :id="'ispieChart3'" :title="'应用安装（使用时长）'" :series="pieSeries3"></chart-pie>
        </el-card>
      </el-col>
      
      <el-col :span="24">
        <el-card>
          <chart-stacked-bar ref="stackedBarChart3" :id="'tstackedBarChart3'" :title="'学科分布（启动个数）'" :series="stackedBarSeries3"></chart-stacked-bar>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
	import ChartPie from '@/components/charts/pie'
	import ChartBar from '@/components/charts/bar'
	import ChartStackedBar from '@/components/charts/stacked-bar'
  import DateAnalysis from '../common/date-analysis'
  import {getCommHttpData,getAnalysisChartData} from '@/utils/common'
  export default {
  	components: {
				ChartPie,
  	    DateAnalysis,
  	    ChartBar,
  	    ChartStackedBar
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	userType:this.GLOBAL.getUserType(),
      	startDate:'',
      	endDate:'',
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
      	  this.barSeries1 = {xValue:['QQ音乐','360浏览器','优酷视频','office ','多媒体教学大师'],yValue:[[0.2,2.15,3.6,5.5,10.4]],
      	    seriaName:['使用深度'],
		    		yAxis:[{
							name: '',
							min: 0,
							max: null,
							interval: null,
							axisLabel: ''
						}]}
      	  this.pieSeries1={xValue:['办公','网页','视频','应用','通讯','其他'],yValue:[40.5,16.2,11.1,10,10,13.2]},
      	  this.pieSeries2={xValue:['办公','网页','视频','应用','通讯','其他'],yValue:[39.5,25,15.6,5.2,50,14.2]},
      	  this.pieSeries3={xValue:['办公','网页','视频','应用','通讯','其他'],yValue:[38,16,60,14,30,15]},
        	this.stackedBarSeries3 = {
						xValue: ['语文','数学','英语','物理','生物','化学','历史'].reverse(),
						yValue: [
								[31,24,14,24,27,29,31],
								[50,43,35,45,41,47,43],
								[12,8,17,6,5,8,27],
								[25,30,19,19,20,13,8],
								[5,2,30,10,9,9,13],
								[27,30,20,31,31,34,34],
								[36,34,18,23,24,20,15],

						],
						seriaName: ['办公','网页','视频','应用','音频','通讯','其他'],
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
