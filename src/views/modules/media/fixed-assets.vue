<template>
	<div class="fixed-assets">
		<!--<el-row>
			<el-col :span="24">-->
				<el-button type="primary" @click="addAssets" style="margin-right:10px;margin-bottom:10px;">添加答题卡</el-button>
				<el-dropdown>
					<el-button type="primary">
						更多<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>
							<div @click="alltheDel">删除</div>
						</el-dropdown-item>
						<el-dropdown-item>
							<div @click="showLeadVisible">导入</div>
						</el-dropdown-item>
						<el-dropdown-item>
							<div @click="dowmAsset">导出</div>
						</el-dropdown-item>
						<el-dropdown-item>
							<div @click="addOrUpdateHandle" @refreshDataList="getDataList">绑定分类</div>
						</el-dropdown-item>
						<el-dropdown-item>
							<div @click="getLeadlog">导入记录</div>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-select v-model="theUse" placeholder="用途" @change="getDataList" clearable style="margin-right:10px;margin-left:10px;width:150px;">
					<el-option v-for="item in useList" :key="item.value" clearable :label="item.dictName" :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="theBrand" placeholder="品牌" clearable @change="getDataList" style="margin-right:10px;width:150px;">
					<el-option v-for="item in brandList" :key="item.value" :label="item.dictName" :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="theAssetType" placeholder="类型" clearable @change="getDataList" style="margin-right:10px;width:150px;">
					<el-option v-for="item in assetTypeList" :key="item.value" :label="item.dictName" :value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="gradeClassId" placeholder="班级" clearable style="width:150px;margin-right: 10px;" @change="getDataList">
					<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
					</el-option>
				</el-select>
				<el-input v-model="keywords" @input="getDataList" clearable placeholder="请输入所属者或名称" clearable style="width:200px;"></el-input>
			<!--</el-col>
		</el-row>-->
		<el-table :data="tableData" ref="tableData" border style="width: 100%;margin-top: 10px;" :row-key="getRowKey" @selection-change="selectionChangeHandle">
			<el-table-column type="selection" :reserve-selection="true" header-align="center" align="center" width="50">
			</el-table-column>
			<el-table-column align="center" label='序号' width="95">
				<template slot-scope="scope">
					 {{scope.$index+1+pageSize*(pageIndex-1)}}
				</template>
			</el-table-column>
			<el-table-column prop="assetName" label="名称" width="150" align="center">
			</el-table-column>
			<el-table-column prop="assetCode" label="编号" width="150" align="center">
			</el-table-column>
			<el-table-column label="所属者" width="150" align="center">
				<template slot-scope="scope">
					{{scope.row.assetType==1||scope.row.assetType==4 ?scope.row.assetClassroomName:scope.row.assetOwner}}
				</template>
			</el-table-column>
			</el-table-column>
			<el-table-column prop="assetTypeName" label="类型" width="150" align="center">
			</el-table-column>
			<el-table-column prop="assetClassName" label="班级" width="150" align="center">
			</el-table-column>
			<!-- <el-table-column prop="assetClassification" label="分类" width="150" align="center">
			</el-table-column> -->
			<el-table-column prop="assetUseName" label="用途" width="150" align="center">
			</el-table-column>
			<el-table-column prop="assetBrandName" label="品牌" width="150" align="center">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="150" align="center">
			</el-table-column>
			<el-table-column prop="modifyTime" label="更新时间" width="150" align="center">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150" align="center">
				<template slot-scope="scope">
					<el-button @click="editAssets(scope.row)" type="text" size="small">编辑</el-button>
					<el-button type="text" size="small" @click="delTableData(scope.row.id,1)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>
		<el-dialog :title="!dataForm.id ? '添加' : '编辑 '" :close-on-click-modal="false" :visible.sync="visible" width="30%">
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
				<el-form-item label="名称" prop="assetsName">
					<el-input v-model.trim="dataForm.assetsName" clearable placeholder="请输入名称" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="编号" prop="assetsCode">
					<el-input v-model.trim="dataForm.assetsCode" clearable placeholder="请输入编号" maxlength="30"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="assetsType">
					<el-select v-model="dataForm.assetsType" clearable placeholder="请选择类型" @change="closeClass" style="width:100%">
						<el-option v-for="item in assetTypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级" prop="gradeClassId">
					<el-select v-model="dataForm.gradeClassId" clearable placeholder="班级" @change="showAlow(dataForm.assetsType)" clearable style="width:100%">
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="教室" prop="theRomeId" v-if="dataForm.assetsType==1||dataForm.assetsType==4">
					<el-select v-model="dataForm.theRomeId" clearable placeholder="请选择教室" style="width:100%">
						<el-option v-for="item in roomList" :key="item.classroomId" :label="item.classroomName" :value="item.classroomId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属者" prop="teaId" v-if="dataForm.assetsType==2">
					<el-select v-model="dataForm.teaId" clearable placeholder="请选择所属者" style="width:100%">
						<el-option v-for="item in teaList" :key="item.userId" :label="item.teacherName" :value="item.userId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属者" prop="stuId" v-if="dataForm.assetsType==3">
					<el-select v-model="dataForm.stuId" clearable placeholder="请选择所属者" style="width:100%">
						<el-option v-for="item in stuList" :key="item.userId" :label="item.stuName" :value="item.userId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="品牌" prop="assetBrand">
					<el-select v-model="dataForm.assetBrand" clearable placeholder="请选择品牌" style="width:100%">
						<el-option v-for="item in brandList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用途" prop="assetUse">
					<el-select v-model="dataForm.assetUse" clearable placeholder="请选择用途" style="width:100%">
						<el-option v-for="item in useList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;padding-bottom: 10px;padding-top: 10px;">
				<el-button @click="visible = false">取消</el-button>
				<el-button type="primary" v-if="dialogStatus=='update'" @click="dataFormEdit()" :loading="addLoading">确定</el-button>
				<el-button type="primary" v-if="dialogStatus=='create'"  @click="dataFormSubmit()" :loading="addLoading">确定</el-button>

			</div>
		</el-dialog>
		<el-dialog title="删除" :visible.sync="delVisible" width="30%">
			<div class="tittle" style="font-size:18px">确定要删除吗？</div>
			<el-table :data="delTable" style="margin-bottom: 40px;margin-top:30px" border>
				<el-table-column type="index" label="序号" width="50">
				</el-table-column>
				<el-table-column property="assetName" label="名称" width="150"></el-table-column>
				<el-table-column property="assetCode" label="编号" width="200"></el-table-column>
				<el-table-column property="assetTypeName" label="类型"></el-table-column>
			</el-table>
			<el-form :model="delData">
				<el-form-item label="备注" label-width="100">
					<el-input style="width:400px" v-model="delData.remarks" placeholder="请注明删除原因" type="textarea" ::rows="2">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="delVisible = false">取 消</el-button>
				<el-button type="primary" @click="delTableData(delTable,2)">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="装备导入" :visible.sync="leadVisible" width="33%">
			<el-form label-width="100px">
				<el-form-item label="模板下载">
					<el-button size="small" type="text" style="margin-left: 20px;" @click="modelDown">下载模板</el-button>
				</el-form-item>
				<el-form-item label="文件路径">
					<el-upload class="upload-demo" ref="upload" :action="apiUrl+'sys/oss/upload'" :before-remove="beforeFileRemove" :before-upload="deforeUpload" :on-success="handleFileSuccess" :limit="1" :file-list="fileList" :data="uploadFile">
						<el-button slot="trigger" size="small" @click="clearUploadedImage">选择文件</el-button>
						<div slot="tip" class="el-upload__tip">只能上传xls、xlsx格式文件，文件不能超过2000条</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="submitUpload">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="导入结果" :visible.sync="innerVisible" width="20%">
			<div>成功{{innerData.successNum}}条，失败{{innerData.failNum}}条</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="innerVisible = false">取 消</el-button>
				<el-button type="primary" @click="theLook">查看</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗, 新增 / 修改 -->
		<label-dialog v-if="addOrUpdateVisible" :labelType="2" ref="labelDialog" @refreshDataList="getDataList"></label-dialog>
		<el-dialog title="导入记录" :visible.sync="leadLogVisible" width="45%">
			<el-button @click="getDelLog">删除</el-button>
			<el-table :data="logData" border style="width: 100%;margin-top: 10px;" :row-key="getRowKey1" @selection-change="selectionChangeHandle1">
				<el-table-column type="selection" :reserve-selection="true" header-align="center" align="center" width="50">
				</el-table-column>
				<el-table-column align="center" label='序号' width="95">
					<template slot-scope="scope">
						{{scope.$index+1}}
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="导入时间" align="center">
				</el-table-column>
				<el-table-column prop="assetCode" label="详情" align="center">
					<template slot-scope="scope">
						成功{{scope.row.successNum}}条，失败{{scope.row.failNum}}条
					</template>
				</el-table-column>
				<el-table-column prop="createName" label="操作账号" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button @click="downloadLog(scope.row)" type="text" size="small">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandleLog" @current-change="currentChangeHandleLog" :current-page="pageIndexLog" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeLog" :total="totalPageLog" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-dialog>
	</div>
