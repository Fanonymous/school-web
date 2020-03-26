<template>
	<div class="upload-picture">
		<el-form-item :label="label" prop="picSrc">
			<el-upload class="avatar-uploader" ref="uploadpic" :action="apiUrl+'/sys/oss/picUpload'" :disabled="disabled" 
				:before-remove="beforeFileRemove" :show-file-list="false" 
				:before-upload="deforeUpload" :on-success="handleFileSuccess" :data="uploadFile"
				:on-exceed="handleFileExceed" :file-list="picList">
				<img v-if="imgUrl" :src="imgUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				<div slot="operate-button">aa</div>
				<div slot="tip" class="el-upload__tip">温馨提示：支持.jpg .jpeg .bmp .gif .png格式</div>
			</el-upload>
		</el-form-item>

	</div>
</template>

<script>
import { Stream } from 'stream';
	export default {
		props: {
			label: {
				type: String,
				default: '图标'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			sizeLimit : {
				type : Number,
				default : 2097152
			},
			value : [String, Number]
		},
		data() {
			return {
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				baseIp: window.SITE_CONFIG.imgIP,
				picSrc: '',
				picList: [],
				uploadFile: {
					type: ''
				},
				schoolYearId: '',
				schoolTermId: '',
				yearList: [],
				termList: [],
				imgUrl : '',
			}
		},
		computed : {
			imgValue() {
				return this.value
			},
		},
		watch : {
			value : {
				handler(n) {
					if (n) {
						this.imgUrl = this.baseIp + n
					}
				},
				deep : true,
				immediate : true
			}
		},
		created() {
			this.picList = []
			this.getIndexByDict();
		},
		methods: {
			handleFileExceed(files, fileList) {
				this.$message.warning(`当前限制只能上传 1 个文件`);
			},
			handleFileSuccess(response, file, fileList) {
				this.picSrc = response.url;
                this.imgUrl = this.baseIp+response.url;
				this.$emit('input', this.picSrc)
			},
			beforeFileRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},

			deforeUpload(file) {
				const fileExt = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / this.sizeLimit < 2;
				let isFormat = true;
				this.uploadFile.type = fileExt;
				if(fileExt != ".PNG" && fileExt != ".GIF" && fileExt != ".JPG" && fileExt != ".JPEG" && fileExt != ".BMP") {
					this.$message.error('上传图片格式不对!');
					this.$refs.uploadpic.clearFiles();
					isFormat = false;
				}
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过 ' + this.sizeLimit / 1048576 + 'MB!');
					isFormat = false;
					this.$refs.uploadpic.clearFiles();
				}
				return isFormat;
			},
			getIndexByDict() {
				
			},

			getList() {
				this.$emit('refreshDataList', this.schoolYearId, this.schoolTermId)
			}
		}
	}
</script>
<style lang="scss" scoped>
.avatar-uploader{
	/deep/ .el-upload{
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
  }
  .avatar-uploader{
	  /deep/ .el-upload:hover{
		  border-color: #409EFF;
	  }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
