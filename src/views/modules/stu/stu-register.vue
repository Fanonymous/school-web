<template>
	<div class="stu-register">
	<!--<nav style="background: white;padding-top:30px;padding-bottom: 10px;">-->
		<el-card class="blue-shadow">
			<el-form :inline="true" label-width="60px">
					<!-- <el-form-item label="">
						<el-date-picker v-model="datapicker" type="daterange"  align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDataList" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item> -->
					<el-form-item label="" :model="topForm">
						<el-select v-model="topForm.gradeId" @change="changeGrade" clearable placeholder="请选择年级" class="search-input-stu">
							<el-option v-for="item in gradeOption" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="">
						<el-select v-model="topForm.classId" @change="getDataList" clearable placeholder="请选择班级" class="search-input-stu">
							<el-option v-for="item in classOption" :key="item.classId" :label="item.className" :value="item.classId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-input v-model="keywords" @input="getDataList" style="width:300px;" placeholder="姓名/手机号/邮箱/身份证号/学籍号"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
					<div class="right xs-mini" style="margin-bottom: 10px;">
						<router-link :to="{name:'add-register'}" style="color:white;text-decoration: none;">
							<el-button type="primary">添加学生</el-button>
						</router-link>
						<el-button type="primary" @click="batchHandle">批量导入</el-button>
						<!-- <el-button type="primary" @click="baseLoad">模板下载</el-button> -->
						<!-- <el-button type="primary" @click="downLoad">导出</el-button> -->
						<el-button type="primary" @click="getExportTitle(2)">导出</el-button>
						<el-button type="danger" @click="showDelete(choseList)">批量删除</el-button>
					</div>
				</el-form>
			
			<!--</nav>-->
				<el-table :data="dataList" ref="tableData"  v-loading="listLoading" border style="width: 100%;background: white;" :row-key="getRowKey" @selection-change="selectionChangeHandle">
					<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
					<el-table-column type="index" align="center" label='序号' width="60">
						<template slot-scope="scope">
							 {{scope.$index+1+pageSize*(pageIndex-1)}}
						</template>
					</el-table-column>
					<el-table-column  label="姓名" align="center">
						<template slot-scope="scope">
							<router-link :to="{name:'show-register',query:{stuId:scope.row.stuId}}" style="text-decoration: none;">
								<el-button type="text" size="small">{{scope.row.stuName}}</el-button>
							</router-link>
						</template>
					</el-table-column>
					<el-table-column label="班级" align="center">
						<template slot-scope="scope">
							<span>{{scope.row.gradeName}}{{scope.row.className}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="telPhone" label="手机号" align="center">
					</el-table-column>
					<el-table-column prop="email" label="邮箱" align="center">
					</el-table-column>
					<el-table-column prop="identityNum" label="身份证号" align="center"></el-table-column>
					<el-table-column prop="stuCode" label="学籍号" align="center"></el-table-column>
					<el-table-column  label="性别" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.sex === 0" size="small">男</span>
							<span v-if="scope.row.sex === 1" size="small" type="danger">女</span>
						</template>
					</el-table-column>
					<!-- <el-table-column prop="nativePlace" label="籍贯" align="center">
					</el-table-column>
					<el-table-column prop="birthday" label="出生日期" align="center">
					</el-table-column>
					<el-table-column prop="createDate" label="注册时间" align="center">
					</el-table-column> -->
					<el-table-column prop="zip" label="操作" align="center">
						<template slot-scope="scope">
			                <el-button type="text" size="small" @click="baseLink(scope.row, 1)">完善信息</el-button>
			                <el-button type="text" size="small" @click="baseLink(scope.row, 2)">离校</el-button>
							<el-button type="text" size="small" @click="showDelete([scope.row.stuId], scope.row.stuName, 1, scope.row)" style="color:#f56c6c;">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
		</el-card>


		<el-dialog title="删除" :visible.sync="delVisible" width="500px" custom-class="delete-person-dialog">
			<div class="delete-person-name" v-if="!isOnly">
				<div>已选择</div>
				<div class="name-detail">{{delName}}</div>
				<div v-if="choseList.length > 7">等</div>
				<div>{{choseList.length}}名学生。</div>
				<el-tooltip class="item" v-if="choseList.length > 8" effect="dark" :content="delName" placement="bottom-end" popper-class="delete-name-tip">
					<div class="el-icon-d-arrow-right"></div>
				</el-tooltip>
			</div>

			<div class="delete-wrapper" v-show="!isConfirm">
				<div style="font-weight:bold;">您是否存在以下情况：</div>
				<ul class="problem-list">
					<li>
						<div class="wrong-tip"><span>1.</span>添加的学生信息有误。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate" @click="downloadByChoise">批量更新学生信息</div> -->
                        <div v-if="!isOnly">请在列表页编辑学生信息</div>
						<div v-else class="dialog-problem-operate" @click="routerEdit">编辑学生信息</div>
					</li>
					<li>
						<div class="wrong-tip"><span>2.</span>学生已离校。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate">全部置为离校学生</div> -->
                        <div v-if="!isOnly">请在列表页置为离校学生</div>
						<div v-else class="dialog-problem-operate" @click="baseLink(tempRow, 2)">置为离校学生</div>
					</li>
					<li>
						<div class="wrong-tip"><span>3.</span>学生已毕业。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate">全部置为已毕业学生</div> -->
                        <div v-if="!isOnly" class="dialog-problem-operate" @click="$router.push({ name : 'stu-graduates' })">毕业班设置</div>
						<div v-else class="dialog-problem-operate" @click="$router.push({ name : 'stu-graduates' })">毕业班设置</div>
					</li>
				</ul>
			</div>

			<div class="confirm-delete" v-show="isConfirm">
                <div>
                    <span class="el-icon-warning"></span>
                    <span style="padding-left:5px;">删除后会同时删除与学生相关的信息</span>
                </div>
                <div style="margin-top:20px;">
                    <el-radio v-model="isKnow" label="1">我已知晓</el-radio>
                </div>
            </div>

			<div slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false" size="small">取 消</el-button>
				<el-button type="primary" @click="theDelete" size="small" v-show="isConfirm" :disabled="!isKnow">删除</el-button>
				<el-button type="primary" @click="goDelete" size="small" v-show="!isConfirm">继续删除</el-button>
			</div>
		</el-dialog>


		<!-- 弹窗, 新增 / 修改 -->
		<batch-data :type="1" v-if="batchVisible" ref="batchData" :batchMethod="batchMethod" @exportExcel="getExportTitle(1)" @refreshDataList="getup"></batch-data>
		<!-- 选择导出列 -->
		<template v-if="dialogExportVisible">
			<el-dialog :title="exportTitle" :visible.sync="dialogExportVisible" width="35%">
				<div id="scrool-class" style="margin-top:-20px;height: 400px;overflow-y: auto;">
					<!-- <template v-for="item in gradeClassList"> -->
					<div class="class-title">
						<el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange" v-model="teacherCheck"></el-checkbox>
						<span style="margin-left: 10px;">{{basicList.description}}</span>
					</div>
					<el-checkbox-group class="checkbox-border" v-model="checkTeacherCol" @change="handleCheckedChange">
						<el-col v-for="item in basicList.dataList" :span="6" style="margin-top: 10px;">
							<el-checkbox :disabled="item.must == 1" :label="item">{{item.fieldName}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
					<div class="class-title">
						<el-checkbox :indeterminate="isIndeterminate1" @change="handleCheckAllChange1" v-model="teacherCheck1"></el-checkbox>
						<span style="margin-left: 10px;">{{basicList1.description}}</span>
					</div>
					<el-checkbox-group class="checkbox-border" v-model="checkTeacherCol1" @change="handleCheckedChange1">
						<el-col v-for="item in basicList1.dataList" :span="6" style="margin-top: 10px;">
							<el-checkbox :checked="item.must == 1" :disabled="item.must == 1" :label="item">{{item.fieldName}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
					<div class="class-title">
						<el-checkbox :indeterminate="isIndeterminate2" @change="handleCheckAllChange2" v-model="teacherCheck2"></el-checkbox>
						<span style="margin-left: 10px;">{{basicList2.description}}</span>
					</div>
					<el-checkbox-group v-model="checkTeacherCol2" @change="handleCheckedChange2">
						<el-col v-for="item in basicList2.dataList" :span="6" style="margin-top: 10px;">
							<el-checkbox :checked="item.must == 1" :disabled="item.must == 1" :label="item">{{item.fieldName}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
					<div class="class-title">
						<el-checkbox :indeterminate="isIndeterminate3" @change="handleCheckAllChange3" v-model="teacherCheck3"></el-checkbox>
						<span style="margin-left: 10px;">{{basicList3.description}}</span>
					</div>
					<el-checkbox-group v-model="checkTeacherCol3" @change="handleCheckedChange3">
						<el-col v-for="item in basicList3.dataList" :span="6" style="margin-top: 10px;">
							<el-checkbox :checked="item.must == 1" :disabled="item.must == 1" :label="item">{{item.fieldName}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
					<div class="class-title">
						<el-checkbox :indeterminate="isIndeterminate4" @change="handleCheckAllChange4" v-model="teacherCheck4"></el-checkbox>
						<span style="margin-left: 10px;">{{basicList4.description}}</span>
					</div>
					<el-checkbox-group v-model="checkTeacherCol4" @change="handleCheckedChange4">
						<el-col v-for="item in basicList4.dataList" :span="6" style="margin-top: 10px;">
							<el-checkbox :checked="item.must == 1" :disabled="item.must == 1" :label="item">{{item.fieldName}}</el-checkbox>
						</el-col>
					</el-checkbox-group>
					<!-- </template> -->
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button size="mini" @click="handleCancel">取 消</el-button>
					<el-button size="mini" type="primary" @click="getExportFile1">确 定</el-button>
				</span>
			</el-dialog>
				
		</template>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, deleteData,getExportFile } from '@/utils/common'
	import BatchData from '../teach/batch-data'
	export default {
		data() {
			return {
				exportTitle:'',
				teacherCheck: false,
				teacherCheck1: false,
				teacherCheck2: false,
				teacherCheck3: false,
				teacherCheck4: false,
				dialogExportVisible: false,
				checkTeacherCol: [],
				checkTeacherCol1: [],
				checkTeacherCol2: [],
				checkTeacherCol3: [],
				checkTeacherCol4: [],
				isIndeterminate: false,
				isIndeterminate1: false,
				isIndeterminate2: false,
				isIndeterminate3: false,
				isIndeterminate4: false,
				checkAllList:[],
				checkAllList1:[],
				checkAllList2:[],
				checkAllList3:[],
				checkAllList4:[],
				basicList:null,
				basicList1:null,
				basicList2:null,
				basicList3:null,
				basicList4:null,
				defaultSelect:[],
				defaultSelect1:[],
				defaultSelect2:[],
				defaultSelect3:[],
				defaultSelect4:[],
                baseUrl : window.SITE_CONFIG.baseUrlMedia,
				schoolId: this.GLOBAL.getOrgId(),
				datapicker: [],
				batchMethod:'stu/basicInfo/importStu',
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataList:[],
				gradeOption:[],
				classOption:[],
				keywords: '',
				choseList:[],
				delName:'',
				delId:[],
				delVisible:false,
				leadVisible:false,
				listLoading:false,
				filePath:'',
				topForm: {
					gradeId: '',
					classId: '',
				},
				batchVisible: false,
				isKnow : '',
				isConfirm : false,
                isOnly : false,
                tempRow : {},
			}
		},
		components: {
			BatchData
		},
		watch : {
			delVisible(n) {
				if (!n) {
					this.isConfirm = false
					this.isKnow = ''
					this.isOnly = false
				}
			}
		},
	    created() {
	    	this.getGrade();
			this.getDataList();
		},
		methods: {
			handleCancel(){
				this.teacherCheck=false;
				this.teacherCheck1=false;
				this.teacherCheck2=false;
				this.teacherCheck3=false;
				this.teacherCheck4=false;
				this.dialogExportVisible = false;
				this.checkTeacherCol= [];
				this.checkTeacherCol1= [];
				this.checkTeacherCol2= [];
				this.checkTeacherCol3= [];
				this.checkTeacherCol4= [];
				this.isIndeterminate= false;
				this.isIndeterminate1= false;
				this.isIndeterminate2= false;
				this.isIndeterminate3= false;
				this.isIndeterminate4= false;
				this.checkAllList = []
				this.checkAllList1 = []
				this.checkAllList2 = []
				this.checkAllList3 = []
				this.checkAllList4 = []
			},
			handleCheckAllChange(val) {
				
				this.checkTeacherCol = val ? this.checkAllList : this.defaultSelect;
				this.isIndeterminate = false;
			},
			handleCheckedChange(value) {
				let checkTeacherCol = value.length;
				this.teacherCheck = checkTeacherCol === this.checkAllList.length;
				this.isIndeterminate = checkTeacherCol > 0 && checkTeacherCol < this.checkAllList.length;
			},
			handleCheckAllChange1(val) {
				this.checkTeacherCol1 = val ? this.checkAllList1 : this.defaultSelect1;
				this.isIndeterminate1 = false;
			},
			handleCheckedChange1(value) {
				let checkTeacherCol1 = value.length;
				this.teacherCheck1 = checkTeacherCol1 === this.checkAllList1.length;
				this.isIndeterminate1 = checkTeacherCol1 > 0 && checkTeacherCol1 < this.checkAllList1.length;
			},
			handleCheckAllChange2(val) {
				this.checkTeacherCol2 = val ? this.checkAllList2 : this.defaultSelect2;
				this.isIndeterminate2 = false;
			},
			handleCheckedChange2(value) {
				let checkTeacherCol2 = value.length;
				this.teacherCheck2 = checkTeacherCol2 === this.checkAllList2.length;
				this.isIndeterminate2 = checkTeacherCol2 > 0 && checkTeacherCol2 < this.checkAllList2.length;
			},
			handleCheckAllChange3(val) {
				this.checkTeacherCol3 = val ? this.checkAllList3 : this.defaultSelect3;
				this.isIndeterminate3 = false;
			},
			handleCheckedChange3(value) {
				let checkTeacherCol3 = value.length;
				this.teacherCheck3 = checkTeacherCol3 === this.checkAllList3.length;
				this.isIndeterminate3 = checkTeacherCol3 > 0 && checkTeacherCol3 < this.checkAllList3.length;
			},
			handleCheckAllChange4(val) {
				this.checkTeacherCol4= val ? this.checkAllList4 : this.defaultSelect4;
				this.isIndeterminate4 = false;
			},
			handleCheckedChange4(value) {
				let checkTeacherCol4 = value.length;
				this.teacherCheck4 = checkTeacherCol4 === this.checkAllList4.length;
				this.isIndeterminate4 = checkTeacherCol4 > 0 && checkTeacherCol4 < this.checkAllList4.length;
			},
			getGrade() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeListAuthority',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.gradeOption=data.list;
				})
			},
			//班级
			getClass() {
				let that = this;
				getCommHttpData({
					url: 'common/queryClassListAuthority',
					method: 'get',
					contentType: 1,
					data: {
						gradeId:this.topForm.gradeId
					}
				}, function(data) {
					that.classOption=data.list;
				})

			},
			//改变年级
			changeGrade(){
				if(this.topForm.gradeId&&this.topForm.gradeId!=''){
					this.getClass();
				}
				this.topForm.classId=''
				this.getDataList()
			},
			//列表
			getDataList() {
				this.listLoading = true				
				let startDate = !this.datapicker||this.datapicker.length == 0 ? undefined : this.datapicker[0];
				let endDate = !this.datapicker||this.datapicker.length == 0 ? undefined : this.datapicker[1];
				let keywords = this.keywords.length == 0 ? undefined : this.keywords;
				let that = this
				getCommHttpData({
					url: 'stu/basicInfo/getStuList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: "",
						gradeId:this.topForm.gradeId,
						classId:this.topForm.classId,
						startDate: startDate,
						endDate:endDate,
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getDataList()
						}
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.listLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.choseList = val;
			},
			//反选
			getRowKey(row) {
				return row.id
			},
			//下载表格
			downLoad(tempFile){
				let startDate = this.datapicker.length == '' ? '' : this.datapicker[0];
				let endDate = this.datapicker.length == '' ? '' : this.datapicker[1];
				let gradeId = this.topForm.gradeId;
				let classId = this.topForm.classId;
				let keywords = this.keywords;
				let schoolId = this.schoolId;
				this.$confirm('您确定导出文件吗?', '系统提示', {
				      confirmButtonText: '确定',
				      cancelButtonText: '取消',
				      type: 'warning'
				    }).then(() => {
						window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+
						'stu/basicInfo/downloadStuInfo?excelType=xlsx&excelName='+this.GLOBAL.getOrgName() + '学生信息表&schoolId='+
						this.schoolId+'&keywords='+keywords+'&startDate='+startDate+'&endDate='+endDate+'&classId='+classId+'&gradeId='+gradeId+tempFile));
						this.dialogExportVisible = false
				    }).catch(() => {
				      this.$message({
				        type: 'info',
				        message: '已取消'
				      });
				    });
				// getExportFile(this,'stu/basicInfo/downloadStuInfo',{
				// 	excelName:this.GLOBAL.getOrgName()+'学生信息表',schoolId:this.schoolId,keywords:keywords,startDate :startDate , endDate:endDate,classId:classId,gradeId:gradeId})
            },
            
            downloadByChoise() {
                let url = this.baseUrl + 'stu/basicInfo/downloadStuInfo' + '?excelType=xlsx&excelName=' + this.GLOBAL.getOrgName()+'学生信息表' + '&schoolId=' + this.schoolId + '&stuIds=' + this.delId.join()
                window.location.href = url
                this.delVisible = false
            },
			getExportTitle(type){
				this.handleCancel()				
				let that = this
				getCommHttpData({
					url: 'common/queryFieldName',
					method: 'post',
					contentType: 2,
					data:{
						"mouldType":2
					}
				}, res => {
					if (res.code == 0) {
						that.basicList = res.list[0];
						that.basicList1 = res.list[1];
						that.basicList2 = res.list[2];
						that.basicList3 = res.list[3];
						that.basicList4 = res.list[4];
						let dataList = that.basicList.dataList
						let dataList1 = that.basicList1.dataList
						let dataList2 = that.basicList2.dataList
						let dataList3 = that.basicList3.dataList
						let dataList4 = that.basicList4.dataList
						dataList.forEach(item=>{
							that.checkAllList.push(item)
							if(item.must == 1){
								that.checkTeacherCol.push(item)
								that.defaultSelect.push(item)
								that.isIndeterminate= true;
							}
						})
						dataList1.forEach(item=>{
							that.checkAllList1.push(item)
							if(item.must == 1){
								that.checkTeacherCol1.push(item)
								that.defaultSelect1.push(item)
								that.isIndeterminate1= true;
							}
						})
						dataList2.forEach(item=>{
							that.checkAllList2.push(item)
							if(item.must == 1){
								that.checkTeacherCol2.push(item)
								that.defaultSelect2.push(item)
								that.isIndeterminate2= true;
							}
						})
						dataList3.forEach(item=>{
							that.checkAllList3.push(item)
							if(item.must == 1){
								that.checkTeacherCol3.push(item)
								that.defaultSelect3.push(item)
								that.isIndeterminate3= true;
							}
						})
						dataList4.forEach(item=>{
							that.checkAllList4.push(item)
							if(item.must == 1){
								that.checkTeacherCol4.push(item)
								that.defaultSelect4.push(item)
								that.isIndeterminate4= true;
							}
						})
						that.dialogExportVisible = true;
						that.exportTitle = type == 1 ? '选择下载列' : '选择导出列';
					}
				})
			},

			getExportFile1() {
				
				let columns = [...this.checkTeacherCol,...this.checkTeacherCol1,...this.checkTeacherCol2,...this.checkTeacherCol3,...this.checkTeacherCol4]
				let tempFile = ''
				columns.forEach(item=>{
					tempFile+='&fieldName='+item.fieldName
				})
				if(this.exportTitle == '选择下载列'){
						window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'stu/basicInfo/downloadStuModel?excelName=学生信息导入模板&excelType=xlsx'+tempFile));
						this.dialogExportVisible = false
				}else{
					this.downLoad(tempFile)
				}
			},
			//模板下载
			baseLoad(){
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'stu/basicInfo/downloadStuModel?excelName=学生信息导入模板&excelType=xlsx'));
				//getExportFile(this,'stu/basicInfo/downloadStuModel',{excelName:'学生信息导入模板'})
			},
			//删除提示
			showDelete(row, name, only, item){
				if (only) {
                    this.isOnly = true
                    this.tempRow = item
				}
				if(row && row.length > 0){
					this.delVisible = true;
					this.delName = '';
					this.delId = [];
					if(name){
						this.delName = name;
						this.delId = row;
					}else{
						let arr = [];
						let ids = [];
						for(let i in row){
							arr.push(row[i].stuName)
							ids.push(row[i].stuId)
						}
						this.delName = arr.toString()
						this.delId = ids
					}
				}else {
					this.$message.closeAll()
					this.$message({
						type: 'error',
						message: '请选择'
					});
				}
			},

			goDelete() {
				this.isConfirm = true
			},
			routerEdit() {
				this.$router.push({
					name:'edit-register',
					query: {
						stuId : this.delId[0]
					}
				})
			},
			//确定删除
			theDelete(){
				if (this.isKnow) {
					let that = this;
					getCommHttpData({
						url: 'stu/basicInfo/delete?stuIds=' + this.delId.join(),
						method: 'get',
						contentType: 2,
					}, res => {
                        if(res.code == 0) {
							that.$message.success('删除成功');
						}
						that.delVisible=false;
						that.getDataList()
                    })
				}
			},
			// 批量导入
			batchHandle() {
				this.batchVisible = true
				this.$nextTick(() => {
					this.$refs.batchData.init()
				})
			},
			//批量确定
			getup(){
				this.batchVisible=false;
				this.getDataList()
            },
            
            baseLink(item, num) {
                if (num == 1) {
                    this.$router.push( { name : 'edit-register', query : { stuId : item.stuId } } )
                }else if (num == 2) {
                    this.$router.push( { name : 'stu-add-change', query : { operate : { stuName : item.stuName, stuId : item.stuId } } } )
                }
            }
		}
	}
