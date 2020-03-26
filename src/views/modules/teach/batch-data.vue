<template>
	<el-dialog :title="!dataForm.id ? '批量添加' : '修改标签'" :close-on-click-modal="false" :visible.sync="visible" @close="handleClose">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px" style="padding-right: 100px;">
			<el-form-item v-if="!dataForm.id" label="第一步">
				<el-button type="text" @click="exportData()">模板下载</el-button>
			</el-form-item>
			<div style="position: relative;">
				<uploadfile :label="!dataForm.id ? '第二步' : '附件'" ref="uploadpic" :limit=1 :fileExt="fileExtWechat" uploadUrl="picUpload" @refreshDataList="getPicSrc"></uploadfile>
				<el-button type="success" size="small" @click="dataFormSubmit()" class="import-btn">导入</el-button>
			</div>
			<el-form-item label="">
				<el-progress v-if="batchClick" :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
				<template v-if="batchLoading">
					<div style="background: #fcfcfc;margin-top: 15px;padding: 15px;padding-top:5px">
						<div style="font-weight: 600;font-size: 16px;">导入结果:</div>
						<div class=""> 共<span class="">{{totalNum}}</span>条，<span style="color: #8ABE78;">成功：{{okNum}}条</span>， <span style="color: #F15643;">失败：{{failNum}}条</span>
							<el-button style="margin-left: 100px;" v-if="errorList.length > 0" type="text" @click="failExport">错误数据下载({{errorList.length}}处)</el-button>
						</div>
						<!-- <div v-if="errorList.length > 0">
							<div v-for="item in errorList">{{item}}</div>
						</div> -->
						<div style="color: #999999;">注：导入成功的{{type == 1 ? '学生' : '教师'}}中，会存在非重要信息填写错误，可下载错误数据查看。</div>
					</div>
				</template>
			</el-form-item>

		</el-form>
		<span slot="footer" class="dialog-footer">
      <!--<el-button @click="visible = false">取消</el-button>-->
      <el-button type="primary" :disabled="percentage < 100 && batchLoading == false" @click="refreshTableList" style="margin-right: 100px;">确定</el-button>
    </span>
	</el-dialog>
</template>
<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
	
	.import-btn {
		position: absolute;
		top: 2px;
		left: 220px;
	}
</style>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData, getExportFile } from '@/utils/common'
	import Uploadfile from '../common/upload-file'
	export default {
		props: {
			batchMethod: {
				type: String,
				default: 'teacherManage/saveBatch'
			},
			type:{
				type: String
			}
		},
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				imgUrl: window.SITE_CONFIG.imgIP,
				picList: [],
				fileExtWechat: ['.XLS', '.XLSX'],
				visible: false,
				addVisible: true,
				dataForm: {
					tagId: 0,
				},
				dataRule: {},
				appendixPath: '',
				dynamicTags: [],
				totalNum: 0,
				okNum: 0,
				failNum: 0,
				errorExcelPath: '',
				errorList: [],
				percentage: 0,
				batchLoading: false,
				batchClick: false,
				errorInfo: false
			}
		},
		components: {
			Uploadfile
		},
		mounted() {

		},
		methods: {
			init() {

				this.appendixPath = ''
				this.visible = true
				this.batchLoading = false
				this.batchClick = false
				this.errorInfo = false
				this.$refs.uploadpic.picSrc = ''
				this.$refs.uploadpic.picList = []
			},
			getPicSrc(picSrc) {
				this.appendixPath = picSrc
				this.percentage = 0
				this.batchLoading = false
				this.batchClick = false
			},
			exportData(){
				this.$emit('exportExcel')
			},
			// 文件导入
			dataFormSubmit() {
				var that = this
				if(this.appendixPath == '') {
					this.$message({
						message: '请先上传文件',
						type: 'error'
					})
					return;
				}

				that.batchLoading = false
				that.batchClick = true
				that.percentage = 1
				setInterval(function() {
					if(that.percentage<99){
						that.percentage++
					}
				}, 100)

				getCommHttpData({
					url: this.batchMethod,
					method: 'post',
					contentType: 2,
					//					operateType: 2,
					that: this,
					data: {
						schoolId: this.schoolId,
						filePath: this.appendixPath
					}
				}, function(data) {
					that.percentage = 100
					that.batchLoading = true
					
					if(data.msg != 'success'){
						that.$message({
							message: data.msg,
							type: 'error'
						})
						that.totalNum = 0
						that.okNum = 0
						that.failNum = 0
						that.errorList = []
						return;
					}
					that.totalNum = data.total
					that.okNum = data.ok
					that.failNum = data.fail
					that.errorExcelPath = data.errorExcelPath
					if(data.errorList == undefined) {
						that.errorList = []
					}else{
						that.errorList = data.errorList
						
					}
					
				})
			},
			failExport() {
				let getstr='?filePath='+this.errorExcelPath+'&fileName=错误数据'
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'file/common/getMenuFile'+getstr));
			},
			refreshTableList() {
				if(this.appendixPath == '') {
					this.$message({
						message: '请先上传文件',
						type: 'error'
					})
					return;
				}
				if(this.percentage != 100) {
					this.$message({
						message: '请先导入文件',
						type: 'error'
					})
					return;
				}

				this.visible = false
				this.$emit('refreshDataList', '')
			},
			handleClose(){
				this.$emit('refreshDataList', '')
			}

		}

	}
</script>