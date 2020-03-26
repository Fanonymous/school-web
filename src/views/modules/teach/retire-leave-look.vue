<template>
	<div class="mod-config">
		<el-card>
			<el-row :gutter="0">
				<el-form :model="form" :rules="rules" ref="dataForm">
					<el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
						
					</el-form-item>
					<el-form-item label="退休类型" :label-width="formLabelWidth" prop="retireType">
						
					</el-form-item>
					<el-form-item label="退休时间" :label-width="formLabelWidth" prop="outData">
						
					</el-form-item>
					<el-form-item label="备注" :label-width="formLabelWidth">
						
					</el-form-item>
					<el-form-item label="附件" :label-width="formLabelWidth">
						 
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="dataFormSubmit">提交</el-button>
						<el-button @click="$router.push({name:'media-type'})">取消</el-button>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	import Uploadfile from '../common/upload-file'
	export default {
		data() {
			return {
				deviceId: undefined,
				form: {
					name: '',
					outData: '',
					theType: '',
					outReson: '',
					leaschoolId: '',
					retireType: '',
					teacherId: '',
					userId: ''
				}
			}
		},
		components: {
			Uploadfile
		},
		mounted() {
			
		},
		methods: {
			//查询离职或者退休信息
			getDataInfo() {
				
				
			}
			
		}
	}
</script>