</script>

<style lang="scss" scoped>
	.stu-register{
		.el-button+.el-button{
		margin-left: 0;
		}
		.el-button{
			white-space:pre-wrap
		}
		.el-form-item{
			margin-bottom:10px
		}
	}
	.problem-list{
		li{
			display: flex;
			line-height: 28px;
		}
		.wrong-tip{
			width: 240px;
		}
		.dialog-problem-operate{
			color: #3C85EE;
			cursor: pointer;
			&:hover{
				color: #3C85EE;
			}
			text-decoration: underline;
		}
	}
	.confirm-delete{
		padding-left: 20px;
	}
	.confirm-delete .el-icon-warning{
		color: #cc2525;
		font-size: 16px;
	}
	.delete-person-name{
		display: flex;
		.name-detail{
			max-width: 300px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			padding: 0 5px;
			font-weight: bold;
		}
		margin-bottom: 10px;
		font-size: 12px;
		.el-icon-d-arrow-right{
			color: #1ABCAD;
		}
    }
    .search-input-stu{
        width: 200px;
    }
    @media screen and (max-width: 1280px) {
    .xs-mini{
        /deep/ .el-button{
            padding: 7px 15px;
            font-size: 12px;
            border-radius: 3px;
        }
        float: left;
    }
    .search-input-stu{
        width: 100px;
    }
}
	#scrool-class {
		border-top: 1px solid #CCCCCC;
		.class-title {
			line-height: 40px;
			padding-top: 10px;
			font-size: 16px;
		}
		.el-checkbox-group {
			overflow: hidden;
			padding-left: 15px;
			padding-right: 15px;
			padding-bottom: 20px;
			// margin-bottom: 10px;
			margin: 0.9375rem;
			margin-top: 0;
		}
		.checkbox-border{
			border-bottom: 1px solid #CCCCCC;
		}
		&::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/
		        width:10px;  
		        height:10px;  
		}
		&::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
		    background: #ccc;
		}
		&::-webkit-scrollbar-track {/*滚动条里面轨道*/
		        background: #F0F0F0;
		    }
	}
	
</style>

<style lang="scss">
.delete-person-dialog{
	.el-dialog__body{
		padding: 10px 20px;
	}
}
.delete-name-tip{
    max-width: 420px;
}
</style>
