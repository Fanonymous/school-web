<template>
	<div class="mod-config">
		<el-card>
			<el-row :gutter="0">
				<el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" class="retire--foems">
					<el-form-item label="姓名：" prop="teacherId">
						<el-select v-model="dataForm.teacherName" style="width: 50%;" :disabled="!!$route.query.id" filterable remote :remote-method="getNames"
						 :loading="loading" @change="getTeacherDetail" placeholder="姓名/手机号/身份证号/邮箱/教籍号">
							<el-option :disabled="index == 0" v-for="(item,index) in teacherList" :key="item.teacherId" :value="item.teacherId">
								<span style="display: inline-block;width: 60px;">{{item.teacherName}}</span>
								<span style="display: inline-block;width: 95px;">{{item.telPhone}}</span>
								<span style="display: inline-block;width: 140px;">{{item.email}}</span>
								<span style="display: inline-block;width: 150px;">{{item.identityNum}}</span>
								<span style="display: inline-block;width: 150px;">{{item.teacherNum}}</span>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="合同关系：" prop="contractualType">
						<el-select style="width: 50%;" v-model="dataForm.contractualType" clearable placeholder="请选择合同关系">
							<el-option v-for="item in quitTypeList" :key="item.value" :label="item.dictName" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="离职时间：" prop="endDate">
						<el-date-picker style="width: 50%;" v-model="dataForm.endDate" type="date" placeholder="请选择日期" value-format='yyyy-MM-dd'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input type="textarea" maxlength="100" :rows="4" v-model="dataForm.remark"></el-input>
						<span style="position:absolute; right:10px;bottom:0px;">{{dataForm.remark.length}}/100</span>
					</el-form-item>
					<el-form-item label="附件：">
						<el-upload class="upload-demo" ref="upload" :action="apiUrl + '/sys/oss/picUpload'" :before-upload="deforeUpload"
						 :limit="1" :on-success="handleSuccess" :on-remove="handleRemove" :on-exceed="handleExceed" :file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">文件大小不能超过500M</div>
						</el-upload>
					</el-form-item>
					<!-- <uploadfile label="附件" ref="uploadpic" :limit=2 :fileExt="fileExtWechat" uploadUrl="picUpload" @refreshDataList="getPicSrc"></uploadfile> -->
					<el-form-item>
						<el-button @click="gobackClick">取消</el-button>
						<el-button type="primary" v-if="$route.query.id" @click="dataFormSubmit(1)">确定</el-button>
						<el-button type="primary" v-else @click="dataFormSubmit(0)">确定</el-button>
					</el-form-item>
				</el-form>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import {
		getCommHttpData,
		getCommonDictByType,
		deleteData
	} from '@/utils/common'
	import Uploadfile from '../common/upload-file-other.vue'
	export default {
		data() {
			return {
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				deviceId: undefined,
				fileExtWechat: ['.PNG', '.JPEG', '.word', '.ppt', '.excel', '.zip', '.mp3', '.mp4', '.docx'],
				quitTypeList: [],
				teacherList: [],
				leaveType: 1,
				keywords: '',
				teacherDetail: {},
				fileList: [],
				dataForm: {
					schoolId: this.GLOBAL.getOrgId(),
					teacherId: '',
					contractualType: '',
					endDate: this.formatDateTime(),
					appendixPath: '',
					remark: '',
					state: 1,
					teacherName:''
				},
				rules: {
					teacherId: [{
						required: true,
						message: '请选择教师',
						trigger: 'change'
					}],
					endDate: [{
						required: true,
						message: '请选择日期',
						trigger: 'change'
					}],
					contractualType: [{
						required: true,
						message: '请选择合同关系',
						trigger: 'change'
					}]

				},
				loading: false
			}
		},
		components: {
			Uploadfile
		},
		mounted() {
			getCommonDictByType(this, 'quit_type', 'quitTypeList')
            this.getDataInfo()
            if (this.$route.query.operate) {
                this.dataForm.teacherName = this.$route.query.operate.teacherName
                this.dataForm.teacherId = this.$route.query.operate.teacherId
            }
		},
		methods: {
			formatDateTime() {
				let date = new Date();
				let y = date.getFullYear();
				let m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				return y + '-' + m + '-' + d;
			},
			handleSuccess(response, file, fileList) {
				if (response.code == 0) {
					this.dataForm.appendixPath = response.url
				}
			},
			handleExceed(files, fileList) {
				this.$message.error('只能上传一个附件')
			},
			handleRemove() {
				this.dataForm.appendixPath = ''
			},
			deforeUpload(file) {
				const isLt2M = file.size / 1024 / 1024 < 500;
				let isFormat = true;
				if (!isLt2M) {
					this.$refs.upload.clearFiles()
					this.$message.error(`上传文件大小不能超过 500MB!`);
					isFormat = false;
				}
				return isFormat;
			},
			gobackClick() {
                if (this.$route.query.operate) {
                    this.$router.push({ name: 'teach-entry-manage' })
                }else {
                    this.$router.push({ name: 'teach-leave-manage' })
                }
			},
			getTeacherDetail(val) {
				this.teacherDetail = this.teacherList.find(item => {
					return item.teacherId == val
				})
				this.dataForm.teacherId = this.teacherDetail.teacherId
				this.dataForm.teacherName = this.teacherDetail.teacherName
			},
			getDataInfo() {
				let teacherId = this.$route.query.id
				let that = this
				if (teacherId) {
					getCommHttpData({
						url: `/teacherManage/queryByTeacherId?teacherId=` + teacherId,
						method: 'get',
						contentType: 2
					}, function(data) {
						let tmpdata = data.list
						that.teacherDetail = tmpdata
						for (let key in that.dataForm) {
							if (tmpdata.hasOwnProperty(key)) {
								that.dataForm[key] = tmpdata[key];
							}
						}
						if(tmpdata.appendixPath){
							that.$nextTick(() => {
								that.fileList = [{
									name: tmpdata.appendixPath,
									url: window.SITE_CONFIG.baseUrlMedia + tmpdata.appendixPath
								}]
							})
						}
						that.getNames(tmpdata.teacherName)
					})
				}

			},
			getNames(query) {
				if (query !== '') {
					this.loading = true;
					let that = this
					getCommHttpData({
						url: `/teacherManage/queryList`,
						method: 'post',
						contentType: 2,
						data: {
							keywords: query
						}
					}, function(data) {
						that.loading = false;
						if(data.list.length > 0){
							let tmpTitle = [{
								'teacherId':0,
								'teacherName':'姓名',
								'telPhone':'手机号',
								'email':'邮箱',
								'identityNum':'身份证号',
								'teacherNum':'教籍号'
							}]
							
							that.teacherList=tmpTitle.concat(data.list)
								console.log(that.teacherList,'that.teacherList')
						}else{
							that.teacherList = []
						}
					})
				}
			},
			dataFormSubmit(type) {
				//提交
				this.$refs['dataForm'].validate((valid) => {
					let teacherName = null 
					if(this.$route.query.operate){
						teacherName = this.teacherDetail.teacherName ? this.teacherDetail.teacherName : this.dataForm.teacherName
					}else{
						teacherName = this.teacherDetail.teacherName
					}
					if (valid) {
						this.$confirm(teacherName + '教师离职后，当前所有任职将撤销，您确定离职吗？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							var that = this
							let url = type == 1 ? `/teacherManage/updateLeave` : `/teacherManage/saveLeave`
							getCommHttpData({
								url: url,
								method: 'post',
								contentType: 2,
								operateType: 2,
								that: this,
								data: this.dataForm
							}, function(data) {
								that.gobackClick()
							})
						}).catch(() => {});
					}
				})
			}
		}
	}
</script>
<style>
	.retire--foems{
	    width: 50%;
	}
	.panel-bg {
		background: #f9fafc;
		padding: 5px 15px;
	}

	.panel-bg span {
		margin-right: 50px;
	}
	.el-select-dropdown__item span{
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
	}

	/* .el-upload-list--text {
		width: 600px;
	} */
</style>
