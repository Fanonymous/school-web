<template>
	<div class="honor_management vue">
		<el-card>
			<el-tabs v-model="activeName" @tab-click="changeHoner">
				<el-tab-pane label="学生荣誉" name="first">
					<el-row>
						<el-col :span="24">
							<el-select v-model="schoolTrem" placeholder="请选择学年学期" style="width:200px;margin-right: 10px;" @change="gradeClass">
								<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
								</el-option>
							</el-select>
							<el-select v-model="gradeClassId" placeholder="请选择年级班级" clearable style="width:250px;margin-right: 10px;" @change="getstuImg">
								<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
								</el-option>
							</el-select>
							
							<el-select v-model="theType" placeholder="请选择评定方式" clearable  @change="getstuImg" style="margin-right: 3px;">
								<el-option v-for="item in typeList" :key="item.value" :label="item.dictName" :value="item.value">
								</el-option>
							</el-select>
							<el-input placeholder="请输入学生姓名" :inline="true"  clearable style="width: 250px;" @input="getstuImg" v-model="stuMsg"></el-input>
							<el-button type="primary" style="float:right" @click="showaddStu">添加荣誉</el-button>
						</el-col>
					</el-row>
					<el-row :gutter="20" style="margin-top: 10px;">
						<el-col :span="24" v-if = "stuHonerlist.length ==0" style="height: 280px;">
							  <!-- <el-card style="width:100%;height: 100%;"> -->
							  	<img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
							  <!-- </el-card> -->
						</el-col>
						<el-col v-else :span="6" class="the_imgs" v-for='item,index in stuHonerlist'>
							<div class="the_contain" style="height: 200px;margin-bottom: 20px;">
								<img :src="baseIp+item.honerCover" :onerror="defaultImg" width="100%" height="80%" />
								<div class="word">{{item.honerName}}</div>
								<div class="the_stu">
									<el-button type="primary" style="text-align: center;" @click="editHoner(item,'1')">编辑</el-button>
									<el-button type="primary" style="text-align: center;" @click="stuHonerdel(item)">删除</el-button>
								</div>
							</div>
						</el-col>
					</el-row>
					<div style="margin-top: 20px">
						<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[12, 24, 60, 120]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="班级荣誉" name="second" >
					<el-row>
						<el-col :span="24">
							<el-select v-model="schoolTrem1" placeholder="请选择学年学期" style="width:200px;margin-right: 10px;" @change="gradeClass1">
								<el-option v-for="(item,index) in theStoption1" :key="index" :label="item.schoolYearName+item.termName" :value="index">
								</el-option>
							</el-select>
							<el-select v-model="gradeClassId1" placeholder="请选择年级班级" clearable style="width:250px;margin-right: 10px;">
								<el-option v-for="(item,index) in theGcoption1" :key="index" :label="item.gradeName+item.className" :value="index"></el-option>
							</el-select>
							<el-select v-model="theType1" placeholder="请选择评定方式" clearable style="margin-right: 3px;">
								<el-option v-for="item in typeList" v-if="item.dictName!='班级评定'" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
							</el-select>
							<el-button type="primary" style="float:right" @click="showaddClass">添加荣誉</el-button>
						</el-col>
					</el-row>
					<el-row :gutter="20" style="margin-top: 10px;">
						<el-col :span="24" v-if = "classHonerlist.length ==0" style="height: 280px;">
							  <!-- <el-card style="width:100%;height: 100%;"> -->
							  	<img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
							  <!-- </el-card> -->
						</el-col>
						<el-col v-else :span="6" class="the_imgs" v-for='item,index in classHonerlist'>
							<div class="the_contain" style="height: 200px;margin-bottom: 20px;">
								<img :src="baseIp+item.honerCover" :onerror="defaultImg" width="100%" height="80%" />
								<div class="word">{{item.honerName}}</div>
								<div class="the_class">
									<el-button type="primary" style="text-align: center;" @click="editHoner(item,'2')">编辑</el-button>
									<el-button type="primary" style="text-align: center;" @click="classHonerdel(item)">删除</el-button>
								</div>
							</div>
							
						</el-col>
					</el-row>
					<div style="margin-top: 20px">
						<el-pagination @size-change="sizeChangeHandleClass" @current-change="currentChangeHandleClass" :current-page="pageIndexClass" :page-sizes="[12, 24, 60, 120]" :page-size="pageSizeClass" :total="totalPageClass" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<el-dialog :title="stuTittle" :visible.sync="dialogFormVisible" width="30%">
			<el-form :model="form" :rules="rules" ref="honerForm" label-width="100px">
				<el-form-item label="荣誉类型" >
					<el-radio-group v-model="form.radio">
						<el-radio label="1">学生荣誉</el-radio>
						<el-radio label="2">班级荣誉</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="荣誉名称" prop="name">
					<el-input v-model="form.name" autocomplete="off" clearable placeholder="请输入荣誉名称" style="width:200px;"></el-input>
				</el-form-item>
				
				<el-form-item label="学年学期"  prop="schoolTrem">
					<el-select v-model="form.schoolTrem" placeholder="请选择学年学期" clearable style="width:200px;margin-right: 10px;" @change="gradeClass2">
						<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年级班级"   prop="gradeClassId">
					<el-select v-model="form.gradeClassId" placeholder="请选择年级班级"  clearable style="width:200px;margin-right: 10px;" @change="getstuName">
						<el-option v-for="(item,index) in theGcoption2" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学生姓名" v-if="form.radio=='1'" prop="stuName">
					<el-select v-model="form.stuName" placeholder="请选择学生姓名" clearable style="width:200px;margin-right: 10px;" >
						<el-option v-for="item in stuOption" :key="item.stuId" :label="item.stuName" :value="item.stuId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="评定方式" prop="theType">
					<el-select v-model="form.theType" placeholder="请选择评定方式" clearable @change="getstuImg" style="margin-right: 3px;">
						<el-option v-for="item in typeList" v-if="(form.radio==2&&item.dictName!='班级评定')||form.radio==1" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<uploadpic ref="uploadpic" label="上传封面" :key="index1" v-model="form.picSrc"></uploadpic>
			</el-form>
				<div style="text-align: center;">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="addstuHoner" v-if="form.radio=='1'">提交</el-button>
					<el-button type="primary" @click="addclassHoner" v-if="form.radio=='2'">提交</el-button>
				</div>
		</el-dialog>

		<el-dialog :title="teaTittle" :visible.sync="editShow"  width="30%">
			<el-form :model="forms" label-width="100px" :rules="rules" ref="honerForms">
				<el-form-item label="荣誉名称：" :label-width="formLabelWidth"  prop="name">
					<el-input v-model="forms.name" autocomplete="off" clearable placeholder="请输入荣誉名称" style="width:200px;"></el-input>
				</el-form-item>
				<el-form-item label="学年学期：" :label-width="formLabelWidth" prop="schoolTrem">
					<el-select v-model="forms.schoolTrem" placeholder="请选择学年学期" clearable style="width:200px;margin-right: 10px;" @change="gradeClass3">
						<el-option v-for="(item,index) in theStoption" :key="index" :label="item.schoolYearName+item.termName" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年级班级：" :label-width="formLabelWidth" prop="gradeClassId">
					<el-select v-model="forms.gradeClassId" placeholder="请选择年级班级" clearable style="width:200px;margin-right: 10px;" @change="getstuName1">
						<el-option v-for="(item,index) in theGcoption3" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="学生姓名：" :label-width="formLabelWidth" v-if="num=='1'" prop="stuName">
					<el-select v-model="forms.stuName" placeholder="请选择学生姓名" clearable style="width:200px;margin-right: 10px;">
						<el-option v-for="item in stuOption1" :key="item.stuId" :label="item.stuName" :value="item.stuId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="评定方式：" :label-width="formLabelWidth" prop="theType">
					<el-select v-model="forms.theType" placeholder="请选择评定方式"  clearable @change="getstuImg" style="margin-right: 3px;">
						<el-option v-for="item in typeList" v-if="activeName=='second'&&item.dictName!='班级评定'||activeName=='first'" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!--<el-form-item label="上传封面：" prop="homePagePrc" :label-width="formLabelWidth">-->
				<uploadpic ref="uploadpic" label="上传封面" v-model="forms.picSrc" ></uploadpic>
				<!--</el-form-item>-->
			</el-form>
				<div style="text-align: center;">
					<el-button @click="editShow = false" >取 消</el-button>
					<el-button type="primary" @click="editstuHoner" v-if="num=='1'" >提交</el-button>
					<el-button type="primary" @click="editclassHoner" v-if="num=='2'">提交</el-button>
				</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import Uploadpic from '../common/uploadpic'
	export default {
		data() {
			return {
                index1 : 1,
				baseIp: window.SITE_CONFIG.imgIP,
				formLabelWidth: "100px",
				dialogFormVisible: false,
				activeName: "first",
				stuMsg:undefined,
				classHonerlist: [],
				num: '',
				stuTittle:'',
				teaTittle:'',
				form: {
					name: "",
					radio: "1",
					gradeClassId: undefined,
					schoolTrem:undefined,
					theType: '',
					picSrc: '',
					stuName: '',
				},
				forms: {
					name: "",
					gradeClassId: undefined,
					schoolTrem:undefined,
					theType: '',
					picSrc: '',
					stuName: '',
				},
				row: [],
				stuOption: [],
				stuOption1: [],
				editShow: false,
				homePagePrcList: [],
				gradeClassId: undefined,
				theGcoption: [],
				theGcoption1:[],
				theGcoption2: [],
				theGcoption3:[],
				schoolTrem: 0,
				theStoption: [],
				theStoption1:[],
				theStoption2:[],
				theType: undefined,
				gradeClassId1: '',
				schoolTrem1: undefined,
				theType1: '',
				typeList: [],
				typeList1:[],
				pageIndex: 1,
				pageSize: 12,
				totalPage: 0,
				pageIndexClass: 1,
				pageSizeClass: 12,
				totalPageClass: 0,
				stuHonerlist: [],
				defaultImg: 'this.src="' + require('../../../assets/img/nothing.png') + '";this.onerror = null',
				rules: {
					name: [{
						required: true,
						message: '请输入荣誉名称',
						trigger: 'blur'
					}],
					schoolTrem: [{
						required: true,
						message: '请选择学年学期',
						trigger: 'change'
					}],
					gradeClassId: [{
						required: true,
						message: '请选择年级班级',
						trigger: 'change'
					}],
					stuName: [{
						required: true,
						message: '请选择学生姓名',
						trigger: 'change'
					}],
					theType: [{
						required: true,
						message: '请选择评定方式',
						trigger: 'change'
					}],

					picSrc: [{
						required: true,
						message: '请选择图片',
						trigger: 'change'
					}],
				}
			}
		},
		watch : {
			gradeClassId1(n) {
				this.getclassImg()
			},
			theType1(n) {
				this.getclassImg()
			}
		},
		created() {
			this.schoolTerm()
			this.schoolTerm1()
		},

		components: { Uploadpic },
		methods: {
			getPicSrc(picSrc) {
				this.form.picSrc = picSrc
				this.forms.picSrc = picSrc
			},
			gradeClass() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:this.theStoption[this.schoolTrem].yearTermId
					},
				}, function(data) {
					that.theGcoption = data.list;
					that.getstuImg()
					that.getType();
				})
			},
			gradeClass1() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:this.theStoption1[this.schoolTrem1].yearTermId
					},
				}, function(data) {
					that.theGcoption1 = data.list;
					that.getclassImg()
					that.getType();
				})
			},
			gradeClass2() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:this.theStoption[this.form.schoolTrem].yearTermId
					},
				}, function(data) {
					that.theGcoption2 = data.list;
					that.getstuName()
					that.getType();
				})
			},
			gradeClass3(gradeId,classId) {
				let that = this;
				this.forms.schoolTrem= this.forms.schoolTrem ==undefined?0:this.forms.schoolTrem
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data:{
						yearTermId:this.theStoption[this.forms.schoolTrem].yearTermId
					},
				}, function(data) {
					that.theGcoption3 = data.list;
					for(var i=0;i<that.theGcoption3.length;i++){
						if(that.theGcoption3[i].gradeId== gradeId && that.theGcoption3[i].classId==classId){
							that.forms.gradeClassId =i
						}
					};
					that.getstuName1()
					that.getType();
				})
			},
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.theStoption = data.list;
					that.gradeClass()
					that.getstuImg() 
				})
			},
			schoolTerm1() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.theStoption1 = data.list;
					that.schoolTrem1=0;
					that.gradeClass1()
				})
			},
			schoolTerm2() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.theStoption2 = data.list;
					that.gradeClass3()
					
				})
			},
			getType() {
				getCommonDictByType(this, 'honer_way', 'typeList');
			},
			getstuImg() {
				let gradeId;
				let classId;
				if(this.theGcoption[this.gradeClassId] != undefined) {
					gradeId =this.theGcoption[this.gradeClassId].gradeId;
					classId = this.theGcoption[this.gradeClassId].classId;
				};
				let that = this;
				getCommHttpData({
					url: 'cms/honer/list',
					method: 'get',
					contentType: 1,
					data: {
						honerType: 2,
						gradeId: gradeId,
						classId: classId,
						honerWay: this.theType,
						studentName: this.stuMsg,
						schoolYearId: this.theStoption[this.schoolTrem].schoolYearId,
						termId: this.theStoption[this.schoolTrem].termId,
						page: this.pageIndex,
						size: this.pageSize,
					},
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getstuImg()
						}
						that.stuHonerlist = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.stuHonerlist = []
						that.totalPage = 0
					}
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getstuImg()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getstuImg()
			},
			changeHoner() {
				this.gradeClass();
				this.getclassImg();
            },
            
			getclassImg() {
				let that = this
				let gradeId = undefined , classId = undefined
				if(this.gradeClassId1 || parseInt(this.gradeClassId1) == 0){
                    gradeId = this.theGcoption1[this.gradeClassId1].gradeId
                    classId = this.theGcoption1[this.gradeClassId1].classId
				}
				getCommHttpData({
					url: 'cms/honer/list',
					method: 'get',
					contentType: 1,
					data: {
						honerType : 1,
						gradeId : gradeId,
						classId : classId,
						honerWay : this.theType1,
						schoolYearId : this.theStoption1[this.schoolTrem1].schoolYearId,
						termId : this.theStoption1[this.schoolTrem1].termId,
						page : this.pageIndexClass,
						size : this.pageSizeClass,
					},
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndexClass != 1) {
							that.pageIndexClass = 1
							that.getclassImg()
						}
						that.classHonerlist = data.page.list
						that.totalPageClass = data.page.totalCount
					} else {
						that.classHonerlist = []
						that.totalPageClass = 0
					}
				})
			},
			// 每页数
			sizeChangeHandleClass(val) {
				this.pageSizeClass = val
				this.pageIndexClass = 1
				this.getclassImg()
			},
			// 当前页
			currentChangeHandleClass(val) {
				this.pageIndexClass = val
				this.getclassImg()
			},
			stuHonerdel(row) {
				let honerId = row.honerId;
				let that = this;
				deleteData(this, {
					url: 'cms/honer/delete',
					method: 'get',
					contentType: 1,
					operateType: 1,
					data: {
						honerId: honerId
					}
				}, function(data) {
					that.getstuImg()
				})
			},
			classHonerdel(row) {
				let honerId = row.honerId;
				let that = this;
				deleteData(this, {
					url: 'cms/honer/delete',
					method: 'get',
					contentType: 1,
					operateType: 1,
					data: {
						honerId: honerId
					}
				}, function(data) {
					that.getclassImg()
				})
			},
			getstuName() {
				let that = this;
				let gradeId,classId,schoolYearId,termId;
				if( this.form.gradeClassId!=undefined){
					 gradeId=this.theGcoption2[this.form.gradeClassId].gradeId
				}else{
					 gradeId=undefined
				}
				if(this.form.gradeClassId!=undefined){
					  classId=this.theGcoption2[this.form.gradeClassId].classId
				}else{
					 classId=undefined
				}
				if(this.form.schoolTrem!=undefined){
					  schoolYearId=this.theStoption[this.form.schoolTrem].schoolYearId;
					  termId= this.theStoption[this.form.schoolTrem].termId
				}else{
					 schoolYearId=undefined;
					 termId=undefined
				}
				getCommHttpData({
					url: 'common/queryStudentByGradeAndClass',
					method: 'get',
					contentType: 1,
					data: {
						gradeId: gradeId,
						classId:classId,
						schoolYearId: schoolYearId,
						termId:termId,
					},
				}, function(data) {
					that.stuOption = data.list
					if(data.list.length==0){
						that.form.stuName=''
					}
				})
			},
			getstuName1() {
				let that = this;
				let gradeId,classId,schoolYearId,termId;
				if( this.forms.gradeClassId!=undefined){
					 gradeId=this.theGcoption3[this.forms.gradeClassId].gradeId
				}else{
					 gradeId=undefined
				}
				if(this.forms.gradeClassId!=undefined){
					  classId=this.theGcoption3[this.forms.gradeClassId].classId
				}else{
					 classId=undefined
				}
				if(this.forms.schoolTrem!=undefined){
					
					  schoolYearId=this.theStoption[this.forms.schoolTrem].schoolYearId;
					  termId= this.theStoption[this.forms.schoolTrem].termId
				}else{
					 schoolYearId=undefined;
					 termId=undefined
				}
				getCommHttpData({
					url: 'common/queryStudentByGradeAndClass',
					method: 'get',
					contentType: 1,
					data: {
						gradeId: gradeId,
						classId: classId,
						schoolYearId: schoolYearId,
						termId:termId,
					},
				}, function(data) {
					that.stuOption1 = data.list
					if(data.list.length==0){
						that.forms.stuName=''
					}
				})
			},
			showaddStu() {
                this.dialogFormVisible = true;
                this.index1 ++
				this.form.radio = "1";
				this.form.name = "";
				this.form.gradeClassId = '';
				this.form.schoolTrem = '';
				this.form.theType = '';
				this.form.stuName = '';
				this.gradeClass();
				this.getType();
				this.stuTittle="添加荣誉";
                this.form.picSrc='';
                
				this.$nextTick(() => {
                    this.$refs.uploadpic.picList = []
                    this.$refs['honerForm'].clearValidate()
				})
			},
			showaddClass() {
                this.dialogFormVisible = true;
                this.index1 ++
				this.form.radio = "2";
				this.form.name = "";
				this.form.gradeClassId = '';
				this.form.schoolTrem = '';
				this.form.theType = '';
                this.form.stuName = '';
                this.form.picSrc = ''
				this.gradeClass();
				this.teaTittle="添加荣誉";
				this.$nextTick(() => {
                    this.$refs.uploadpic.picList = []
                    this.$refs['honerForm'].clearValidate()
				})
			},
			addstuHoner() {
				this.$refs['honerForm'].validate((valid) => {
					if(valid) {
						let that = this;
						getCommHttpData({
							url: 'cms/honer/add/student',
							method: 'post',
							contentType: 2,
							data: {
								stuId: this.form.stuName,
								gradeId: this.theGcoption2[this.form.gradeClassId].gradeId,
								classId: this.theGcoption2[this.form.gradeClassId].classId,
								schoolYearId: this.theStoption[this.form.schoolTrem].schoolYearId,
								termId: this.theStoption[this.form.schoolTrem].termId,
								honerWay: this.form.theType,
								honerName: this.form.name,
								honerCover: this.form.picSrc
							},
						}, function(data) {
							that.dialogFormVisible = false;
							that.getstuImg();
		
						})
						that.$nextTick(() => {
								that.$refs.uploadpic.picList = []
							})
					}})
				
			},
			addclassHoner() {
				this.$refs['honerForm'].validate((valid) => {
					if(valid) {
						let that = this;
						getCommHttpData({
							url: 'cms/honer/add/class',
							method: 'post',
							contentType: 2,
							data: {
								gradeId: this.theGcoption2[this.form.gradeClassId].gradeId,
								classId: this.theGcoption2[this.form.gradeClassId].classId,
								schoolYearId: this.theStoption[this.form.schoolTrem].schoolYearId,
								termId: this.theStoption[this.form.schoolTrem].termId,
								honerWay: this.form.theType,
								honerName: this.form.name,
								honerCover: this.form.picSrc
							},
						}, function(data) {
							that.dialogFormVisible = false;
							that.getclassImg();
						})
						that.$nextTick(() => {
								that.$refs.uploadpic.picList = []
							})
					}})
				
			},
			editHoner(row, num) {
				if(num==1){
					this.stuTittle="编辑荣誉";
				}
				if(num==2){
					this.teaTittle="编辑荣誉";
				}
				this.num = num;
				this.row = row;
				this.editShow = true;
				this.forms.name = row.honerName;
				for(var j=0;j<this.theStoption.length;j++){
					if(this.theStoption[j].schoolYearId==this.row.schoolYearId && this.theStoption[j].termId==this.row.termId){
						this.forms.schoolTrem =j
					}
				}
				this.forms.picSrc=row.honerCover;
				this.gradeClass3(this.row.gradeId,this.row.classId);
				this.forms.theType = row.honerWay;
				this.forms.stuName = row.stuName;
				this.forms.stuId = row.stuId;
				if(this.row.honerCover){
					this.$nextTick(() => {
						this.$refs.uploadpic.picList = [{
							name: this.row.honerCover,
							url: this.baseIp + this.row.honerCover
						}]
					})

				}
				
			},
			editstuHoner() {
			this.$refs['honerForms'].validate((valid) => {
					if(valid) {
						let honerId = this.row.honerId;
						let that = this;
						getCommHttpData({
							url: 'cms/honer/updateHoner',
							method: 'post',
							contentType: 2,
							data: {
								honerId: honerId,
								honerName: this.forms.name,
								honerType: 2,						
								schoolId: this.row.schoolId,
								gradeId: this.theGcoption3[this.forms.gradeClassId].gradeId,
								classId: this.theGcoption3[this.forms.gradeClassId].classId,
								schoolYearId: this.theStoption[this.forms.schoolTrem].schoolYearId,
								termId: this.theStoption[this.forms.schoolTrem].termId,
								stuId: this.forms.stuId,
								honerWay: this.forms.theType,
								honerCover: this.forms.picSrc
							},
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									message: '修改成功',
									type: 'success'
								});
								that.editShow = false;
								that.getstuImg()
							}
		
						})
					}})
				
			},
			editclassHoner() {
			this.$refs['honerForms'].validate((valid) => {
					if(valid) {
						let honerId = this.row.honerId;
						let that = this;
						getCommHttpData({
							url: 'cms/honer/updateHoner',
							method: 'post',
							contentType: 2,
							data: {
								honerId: honerId,
								honerName: this.forms.name,
								honerType: 1,						
								schoolId: this.row.schoolId,
								gradeId: this.theGcoption3[this.forms.gradeClassId].gradeId,
								classId: this.theGcoption3[this.forms.gradeClassId].classId,
								schoolYearId: this.theStoption[this.forms.schoolTrem].schoolYearId,
								termId: this.theStoption[this.forms.schoolTrem].termId,
								stuId: this.forms.stuId,
								honerWay: this.forms.theType,
								honerCover: this.forms.picSrc,
							},
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									message: '修改成功',
									type: 'success'
								});
								that.editShow = false;
								that.getclassImg()
							}
		
						})
					}})
				
			}
		}
	}
</script>

<style scoped lang="scss">
	.the_imgs {
	  position: relative;
	  cursor: pointer;  
	}
	.the_class {
	    position: absolute;
	    left: 0;
	    right: 0;
	    top: 80px;
	    bottom: 0;
	    height: 30px;
	    text-align: center;
		}
	.the_stu {
	    position: absolute;
	    left: 0;
	    right: 0;
	    top: 80px;
	    bottom: 0;
	    height: 30px;
	    text-align: center;
		}
	.the_imgs{
		.word{
			width:"100%";
			text-align: center;
			padding-top: 10px;
			padding-bottom: 10px;
			background: #3C85EE;
			color:white;
			font-size: 18px;
		}
	}
	.the_imgs .the_class{
	  display:none;
	}
	.the_imgs:hover .the_class{
	  display:block; 
	}
	.the_imgs .the_stu{
	  display:none;
	}
	.the_imgs:hover .the_stu{
	  display:block; 
	}
</style>