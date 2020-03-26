<template>
	<div class="mod-demo-echarts card-index-cont">
		
		<router-link :replace=true :to="{name:'class-card-class_infor'}">
		<el-row :gutter="12">
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon39.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">学生总数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.stuNum || 0}}</span>人</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon30.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">获得荣誉数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.honerNum || 0}}</span>个</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
				<el-card shadow="hover" class="card-index-box">
					<div class="card-index-body">
						<div class="body-icon icon-small"><img src="~@/assets/img/icons/icon21.png" /></div>
						<div class="body-text2">
							<div class="kpi-text">班级照片数</div>
							<div class="kpi-value"><span class="kpi-num">{{kpiData.imgNum || 0}}</span>张</div>
						</div>
					</div>
				</el-card>
				<div style="float: right; position: absolute;top:155px;right: 10px;">
						{{gradeClassName}}
						<router-link :replace=true :to="{name:routerName}" v-if="isMore">
							<span type="text" style="color:#3C85EE">&nbsp;&nbsp;>></span>
						</router-link>
					</div>
			</el-col>
			
		</el-row>
		</router-link>
	</div>
</template>

<script>
	import echarts from 'echarts'
	import mediacss from '@/assets/scss/media.scss'
	import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
	import ChartColumn from '@/components/charts/column'
	import { getCommHttpData, getAnalysisChartData,getDateStr } from '@/utils/common'
	export default {
		components: {
			ChartBarLineZoom,
			ChartColumn
		},
		data() {
			return {
				kpiData: {
					headmaster: 0,
					honerNum: 0,
					img: 0,
					imgNum: 0,
					nowCourse: 0,
					page: 0,
					stuNum: 0
				},
				gradeClassName:'',
				isMore:false
			}
		},
		mounted() {
			this.iniChartsData();
		},

		methods: {
			iniChartsData() {
				let that = this;
				getCommHttpData({
					url: 'uc/micro/classSpace',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data.list && data.list.length > 0) {
						that.kpiData = data.list[0]
						that.gradeClassName = data.list[0].gradeName+''+data.list[0].className
						that.isMore = data.list.length >1?true:false	
					} else {
						that.kpiData = {
							headmaster: 0,
							honerNum: 0,
							img: 0,
							imgNum: 0,
							nowCourse: 0,
							page: 0,
							stuNum: 0
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