</template>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData,getExportFile } from '@/utils/common'
	import LabelDialog from './equip-label-dialog'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				apiUrl: window.SITE_CONFIG.baseUrlMedia,
				addLoading:false,
				dialogStatus:'',
				typeList: [],
				theType: '',
				keywords: '',
				tableData: [],
				visible: false,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				pageIndexLog: 1,
				pageSizeLog: 10,
				totalPageLog: 0,
				useList: [],
				innerVisible: false,
				innerData: [],
				theUse: '',
				brandList: [],
				theBrand: '',
				assetTypeList: [],
				theAssetType: '',
				theGcoption: [],
				gradeClassId: '',
				roomList: [],
				stuList: [],
				teaList: [],
				filePath: '',
				leadLog: false,
				addOrUpdateVisible: false,
				uploadFile: {
					type: ''
				},
				dataForm: {
					assetsName: '',
					assetsCode: '',
					assetsType: '',
					assetBrand: '',
					assetUse: '',
					theRomeId: '',
					gradeClassId: '',
					teaId: '',
					stuId: '',
					id: null
				},
				delData: {
					remarks: '',
				},
				btnloading:false,
				fileList: [],
				delTable: [],
				delVisible: false,
				leadVisible: false,
				leadLogVisible: false,
				logData: [],
				logTable: [],
				dataRule: {
					assetsName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					assetsCode: [{
						required: true,
						message: '编号不能为空',
						trigger: 'blur'
					}],
					assetsType: [{
						required: true,
						message: '类型不能为空',
						trigger: 'change'
					}],
					assetBrand: [{
						required: true,
						message: '品牌不能为空',
						trigger: 'change'
					}],
					assetUse: [{
						required: true,
						message: '用途不能为空',
						trigger: 'change'
					}]
				},
			}
		},
		mounted() {
			this.getDataList();
			this.getUse();
			this.getBrand();
			this.getAssetType();
			this.gradeClass();
			this.getClassroom()
		},
		components: {
			LabelDialog
		},
		methods: {
			addAssets() {			
				this.visible = true;
				this.dialogStatus = 'create'
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				});
				this.dataForm.assetsName = '';
				this.dataForm.assetsCode = '';
				this.dataForm.assetsType = '';
				this.dataForm.assetUse = '';
				this.dataForm.assetBrand = '';
				this.dataForm.theRomeId = '';
				this.dataForm.gradeClassId = '';
				this.dataForm.stuId = '';
				this.dataForm.teaId = ''
				this.dataForm.id = undefined;
				this.btnloading=false;
				
			},
			// 获取数据列表
			getDataList() {

				this.dataListLoading = true
				let that = this
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				this.theAssetType = this.theAssetType == '' ? undefined : this.theAssetType;
				this.theUse = this.theUse == '' ? undefined : this.theUse;
				this.theBrand = this.theBrand == '' ? undefined : this.theBrand;
				var assetGradeId;
				var assetClassId;
				if(this.theGcoption[parseInt(this.gradeClassId)] != undefined) {
					assetGradeId = this.theGcoption[this.gradeClassId].gradeId;
					assetClassId = this.theGcoption[parseInt(this.gradeClassId)].classId;
				}
				getCommHttpData({
					url: 'assetManage/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						keyword: this.keywords,
						assetType: this.theAssetType,
						assetUse: this.theUse,
						assetBrand: this.theBrand,
						assetGradeId: assetGradeId,
						assetClassId: assetClassId

					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getDataList()
						}
						that.tableData = data.page.list
						that.totalPage = data.page.totalCount
						//						that.dataListSelections = that.labelList
					} else {
						that.tableData = []
						that.totalPage = 0
					}
					that.dataListLoading = false
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
				this.delTable = val;
			},
			//			用途
			getUse() {
				let that = this;
				getCommHttpData({
					url: 'assetManage/findAssetTag',
					method: 'post',
					contentType: 2,
					data: {
						type: 2
					},
				}, function(data) {
					that.useList = data.list;
				})
				//				getCommonDictByType(this, 'asset_use', 'useList');
			},
			//			品牌
			getBrand() {
				let that = this;
				getCommHttpData({
					url: 'assetManage/findAssetTag',
					method: 'post',
					contentType: 2,
					data: {
						type: 1
					},
				}, function(data) {
					that.brandList = data.list;
				})
				//				getCommonDictByType(this, 'asset_brand', 'brandList');
			},
			//			资产类型
			getAssetType() {
				getCommonDictByType(this, 'asset_type', 'assetTypeList');
			},
			theLook() {
				this.innerVisible = false;
				this.leadLogVisible = true;
				this.getLeadlog()
			},
			cancel() {
				this.leadVisible = false;
				this.$refs.upload.clearFiles();
			},
			//			班级
			gradeClass() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClass',
					method: 'get',
					contentType: 1,
					data: {
						yearTermId: "0"
					},
				}, function(data) {
					that.theGcoption = data.list;
				})
			},
			//			教室
			getClassroom() {
				let that = this;
				getCommHttpData({
					url: 'basedatacenter/classroom/queryAllByCondition',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId
					},
				}, function(data) {
					that.roomList = data.data;
				})
			},
			showAlow(num) {
				this.teaList=[];
				this.stuList=[];
				this.dataForm.stuId = "";
				this.dataForm.teaId = ""
				if(num == 2) {
					this.getTea();
				}
				console.log(num)
				if(num == 3) {
					this.getStu()
				}
			},
			//			学生
			getStu() {
				let gradeId;
				let classId;
				if(this.dataForm.gradeClassId!= ''&&this.theGcoption.length>0) {
					gradeId = this.theGcoption[this.dataForm.gradeClassId].gradeId;
					classId = this.theGcoption[this.dataForm.gradeClassId].classId;
				}
				let that = this;
				getCommHttpData({
					url: 'common/getStuByClassId',
					method: 'post',
					contentType: 2,
					data: {
						gradeId: gradeId,
						classId: classId
					},
				}, function(data) {
					that.stuList = data.list;
					if(data.list.length == 0) {
						that.dataForm.stuId = ""
					}
				})
			},
			//			教师
			getTea() {
				let gradeId;
				let classId;
				if(this.dataForm.gradeClassId!=''&&this.theGcoption.length>0) {
					gradeId = this.theGcoption[this.dataForm.gradeClassId].gradeId;
					classId = this.theGcoption[this.dataForm.gradeClassId].classId;
				}
				let that = this;
				getCommHttpData({
					url: 'common/getTeaByClassId',
					method: 'post',
					contentType: 2,
					data: {
						gradeId: gradeId,
						classId: classId
					},
				}, function(data) {
					that.teaList = data.list;
					if(data.list.length == 0) {
						that.dataForm.teaId = ""
					}
				})
			},
			//			添加
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						let assetGradeId;
						let assetClassId;
						if(this.theGcoption[parseInt(this.dataForm.gradeClassId)] != undefined) {
							assetGradeId = this.theGcoption[this.dataForm.gradeClassId].gradeId;
							assetClassId = this.theGcoption[parseInt(this.dataForm.gradeClassId)].classId;
						}
						let assetClassroomId = this.dataForm.theRomeId == '' ? undefined : this.dataForm.theRomeId;
						let assetOwnerId;
						if(this.dataForm.teaId != "") {
							assetOwnerId = this.dataForm.teaId
						} else if(this.dataForm.stuId != "") {
							assetOwnerId = this.dataForm.stuId
						} else {
							assetOwnerId = undefined
						}

						let that = this;
						that.addLoading = true
						getCommHttpData({
							url: 'assetManage/addOrEditAsset',
							method: 'post',
							contentType: 2,
							operateType: 3,
							that: this,
							data: {
								assetSchoolId: this.schoolId,
								assetName: this.dataForm.assetsName,
								assetCode: this.dataForm.assetsCode,
								assetType: this.dataForm.assetsType,
								assetUse: this.dataForm.assetUse,
								assetBrand: this.dataForm.assetBrand,
								assetGradeId: assetGradeId,
								assetClassId: assetClassId,
								assetOwnerId: assetOwnerId,
								assetClassroomId: assetClassroomId
							},
						}, function(data) {
							if(data.code==0){
								that.addLoading = false
								that.visible = false
								that.getDataList()	
							}else{
								// that.$message({
							 //      message: data.msg,
							 //      type: 'error',
							 //      duration: 3 * 1000
							 //    })
								that.visible = false
							}
						})

					}
				})
			},
			//			编辑
			editAssets(row) {
				this.dataForm.id = row.id;
				this.dataForm.assetsName = row.assetName;
				this.dataForm.assetsCode = row.assetCode;
				this.dataForm.assetsType = row.assetType;
				this.dataForm.assetUse = row.assetUse;
				this.dataForm.assetBrand = row.assetBrand;
				this.dataForm.theRomeId = row.assetClassroomId;
				for(var j = 0; j < this.theGcoption.length; j++) {
					if(this.theGcoption[j].classId == row.assetClassId && this.theGcoption[j].gradeId == row.assetGradeId) {
						this.dataForm.gradeClassId = j
					}
				};
				if(this.dataForm.assetsType == 2) {
					this.getTea();
					this.dataForm.teaId = row.assetOwnerId;
				} else if(this.dataForm.assetsType == 3) {
					this.getStu()
					this.dataForm.stuId = row.assetOwnerId
				}
				this.visible = true
				this.dialogStatus = 'update'

			},
			showLeadVisible() {
				this.leadVisible = true;

			},
			//			编辑确定
			dataFormEdit() {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						let assetGradeId;
						let assetClassId;
						if(this.theGcoption[parseInt(this.dataForm.gradeClassId)] != undefined) {
							assetGradeId = this.theGcoption[this.dataForm.gradeClassId].gradeId;
							assetClassId = this.theGcoption[parseInt(this.dataForm.gradeClassId)].classId;
						}
						let assetClassroomId = this.dataForm.theRomeId == '' ? undefined : this.dataForm.theRomeId;
						let assetOwnerId;
						if(this.dataForm.teaId != "") {
							assetOwnerId = this.dataForm.teaId
						} else if(this.dataForm.stuId != "") {
							assetOwnerId = this.dataForm.stuId
						} else {
							assetOwnerId = undefined
						}

						let that = this;
						that.addLoading = true
						getCommHttpData({
							url: 'assetManage/addOrEditAsset',
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: {
								id: this.dataForm.id,
								assetSchoolId: this.schoolId,
								assetName: this.dataForm.assetsName,
								assetCode: this.dataForm.assetsCode,
								assetType: this.dataForm.assetsType,
								assetUse: this.dataForm.assetUse,
								assetBrand: this.dataForm.assetBrand,
								assetGradeId: assetGradeId,
								assetClassId: assetClassId,
								assetOwnerId: assetOwnerId,
								assetClassroomId: assetClassroomId
							},
						}, function(data) {
							that.addLoading = false
							that.visible = false
							that.getDataList()
						})
					}
				})
			},
			//			反选
			getRowKey(row) {
				return row.id
			},
			//			clearRow (){
			//		      this.$refs.tableData.clearSelection()
			//		    },
			alltheDel(){
				if(this.delTable.length>0){
					this.delVisible=true;
				}else{
					this.$message({
						type: 'error',
						message: '请选择卡片'
					});
				}
				
			},
			//			删除
			delTableData(row, num) {
				let ids = [];
				if(num == 1) {
					ids = [row]
				};
				this.delData.remarks = this.delData.remarks == '' ? undefined : this.delData.remarks;
				if(num == 2) {
					for(let i in row) {
						ids.push(row[i].id)
					}
				}
				let that = this;
				getCommHttpData({
					url: 'assetManage/deleteAsset',
					method: 'post',
					contentType: 2,
					data: {
						ids: ids,
						remarks: this.delData.remarks
					}
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '删除成功!'
						});
					}
					that.delVisible = false
					that.getDataList()
				})
			},
			//			下载
			dowmAsset() {
				let keywords = this.keywords == undefined ? '' : this.keywords;
				let theAssetType = this.theAssetType == undefined ? 0 : this.theAssetType;
				let theUse = this.theUse == undefined ? 0 : this.theUse;
				let theBrand = this.theBrand == undefined ? 0 : this.theBrand;
				let assetGradeId = this.gradeClassId == '' ? 0 : this.theGcoption[this.gradeClassId].gradeId;
				let assetClassId = this.gradeClassId == '' ? 0 : this.theGcoption[this.gradeClassId].classId;
				let schoolId = this.schoolId;
				let deptId = this.$cookie.get('orgId');
				let deptType = this.$cookie.get('userType');
//				let getstr = '?excelType=xls&schoolId=' +schoolId+'&keyword=' + keywords + '&assetType=' + theAssetType + '&assetUse=' + theUse + '&assetBrand=' + theBrand + '&assetGradeId=' + assetGradeId + '&assetClassId=' + assetClassId + '&deptId=' + deptId + '&deptType=' + deptType ;
//				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'assetManage/exportAsset' + getstr));		
//				
				getExportFile(this,'assetManage/exportAsset',{excelName:this.GLOBAL.getOrgName()+'答题卡设备表',schoolId:schoolId,keywords:keywords,assetType:theAssetType,assetUse:theUse,assetBrand:theBrand,assetGradeId:assetGradeId,assetClassId:assetClassId,deptId:deptId,deptType:deptType})
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
			},
			deforeUpload(file) {
				const fileExtStr = file.name.substring(file.name.lastIndexOf("."), file.name.length).toUpperCase();
				this.uploadFile.type = fileExtStr;
				let isFormat = true;
				if(fileExtStr != ".XLS" && fileExtStr != ".XLSX") {
					this.$message.error('上传文件格式不对!');
					isFormat = false;
					this.$refs.upload.clearFiles();
				}
				return isFormat;
			},
			closeClass() {
				this.dataForm.gradeClassId = ''
			},
			submitUpload() {

				let that = this;
				getCommHttpData({
					url: 'assetManage/importAsset',
					method: 'post',
					contentType: 2,
					data: {
						filePath: this.filePath,
						schoolId: this.schoolId
					},
				}, function(data) {
					if(data.code == 0) {
						that.leadVisible = false;
						that.$refs.upload.clearFiles();
						that.innerData = data;
						that.innerVisible = true
					}
					that.getDataList()
				})
			},

			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					let equipList = this.delTable
					let equipTemp = new Array()
					let lebelArr1 = new Array()
					let lebelArr2 = new Array()
					if(equipList.length == 0) {
						this.$message({
							message: '请选择卡片',
							type: 'error'
						})
						return;
					}
					this.$refs.labelDialog.init(equipList)
				})
			},
			//			获取导入记录
			getLeadlog() {
				this.leadLogVisible = true
				let that = this;
				getCommHttpData({
					url: 'assetManage/importList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex1,
						limit: this.pageSize1
					},
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex1 != 1) {
							that.pageIndex1 = 1
							that.getLeadlog()
						}
						that.logData = data.page.list
						that.totalPage1 = data.page.totalCount
						//						that.dataListSelections = that.labelList
					} else {
						that.logData = []
						that.totalPage = 0
					}
				})

			}, // 每页数
			sizeChangeHandleLog(val) {
				this.pageSizeLog = val
				this.pageIndexLog = 1
				this.getLeadlog()
			},
			// 当前页
			currentChangeHandleLog(val) {

				this.pageIndexLog = val
				this.getLeadlog()
			},
			// 多选
			selectionChangeHandle1(val) {
				this.logTable = val;
			},
			getRowKey1(row) {
				return row.id
			},
			//			模板下载
			modelDown() {
				let getstr = '?excelType=xlsx&excelName=答题卡导入模板表';
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'assetManage/loadAssetExcelModel' + getstr));
			},
			//			导入记录下载
			downloadLog(row) {
				let getstr = '?excelType=xlsx&excelName=答题卡导入记录表';
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.fileIP + row.filePath + getstr));
			},
			//			删除
			getDelLog() {
				let ids = []
				for(let i in this.logTable) {
					ids.push(this.logTable[i].id)
				}
				if(this.logTable.length == 0){
					this.$message({
			            message: '请至少选择一条数据',
			            type: 'error'
			        })
					return;
				}
				
				
				let that = this;
				deleteData(this, {
					url: 'assetManage/deleteImportData',
					method: 'post',
					contentType: 2,
					operateType: 1,
					data: {
						ids: ids,
					}
				}, function(data) {
					if(data.code == 0) {}
					that.getLeadlog()
				})
			}
		}
	}
</script>

<style>

</style>