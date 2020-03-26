<template>
	<div class="class_information">
		<el-row>
			<el-col :span="24">
				
				<el-select v-model="schoolTrem" placeholder="请选择学年学期" style="width:200px;margin-right: 10px;" @change="changeGrade">
					<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
					</el-option>
				</el-select>
				<el-select v-model="gradeClassId"  placeholder="请选择年级班级" style="width:250px;margin-right: 10px;" @change="changeClass">
					<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-row :gutter="12" style="margin-top: 10px;">
			<el-col :span="6">
				<div class="the_contain the_one">
					<el-col :span="19" style="text-align:center;">
						<h2 style="font-size: 25px;">{{theConter}}</h2>
						<span>{{classroomName}}</span>
					</el-col>
					<el-col :span="4">
						<img src="~@/assets/img/rflag.png" alt="" width="55" height="77"/>
					</el-col>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="the_contain the_two" >
					<el-col :span="12" style="text-align:center;line-height: 100px;">
						<!--<img src="~@/assets/img/avatar.png" alt=""/>-->
						<img v-if="icImg == ''" src="~@/assets/img/pic_avatar.jpg" />
						<img v-else :src="imgUrl+icImg" :onerror="defaultImg"/>
					</el-col>
					<el-col :span="12">
						<h2 style="font-size: 20px;height: 20px;" v-if="teaName.length==1">{{strTeaName}}</h2>
						
						<el-tooltip v-if="teaName.length >1" class="item"  effect="dark" :content="strTeaName" placement="top-start">
							<template v-for="(item,index) in teaName">
								<h2 style="font-size: 20px;height: 20px;" :key="index">
									{{item}}
									<span v-if="item.length>1">...</span>
								</h2>
							</template>
						</el-tooltip>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;班主任</span>
					</el-col>
				</div>
			</el-col>
			<el-col :span="6">
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
			<el-col :span="6">
				<div class="the_contain the_four">
					<el-col :span="12" style="text-align:center;color:white;">
						<h2 style="font-size: 20px;">{{teacherNum}}人</h2>
						<span>教师总数</span>
					</el-col>
					<el-col :span="12" style="text-align:center;line-height: 100px;">
						<img src="~@/assets/img/tea.png" alt=""/>
					</el-col>
				</div>
			</el-col>
		</el-row>
		
		<el-row :gutter="12" style="margin-top: 10px;">
		  <el-col :span="18" >
		  	<div class="grid-content " style="background: white;padding: 20px 21px 20px 0;">
		  		<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="封面:">
						<el-upload class="avatar-uploader" :action="apiUrl+'/sys/oss/picUpload'" :show-file-list="false" :on-success="handleAvatarSuccess" :data="uploadFile" :before-upload="beforeAvatarUpload">
							<div class="cover-img">
								<div>
									<img v-if="!imageUrl" src="~@/assets/img/pic_default.jpg" width="120px" height="120px" style="border-radius: 4px;" />
									<img v-else :src="defaultPic" v-real-img="imgUrl+imageUrl"  width="120px" height="120px" style="border-radius: 4px;" />
								</div>
								<div class="cover-img-box">
									<div style="line-height:80px;">上传封面，展示个性化班级~</div>
									<el-button type="text" size="small">点击上传</el-button>
								</div>
							</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="口号">
						<el-input v-model="form.slogan"></el-input>
					</el-form-item>
					<el-form-item label="目标">
						<el-input v-model="form.goal"></el-input>
					</el-form-item>
					<el-form-item label="简介">
						<el-input type="textarea" v-model="form.introduction" :autosize="{ minRows: 4, maxRows: 6}">
						</el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" :autosize="{ minRows:2, maxRows: 4}" v-model="form.remark">
						</el-input>
					</el-form-item>
					<el-form-item>
					    <el-button type="primary" @click="onSubmit">保存</el-button>
					</el-form-item>
				</el-form>
		  	</div>
		  </el-col>
		  <el-col :span="6">
		  	<div class="grid-content" style="background: white;padding: 10px;min-height: 408px;">
		  		<el-table :data="courseList"  border>
					<el-table-column prop="teacherName" label="老师" align="center">
					</el-table-column>
					<el-table-column prop="subjectName" label="科目" align="center">
					</el-table-column>
					<el-table-column prop="sex" label="性别" align="center">
					</el-table-column>
				</el-table>
		  	</div>
		  </el-col>
		</el-row>
	</div>
</template>

