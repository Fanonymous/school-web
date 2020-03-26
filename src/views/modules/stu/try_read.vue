<template>
	<div class="try_read">
		<el-card class="blue-shadow">
			<year-term ref="yearTerm" @refreshDataList="refreshDataList"></year-term>
			<el-select v-model="stuChangeType" clearable placeholder="请选择类型" style="width:150px" @change="getType">
				<el-option v-for="item in typeOption" :key="item.value" :label="item.dictName" :value="item.value">
				</el-option>
			</el-select>
			<el-input v-model="msg" @input="getDataList" style="width:300px" placeholder="请输入姓名/用户名/用户拼音查询"></el-input>
			<el-button type="primary" icon="el-icon-download" style="border:none;margin-left:10px;">导出</el-button>
			<el-button type="primary" icon="el-icon-plus" style="float: right;" @click="theAdd">添加</el-button>
			<el-table ref="singleTable" :data="dataList" highlight-current-row style="width: 100%;margin-top: 10px;">
				<el-table-column type="index" label="序号" align="center" width="80">
				</el-table-column>
				<el-table-column property="loginName" label="用户名" align="center">
				</el-table-column>
				<el-table-column property="stuName" label="姓名" align="center">
				</el-table-column>
				<el-table-column property="sex" label="性别" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.sex === 0" size="small">男</span>
						<span v-else size="small" type="danger">女</span>
					</template>
				</el-table-column>
				<el-table-column property="stuChangeTypeName" label="异动类型" align="center">
				</el-table-column>
				<el-table-column property="bGradeClassName" label="原级届班级" align="center">
				</el-table-column>
				<el-table-column property="aGradeClassName" label="现级届班级" align="center">
				</el-table-column>
				<el-table-column property="createDate" :formatter="dateFormat" label="时间" align="center">
				</el-table-column>
				<el-table-column property="stuChangeCause" label="异动原因" align="center">
				</el-table-column>
				<el-table-column property="stuChangeStateName" label="状态" align="center">
				</el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
						<el-button v-if="scope.row.stuChangeState==2" @click="outClick(scope.row)" type="text" size="small">退学</el-button>
						<el-button v-if="scope.row.stuChangeState==2" @click="goClick(scope.row)" type="text" size="small">转正</el-button>
						<span v-else>/</span>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
		<el-dialog title="试读管理--添加" :visible.sync="dialogFormVisible">
			<el-form :model="form" :rules="rules" ref="tryForm">
				<el-form-item label="学生" :label-width="formLabelWidth" prop="checkedName">
					<el-tag :key="tag" style="margin-right:10px" v-for="tag in form.checkedName" v-model="form.checkedName" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag.stuName}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showBullet" icon="el-icon-plus"></el-button>
				</el-form-item>
				<el-form-item label="试读类别" :label-width="formLabelWidth" prop="changeVal">
					<el-select v-model="form.changeVal" clearable placeholder="请选择试读类别" style="width:150px" @change="getType">
						<el-option v-for="item in typeOption" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="试读级届班级" :label-width="formLabelWidth" prop='sid'>
					<el-select v-model="form.sid" clearable placeholder="请选择学段" style="width:150px" @change="bulletSection">
						<el-option v-for="item in sectOption" :key="item.sid" :label="item.sname" :value="item.sid">
						</el-option>
					</el-select>
					<el-select v-model="form.id" clearable placeholder="请选择级届" style="width:150px" @change="bulletClass">
						<el-option v-for="item in gradeOption" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
					<el-select v-model="form.classId" clearable placeholder="请选择班级" style="width:150px" @change="bulletClass">
						<el-option v-for="item in classOption" :key="item.classId" :label="item.className" :value="item.classId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="试读原因" :label-width="formLabelWidth">
					<el-input type="textarea" :rows="2" style="width:400px;" placeholder="请输入试读原因" v-model="changeReson">
					</el-input>
				</el-form-item>
				<el-form-item label="试读时间" :label-width="formLabelWidth" prop="value1">
					<el-date-picker v-model="form.value1" type="date" value-format='yyyy-MM-dd' placeholder="选择日期">
					</el-date-picker>
				</el-form-item>

			</el-form>
			<el-dialog width="35%" title="系统提示：" :visible.sync="innerVisible" append-to-body>
				<el-select v-model="form.sid" clearable placeholder="请选择学段" style="width:150px" @change="bulletSection">
					<el-option v-for="item in sectOption" :key="item.sid" :label="item.sname" :value="item.sid">
					</el-option>
				</el-select>
				<el-select v-model="form.id" clearable placeholder="请选择级届" style="width:150px" @change="bulletClass">
					<el-option v-for="item in gradeOption" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
				<el-select v-model="form.classId" clearable placeholder="请选择班级" style="width:150px" @change="bulletClass">
					<el-option v-for="item in classOption" :key="item.classId" :label="item.className" :value="item.classId">
					</el-option>
				</el-select>
				<el-input v-model="keyWord" style="margin-top: 20px;padding-bottom: 15px;" @input="getName" placeholder="请输入姓名/用户名/用户拼音查询"></el-input>
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
				<div style="margin: 15px 0;padding-left: 20px;"></div>
				<el-checkbox-group v-model="form.checkedName" @change="handleCheckedCitiesChange">
					<el-checkbox v-for="item in nameOption" :label="item" :key="item">{{item.stuName}}</el-checkbox>
				</el-checkbox-group>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="litBullet">确 定</el-button>
					<el-button @click="innerVisible = false">取 消</el-button>
				</div>
			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="lastSubmit ">确 定</el-button>
				<el-button @click="dialogFormVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import YearTerm from '../common/yearterm'
	import YearTermForm from '../common/yearterm-form'
	import Grade from '../common/grade'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				sectOption: [],
				stuChangeType: '',
				schoolYearId: '',
				termId: '',
				typeOption: [],
				checkAll: false,
				nameOption: [],
				gradeOption: [],
				classOption: [],
				changeReson: '',
				msg: '',
				keyWord: '',
				isIndeterminate: true,
				inputVisible: false,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				stuArr: [],
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					changeVal: '',
					sid: '',
					id: '',
					classId: '',
					tag:'',
					value1: '',
					checkedName: [],
				},
				dialogFormVisible: false,
				formLabelWidth: '120px',
				innerVisible: false,
				textarea: '',
				
				rules: {
					checkedName: [{
							required: true,
							message: '请选择姓名',
							trigger: 'blur'
						}],
					changeVal: [{
							required: true,
							message: '请选择试读类别	',
							trigger: 'change'
						}],
					sid:[{
							required: true,
							message: '请选择级届班级',
							trigger: 'change'
						}],
					value1:[{
							required: true,
							message: '请选择日期',
							trigger: 'change'
						}],
				}
			}
		},
		activated() {
			this.getType();
			this.getDataList();
		},
		components: {
			YearTerm,
			YearTermForm,
			Grade
		},
		methods: {
			refreshDataList(paramYearId, paramTermId) {
				this.schoolYearId = paramYearId == undefined ? 0 : paramYearId;
				this.termId = paramTermId == undefined ? 0 : paramTermId;
				this.getType()
			},
			dateFormat(row, column, cellValue, index) {
				const timeFormat = row[column.property].substring(0, 10);
				return timeFormat
			},
			outClick(row) {
				console.log(row);
				this.$confirm('您确认退学吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: this.$http.adornUrl('/cms/stuChange/changeUpdate'),
						method: 'post',
						data: this.$http.adornData({
							aGradeClass: (row.aGradeClass).toString(),
							changeType: "4",
							stuChangeId: row.stuChangeId,
							stuId: row.stuId,
							trimChangeTypeId: "31",
						})
					}).then(({
						data
					}) => {
						if(data.code == 0) {
							this.$message({
								type: 'success',
								message: '退学成功!'
							})
						};
					});
					this.getDataList()

				})
			},
			goClick(row) {
				this.$confirm('您确认转正吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: this.$http.adornUrl('/cms/stuChange/changeUpdate'),
						method: 'post',
						data: this.$http.adornData({
							aGradeClass: (row.aGradeClass).toString(),
							changeType: "4",
							stuChangeId: row.stuChangeId,
							stuId: row.stuId,
							trimChangeTypeId: "98",
						})
					}).then(({
						data
					}) => {
						if(data.code == 0) {
							this.$message({
								type: 'success',
								message: '转正成功!'
							})
						};
					});
					this.getDataList()

				})
			},
			getType() {
				this.$http({
					url: this.$http.adornUrl('/uc/dict/typeChange'),
					method: 'post',
					headers: {
						'Content-type': 'application/x-www-form-urlencoded'
					},
					data: this.$http.adornData({
						type: '1004'
					}, true, 'form'),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(({
					data
				}) => {
					this.typeOption = data.list;
					this.getDataList()
				});

			},
			getDataList() {
				this.dataListLoading = true
				this.$http({
					url: this.$http.adornUrl('/cms/stuChange/changeList'),
					method: 'post',
					data: this.$http.adornData({
						'desc': this.msg,
						'limit': this.pageSize,
						'order': "",
						'page': this.pageIndex,
						'schoolId': this.schoolId,
						'schoolYearId': (this.schoolYearId).toString(),
						'sidx': "",
						'stuChangeClass': "1004",
						'stuChangeType': (this.stuChangeType).toString(),
						'termId': (this.termId).toString()
					})
				}).then(({
					data
				}) => {
					if(data && data.code === 0) {
						this.dataList = data.page.list
						this.totalPage = data.page.totalCount
					} else {
						this.dataList = []
						this.totalPage = 0
					}
					this.dataListLoading = false
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
			showBullet() {
				this.innerVisible = true;
				this.getType();
				this.bulletSection()
			},
			bulletSection() {
				this.$http({
					url: this.$http.adornUrl('/cms/gradeInfo/getSchoolSection'),
					method: 'post',
					data: this.$http.adornData({
						'schoolId': this.schoolId,
					})
				}).then(({
					data
				}) => {
					this.sectOption = data.list;
				});
				this.bulletGrade()
			},
			bulletGrade() {
				this.$http({
					url: this.$http.adornUrl('/cms/stuChange/changeByExam'),
					method: 'post',
					data: this.$http.adornData({
						'commType': 4,
						'queryType': 1,
						'schoolSection': (this.form.sid).toString(),
					})
				}).then(({
					data
				}) => {
					this.gradeOption = data.list;
				});
			},
			bulletClass() {
				this.$http({
					url: this.$http.adornUrl('/cms/stuChange/changeByExam'),
					method: 'post',
					data: this.$http.adornData({
						'commType': 4,
						'queryType': 2,
						'id': (this.form.id).toString(),
						'schoolYearId': (this.schoolYearId).toString()
					})
				}).then(({
					data
				}) => {
					this.classOption = data.list;
				});
				this.getName()
			},
			getName() {
				this.$http({
					url: this.$http.adornUrl('/cms/stuChange/changeByStu'),
					method: 'post',
					data: this.$http.adornData({
						'classId': (this.form.classId).toString(),
						'desc': this.keyWord,
						'gradeClassId': (this.form.id).toString(),
						'schoolYearId': (this.schoolYearId).toString()
					})
				}).then(({
					data
				}) => {
					this.nameOption = data.list;
				});
			},
			handleCheckAllChange(val) {
				this.form.checkedName = val ? this.nameOption : [];
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.nameOption.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.nameOption.length;
			},
			handleClose(tag) {
				this.dynamicTags = this.form.checkedName;
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			litBullet() {
				this.innerVisible = false;
				this.bulletGrade();
			},
			theAdd(){
				this.dialogFormVisible = true;
				this.form.checkedName=[];
				this.nameOption=[];
				this.form.changeVal='';
				this.form.sid='';
				this.form.id='';
				this.form.value1='';
				this.form.classId='';
				this.changeReson=''   
			},
			lastSubmit() {
				this.$refs['tryForm'].validate((valid) => {
				 if (valid) {
						for(var i = 0; i < this.form.checkedName.length; i++) {
							if(this.stuArr.indexOf(this.form.checkedName[i].stuId) == -1) {
								this.stuArr.push(this.form.checkedName[i].stuId)
							}
						}
						this.$confirm('学生学籍异动后立即生效，您确定添加吗？', '提示', {
							cancelButtonText: '取消',
							confirmButtonText: '确定',
							type: 'warning'
						}).then(() => {
							this.$http({
								url: this.$http.adornUrl('/cms/stuChange/changeSave'),
								method: 'post',
								data: this.$http.adornData({
									'classId': (this.form.id).toString(),
									'date': (this.form.value1).toString(),
									'gradeClassId': "25",
									'schoolYearId': (this.schoolYearId).toString(),
									'stuChangeCause': this.changeReson,
									'stuChangeClass': 1004,
									'stuChangeType': (this.form.changeVal).toString(),
									'stuIds': this.stuArr
								})
							}).then(({
								data
							}) => {
								if(data.code == 0) {
									this.$message({
										type: 'success',
										message: '操作成功!'
									})
								};
								this.dialogFormVisible = false;
								this.getDataList()
							});
						});
					}
				 })
			}
		}
	}
</script>
<style scoped lang="scss">
	.el-checkbox-group {
		.el-checkbox {
			margin-left: 30px;
		}
	}
</style>