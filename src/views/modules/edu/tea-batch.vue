<template>
	<div class="tea-batch" style="background: white;padding:10px;">
		<el-upload style="margin-top:20px;margin-bottom: 20px;" class="upload-demo" ref="upload" :action="apiUrl+'sys/oss/upload'" :on-preview="handlePreview" :before-remove="beforeFileRemove" :before-upload="deforeUpload" :on-success="handleFileSuccess" :on-remove="handleRemove" :limit="1" :file-list="fileList" :data="uploadFile">
			<el-button slot="trigger" size="small" type="primary" @click="clearUploadedImage">选择文件</el-button>
			<el-button style="margin-left: 20px;padding-left:30px;padding-right: 30px;" size="small" type="success" @click="submitUpload">上传</el-button>
			<el-button size="small" type="primary" style="margin-left: 20px;" @click="showDown">下载模板</el-button>
		</el-upload>
		<div class="remind" style="margin-top:5px;" v-if="errorNum>0">
			<i class="el-icon-warning" style="color:#F00000"></i><span style="padding-left:5px;color:#909399">共有{{errorNum}}条错误数据</span>
			<span class="tixing" style="float:right;color:#909399">您可编辑原文件或者重新上传</span>
		</div>
		<div class="tables" style="padding-bottom: 60px;">
			<el-table :data="tableData" v-loading="tableLoading" border style="width: 100%; margin-top: 20px;background: white;" @cell-click="handle">
				<el-table-column type="index" label="序号" width="80" align="center">
					<template slot-scope="scope">
						{{scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column prop="teacherName" label="教师" align="center">
					<template slot-scope="scope">
            <div class="error-td" v-if="String(scope.row.error).includes('教师')">{{scope.row.teacherName}}</div>
            <div class="default-td" v-else>{{scope.row.teacherName}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="subjectName" label="科目" align="center">
					<template slot-scope="scope">
            <div class="error-td" v-if="String(scope.row.error).includes('科目')">{{scope.row.subjectName}}</div>
            <div class="default-td" v-else>{{scope.row.subjectName}}</div>
						<!-- <div class="error-td">{{scope.row.subjectName}}</div> -->
					</template>
				</el-table-column>
				<el-table-column prop="gradeName" label="年级" align="center">
					<template slot-scope="scope">
            <div class="error-td" v-if="String(scope.row.error).includes('年级')">{{scope.row.gradeName}}</div>
            <div class="default-td" v-else>{{scope.row.gradeName}}</div>
            <!-- <div class="error-td">{{scope.row.gradeName}}</div> -->
					</template>
				</el-table-column>
				<el-table-column prop="className" label="班级" align="center">
					<template slot-scope="scope">
            <div class="error-td" v-if="String(scope.row.error).includes('班级')">{{scope.row.className}}</div>
            <div class="default-td" v-else>{{scope.row.className}}</div>
            <!-- <div class="error-td">{{scope.row.className}}</div> -->
					</template>
				</el-table-column>
			</el-table>
			<el-button v-if="tableData.length>0" type="primary" @click="okChange" style="float:right;margin-top: 20px;padding-left: 40px;padding-right: 40px;">确 定</el-button>
		</div>
		<el-dialog title="教师" :visible.sync="teaShow" width="30%">
			<div style="margin-top: 20px;">
				<!--<div class="no" v-if='teaList.length==0'>
					<div class="margin-bottom-20"><img src="~@/assets/img/datano.png"/></div>
					<div>暂无数据</div>
				</div>-->
				<el-form label-width="120px">
						<el-form-item label="请选择教师" >
							<el-select v-model="checkTea" style="width:70%" multiple filterable  :multiple-limit="limitNum" remote :remote-method="getTnames" :loading="loading" placeholder="请输入教师姓名">
								<el-option v-for="item in teaList" :key="item.teacherId" :label="item.teacherName" :value="item.teacherId">
								</el-option>
							</el-select>
						</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="teaShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureTea">确 定</el-button>
			  </span>
		</el-dialog>
		<el-dialog title="科目" :visible.sync="subShow" width="30%">
			<div style="margin-top: 20px">
				<div class="no" v-if='subList.length==0'>
					<div style="margin-bottom: 20px;"><img src="~@/assets/img/datano.png"/></div>
					<div>暂无数据</div>
				</div>
				<el-checkbox-group v-model="checkSub" size="small" v-else>
					<el-checkbox v-for="item in subList" :label="item.subjectId" border style="margin-bottom: 10px;margin-left: 10px;margin-right:10px;">{{item.subjectName}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="subShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureSub">确 定</el-button>
			  </span>
		</el-dialog>
		<el-dialog title="年级" :visible.sync="gradeShow" width="30%">
			<div style="margin-top: 20px">
				<div class="no" v-if='gradeList.length==0'>
					<div style="margin-bottom: 20px;"><img src="~@/assets/img/datano.png"/></div>
					<div>暂无数据</div>
				</div>
				<el-radio-group v-model="radioGrade" size="small" v-else>
					<el-radio v-for="item in gradeList" :label="item.gradeId" border style="margin-bottom: 10px;margin-left: 10px;margin-right:10px;">{{item.gradeName}}</el-radio>
				</el-radio-group>
			</div>
			<span slot="footer" class="dialog-footer" >
			    <el-button @click="gradeShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureGrade">确 定</el-button>
			  </span>
		</el-dialog>
		<el-dialog title="班级" :visible.sync="classShow" width="30%">
			<div style="margin-top: 20px">
				<div class="no" v-if='classList.length==0'>
					<div style="margin-bottom: 20px;"><img src="~@/assets/img/datano.png"/></div>
					<div>暂无数据</div>
				</div>
				<!--<el-input placeholder="请输入姓名/用户名/教职工号查询" style="width:200px"></el-input>-->
				<el-checkbox-group v-model="checkClass" size="small" v-else>
					<el-checkbox v-for="item in classList" :label="item.classId" border style="margin-bottom: 10px;margin-left: 10px;margin-right:10px;">{{item.className}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="classShow = false">取 消</el-button>
			    <el-button type="primary" @click="sureClass">确 定</el-button>
			  </span>
		</el-dialog>

	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				schoolId: this.GLOBAL.getOrgId(),
				fileList: [],
				teaShow: false,
				subShow: false,
				gradeShow: false,
				classShow: false,
				checkTea: [],
				checkSub: [],
				radioGrade: '',
				checkClass: [],
				filePath: '',
				tableData: [],
				yearTermId:'',
				limitNum: 10,
				uploadFile: {
					type: ''
				},
				loading:false,
				teaList: [],
				errorNum: 0,
				theRow: 0,
				gradeList: [],
				subList: [],
				classList: [],
				theType: undefined,
				teaAllList:[],
        tableLoading:false
			}
		},
		mounted() {
			let that = this;
			getCommHttpData({
				url: 'common/queryTeacherList',
				method: 'get',
				contentType: 1,
				data: {
					schoolId: this.schoolId
				},
			}, function(data) {
				that.loading = false;
				that.teaAllList = data.list;
			})
			this.yearTermId = this.$route.params.yearTermId;
		},
		methods: {
			showDown() {
				this.exportFile();
				//				this.exportFile2()
			},
			//行标红
			cellStyle(row, column, rowIndex, columnIndex) {
				for(var i = 0; i < this.tableData.length; i++) {
					if(this.tableData[i].error && this.tableData[i].error.length > 0) {
						var num = i;
						for(var j = 0; j < this.tableData[i].error.length; j++) {
							var name = this.tableData[i].error[j];
							if(row.rowIndex == i && this.tableData[i].error[j] == row.column.label) {
								return 'background:#f00000;'
							}
						}
					}
				}
			},
			beforeFileRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleFileSuccess(response, file, fileList) {
				this.fileList = fileList;
				this.filePath = response.url;
			},
			clearUploadedImage() {
				this.$refs.upload.clearFiles();
				this.tableData = [];
				this.errorNum=0
			},
			deforeUpload(file) {
				//let fileName = file.name
				//file.name = '5555'

				const fileExtStr = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				this.uploadFile.type = fileExtStr;
			},
			//下载文件
			exportFile() {
				var data = this.schoolId;
				let getstr = '?excelType=xls&schoolId=' + data + ''
				const iframe = document.createElement("iframe");
				var url = window.SITE_CONFIG.baseUrlMedia + 'eduManageTeachingSubject/teachingSubjectModel' + getstr;
				iframe.style.display = "none"; // 防止影响页面
				iframe.style.height = 0; // 防止影响页面
				iframe.src = url;
				document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
				// 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
				setTimeout(() => {
					iframe.remove();
				}, 5 * 60 * 1000);
			},
			//			exportFile2() {
			//				var data = this.schoolId;
			//				let getstr = '?excelType=xls&schoolId=' + data + ''
			//				const iframe = document.createElement("iframe");
			//				var url = window.SITE_CONFIG.baseUrlMedia + 'eduManageTeachingSubject/teachingSubjectModel2' + getstr;
			//				iframe.style.display = "none"; // 防止影响页面
			//				iframe.style.height = 0; // 防止影响页面
			//				iframe.src = url;
			//				document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
			//				// 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
			//				setTimeout(() => {
			//					iframe.remove();
			//				}, 5 * 60 * 1000);
			//			},
			//上传
			submitUpload() {
				let that = this;
				debugger
				that.tableLoading = true
				getCommHttpData({
					url: 'eduManageTeachingSubject/saveBatch',
					method: 'post',
					contentType: 2,
					operateType:3,
					data: {
						filePath: this.filePath,
						schoolId: this.schoolId,
						yearTermId:this.yearTermId
					},
				}, function(data) {
					that.tableLoading = false
					if(data.code == 0) {
						for(var i = 0; i < data.list.length; i++) {
							data.list[i].indexNum = i
						}
						that.tableData = data.list;
						that.errorNum = data.errorNum;
						that.theType = data.type
					}
				})
			},
			handleRemove(file, fileList) {
				this.tableData = [];
				this.errorNum = []
			},
			handlePreview(file) {},
			//点击事件
			handle(row, column, cell, event) {
				this.checkSub = [];
				this.radioGrade = '';
				this.checkClass = [];
				 this.checkTea=[]
				this.theRow = row.indexNum
				if(column.label == "教师") {
					this.teaShow = true;
					this.teaList =row.teacherIdList;
					let teaArr=[];
					if(this.teaList.length>0){
						for(let i in this.teaList){
							teaArr.push(this.teaList[i].teacherId)
						}
						 this.checkTea=teaArr
					}
				};
				if(column.label == "科目") {
					this.subShow = true
					let that = this;
					this.subList=row.subjectIdList
					getCommHttpData({
						url: 'common/querySubjectList',
						method: 'get',
						contentType: 1,
						data: {
							schoolId: this.schoolId,
						},
					}, function(data) {
						that.subList = data.list;
					})
					let subArr=[];
					if(this.subList.length>0){
						for(let i in this.subList){
							subArr.push(this.subList[i].subjectId)
						}
					 this.checkSub=subArr
					}
				};
				if(column.label == "年级") {
					this.gradeShow = true
					let that = this;
					this.gradeList=row.gradeIdList
					getCommHttpData({
						url: 'common/queryGradeList',
						method: 'get',
						contentType: 1,
					}, function(data) {
						that.gradeList = data.list;
					})
					let gradeArr=""
					if(this.gradeList.length>0){
						for(let i in this.gradeList){
							gradeArr=this.gradeList[i].gradeId
						}
					 this.radioGrade=gradeArr
					}
				};
				if(column.label == "班级") {
					this.classShow = true;
					let that = this;
					this.classList=row.classIdList
					this.gradeList = row.gradeIdList;
					let gradeIdgo = ''
					for(var i = 0; i < that.gradeList.length; i++) {
						if(that.tableData[that.theRow].gradeName == that.gradeList[i].gradeName) {
							gradeIdgo = that.gradeList[i].gradeId
						}
					}
					getCommHttpData({
						url: 'common/queryClassListByYearTermId',
						method: 'get',
						contentType: 1,
						data: {
							schoolId: that.schoolId,
							gradeId: gradeIdgo,
							yearTermId:this.yearTermId
						},
					}, function(data) {
						that.classList = data.list;
					})
					let classArr=[];
					if(this.classList.length>0){
						for(let i in this.classList){
							classArr.push(this.classList[i].classId)
						}
					 this.checkClass=classArr
					}
				}
			},
			//获取教师姓名
			getTnames(query) {
				if(query !== '') {
					this.loading = true;
					let that = this;
					getCommHttpData({
						url: 'common/queryTeacherList',
						method: 'get',
						contentType: 1,
						data: {
							schoolId: this.schoolId,
							keywords: query
						},
					}, function(data) {
						that.loading = false;
						that.teaList = data.list;
					})
				}
			},
			//变更老师，保存
			sureTea() {
				let str = new Array();
				
				//弹框选中值
				for(var j = 0; j < this.teaAllList.length; j++) {
					for(var m = 0; m < this.checkTea.length; m++) {
						if(this.teaAllList[j].teacherId == this.checkTea[m]) {
							str.push(this.teaAllList[j].teacherName);
						}
					}
				}
				let that = this;
				if(str.length == 0) {
					that.$message({
						type: 'error',
						message: '请选择老师'
					});
				} else {
					str = str.toString()
					let arr = [];
					for(var i = 0; i < this.tableData.length; i++) {
						if(this.theRow == i) {
							this.tableData[i].teacherName = str;
							arr.teacherName = this.tableData[i].teacherName;
							arr.subjectName = this.tableData[i].subjectName;
							arr.gradeName = this.tableData[i].gradeName;
							arr.className = this.tableData[i].className;
						}
					};
					let cname;
					if(arr.className) {
						cname = arr.className
					} else {
						cname = ''
					};
					let errorRowNum;
					if(that.tableData[that.theRow].error) {
						errorRowNum = that.tableData[that.theRow].error.length
					} else {
						errorRowNum = 0
					}
					getCommHttpData({
						url: 'eduManageTeachingSubject/checkUploadData',
						method: 'post',
						contentType: 2,
						data: {
							type: this.theType,
							schoolId: this.schoolId,
							teacherName: arr.teacherName,
							subjectName: arr.subjectName,
							gradeName: arr.gradeName,
							className: cname,
							errorNum: this.errorNum,
							yearTermId:this.yearTermId,
							errorRowNum: errorRowNum
						},
					}, function(data) {
						if(data.list) {
							that.tableData[that.theRow].error = data.list[0].error;
							that.tableData[that.theRow].teacherName = data.list[0].teacherName;

							that.tableData[that.theRow].teacherIdList = data.list[0].teacherIdList;

						} else {
							that.tableData[that.theRow].error = []
						}
						that.errorNum = data.errorNum;
						that.teaShow = false;
					})
				}
			},
			sureGrade() {
				let str = '';
				for(var j = 0; j < this.gradeList.length; j++) {
					if(this.gradeList[j].gradeId == this.radioGrade) {
						str = this.gradeList[j].gradeName;
					}
				};
				let that = this;
				if(str.length == '') {
					that.$message({
						type: 'error',
						message: '请选择年级'
					});
				} else {
					for(var i = 0; i < this.tableData.length; i++) {
						if(this.theRow == i) {
							this.tableData[i].gradeName = str;
						}
					};
					let arr = [];
					for(var i = 0; i < this.tableData.length; i++) {
						if(this.theRow == i) {
							this.tableData[i].gradeName = str;
							arr.teacherName = this.tableData[i].teacherName;
							arr.subjectName = this.tableData[i].subjectName;
							arr.gradeName = this.tableData[i].gradeName;
							arr.className = this.tableData[i].className;
						}
					};
					let cname;
					if(arr.className) {
						cname = arr.className
					} else {
						cname = ''
					}
					let errorRowNum;
					if(that.tableData[that.theRow].error) {
						errorRowNum = that.tableData[that.theRow].error.length
					} else {
						errorRowNum = 0
					}
					getCommHttpData({
						url: 'eduManageTeachingSubject/checkUploadData',
						method: 'post',
						contentType: 2,
						data: {
							type: this.theType,
							schoolId: this.schoolId,
							teacherName: arr.teacherName,
							subjectName: arr.subjectName,
							gradeName: arr.gradeName,
							className: cname,
							errorNum: this.errorNum,
							yearTermId:this.yearTermId,
							errorRowNum: errorRowNum
						},
					}, function(data) {
						if(data.list) {
							that.tableData[that.theRow].error = data.list[0].error;
							that.tableData[that.theRow].gradeName = data.list[0].gradeName;
							that.tableData[that.theRow].gradeIdList = data.list[0].gradeIdList;
						} else {
							that.tableData[that.theRow].error = []
						}
						that.errorNum = data.errorNum;
						that.gradeShow = false;
					})
				}
			},
			sureSub() {
				let str = [];
				for(var j = 0; j < this.subList.length; j++) {
					for(var m = 0; m < this.checkSub.length; m++) {
						if(this.subList[j].subjectId == this.checkSub[m]) {
							str.push(this.subList[j].subjectName);

						}
					}
				};
				let that = this;
				if(str.length == 0) {
					that.$message({
						type: 'error',
						message: '请选择科目'
					});
				} else {
					str = str.toString();
				for(var i = 0; i < this.tableData.length; i++) {
					if(this.theRow == i) {
						this.tableData[i].subjectName = str;
					}
				};
				let arr = [];
				for(var i = 0; i < this.tableData.length; i++) {
					if(this.theRow == i) {
						this.tableData[i].subjectName = str;
						arr.teacherName = this.tableData[i].teacherName;
						arr.subjectName = this.tableData[i].subjectName;
						arr.gradeName = this.tableData[i].gradeName;
						arr.className = this.tableData[i].className;
					}
				};
				let cname;
				if(arr.className) {
					cname = arr.className
				} else {
					cname = ''
				}
					let errorRowNum;
					if(that.tableData[that.theRow].error) {
						errorRowNum = that.tableData[that.theRow].error.length
					} else {
						errorRowNum = 0
					}
					getCommHttpData({
						url: 'eduManageTeachingSubject/checkUploadData',
						method: 'post',
						contentType: 2,
						data: {
							type: this.theType,
							schoolId: this.schoolId,
							teacherName: arr.teacherName,
							subjectName: arr.subjectName,
							gradeName: arr.gradeName,
							className: cname,
							errorNum: this.errorNum,
							errorRowNum:errorRowNum,
							yearTermId:this.yearTermId
						},
					}, function(data) {
						if(data.list) {
							that.tableData[that.theRow].error = data.list[0].error;
							that.tableData[that.theRow].subjectName = data.list[0].subjectName;
							that.tableData[that.theRow].subjectIdList = data.list[0].subjectIdList;
						} else {
							that.tableData[that.theRow].error = []
						}
						that.errorNum = data.errorNum;
						that.subShow = false;
					})
				}
			},
			sureClass() {
				let str =[];
				for(var j = 0; j < this.classList.length; j++) {
					for(var m = 0; m < this.checkClass.length; m++) {
						if(this.classList[j].classId == this.checkClass[m]) {
							str.push(this.classList[j].className);

						}
					}
				};
				let that = this;				
				if(str.length == 0) {
					that.$message({
						type: 'error',
						message: '请选择班级'
					});
				} else {
					str = str.toString();
				for(var i = 0; i < this.tableData.length; i++) {
					if(this.theRow == i) {
						this.tableData[i].className = str;
					}
				};
				let arr = [];
				for(var i = 0; i < this.tableData.length; i++) {
					if(this.theRow == i) {
						this.tableData[i].className = str;
						arr.teacherName = this.tableData[i].teacherName;
						arr.subjectName = this.tableData[i].subjectName;
						arr.gradeName = this.tableData[i].gradeName;
						arr.className = this.tableData[i].className;
					}
				};
				let cname;
				if(arr.className) {
					cname = arr.className
				} else {
					cname = ''
				}
				let errorRowNum;
					if(that.tableData[that.theRow].error) {
						errorRowNum = that.tableData[that.theRow].error.length
					} else {
						errorRowNum = 0
					}
					getCommHttpData({
						url: 'eduManageTeachingSubject/checkUploadData',
						method: 'post',
						contentType: 2,
						data: {
							type: this.theType,
							schoolId: this.schoolId,
							teacherName: arr.teacherName,
							subjectName: arr.subjectName,
							gradeName: arr.gradeName,
							className: cname,
							errorNum: this.errorNum,
							errorRowNum: errorRowNum,
							yearTermId:this.yearTermId
						},
					}, function(data) {
						if(data.list) {
							console.log(data.list)
							that.tableData[that.theRow].error = data.list[0].error;
							that.tableData[that.theRow].className = data.list[0].className;
							console.log(data.list)
							that.tableData[that.theRow].classIdList = data.list[0].classIdList;
						} else {
							that.tableData[that.theRow].error = []
						}
						that.errorNum = data.errorNum;
						that.classShow = false;
					})
				}
			},
			//最终提交
			okChange() {
				let dataParam = [];
				for(var i = 0; i < this.tableData.length; i++) {
					dataParam.push({
						teacherName: this.tableData[i].teacherName,
						subjectName: this.tableData[i].subjectName,
						gradeName: this.tableData[i].gradeName,
						className: this.tableData[i].className
					})
				};
				let that = this;
				getCommHttpData({
					url: 'eduManageTeachingSubject/saveBatchData',
					method: 'post',
					contentType: 2,
					data: {
						list: dataParam,
						type: this.theType,
						schoolId: this.schoolId,
						yearTermId:this.yearTermId
					},
				}, function(data) {
					if(data.list && data.list.length > 0) {
						that.$message({
							type: 'error',
							message: data.message
						});

					} else {
						that.$message({
							type: 'success',
							message: '操作成功'
						});
						that.$router.go(-1)
					}
					//						 that.$router.push({name: 'teacher'})
					//						
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.el-upload .el-upload-list {
		width: 500px
	}
	.no{
		text-align: center;
		vertical-align: middle;
	}
  .el-table td, .el-table th{
    padding: 0px 0px !important;
  }
  .el-table--medium td, .el-table--medium th{
    padding: 0px 0px !important;
  }
  .default-td{
    padding: 10px 0;
  }
  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0px;
  }
  .el-table .cell, .el-table th div{
    padding-right: 0px;
  }
  .el-table .cell{
    line-height: 18px;
  }

  .error-td{
    background-color: #FF0000; padding: 10px 0;
  }
</style>