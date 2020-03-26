<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card class="blue-shadow">
			<div class="filter-container">
				<el-select class="filter-item" v-model="classroomType" clearable @change="getDataList" placeholder="请选择教室类型">
					<el-option v-for="item in sTypeOptions" :key="item.value" :label="item.dictName" :value="item.value">
					</el-option>
				</el-select>
				<el-select class="filter-item" v-model="roomGradeId" clearable @change="getDataList" placeholder="请选择年级">
					<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
					</el-option>
				</el-select>
				<el-button class="fr right" style='margin-bottom:10px' type="primary" @click="handleCreate">添加教室</el-button>
			</div>
			<el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row>
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" class="demo-table-expand">
							<el-form-item label="教室位置">
								<span>{{ props.row.position || '--'}}</span>
							</el-form-item>
							<el-form-item label="负责人">
								<span>{{ props.row.teacherNames  || '--'}}</span>
							</el-form-item>
							<el-form-item label="总座位数">
								<span>{{ props.row.capacity  || '--'}}</span>
							</el-form-item>
							<el-form-item label="有效座位数">
								<span>{{ props.row.setCount  || '--'}}</span>
							</el-form-item>
							<el-form-item label="备注">
								<span>{{ props.row.remark  || '--'}}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column align="center" label='序号' width="95">
					<template slot-scope="scope">
						{{scope.$index+1+pageSize*(pageIndex-1)}}
					</template>
				</el-table-column>
				
				<el-table-column align="center" label="教室名称">
					<template slot-scope="scope">
						{{scope.row.classroomName}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="教室类型">
					<template slot-scope="scope">
						{{scope.row.classroomTypeName}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="班级">
					<!--<template slot-scope="scope">
						{{scope.row.className  || '--'}}
					</template>-->
					
					<template slot-scope="scope">
						<div class="nalist" style="display: inline-block;" v-if="scope.row.classroomType == 1">
							<template v-if="scope.row.className">
								<el-tag>{{scope.row.className}}</el-tag>
								<i style="color:#3C85EE;font-size: 16px;cursor:pointer" class="el-icon-edit" @click="openClass(scope.row)"></i>
							</template>
							<i v-else class="el-icon-circle-plus showAdd" style="color:#3C85EE;font-size: 20px;cursor:pointer;"  @click="openClass(scope.row)"></i>
						</div>
						<div v-else style="color: #CCCCCC;cursor: not-allowed;">功能部室无班级</div>
					</template>
					
					
				</el-table-column>			
				<el-table-column prop="status" header-align="center" align="center" label="是否启用">
					<template slot-scope="scope">
						<!--禁用-->
						<el-switch  active-text="是" :width="50" inactive-text="否"  v-model="scope.row.status" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeStatus(scope.row.classroomId,scope.row.status)">
						<!--启用-->
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" width="150">
					<template slot-scope="scope">
						<!--<el-button type="text" size="small" @click="handleLook(scope.row)">详情</el-button>-->
						<el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
						<el-button type="text" style="color:#f56c6c" size="small" @click="deleteData(scope.row.classroomId)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container fr">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px">
				<el-form-item label="教室名称" prop="classroomName">
					<el-input v-model="dataForm.classroomName" placeholder="请输入教室名称"></el-input>
				</el-form-item>
				<el-form-item label="教室类别" prop="classroomType">
					<el-select class="filter-item" v-model="dataForm.classroomType" >
						<el-option v-for="item in sTypeOptions" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级" prop="gradeId" v-if="dataForm.classroomType !=2">
					<grade ref="grade" :gradeIdp="dataForm.gradeId" @refreshDataList="getGradeId" :require=true ></grade>
					<class ref="classDialog" :gradeId="dataForm.gradeId" :classIdp="dataForm.classId"  @refreshClassList="getClassId" :require=true></class>
				</el-form-item>
				<el-form-item label="教室位置" prop="position">
					<el-input v-model="dataForm.position" placeholder="如XX楼XX层XX室"></el-input>
				</el-form-item>
				<el-form-item label="负责人">
					 <el-select v-model="dataForm.teacherId" :multiple-limit="10" style="width:300px" multiple filterable placeholder="请输入负责人">
					 <!--<el-select v-model="dataForm.teacherId" style="width:300px" placeholder="请输入负责人">-->	
					    <el-option
					      v-for="item in teacherList"
					      :key="item.teacherId"
					      :label="item.teacherName"
					      :value="item.teacherId">
					    </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="总座位数" prop="capacity">
					<el-input-number v-model="dataForm.capacity" :min="0" :max="99999999"></el-input-number>
				</el-form-item>
				<el-form-item label="有效座位数" prop="setCount">
					<el-input-number v-model="dataForm.setCount" :min="0" :max="99999999"></el-input-number>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="dataForm.remark" placeholder="请输入备注"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="addLoading">{{$t('table.confirm')}}</el-button>
				<el-button v-else-if="dialogStatus=='update'" type="primary" @click="createData" :loading="addLoading">{{$t('table.confirm')}}</el-button>
			</div>
		</el-dialog>
		<!--删除-->
		<el-dialog title="删除" :visible.sync="dialogDelete" width="400px">
			<div style="font-size:16px;margin-top:-20px;margin-bottom: 20px;">您确定删除此教室吗?</div>
			<div style="font-size:12px;margin-bottom: 20px;color: #9c9c9c;"><i class="el-icon-warning" style="color: red"></i>&nbsp;删除后会同时删除与教室相关的信息。</div>
			<div><el-checkbox v-model="isChecked"><span style="font-size: 12px;;">我已知晓</span></el-checkbox></div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogDelete=false">取消</el-button>
				<el-button type="primary" :disabled="!isChecked" @click="submitDelete">确定</el-button>
			</div>
		</el-dialog>
		<!--修改班级-->
		<el-dialog title="请选择班级" :visible.sync="dialogClassVisible" width="30%">
			<div id="scrool-class" style="margin-top:-20px;height: 300px;overflow-y: auto;">
				<template v-for="item in gradeClassList">
					<div class="class-title">{{item.gradeName}}</div>
					<el-radio-group style="overflow: hidden;display: block;" v-model="checkClass">
						<el-col :span="6" v-for="item1 in item.classList" style="margin-top: 10px;">
							<el-radio :disabled="item1.isBind ==1" :label="item1.gradeId+'-'+item1.classId">{{item1.className}}</el-radio>
						</el-col>
					</el-radio-group>
				</template>
			</div>
		  <span slot="footer" class="dialog-footer">
		  	<span style="font-size: 12px;color: #C0C4CC;float: left;">置灰的班级:已添加教室</span>
		    <el-button @click="dialogClassVisible = false">取 消</el-button>
		    <el-button type="primary" @click="setClass()">确 定</el-button>
		  </span>
		</el-dialog>
	</div>

</template>
<script>
	import Grade from '../common/grade'
	import Class from '../common/class'
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				gradeClassList:[],
				checkClass:'',
				dialogClassVisible: false,
				isChecked:false,
				dialogDelete: false,
				deleteId:'',
				schoolId: this.GLOBAL.getOrgId(),
				gradeList:[],
				roomGradeId:'',
				addLoading: false,
				dataList: null,
				listLoading: true,
				pageSize: 10,
				pageIndex: 1,
				totalPage: 0,
				classroomType: undefined,
				teacherList:[],
				gradeRequire:false,
				classRequire:false,
				dataForm: {
					classroomId: undefined,
					classroomName: '',
					classroomType: 1,
					classroomTypeName: '',
					gradeId: '',
					classId: '',
					position: '',
					teacherId: [],
					teacherName:'',
					capacity: '',
					setCount: '',
					remark: ''
				},
				sectionOptions: null,
				sTypeOptions: null,
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
					classroomName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					},{
						min: 1,
						max: 20,
						message: '教室名称的长度不能大于20 个字符'
					}],
					classroomType: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					schoolSection: [{
						required: true,
						trigger: 'change'
					}]
				}
			}
		},
		components: {
			Grade,
			Class
		},
		mounted() {
			getCommonDictByType(this, 'classroom_type', 'sTypeOptions')
			
			
			this.getTeacherList()
			this.getDataList();
			this.getGradeData()
		},
		methods: {
			//选择班级
			openClass(row){
				for(var i in this.dataForm) {
					if(row.hasOwnProperty(i)){
						this.dataForm[i] = row[i]
					}
				}
				if(row.gradeId && row.classId){
					this.checkClass = row.gradeId +'-'+row.classId
				}else{
					this.checkClass = ''
				}
				let that = this
				getCommHttpData({
					url: 'eduManageClassroom/getGradeClassList',
					method: 'post',
					contentType: 2,
					data:{}
				}, function(data) {
					if(data && data.code == 0) {
						let tmpList = data.list,
						tmpStr = [],currentList = []
						tmpList.forEach(item=>{
							if(tmpStr.indexOf(item.gradeName) ==-1){
								tmpStr.push(item.gradeName)
								currentList.push({
									gradeName: item.gradeName,
									classList: [item]
								})
							}else{
								let index = tmpStr.indexOf(item.gradeName)
								currentList[index].classList.push(item)
							}
						})
						that.gradeClassList = currentList
						that.dialogClassVisible = true
						tmpList = null
						tmpStr = null
					}
				})
			},
			//设置班级
			setClass(){
				let tmp = this.checkClass.split('-')
				this.dataForm.gradeId = tmp[0]
				this.dataForm.classId = tmp[1]
				let that = this
				getCommHttpData({
					url: 'eduManageClassroom/addAndEdit',
					method: 'post',
					contentType: 2,
					operateType: 3,
					that: this,
					data: this.dataForm
				}, function(data) {
					if(data && data.code == 0){
						that.getDataList();
						that.dialogClassVisible = false
					}
					
				})
			},
			//教师列表
			getTeacherList(){
//				let tmpQuery = query ? query : ''
//				this.tLoading = true
				let that = this
				getCommHttpData({
					url: 'common/queryTeacherList',
					method: 'get',
					contentType: 1,
					data: {schoolId: this.schoolId
					}
				}, function(data) {
					if(data && data.code == 0) {
//						that.tLoading = false
						that.teacherList = data.list
					}
				})
			},
				//查询年级
			getGradeData() {
				var that = this
				getCommHttpData({
					url: 'common/queryGradeList',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
					}
				}, function(data) {
					if(data.code == 0) {
						that.gradeList = data.list
					} else {
						that.gradeList = []
					}
				})
			},
			//年级信息
			getGradeId(gradeId) {
				this.dataForm.gradeId = gradeId;
				this.$refs.classDialog.classList = []
				this.dataForm.classId = ''
			},
			//班级信息
			getClassId(classId) {
				this.dataForm.classId = classId;
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
			//教室列表
			getDataList() {
				let that = this
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				let startDate, endDate
				if(this.datapicker != null && this.datapicker.length == 2) {
					startDate = this.datapicker[0]
					endDate = this.datapicker[1]
				}

				getCommHttpData({
					url: 'eduManageClassroom/getList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: '',
						schoolId: this.schoolId,
						classroomType: this.classroomType,
						gradeId:this.roomGradeId
					}
				}, function(data) {
					if(data && data.code == 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
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
			resetTemp() {
				this.dataForm = {
					classroomId: undefined,
					classroomName: '',
					classroomType: 1,
					gradeId: '',
					classId: '',
					position: '',
					teacherId: [],
					teacherName:'',
					capacity: '',
					setCount: '',
					remark: ''
				}
			},
			//添加-dialog
			handleCreate() {
				this.resetTemp()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			handleLook(row) {
				this.dataForm = Object.assign({}, row) // copy obj
				//this.dataForm.classroomType = this.dataForm.classroomType
				this.dialogStatus = 'look'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.dataForm = Object.assign({}, row) // copy obj
				this.dataForm.teacherId = row.teacherIds ? row.teacherIds.split(',') : []
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			//添加&编辑数据
			createData(type) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						
						let obj = this.sTypeOptions.find((item)=>{//这里的userList就是上面遍历的数据源
					          return item.value === this.dataForm.classroomType;//筛选出匹配数据
					    });
						this.dataForm.classroomTypeName = obj.dictName
						
						let data = {}
						for(var key in this.dataForm){
							if(this.dataForm.hasOwnProperty(key)){
								data[key] = this.dataForm[key]
							}
						}
						let teacherIds = data.teacherId.length > 0 ? data.teacherId.join(','):''
						data.teacherIds = teacherIds
						data.teacherId = ''
						getCommHttpData({
							url: 'eduManageClassroom/addAndEdit',
							method: 'post',
							contentType: 2,
							operateType: 3,
							that: this,
							data: data
						}, function(data) {
							if(data && data.code == 0){
								let dialogStatus = that.dialogStatus
								that.$message({
						        	message: dialogStatus == 'create' ? '添加成功' : '编辑成功',
						        	type: 'success'			       
						    	})
								that.getDataList();
								setTimeout(()=>{
									that.addLoading = false
									that.dialogFormVisible = false
								},500)
								
							}else{
								that.addLoading = false
							}
							
							
						})
					}
				})
			},
			
			//修改状态
			changeStatus(id,status) {
				var that = this
				getCommHttpData({
					url: `eduManageClassroom/updateStatus`,
					method: 'post',
					contentType: 2,
					data: {classroomId:id,status:status}
				}, function(data) {
					that.getDataList()
				})
			},
			submitDelete(){
				let that = this
				getCommHttpData({
					url: 'eduManageClassroom/delete',
					method: 'post',
					contentType: 2,
					operateType: 3,
					data: {
						classroomId:that.deleteId 
					}
				}, function(data) {
					if(data.code == 0){
						that.dialogDelete = false;
						that.deleteId = '';
						that.$message({
				        	message: '删除成功',
				        	type: 'success'			       
				    	})
						that.getDataList()	
					}else{
						that.dialogDelete = false;
						that.deleteId = '';
					}
				})
			},
			//删除教室
			deleteData(delJson) {
				this.isChecked= false;
				this.dialogDelete = true;
				this.deleteId = delJson;
//			  	var that =this
//			    deleteData(this,{url:'cms/classroom/saveOrUpdate',method:'post',serverType:1,contentType:2,operateType:1,data:delJson},function(data){
//			    	that.dialogFormVisible = false
//			    	that.getList()
//				})
			}
		}
	}
</script>
<style>
	.demo-table-expand {
		font-size: 0;
	}
	
	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}
	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	.showAdd{
		display: none;
		
	}
	.el-icon-edit{
		display: none;
	}
	.is-center:hover .el-icon-edit{
		display: inline-block;
		cursor: pointer;
	}
	.is-center:hover .showAdd{
		display: inline-block;
		cursor: pointer;
	}
	.class-title{
		line-height: 40px;
		margin-top: 10px;
		font-size: 16px;
	}
	#scrool-class::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/  
            width:10px;  
            height:10px;  
    }
    #scrool-class::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        background: #ccc;
    }
	#scrool-class::-webkit-scrollbar-track {/*滚动条里面轨道*/
	        background: #F0F0F0;
	    }
	    #scrool-class .el-radio__label{
	    	font-size: 15px !important;
	    }
</style>