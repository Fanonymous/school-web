<template>
	<div class="mod-config">
		<el-row :gutter="0">
			<el-col :span="4" >
				<el-card class="report-card">
					<img src="~@/assets/img/icons/report.png"/>
					<div class="card-text">区域信息化水平数据填报</div>
					<el-button v-if="status ==0" class="card-primary" type="primary" size="mini" @click="$router.push({name:'data-add'})">数据填报</el-button>
					<el-button v-else class="card-primary" type="primary" size="mini" @click="$router.push({name:'data-add'})">数据补录</el-button>
				</el-card>
				<!--<div class="card-footer">纳吉特教育（北京）有限公司产品问卷调查（3730701）</div>-->
			</el-col>
		</el-row>
	</div>
</template>
<style>
	.report-card{
		width: 100%;
		text-align: center;
		height: 289px;
		cursor: pointer;
	}
	.report-card:hover{
		background-color: #c0c0c0;
	}
	.report-card .card-text{
		margin-top: 10px;
	}
	.report-card img{
		margin-top: 64px;
	}
	.report-card .card-primary{
		text-align: center;
		margin-top: 10px;
		visibility: hidden;
	}
	.report-card:hover .card-primary{
	    visibility:visible;
	}
	.card-footer{
		margin-top: 10px;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				addLoading:false,
				status:0
			}
		},
		created(){
			
		},
		mounted() {
			var that = this
			getCommHttpData({
				url: 'assess/cmsdatareporting/getStatus',
				method: 'post',
				contentType: 2,
				data: {}
			}, function(data) {
				if(data && data.code==0){
					that.status = data.status
				}
			})
		},
		methods: {
		}
	}
</script>