<template>
	<div class="teachers_manage_retire">
		<!--<date-analysis @refreshChartsData="getDataList"></date-analysis>-->
		<!-- <el-date-picker style="margin-bottom: 10px;" v-model="datapicker" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="getDataList" value-format="yyyy-MM-dd">
		</el-date-picker> -->
		<el-card class="blue-shadow">
			<el-input v-model="keywords" clearable style="width:300px;margin-bottom: 10px;" placeholder="姓名/手机号/身份证号/邮箱/教籍号"><i
				 slot="prefix" class="el-input__icon el-icon-search"></i></el-input>

			<div class="right xs-mini" style="margin-bottom: 10px;">
				<!-- <el-button type="primary" @click="$router.push({name:'teach-entry-data',query:{type:0,leaveType:1}, params: {id: ''}})">添加教师</el-button> -->
				<el-button type="primary" @click="$router.push({name: 'teach-manage-add',query:{type:0}, params: {id: ''}})">添加教师</el-button>
				<el-button type="primary" @click="batchHandle()">批量导入</el-button>
				<!-- <el-button type="primary" @click="getExportFile">模板下载</el-button> -->
				<el-button type="primary" @click="getExportTitle(2)">导出</el-button>
				<!-- <el-button type="primary" @click="getExportList">导出</el-button> -->
				<el-button type="danger" @click="showDelete(choseList)">批量删除</el-button>
			</div>

			<el-table ref="singleTable" :data="dataList" @selection-change="selectionChangeHandle" fit border v-loading="listLoading"
			 element-loading-text="拼命加载中" highlight-current-row style="width:100%;margin-top:10px">
				<el-table-column type="selection" header-align="center" align="center" width="50" :selectable="checkSelectable">
				</el-table-column>
				<el-table-column type="index" label="序号" align="center" width="50">
					<template slot-scope="scope">
						{{scope.$index+1+pageSize*(pageIndex-1)}}
					</template>
				</el-table-column>
				<el-table-column property="teacherName" label="姓名" align="center">
					<!--<template slot-scope="scope">
						<router-link :to="{name:'teach-manage-look',query:{teacherId:scope.row.teacherId},params:{teacherId:scope.row.teacherId}}" style="text-decoration: none;">
							{{scope.row.teacherName}}
						</router-link>
					</template>-->
				</el-table-column>
				<el-table-column property="telPhone" label="手机号" align="center"></el-table-column>
				<el-table-column property="email" label="邮箱" align="center" width="180"></el-table-column>
				<el-table-column property="identityNum" label="身份证号" align="center" width="180"></el-table-column>
				<el-table-column property="teacherNum" label="教籍号" align="center" width="180"></el-table-column>
				<!-- <el-table-column property="enterDate" label="入职时间" align="center"></el-table-column> -->
				<el-table-column prop="sex" label="性别" align="center" width="60">
					<template slot-scope="scope">
						<span v-if="scope.row.sex == 0">男</span>
						<span v-if="scope.row.sex == 1">女</span>
					</template>
				</el-table-column>
				<el-table-column prop="nativePlace" label="籍贯" align="center" width="200"></el-table-column>
				<el-table-column property="birthday" label="出生日期" align="center"></el-table-column>
				<el-table-column property="teacherTypecodeName" label="教职工类别" align="center"></el-table-column>

				<el-table-column fixed="right" label="操作" align="center" min-width="200">
					<template slot-scope="scope">
						<router-link :to="{name:'teach-manage-add',query:{type:1,teacherId:scope.row.teacherId}}" style="text-decoration: none;">

						</router-link>
						<el-button type="text" size="small" @click="baseLink(scope.row, 1)">完善信息</el-button>
						<template v-if="scope.row.userId == userId">
							<div title="您不可修改自己的状态" style="display: inline-block;">
								&nbsp;&nbsp;
								<el-button type="text" size="small" disabled>离职</el-button>
								<el-button type="text" size="small" disabled>退休</el-button>
								<el-button type="text" size="small" class="btn-text-color-red" disabled>删除</el-button>
							</div>
						</template>
						<template v-else>
							<el-button type="text" size="small" @click="baseLink(scope.row, 2)">离职</el-button>
							<el-button type="text" size="small" @click="baseLink(scope.row, 3)">退休</el-button>
							<el-button type="text" size="small" class="btn-text-color-red" @click="showDelete([scope.row.teacherId], scope.row.teacherName, 1, scope.row)">删除</el-button>
						</template>

					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
				 :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>

		<!-- 弹窗, 新增 / 修改 -->
		<batch-data :type="2" v-if="batchVisible"  ref="batchData" @exportExcel="getExportTitle(1)" @refreshDataList="getDataList"></batch-data>


		<el-dialog title="删除" :visible.sync="delVisible" width="500px" custom-class="delete-person-dialog">
			<div class="delete-person-name" v-if="!isOnly">
				<div>已选择</div>
				<div class="name-detail">{{delName}}</div>
				<div v-if="choseList.length > 7">等</div>
				<div>{{choseList.length}}名教师。</div>
				<el-tooltip class="item" v-if="choseList.length > 8" effect="dark" :content="delName" placement="bottom-end"
				 popper-class="delete-name-tip">
					<div class="el-icon-d-arrow-right"></div>
				</el-tooltip>

			</div>
			<div class="delete-wrapper" v-show="!isConfirm">
				<div style="font-weight:bold;">您是否存在以下情况：</div>
				<ul class="problem-list">
					<li>
						<div class="wrong-tip"><span>1.</span>添加的教师信息有误。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate" @click="downloadByChoise">批量更新教师信息</div> -->
						<div v-if="!isOnly">请在列表页编辑教师信息</div>
						<div v-else class="dialog-problem-operate" @click="routerEdit">编辑教师信息</div>
					</li>
					<li>
						<div class="wrong-tip"><span>2.</span>教师已离职。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate">全部置为离职教师</div> -->
						<div v-if="!isOnly">请在列表页置为离职教师</div>
						<div v-else class="dialog-problem-operate" @click="baseLink(tempRow, 2)">置为离职教师</div>
					</li>
					<li>
						<div class="wrong-tip"><span>3.</span>教师已退休。</div>
						<!-- <div v-if="!isOnly" class="dialog-problem-operate">全部置为退休教师</div> -->
						<div v-if="!isOnly">请在列表页置为退休教师</div>
						<div v-else class="dialog-problem-operate" @click="baseLink(tempRow, 3)">置为退休教师</div>
					</li>
				</ul>
			</div>

			<div class="confirm-delete" v-show="isConfirm">
				<div>
					<span class="el-icon-warning"></span>
					<span style="padding-left:5px;">删除后会同时删除与教师相关的信息</span>
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
		<!-- 选择导出列 -->
		<template v-if="dialogExportVisible">
			<el-dialog :title="exportTitle" :visible.sync="dialogExportVisible" width="30%">
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
						<el-col v-for="item in basicList2.dataList" :span="12" style="margin-top: 10px;">
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
	import {
		getCommHttpData,
		getCommonDictByType,
		deleteData,
		getExportFile
	} from '@/utils/common'
	import BatchData from './batch-data'
	import DateAnalysis from '../common/date-analysis'
	export default {
		data() {
			return {
				exportTitle:'',
				teacherCheck: false,
				teacherCheck1: false,
				teacherCheck2: false,
				dialogExportVisible: false,
				checkTeacherCol: [],
				checkTeacherCol1: [],
				checkTeacherCol2: [],
				isIndeterminate: false,
				isIndeterminate1: false,
				isIndeterminate2: false,
				checkAllList:[],
				checkAllList1:[],
				checkAllList2:[],
				basicList:null,
				basicList1:null,
				basicList2:null,
				defaultSelect:[],
				defaultSelect1:[],
				defaultSelect2:[],
				schoolId: this.GLOBAL.getOrgId(),
				userId: this.GLOBAL.getUserId(),
				// termId: this.GLOBAL.getTermId(),
				// schoolYearId: this.GLOBAL.getYearId(),
				datapicker: [],
				keywords: '',
				termId: '',
				schoolYearId: '',
				roleTeam: [],
				theRole: undefined,
				msg: '',
				dialogFormVisible: false,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				loading: false,
				leaschoolId: '',
				names: [],
				theupdata: false,
				listLoading: true,
				form: {
					name: '',
					outData: '',
					outAdd: ''
				},
				forms: {
					name: '',
					outData: '',
					theType: '',
					outReson: '',
					leaschoolId: '',
					quitType: '',
					teacherId: '',
					userId: '',
				},
				formLabelWidth: '120px',
				rules: {
					name: [{
						required: true,
						message: '请选择类型',
						trigger: 'blur'
					}],
					outData: [{
						required: true,
						message: '请选择姓名',
						trigger: 'change'
					}],
				},
				teacherIdList: [],
				batchVisible: false,

				delVisible: false,
				isOnly: false,
				isKnow: '',
				isConfirm: false,
				delName: '',
				choseList: [],
				delId: [],
				baseUrl: window.SITE_CONFIG.baseUrlMedia,
				tempRow: {},
			}
		},
		components: {
			BatchData,
			DateAnalysis
		},
		watch: {
			keywords(val) {
				this.getDataList()
			},
			delVisible(n) {
				if (!n) {
					this.isConfirm = false
					this.isKnow = ''
					this.isOnly = false
				}
			}
		},
		mounted() {
			this.getDataList()
		},

		methods: {
			handleCancel(){
				this.teacherCheck=false;
				this.teacherCheck1=false;
				this.teacherCheck2=false;
				this.dialogExportVisible = false;
				this.checkTeacherCol= [];
				this.checkTeacherCol1= [];
				this.checkTeacherCol2= [];
				this.isIndeterminate= false;
				this.isIndeterminate1= false;
				this.isIndeterminate2= false;
				this.checkAllList=[]
				this.checkAllList1=[]
				this.checkAllList2 = []
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
				this.checkTeacherCol2 = val ? this.checkAllList2 : this.defaultSelect;
				this.isIndeterminate2 = false;
			},
			handleCheckedChange2(value) {
				let checkTeacherCol2 = value.length;
				this.teacherCheck2 = checkTeacherCol2 === this.checkAllList2.length;
				this.isIndeterminate2 = checkTeacherCol2 > 0 && checkTeacherCol2 < this.checkAllList2.length;
			},
			checkSelectable(row) {
				return row.userId != this.userId
			},
			// 多选
			selectionChangeHandle(val) {
				this.choseList = val
			},
			dateFormat(row, column, cellValue, index) {
				const timeFormat = row[column.property].substring(0, 10);
				return timeFormat
			},
			getDataList() {
				let that = this
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				let startDate, endDate
				if (this.datapicker != null && this.datapicker.length == 2) {
					startDate = this.datapicker[0]
					endDate = this.datapicker[1]
				}

				getCommHttpData({
					url: 'teacherManage/queryList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: '',
						schoolId: this.schoolId,
						keywords: this.keywords,
						startTime: startDate,
						endTime: endDate
					}
				}, function(data) {
					if (data && data.code == 0) {
						if (data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getDataList()
						}
						that.listLoading = false
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
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
			getbullet() {
				this.dialogFormVisible = true;
				this.form.name = '';
				this.form.outData = '';
				this.form.outAdd = '';
				this.getNames()
			},
			getNames(query) {
				if (query !== '') {
					this.loading = true;
					this.$http({
						url: this.$http.adornUrl('/cms/teacherList/getTeacherBySchool'),
						method: 'post',
						data: this.$http.adornData({
							'teacherName': query,
							'schoolId': this.schoolId,
							'schoolYearId': this.schoolYearId,
							'termId': this.termId,
						})
					}).then(({
						data
					}) => {
						this.loading = false;
						this.names = data.list;
					});
				}
			},
			saveLeave() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$http({
							url: this.$http.adornUrl('/cms/teacherMge/leave'),
							method: 'post',
							data: this.$http.adornData({
								'schoolId': this.schoolId,
								'state': 1,
								'teacherId': this.form.name,
								'quitDate': this.form.outData,
								'leaveState': 2,
								'remark': this.form.outAdd,
							})
						}).then(({
							data
						}) => {
							if (data.code == 0) {
								this.$message({
									type: 'success',
									message: '保存成功!'
								})
							}
							this.getDataList()
						});
						this.dialogFormVisible = false
					}
				})
			},
			goChange(row) {
				this.theupdata = true;
				this.forms.name = row.Name;
				this.forms.outData = row.quitDate;
				this.forms.theType = row.dictName;
				this.forms.outReson = row.quitReason;
				this.forms.leaschoolId = row.leaschoolId;
				this.forms.quitType = row.quitType;
				this.forms.teacherId = row.teacherId;
				this.forms.userId = row.userId
			},
			updataLeave() {
				this.$refs['forms'].validate((valid) => {
					if (valid) {
						this.$http({
							url: this.$http.adornUrl('/cms/teacherMge/upateLeave'),
							method: 'post',
							data: this.$http.adornData({
								leaschoolId: this.forms.leaschoolId,
								leaveState: 2,
								quitDate: this.forms.outData,
								remarks: this.forms.outAdd,
								state: 1,
								teacherId: this.forms.teacherId,
							})
						}).then(({
							data
						}) => {
							this.theupdata = false;
							this.getDataList()
						});
					}
				})
			},
			// 批量导入
			batchHandle() {
				this.batchVisible = true
				this.$nextTick(() => {
					this.$refs.batchData.init()
				})
			},
			refreshDataList() {
				this.getDataList()
			},
			getExportTitle(type){				
				this.handleCancel()
				let that = this
				getCommHttpData({
					url: 'common/queryFieldName',
					method: 'post',
					contentType: 2,
					data:{
						"mouldType":1
					}
				}, res => {
					if (res.code == 0) {
						that.basicList = res.list[0];
						that.basicList1 = res.list[1];
						that.basicList2 = res.list[2];
						let dataList = that.basicList.dataList
						let dataList1 = that.basicList1.dataList
						let dataList2 = that.basicList2.dataList
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
						that.dialogExportVisible = true;
						that.exportTitle = type == 1 ? '选择下载列' : '选择导出列';
					}
				})
			},
			//下载模板
			getExportFile1() {
				let columns = []
				 columns= [...this.checkTeacherCol,...this.checkTeacherCol1,...this.checkTeacherCol2]
				let tempFile = ''
				columns.forEach(item=>{
					tempFile+='&fieldName='+item.fieldName
				})
				if(this.exportTitle == '选择下载列'){
						window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia +
							'teacherManage/teacherInfoModel?excelName=教师信息导入模板&excelType=xlsx&schoolId=' + this.schoolId+tempFile));
							this.dialogExportVisible = false
				}else{
					this.getExportList(tempFile)
				}
			},

			getExportList(tempFile) {
				let keywords = this.keywords == undefined ? '' : this.keywords;
				let startDate = '',
					endDate = ''

				if (this.datapicker != null && this.datapicker.length == 2) {
					startDate = this.datapicker[0]
					endDate = this.datapicker[1]
				}
				this.$confirm('您确定导出文件吗?', '系统提示', {
				      confirmButtonText: '确定',
				      cancelButtonText: '取消',
				      type: 'warning'
				    }).then(() => {
						window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+
						'teacherManage/downloadTeacherInfo?excelType=xlsx&excelName='+this.GLOBAL.getOrgName() + '教师信息表'+
						'&schoolId='+this.schoolId+'&keywords='+keywords+'&startDate='+startDate+'&endDate='+endDate+tempFile));
						this.dialogExportVisible = false
				    }).catch(() => {
				      this.$message({
				        type: 'info',
				        message: '已取消'
				      });
				    });
			},

			goDelete() {
				this.isConfirm = true
			},

			routerEdit() {
				this.$router.push({
					name: 'teach-manage-add',
					query: {
						type: 1,
						teacherId: this.delId[0]
					}
				})
			},

			downloadByChoise() {
				let url = this.baseUrl + 'teacherManage/downloadTeacherInfo' + '?excelType=xlsx&excelName=' + this.GLOBAL.getOrgName() +
					'教师信息表' + '&schoolId=' + this.schoolId + '&teaIds=' + this.delId.join()
				window.location.href = url
				this.delVisible = false
			},

			showDelete(row, name, only, item) {
				if (only) {
					this.isOnly = true
					this.tempRow = item
				}
				if (row && row.length > 0) {
					this.delVisible = true;
					this.delName = '';
					this.delId = [];
					if (name) {
						this.delName = name;
						this.delId = row;
					} else {
						let arr = [];
						let ids = [];
						for (let i in row) {
							arr.push(row[i].teacherName)
							ids.push(row[i].teacherId)
						}
						this.delName = arr.toString()
						this.delId = ids
					}
				} else {
					this.$message.closeAll()
					this.$message({
						type: 'error',
						message: '请选择'
					});
				}
			},

			//确定删除
			theDelete() {
				if (this.isKnow) {
					let that = this;
					getCommHttpData({
						url: 'teacherManage/delete?teaIds=' + this.delId.join(),
						method: 'get',
						contentType: 2
					}, res => {
						if (res.code == 0) {
							that.$message.success('删除成功');
						}
						that.delVisible = false;
						that.getDataList()
					})
				}
			},

			baseLink(item, num) {
				let params = {
					teacherName: item.teacherName,
					teacherId: item.teacherId,
					schoolId: item.schoolId
				}
				if (num == 1) {
					this.$router.push({
						name: 'teach-manage-add',
						query: {
							type: 1,
							teacherId: item.teacherId
						}
					})
				} else if (num == 2) {
					this.$router.push({
						name: 'teach-leave-data',
						query: {
							operate: params
						}
					})
				} else {
					this.$router.push({
						name: 'teach-retire-data',
						query: {
							operate: params
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.delete-person-name {
		display: flex;

		.name-detail {
			max-width: 300px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			padding: 0 5px;
			font-weight: bold;
		}

		margin-bottom: 10px;
		font-size: 12px;

		.el-icon-d-arrow-right {
			color: #3C85EE;
		}
	}

	.confirm-delete {
		padding-left: 20px;
	}

	.confirm-delete .el-icon-warning {
		color: #cc2525;
		font-size: 16px;
	}

	.problem-list {
		li {
			display: flex;
			line-height: 28px;
		}

		.wrong-tip {
			width: 240px;
		}

		.dialog-problem-operate {
			color: #3C85EE;
			cursor: pointer;

			&:hover {
				color: #13887d;
			}

			text-decoration: underline;
		}
	}

	@media screen and (max-width: 1280px) {
		.xs-mini {
			/deep/ .el-button {
				padding: 7px 15px;
				font-size: 12px;
				border-radius: 3px;
			}
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
	.delete-person-dialog {
		.el-dialog__body {
			padding: 10px 20px;
		}
	}

	.delete-name-tip {
		max-width: 420px;
	}
</style>
