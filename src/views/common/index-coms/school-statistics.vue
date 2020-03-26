<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<router-link :replace=true :to="{name:'user-organization',query:{deptType:4,enableType:0}}" >
					<div class="card-index-box small-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon22.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">部门</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.department || 0}}</span>个</div>
							</div>
						</div>
					</div>
				</router-link>
				<router-link :replace=true :to="{name:'edu-class'}">
					<div shadow="hover" class="card-index-box small-box">
						<div class="card-index-body"> 
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon20.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">班级</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.classTotal || 0}}</span>个</div>
							</div>
						</div>
					</div>
				</router-link>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<router-link :replace=true :to="{name:'edu-subject'}">
					<div shadow="hover" class="card-index-box small-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon34.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">科目</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.subjectTotal || 0}}</span>门</div>
							</div>
						</div>
					</div>
				</router-link>
				<router-link :replace=true :to="{name:'teach-entry-manage'}">
					<div shadow="hover" class="card-index-box small-box">
						<div class="card-index-body"> 
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon32.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">教师</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.teacher || 0}}</span>{{kpiData.teaUnit}}人</div>
							</div>
						</div>
					</div>
				</router-link>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<router-link :replace=true :to="{name:'edu-room'}">
					<div shadow="hover" class="card-index-box small-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon31.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">教室</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.classroomTotal || 0}}</span>间</div>
							</div>
						</div>
					</div>
				</router-link>
				<router-link :replace=true :to="{name:'stu-stu-register'}">
					<div shadow="hover" class="card-index-box small-box">
						<div class="card-index-body"> 
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon38.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">学生</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.student || 0}}</span>{{kpiData.stuUnit}}人</div>
							</div>
						</div>
					</div>
				</router-link>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartColumn from '@/components/charts/column'
	import { getCommHttpData, getAnalysisChartData,getDateStr ,getUnitbyNum} from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				kpiData: {
					teacher: 0,
					subjectTotal: 0,
					classroomTotal: 0,
					classTotal: 0,
					staff: 0,
					department: 0,
					student:0,
					teaUnit:'',
					stuUnit:''
				}
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/sSurvey',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.page != null) {
						that.kpiData = data.page
						
						let teaNumUnit = getUnitbyNum(data.page.teacher)
						that.kpiData.teacher = teaNumUnit.num
						that.kpiData.teaUnit = teaNumUnit.unit
						let stuNumUnit = getUnitbyNum(data.page.student)
						that.kpiData.student = stuNumUnit.num
						that.kpiData.stuUnit = stuNumUnit.unit
						
					} else {
						that.kpiData = {
							teacher: 0,
							subjectTotal: 0,
							classroomTotal: 0,
							classTotal: 0,
							staff: 0,
							department: 0
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@media screen and (max-width: 1200px) {
	    .card-index-cont{
	        overflow: auto;
	        overflow-x: hidden;
	    }
	    ::-webkit-scrollbar{  
	        width: 0px;  
	        height: 5px;  
	        background-color: #F5F5F5;  
	    }   
	    ::-webkit-scrollbar-track{  
	        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
	        border-radius: 10px;  
	        background-color: #F5F5F5;  
	    }    
	    ::-webkit-scrollbar-thumb{  
	        border-radius: 10px;  
	        box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
	        background-color: #bdbdbd;  
	    }  
	    ::-webkit-scrollbar-thumb:hover{
	        border-radius: 5px;
	        box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	        background: rgba(0,0,0,0.4);
	    }
	}
	.card-index-cont a{
		color: #303133 !important;
	}
</style>