<script>
	import {getCommHttpData,getCommonDictByType,deleteData } from '@/utils/common'
	export default {
	    data () {
	      return {
	      	gradeClassId:undefined,
			theGcoption:[],
			apiUrl: window.SITE_CONFIG.baseUrlMedia,
	      	imgUrl:window.SITE_CONFIG.imgIP,
			defaultImg: 'this.src="' + require('../../../assets/img/pic_default.jpg') + '";this.onerror = null',
	      	schoolTrem:0,
	      	theStoption:[],
	      	schoolId:this.GLOBAL.getOrgId(),
	      	classroomName:'',
	      	courseList:[],
	      	studentNum:0,
	      	teacherNum:0,
	      	teaName:'',
	      	theConter:'',
	      	icImg:'',
	      	strTeaName:'',
	      	gradeClassInfoId:'',
	      	form:{
	      		slogan:'',
	      		goal:'',
	      		introduction:'',
	      		remark:''
			  },
			defaultPic : '',
			imageUrl: '',
			uploadFile: {
				type: ''
			},
	      }
	    },
	    created() {
			this.schoolTerm();
			
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
	    	schoolTerm(){
	    			let that=this;
		    		getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType:1,
//					data:{},
				}, function(data) {
					that.theStoption=data.list;
					that.gradeClass();
					that.getInform()
				})
	    	},
	    	changeGrade(){
	    		this.gradeClass();
				this.getInform()
	    	},
	    	gradeClass(){
	    			let that=this;
	    			let yearTermId;
						if(this.schoolTrem!=undefined){
							yearTermId=this.theStoption[this.schoolTrem].yearTermId
						}
		    		getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType:1,
					data:{
						yearTermId:yearTermId
					},
				}, function(data) {
					if(data.list&&data.list.length>0){
						that.theGcoption=data.list;
						that.gradeClassId=0;
						that.theConter=''+that.theGcoption[that.gradeClassId].gradeName+''+that.theGcoption[that.gradeClassId].className+''
						that.getInform()
					}
					
				})
	    	},
	    	
	    	changeClass(){
	    		this.theConter=''+this.theGcoption[this.gradeClassId].gradeName+''+this.theGcoption[this.gradeClassId].className+''
				this.getInform()
	    	},
	    	getInform(){
	    		let that=this;
	    		let gradeId,classId,schoolYearId,termId;
	    		if(this.gradeClassId!=undefined){
					gradeId=this.theGcoption[this.gradeClassId].gradeId,
					classId=this.theGcoption[this.gradeClassId].classId
				}else{
					gradeId='0',
					classId='0'
				};
				if(this.schoolTrem!=undefined){
					schoolYearId=this.theStoption[this.schoolTrem].schoolYearId,
					termId=this.theStoption[this.schoolTrem].termId
				}else{
					schoolYearId='0',
					termId='0'
				}
		    		getCommHttpData({
					url: 'cms/eClass/info',
					method: 'get',
					contentType:1,
					data:{
						schoolId:this.schoolId,
						gradeId:gradeId,
						classId:classId,
						schoolYearId: schoolYearId,
						termId:termId,
					},
				}, function(data) {
					that.classroomName=data.classroomName;
					that.courseList=data.courseList;
					that.studentNum=data.studentNum;
					that.teacherNum=data.teacherNum;
					that.teaName=data.classTeacher.split(',').reverse();
					that.strTeaName=data.classTeacher;
					that.icImg=data.icon;
					that.form.slogan=data.slogan;
					that.form.goal=data.goal;
					that.form.introduction=data.introduction;
					that.form.remark=data.remark,
					that.gradeClassInfoId=data.gradeClassInfoId
					that.imageUrl = data.indexPath
				})
	    	},
	    	onSubmit(){	    		
	    		let gradeClassInfoId=gradeClassInfoId==''?undefined:this.gradeClassInfoId
	    		let that=this;
		    		getCommHttpData({
					url: 'cms/eClass/update/info',
					method: 'post',
					contentType:2,
					data:{
						gradeClassInfoId:gradeClassInfoId,
						schoolId:this.schoolId,
						gradeId:this.theGcoption[this.gradeClassId].gradeId,
						classId:this.theGcoption[this.gradeClassId].classId,
						schoolYearId: this.theStoption[this.schoolTrem].schoolYearId,
						termId: this.theStoption[this.schoolTrem].termId,
						slogan:this.form.slogan,
						goal:this.form.goal,
						introduction:this.form.introduction,
						remark:this.form.remark,
						indexPath : this.imageUrl
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

<style scoped lang="scss">
	.the_contain {
		height: 100px;
	}
	
	.the_one {
		background: white;
		
	}
	
	.the_two {
		background: white;
		img{
			display: inline-block;
			height: 80px;
			width:80px;
			border-radius: 50%;
		}
	}
	
	.the_three {
		background: #a9d96c;
	}
	
	.the_four {
		background: #2ebbad;
	}
	.cover-img{
		display: flex;
	}
	.cover-img-box{
		padding-left: 10px;
		text-align: left;
	}
</style>