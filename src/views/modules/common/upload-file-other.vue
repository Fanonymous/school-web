<template>
	<div>
		<el-form-item style="width: 300px;" :label="label" v-model="picSrc" :rules="{ required: fileRequired, message: '文件不能为空', trigger: 'change' }">
			
			<el-upload ref="upload" class="upload-demo" :multiple=true :limit="limit" :action="apiUrl+'sys/oss/'+uploadUrl" :on-preview="handleFilePreview" 
				:before-remove="beforeFileRemove" :on-remove="handleFileRemove" :before-upload="deforeUpload" :on-success="handleFileSuccess"  
				:data="uploadFile" :on-exceed="handleFileExceed" :file-list="picList">
				<el-button size="medium" type="text" icon="el-icon-link" >添加附件</el-button>
				<!--<div slot="tip" class="el-upload__tip">温馨提示：支持{{uploadTip}}格式</div>-->
			</el-upload>
				
		</el-form-item>

	</div>
</template>
<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 120px;
		height: 120px;
		line-height: 120px;
		text-align: center;
	}
	
	.avatar {
		width: 120px;
		height: 120px;
		display: block;
	}
</style>
<script>
	export default {
		props: {
			label: {
				type: String,
				default: '文件'
			},
			limit: {
				type: Number,
				default: 1
			},
			uploadPng: {
				type: Boolean,
				default: false
			},
			uploadUrl: {
				type: String,
				default: 'upload'
			},
			fileExt: {
				type: Array,
				default: ['.XML']
			},
			fileRequired: {
				type: Boolean,
				default: true
			},
			fileSize: {
				type: Number,
				default: 2
			},
			isFile:{
				type: Boolean,
				default: false
			},
			isLoading:{
				type: Boolean,
				default: false
			}
			
		},
		watch: {
			fileExt(val) {
				this.uploadTip = this.fileExt.toString().toLocaleLowerCase()
			}
		},
		data() {

			return {
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				imgUrl: window.SITE_CONFIG.imgIP,
				picSrc: '',
				imageUrl: '',
				picList: [],
				uploadFile: {
					type: ''
				},
				uploadTip: ''
			}
		},
		mounted() {
			this.uploadTip = this.fileExt.toString().toLocaleLowerCase()
		},
		methods: {
			beforeFileRemove(file, fileList) {
				//return this.$confirm(`确定移除 ${file.name}？`)
				this.$emit('refreshLoading', false)
				if(this.limit == 1){
					
					this.$message({
						message: '请重新上传文件',
						type: 'error'
					})
					
					return false
				}else{
					return this.$confirm(`确定移除 ${file.name}？`)
				}
		        				
		 	},
			handleFileRemove(file, fileList) {
				if(this.limit == 1){
					this.$emit('refreshDataList', '')
				}else{
					//this.$emit('refreshDataList', this.picSrc)
				}
				
			},
			handleFilePreview(file) {
			},
			handleFileExceed(files, fileList) {
				this.$message.warning(`当前限制只能上传 ${this.limit} 个文件`);
				this.$emit('refreshLoading', false)
			},
			handleFileSuccess(response, file, fileList) {
				this.picSrc = response.url;
				this.imageUrl = response.url;
			
				if(this.limit >1){
					let listTemp  =  new Array()

					for(let i in fileList){
						if(fileList[i].response == undefined){
							listTemp.push({name:fileList[i].name,url:fileList[i].name})
						}else{
							listTemp.push({name:fileList[i].name,url:fileList[i].response.url})
						}
						
					}
					this.$emit('refreshDataList', listTemp)
				}else{
					
					this.picList = fileList.slice(-1)
					
					this.$emit('refreshDataList', this.picSrc)
				}
				this.$emit('refreshLoading', false)
			},
//			beforeFileRemove(file, fileList) {
// 				return this.$confirm(`确定移除 ${ file.name }？`);
//			},
			deforeUpload(file) {
				const fileExtStr = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / 1024 / 1024 < this.fileSize;
				let isFormat = true;
				this.uploadFile.type = fileExtStr;
				let fileExtArr = new Set(this.fileExt)
				
				this.$emit('refreshLoading', true)
//				if(!fileExtArr.has(fileExtStr)) {
//					this.$refs.upload.clearFiles()
//					
//					this.$message.error('上传文件格式不对!');
//					isFormat = false;
//				}
				if(!isLt2M) {
					this.$emit('refreshLoading', false)
					this.$refs.upload.clearFiles()
					this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`);
					isFormat = false;
				}
				return isFormat;
			},
			
		}
	}
</script>