<template>
	<div class="school_information">
		<el-row :gutter="12" style="margin-top: 10px;">
			<el-col :span="8">
				<div class="the_contain the_one">
					<el-col :span="24" style="text-align:center;">
						<h2 style="font-size: 26px;">{{schoolName}}</h2>
						<span>{{address}}</span>
					</el-col>	
				</div>
			</el-col>
			<!--<el-col :span="6">
				<div class="the_contain the_two">
					<el-col :span="12" style="text-align:center;color:white;">
						<h2 style="font-size: 20px;">{{worderNum}}人</h2>
						<span>职工总数</span>
					</el-col>
					<el-col :span="12" style="text-align:center;line-height: 100px;">
						<img src="~@/assets/img/pross.png" alt=""/>
					</el-col>
				</div>
			</el-col>-->
			<el-col :span="8">
				<div class="the_contain the_three">
					<el-col :span="12" style="text-align:center;color:white;">
						<h2 style="font-size: 20px;">{{studentNum}}人</h2>
						<span>学生总数</span>
					</el-col>
					<el-col :span="12" style="text-align:center;line-height: 100px;">
						<img src="~@/assets/img/stu.png" alt=""/>
					</el-col>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="the_contain the_four">
					<el-col :span="12" style="text-align:center;color:white;">
						<h2 style="font-size: 20px;">{{teacherNum}}人</h2>
						<span>教师总数</span>
					</el-col>
					<el-col :span="12" style="text-align:center;color:white;line-height: 100px;">
						<img src="~@/assets/img/tea.png" alt=""/>
					</el-col>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="12" style="margin-top: 10px;">
		  <el-col :span="24" >
		  	<div class="grid-content " style="background: white;padding: 20px 21px 20px 0;">
		  		<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="校园logo:">
						<el-upload class="avatar-uploader" :action="apiUrl+'/sys/oss/picUpload'" :show-file-list="false" :on-success="handleAvatarSuccess" :data="uploadFile" :before-upload="beforeAvatarUpload">
							<img v-if="!imageUrl" src="~@/assets/img/ic_data_failure.png" width="100px" height="100px" style="border-radius: 50%;" />
							<img v-else :src="defaultPic" v-real-img="imgUrl+imageUrl"  width="100px" height="100px" style="border-radius: 50%;" />
							<div >
								<el-button type="text" size="small" style="height: 20px;"> 修改logo</el-button>
							</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="简介:">
						<el-input type="textarea" :autosize="{ minRows: 14, maxRows: 20}" v-model="form.deptIntroduction">
						</el-input>
					</el-form-item>
					<el-form-item label="备注:">
						<el-input type="textarea" :autosize="{ minRows:4, maxRows: 6}" v-model="form.remark">
						</el-input>
					</el-form-item>
					<el-form-item>
					    <el-button type="primary" @click="onSubmit">保存</el-button>
					</el-form-item>
				</el-form>
		  	</div>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
	import {getCommHttpData,getCommonDictByType,deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	export default {
	    data () {
			return {
				schoolId:this.GLOBAL.getOrgId(),
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				imgUrl: window.SITE_CONFIG.imgIP,
				address:"",
				schoolName:'',
				worderNum:0,
				studentNum:0,
				teacherNum:0,
				deptInfoId:'',
				form:{
					deptIntroduction:'',
					remark:'',
					logoUrl : '', 
				},
				defaultPic : '',
				imageUrl: '',
				uploadFile: {
					type: ''
				},
			}
		},
		components : { Uploadpic },
	    created() {
			this.getInform()
		},
	    methods:{
			handleAvatarSuccess(res, file) {
				this.imageUrl = res.url
			},
			beforeAvatarUpload(file) {
				const fileExt = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				const isLt2M = file.size / 1024/1024 < 5;
				let isFormat = true;
				this.uploadFile.type = fileExt;
				if(fileExt != ".PNG" && fileExt != ".GIF" && fileExt != ".JPG" && fileExt != ".JPEG" && fileExt != ".BMP") {
					this.$message.error('文件类型错误，请选择jpg,png,bmp或gif类型的文件');
					isFormat = false;
				}
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过5MB!');
					isFormat = false;
				}
				return isFormat;
			},
	    	getInform(){
	    			let that=this;
		    		getCommHttpData({
					url: 'cms/eClass/schoolInfo',
					method: 'get',
					contentType:1,
					data:{
						schoolId:this.schoolId
					},
				}, function(data) {
					that.address=data.address;
					that.schoolName=data.school_name;
					that.worderNum=data.worderNum;
					that.studentNum=data.studentNum;
					that.teacherNum=data.teacherNum;
					that.form.remark=data.remark;
					that.form.deptIntroduction=data.deptIntroduction;
					that.deptInfoId=data.deptInfoId
					that.imageUrl = data.logoPath
				})
	    	},
	    onSubmit(){
	    		let that=this;
		    		getCommHttpData({
					url: 'cms/eClass/update/schoolInfo',
					method: 'post',
					contentType:2,
					data:{
						remark:this.form.remark,
						deptIntroduction:this.form.deptIntroduction,
						deptInfoId:this.deptInfoId,
						logoPath : this.imageUrl
					},
				}, function(data) {
					if(data.code==0){
						 that.$message({
				          message: '更新成功',
				          type: 'success'
				        });
					}
					
				})
	    	}
	    }
   }
</script>

<style lang="scss" scoped>
	.the_contain {
		height: 100px;
	}
	
	.the_one {
		background: white;
	}
	
	.the_two {
		background: #57c7f2;;
	}
	
	.the_three {
		background: #a9d96c;
	}
	
	.the_four {
		background: #2ebbad;
	}
</style>