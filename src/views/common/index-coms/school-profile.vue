<template>
	<div class="mod-demo-echarts card-index-cont">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
				<router-link :replace=true :to="{ name: 'user-organization', query: { deptType: 3,enableType:0 }}" >
						<el-card shadow="hover" class="card-index-box">
							<div class="card-index-body">
								<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon40.png" /></div>
								<div class="body-text2">
									<div class="kpi-text">学校</div>
									<div class="kpi-value"><span class="kpi-num">{{kpiData.school || 0}}</span>所</div>
								</div>
							</div>
						</el-card>
					</router-link>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
				<router-link :replace=true :to="{name:'user-user',query:{userType:2,enableType:0}}">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon32.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">教职工</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.teacher || 0}}</span>{{kpiData.teaUnit}}人</div>
							</div>
						</div>
					</el-card>
				</router-link>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
				<router-link :replace=true :to="{name:'user-user',query:{userType:3,enableType:0}}">
					<el-card shadow="hover" class="card-index-box">
						<div class="card-index-body">
							<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon38.png" /></div>
							<div class="body-text2">
								<div class="kpi-text">学生</div>
								<div class="kpi-value"><span class="kpi-num">{{kpiData.student || 0}}</span>{{kpiData.stuUnit}}人</div>
							</div>
						</div>
					</el-card>
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
	import { getCommHttpData, getAnalysisChartData,getDateStr,getUnitbyNum} from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				kpiData: {
					department: 0,
					school: 0,
					staff: 0,
					student: 0,
					teacher: 0,
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
					url: 'uc/micro/usSurvey',
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
							department: 0,
							school: 0,
							staff: 0,
							student: 0,
							teacher: 0
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
.card-index-cont{
    overflow-y: auto;
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
</style>