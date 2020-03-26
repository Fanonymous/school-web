<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<div class="filter-container">
			<el-date-picker v-model="userTime" type="date" :clearable="false" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="getList">
			</el-date-picker>
			<el-button class="fr" style='margin-bottom:20px' type="primary" icon="el-icon-plus" @click="handleCreate" :loading="false">添加</el-button>
		</div>
		<el-row :gutter="12" style="margin-bottom: 20px;" v-loading="listLoading">
			<el-col :span="8" v-if="list.length >0" v-for="(item, index) in list" style="margin-bottom: 20px;">
				<el-card :body-style="{ padding: '0px' }" class="equip-cont">
					<div class="bottom clearfix" style="margin-bottom: 10px;">
						<el-col :span="8" style="text-align: left;margin:10px 0px 0px 0px;">
							<img src="~@/assets/img/classPic.png" width="100%" />
						</el-col>
						<el-col v-if="item.classList == undefined" :span="16" style="text-align: center;font-size: 14px; line-height: 160px;">
							<el-tag>暂无预约</el-tag>
						</el-col>
						<el-col v-else style="font-size: 14px;min-height: 160px;" :span="16">
							<template v-for="classItem in item.classList">
								<el-tag style="margin: 5px ;" closable @close="deleteData({classroomUseinfoId:classItem.classroom_useinfo_id})">第{{classItem.lession_code}}节：{{classItem.grade_name}}{{classItem.class_name}} </el-tag>
							</template>
						</el-col>
						<el-col :span="24" style="text-align: center;margin-top:10px;font-size: 14px;">
							<span>{{item.classroomName}}</span>
						</el-col>
					</div>
				</el-card>
			</el-col>
			<el-col :span="6" v-if="list.length ==0">
				<el-card :body-style="{ padding: '0px' }" class="equip-cont">
					<img src="~@/assets/img/nothing.png" class="image" style="width:70%;min-width:200px;margin-left: 15%;">
				</el-card>
			</el-col>
		</el-row>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="form" label-position="right" label-width="100px">
				<el-form-item label="教室名称" prop="classroomId">
					<el-select class="filter-item" v-model="form.classroomId">
						<el-option v-for="item in roomOptions" :key="item.classroomId" :label="item.classroomName" :value="item.classroomId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年级">
					<grade ref="grade"></grade>
				</el-form-item>
				<el-form-item label="时间" prop="userTime">
					<el-date-picker v-model="form.userTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :clearable="false" format="yyyy-MM-dd" @change="getLession">
					</el-date-picker>
					<el-select class="filter-item" v-model="form.lessionCode">
						<el-option v-for="item in lessionList" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级" prop="classIdList">
					<el-checkbox-group v-model="form.classIdList">
						<el-checkbox v-for="item in classList" :label="item.classId" :key="item.classId">{{item.className}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="form.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="addLoading">{{$t('table.confirm')}}</el-button>
				<el-button v-else-if="dialogStatus=='update'" type="primary" @click="updateData" :loading="addLoading">{{$t('table.confirm')}}</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData, getDateStr } from '@/utils/common'
	import Grade from '../common/grade'
	export default {
		name: 'exportExcel',
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				schoolYearId: this.GLOBAL.getYearId(),
				termId: this.GLOBAL.getTermId(),
				userTime: '',
				list: [],
				listLoading: false,
				schoolType: '',
				form: {
					classIdList: [],
					classroomId: '',
					gradeId: '',
					lessionCode: '',
					remark: '',
					schoolId: '',
					schoolYearId: '',
					termId: '',
					userTime: ''
				},
				roomOptions: null,
				gradeOptions: null,
				classList: [],
				lessionList: [],
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '添加',
					look: '查看'
				},
				dialogPvVisible: false,
				pvData: [],
				rules: {
					classroomId: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
					userTime: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					classIdList: [{
						type: 'array',
						required: true,
						message: '请选择一个班级',
						trigger: 'change'
					}]
				},
				addLoading: false
			}
		},
		components: {
			Grade
		},
		created() {
			this.userTime = getDateStr(0)
			this.getList();
		},
		methods: {

			getList() {
				this.listLoading = true
				var that = this
				getCommHttpData({
					url: 'cms/classroomUseinfo/getUseinfoList',
					method: 'post',
					serverType: 1,
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						userTime: this.userTime
					}
				}, function(data) {
					that.listLoading = false
					that.list = data.list;
					that.roomOptions = data.list;
					that.form.classroomId = data.list[0].classroomId
				})
			},
			resetTemp() {
				this.form = {
					classIdList: [],
					classroomId: '',
					gradeId: '',
					lessionCode: '',
					remark: '',
					schoolId: this.GLOBAL.getOrgId(),
					schoolYearId: this.GLOBAL.getYearId(),
					termId: this.GLOBAL.getTermId(),
					userTime: getDateStr(0)
				}
			},
			handleCreate() {
				this.resetTemp()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.getLession()
				this.$nextTick(() => {
					let that = this
					getCommHttpData({
						url: 'cms/classInfo/listByGrade',
						method: 'post',
						serverType: 1,
						contentType: 0,
						data: {
							gradeId: this.$refs.grade.gradeId
						}
					}, function(data) {
						that.classList = data.list;
					})
					this.$refs['dataForm'].clearValidate()
				})
			},
			getLession() {
				let that = this
				getCommHttpData({
					url: 'cms/curriculums/curLesson',
					method: 'post',
					serverType: 1,
					contentType: 2,
					data: {
						gradeId: this.$refs.grade.gradeId,
						date: this.form.userTime,
						schoolId: this.schoolId,
						schoolYearId: this.schoolYearId,
						termId: this.termId
					}
				}, function(data) {
					let lessionTemp = new Array()
					for(let i = 1; i <= data.list; i++) {
						lessionTemp.push(i)
					}
					that.lessionList = lessionTemp;
				})
			},
			handleLook(row) {
				this.form = Object.assign({}, row) // copy obj
				this.dialogStatus = 'look'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.form = Object.assign({}, row) // copy obj
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			createData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						this.form.gradeId = this.$refs.grade.gradeId
						this.form.classIdList = this.form.classIdList.toString()
						getCommHttpData({
							url: 'cms/classroomUseinfo/checkUserInfo',
							method: 'post',
							serverType: 1,
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.form
						}, function(data) {
							that.dialogFormVisible = false
							that.getList();
						})

					}
				})
			},
			updateData() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						//      	this.temp.schoolSection = this.temp.schoolSection.toString()
						//        saveUcGrade(this.temp).then(() => {
						//          this.getList();
						//          this.dialogFormVisible = false
						//				this.$message({
						//	            type: 'success',
						//	            message: '操作成功!'
						//	         });
						//        })
					}
				})
			},
			deleteData(delJson) {
				var that = this
				deleteData(this, {
					url: 'cms/classroomUseinfo/del',
					method: 'post',
					serverType: 1,
					contentType: 0,
					operateType: 1,
					data: delJson
				}, function(data) {
					that.getList()
				})
			}
		}
	}
</script>