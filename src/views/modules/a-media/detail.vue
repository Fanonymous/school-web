<template>
  <div class="mod-demo-echarts">
  	<date-analysis></date-analysis>
  	<el-row :gutter="12">
  		<el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary">%</div>
		    		<div class="body-text" ><div class="kpi-text">装备在线率</div><div class="kpi-value">/台</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon red">%</div>
		    		<div class="body-text" ><div class="kpi-text">多媒体教学时长</div><div class="kpi-value">/台</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon blue">%</div>
		    		<div class="body-text" ><div class="kpi-text">多媒体交互度</div><div class="kpi-value">/台</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green">%</div>
		    		<div class="body-text" ><div class="kpi-text">教学多样性</div><div class="kpi-value">/台</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		</el-row>
    <el-row :gutter="20">
    	<el-col :span="8">
        <el-card>
          <chart-bar-line-zoom :id="'dbarLineChart1'" :title="'使用分析'"  :series="barLineSeries1"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-radar :id="'dradarChart1'" :title="'使用分析'"  :series="radarSeries1"></chart-radar>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <chart-radar :id="'dradarChart2'" :title="'使用分析'"  :series="radarSeries2"></chart-radar>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <chart-bar-line-zoom :id="'dbarLineChart2'" :title="'使用分析'"  :series="barLineSeries2"></chart-bar-line-zoom>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <chart-column :id="'dcolumnChart1'" :title="'使用分析'"  :series="columnSeries"></chart-column>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="list" v-loading="listLoading" border fit highlight-current-row>
      <el-table-column align="center" label='序号' width="95">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="班级">
        <template slot-scope="scope">
          {{scope.row.gradeEntity.gradeName}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="授课时间" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科目" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="教室" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="授课教师" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="多媒体教学时长" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="多媒体交互度" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="教学多样性" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="教学截图" >
        <template slot-scope="scope">
          {{scope.row.class_name_list}}
        </template>
      </el-table-column>
   </el-table>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartRadar from '@/components/charts/radar'
  import ChartColumn from '@/components/charts/column'
  import DateAnalysis from '../common/date-analysis'
  export default {
  	components: {
  	  ChartRadar,
  	  ChartBarLineZoom,
  	  ChartColumn,
  	  DateAnalysis
    },
    data () {
      return {
      	useRate:0,
      	useCount:0,
      	useTime:0,
      	useTimeRate:0,
      	diversity:0,
      	interactivity:0,
        radarSeries1:{xValue:[],yValue:[]},
        radarSeries2:{xValue:[],yValue:[]},
      	barLineSeries1:{xValue:[],yValue:[]},
      	barLineSeries2:{xValue:[],yValue:[]},
      	columnSeries:{xValue:[],yValue:[]},
        list:null,
        listLoading:false,
        gradeIds:[],
        classIds:[],
        classroomIds:[],
        subjectIds:[],
        sex:'',
        ageRange:'',
        education:'',
        title:''
      }
    },
    mounted () {
    	this.initChartRadar();
      this.initChartColumn();
      this.initChartBarLine();
    },
//  activated () {
//	    this.initChartRadar();
//    this.initChartColumn();
//    this.initChartBarLine();
//  },
    methods: {
    	initChartRadar (){
    		this.gradeIds = [this.$route.params.gradeId]
    		this.classIds = [this.$route.params.classId]
    		console.log(this.classIds)
	      this.radarSeries1={xValue:[],yValue:[]}
	      this.radarSeries2={xValue:[],yValue:[]}
      },
      initChartBarLine (){
      	this.barLineSeries1={xValue:[],yValue:[]}
      	this.barLineSeries2={xValue:[],yValue:[]}
      },
      initChartColumn (){
      	this.columnSeries={xValue:[],yValue:[]}
      }
    }
  }
</script>