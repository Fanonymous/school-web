<template>
  <div class="mod-demo-echarts card-index-cont">
  	<el-row :gutter="12">
		  <el-col :span="6">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-text analysis-home" ><div class="kpi-text">多媒体教学率</div><div class="kpi-value">{{kpiData.useRate || 0}}%</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-text analysis-home" ><div class="kpi-text">多媒体教学时长</div><div class="kpi-value">{{kpiData.useTime || 0}}分钟</div></div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="6">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-text analysis-home" ><div class="kpi-text">多媒体交互度</div>
		    			<!--<el-col :span="20" class="analy-progress">-->
			    			<el-rate
								  v-model="kpiData.interactivityScore || 0"
								  disabled
								  text-color="#ff9900">
								</el-rate>
							<!--</el-col>-->
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
		    		<div class="body-text analysis-home" ><div class="kpi-text">教学多样性</div>
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
    
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartColumn from '@/components/charts/column'
  import {getCommHttpData,getAnalysisChartData,getDateStr} from '@/utils/common'
  export default {
  	components: {
  	  ChartBarLineZoom,
  	  ChartColumn
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	kpiData:{
      		useRate:0,
	      	useCount:0,
	      	useTime:0,
	      	useTimeRate:0,
	      	diversity:0,
	      	interactivity:0,
      	}
      }
    },
    mounted () {
	    this.iniChartsData();
    },

    methods: {
      iniChartsData (){
      	let that = this;
      	let commParams ={schoolId:this.schoolId,startDate: getDateStr(-7),endDate: getDateStr(-1),type:1}
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
      }
    }
  }
</script>
