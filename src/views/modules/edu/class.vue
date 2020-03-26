<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="edu-class">
		<div class="content-box">
			<div class="left-box">
				<el-select class="select-year" size="medium" v-model="yearTermId" @change="changeSchoolTerm">
					<el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
					</el-option>
				</el-select>
				<div class="class-box">
					<div class="class-item" :class="{'class-current':listGradeId ==item.gradeId}" @click="getClassList(item.gradeId)" v-for="item in listGrade" v-key="item.gradeId">{{item.gradeName}}</div>
				</div>
			</div>
			<div class="right-box">
				<div class="filter-container">
					<!--<el-select v-model="yearTermId" @change="changeSchoolTerm">
						<el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
						</el-option>
					</el-select>-->
					<el-select v-model="gradeClassify" @change="getList" clearable placeholder="请选择班级分类" style="margin-right: 5px;">
						<el-option v-for="item in classifyList " :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
					<el-button class="fr" style='margin-bottom:20px;float: right;' type="primary" @click="handleCreate" :loading="false">添加班级</el-button>
					<el-button style='margin-bottom:20px;float: right;margin-right: 20px;' type="primary" @click="theUpdata" :loading="false">升级</el-button>
				</div>
				<el-table class="blue-shadow" :data="list" ref="theTable" v-loading="" border fit highlight-current-row :row-key="getRowKey" @selection-change="selectionChangeHandle">
					<el-table-column type="selection" :selectable="checkSelectable" :reserve-selection="true" header-align="center" align="center" width="50">
					</el-table-column>
					<el-table-column align="center" label='序号' width="95">
						<template slot-scope="scope">
							{{scope.$index+1+pageSize*(pageIndex-1)}}
						</template>
					</el-table-column>
					<el-table-column align="center" property="gradeName" label="年级">
					</el-table-column>
					<el-table-column align="center" property="className" label="班级名称">
					</el-table-column>
					<!--<el-table-column property="classCode" align="center" label="班级代码">
				</el-table-column>-->
					<el-table-column property="userNames" align="center" label="班主任名称">
					</el-table-column>
				
					<el-table-column property="classNum" align="center" label="班额">
						<template slot-scope="scope">
							{{scope.row.classNum>0?scope.row.classNum:''}}
						</template>
					</el-table-column>
					
					<!--<el-table-column align="center" label="是否启用">
						<template slot-scope="scope">
							<el-switch active-text="是" :width="50" inactive-text="否" v-model="scope.row.status" active-color="#13ce66" :active-value="0" :inactive-value="1" @change="changeSatus(scope.row.classId,scope.row.status)">
							</el-switch>
						</template>
					</el-table-column>-->
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="small" type="text" @click="handleCheck(scope.row)">详情</el-button>
							<el-button v-if="scope.row.gradeId==0&&scope.row.yearTermId==0&&isActivation==true" @click="showHandle(scope.row.classId,scope.row.gradeId)" type="text" size="small">激活</el-button>
							<span v-if='scope.row.gradeId&&scope.row.gradeId!=0'>
								<el-button type="text" size="small" @click="editHandle(scope.row.classId,scope.row.gradeId,scope.row.gradeName)">编辑</el-button>
								<el-button style="color:#f56c6c" type="text" size="small" @click="deleteData(scope.row.classId,scope.row)">删除</el-button>
							</span>

						</template>
					</el-table-column>
					<el-table-column type="expand" width="1">
						<template slot-scope="props">
							<el-form label-position="left" class="tb-el-form">
								<el-form-item label="班级分类 :">
									<span>{{ props.row.eduClassifyName? props.row.eduClassifyName : '--' }}</span>
								</el-form-item>
								<el-form-item label="班级类型 :">
									<span>{{ props.row.eduClassTypeName ? props.row.eduClassTypeName : '--' }}</span>
								</el-form-item>
								<el-form-item label="分类 :">
									<span>{{ props.row.tagValues ? props.row.tagValues : '--' }}</span>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</div>

		<el-dialog title="班级管理 | 添加" :visible.sync="dialogFormVisible" width="60%">
			<el-form :inline="true" :rules="rules" ref="dataForm" :model="form" label-position="right" label-width="80px">
				<el-form-item label="年级名称" prop="gradeId">
					<el-select v-model="form.gradeId" clearable placeholder="请选择年级" @change="getGradeName">
						<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级分类" prop="gradeClassify">
					<el-select v-model="form.gradeClassify" @change="" clearable placeholder="请选择班级分类">
						<el-option v-for="item in classifyList " :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级类型" prop="">
					<el-select v-model="form.gradeType" @change="" clearable placeholder="请选择班级类型">
						<el-option v-for="item in gtypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班额" prop="quota">
					<el-input v-model="form.quota" style="width:90px;" maxlength="3"></el-input>人
				</el-form-item>
			</el-form>
			<template>
				<div class="tableDate">
					<div class="table">
						<el-table :data="tableData" ref="table" tooltip-effect="dark" border stripe style="width: 100%" @selection-change='selectRow'>
							<el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
							<el-table-column :render-header="renderHeader" label="班级名称" align="center" width="250">
								<template slot-scope="scope">
									<span>{{form.showGradeName}}</span>
									<el-input style="width: 150px;margin-left: 10px;" v-model="scope.row.className" maxlength="40"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="班主任" align="center" width="320">
								<template slot-scope="scope">
									<el-popover
									    placement="bottom-start"
									    width="380"
									    trigger="click" @show="handleOpen(scope.$index)" @hide="popperIndex='',treeSearchValue=''">
										<div class="search-tree exactAreaClassName">
											<el-input v-model="treeSearchValue" placeholder="请选择姓名查询" style="padding: 5px 10px;" clearable auto-complete="off"></el-input>
											<el-tree style="min-width: 200px;" :check-strictly="true" node-key="userId" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
												:expand-on-click-node="true" :data="userList" :filter-node-method="filterNode" @check-change="selectClassfy(scope.$index)" class="width-tree selectTree-input" :ref="'selectTree'+scope.$index">
												
											</el-tree>
										</div>
										<div slot="reference">
											<el-input placeholder="请选择姓名" readonly class="dep-chose-input"  auto-complete="off" v-model="tableData[scope.$index].teacherName"></el-input>
										</div>
									  </el-popover>
								</template>
							</el-table-column>
							<el-table-column label="分类" align="center" min-width="90">
								<template slot-scope="scope">
									<el-tag :key="tag" v-for="tag in scope.row.applicationTags" style="margin-bottom: 5px;" closable :disable-transitions="false" @close="handleClose(tag,scope.$index)">
										{{tag.tagValue}}
									</el-tag>
									<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
									</el-input>
									<el-button v-else class="button-new-tag" size="small" @click="addOrUpdateHandle(scope.row.applicationTags,scope.$index)">+ 添加</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="name" label="操作" align="center" width="100">
								<template slot-scope="scope">
									<el-button v-if="tableData.length==1" type="text" disabled>删除</el-button>
									<el-button v-else @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="button">
						<P style="text-align: center;">
							<el-input v-model="theNum" style="width:50px" maxlength="2"></el-input>&nbsp;&nbsp;行&nbsp;&nbsp;
							<el-button type="primary" icon="el-icon-plus" circle @click.prevent="addRow()"></el-button>
						</P>
					</div>
				</div>
			</template>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="createData">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :title="theittle" :visible.sync="dialogPvVisible" width="30%">
			<el-form :model="editForm" :rules="rules" ref="formEdit" label-width="80px">
				<div style="margin-bottom: 20px;" v-if="alive.gradeId=='0'&&alive.yearTermId==0">请输入以下信息激活此班级：</div>
				<el-form-item label="班级名称" prop="className">
					<span>{{editForm.showGradeName}}</span>
					<el-input v-model="editForm.className" style="width:40%;margin-left: 10px;" maxlength="40"></el-input>
				</el-form-item>
				<el-form-item label="班级代码" prop="">
					<div>{{editForm.classCode}}</div>
				</el-form-item>
				<el-form-item label="年级" prop="gradeId">
					<el-select v-model="editForm.gradeId" clearable placeholder="请选择年级" :disabled="showDisabled">
						<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班主任" prop="">
					<el-popover
					    placement="bottom-start"
					    width="380"
					    trigger="click" @hide="treeSearchValue=''">
						<div class="search-tree">
							<el-input v-model="treeSearchValue" placeholder="请选择姓名查询" style="padding: 5px 10px;" clearable auto-complete="off"></el-input>
							<el-tree style="min-width: 200px;" :check-strictly="true" node-key="userId" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
								:expand-on-click-node="true" :data="userList" :filter-node-method="filterNode" @check-change="selectClassfyOne" class="width-tree selectTree-input" ref="selectTreeOne">
								
							</el-tree>
						</div>
						<div slot="reference">
							<el-input placeholder="请选择姓名" readonly class="dep-chose-input"  auto-complete="off" v-model="editForm.teacherName"></el-input>
						</div>
					  </el-popover>
					
					
					
					<!-- <el-select v-model="editForm.userId" style="width:90%" multiple :multiple-limit="limitNum" filterable remote :remote-method="getUser" :loading="loading" placeholder="请输入姓名">
						<el-option v-for="item in editForm.userList" :key="item.userId" :label="item.teacherName" :value="item.userId">
						</el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="班级分类" prop="">
					<el-select v-model="editForm.gradeClassify" clearable placeholder="请选择班级分类" style="margin-right: 5px;">
						<el-option v-for="item in classifyList " :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班级类型" prop="">
					<el-select v-model="editForm.gradeType" clearable placeholder="请选择班级类型">
						<el-option v-for="item in gtypeList" :key="item.value" :label="item.dictName" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="班额" prop="quota">
					<el-input v-model="editForm.quota" style="width:45%" maxlength="3"></el-input>
				</el-form-item>
				<el-form-item label="分类" prop="">
					<el-tag :key="tag" v-for="tag in applicationTags" closable disable-transitions="false" @close="handleClose(tag)" style="margin-right: 10px;margin-left: 10px;">
						{{tag.tagValue}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="addOrUpdateHandle(1)">+ 添加</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogPvVisible = false">取 消</el-button>
				<!--<el-button type="primary" v-if="editForm.status==1" @click="handleLook()">确 定</el-button>-->
				<el-button type="primary" @click="handleUpdate">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 弹窗, 新增 / 修改 -->
		<label-dialog tagLabelName="班级" v-if="addOrUpdateVisible" ref="labelDialog" @labelList="labelList"></label-dialog>

		<el-dialog title="班级管理  | 升级" :visible.sync="upgradeVisible" width="30%">
			<el-form :model="upgradeForm">
				<el-form-item label="您确定将选中班级升级到" :label-width="formLabelWidth">
					<!--<el-select v-model="upgradeForm.yearTermId" clearable placeholder="请选择学年学期" style="margin-right: 5px;" @change="getUpClass">
						<el-option v-for="item in updataList " :key="item.yearName" :label="item.yearName" :value="item.yearTermId">
						</el-option>
					</el-select>-->
					<div>{{upgradeForm.yearName+" 吗？"}}</div>
				</el-form-item>
				<el-form-item label="已升级的班级：" :label-width="formLabelWidth">
					<span v-if="upgradeList.length==0">无</span>
					<span v-else v-for="(item,index) in upgradeList">{{item.gradeName}}{{item.className}}{{index!=upgradeList.length-1?'，':''}}</span>
				</el-form-item>
				<el-form-item label="待升级的班级：" :label-width="formLabelWidth">
					<span v-if="waitList.length==0">无</span>
					<span v-else v-for="(item,index) in waitList">{{item.gradeName}}{{item.className}}{{index!=waitList.length-1?'，':''}}</span>
				</el-form-item>
			</el-form>
			<el-dialog :visible.sync="innerVisible" append-to-body width="22%">
				<div v-if="waitList.length==0">班级已全部升级，请查看{{yearTermName}}班级信息</div>
				<div v-if="waitList.length>0">您确定将待升级班级升到{{yearTermName}}吗？</div>
				<div slot="footer" class="dialog-footer" style="text-align: center;">
					<el-button v-if="waitList.length>0" @click="innerVisible = false">取 消</el-button>
					<el-button v-if="waitList.length>0" type="primary" @click="sureUpdata">确定</el-button>
					<el-button v-if="waitList.length==0" type="primary" @click="noUpdata">确定</el-button>
				</div>
			</el-dialog>
			<div slot="footer" class="dialog-footer" style="text-align: center;">
				<el-button @click="upgradeVisible = false">取 消</el-button>
				<el-button type="primary" @click="showInner">确定</el-button>
			</div>
		</el-dialog>
		<!--删除-->
		<el-dialog title="删除" :visible.sync="dialogDelete" width="480px">
			<div style="font-size:16px;margin-top:-20px;margin-bottom: 20px;">此班级已建班使用，您确定删除吗?</div>
			<div style="font-size:12px;margin-bottom: 20px;color: #9c9c9c;"><i class="el-icon-warning" style="color: red"></i>&nbsp;删除后会同时删除班级相关的班主任、任课老师、学生、课表等信息。</div>
			<div>
				<el-checkbox v-model="isChecked"><span style="font-size: 12px;;">我已知晓</span></el-checkbox>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogDelete=false">取消</el-button>
				<el-button type="primary" :disabled="!isChecked" @click="submitDelete">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	import LabelDialog from './label-dialog'
	export default {
		name: 'exportExcel',
		data() {
			return {
				defaultProps: {
					children: 'children',
					label: 'teacherName',
				},
				deptNameSelect:'',
				isChecked: false,
				dialogDelete: false,
				deleteId: '',
				deleteRowData: '',
				schoolId: this.GLOBAL.getOrgId(),
				list: null,
				alive: [],
				showDisabled: true,
				listLoading: true,
				innerVisible: false,
				schoolType: '',
				classTotal: 1,
				gradeList: [],
				loading: false,
				userList: [],
				userId: [],
				tagId: [],
				theittle: '',
				formLabelWidth: "170px",
				applicationTags: [],
				inputVisible: false,
				inputValue: [],
				classifyList: [],
				gtypeList: [],
				gradeClassify: undefined,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				limitNum: 10,
				upgradeVisible: false,
				updataList: [],
				yearList: [],
				yearTermId: '',
				isActivation: false,
				form: {
					gradeId: '',
					schoolClassTypeIdList: [],
					schoolYearId: '',
					termId: '',
					showGradeName: "",
					classList: [],
					gradeClassify: '',
					gradeType: '',
					quota: 55
				},
				editForm: {
					className: '',
					gradeId: '',
					gradeClassify: '',
					gradeType: '',
					quota: 55,
					classCode: '',
					userId: [],
					userList: [],
					status: 0,
					teacherName:''
				},
				upgradeForm: {
					yearTermId: '',
					yearName: ''
				},
				upData: [],
				tnameList: [],
				parmaClassId: '',
				theNum: 1,
				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				addOrUpdateVisible: false,
				ctypeList: [],
				classType: '',
				dialogPvVisible: false,
				pvData: [],
				addLoading: false,
				tableData: [],
				selectlistRow: [],
				oldgradeId: "",
				upgradeList: [],
				waitList: [],
				schoolingNum: '',
				yearTermName: '',
				listGrade:[],
				listGradeId:'',
				schoolYearId:'',
				termId:'',
				rules: {
					gradeId: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					quota: [{
						pattern: /^[0-9]*[1-9][0-9]*$/,
						message: '班额为大于0的整数'
					}],
					className: [{
						required: true,
						message: '不能为空',
						trigger: 'blur',
					}]
				},
				tempIndex: 0,
				isShowSelect:false,
				inputIcon : 'el-icon-arrow-down',
				treeSearchValue : '',
				popperIndex: ''
			}
		},
		watch: {
			treeSearchValue(val) {
				let index = this.popperIndex
				if(index){
					this.$refs['selectTree'+index].filter(val);
				}else{
					this.$refs['selectTreeOne'].filter(val);
				}
			}
		},
		components: {
			LabelDialog
		},
		mounted() {
			this.schoolTerm();
			this.getClassify();
		},
		methods: {
			handleOpen(index){
				this.popperIndex = index
			},
			selectClassfy(index, node) {
				console.log(index,'dhdhhd')
				let deptTemp = this.$refs['selectTree'+index].getCheckedNodes()
				let tempList = []
				let tempIdList = []
				for(let i in deptTemp){
					tempList.push(deptTemp[i].teacherName)
					tempIdList.push(deptTemp[i].userId)
				}
				this.tableData[index].teacherName = tempList.toString();
				this.tableData[index].userId = tempIdList;
				this.$forceUpdate()
				
			},
			selectClassfyOne(){
				let deptTemp = this.$refs.selectTreeOne.getCheckedNodes(), depName = [], depIds = []
				if(deptTemp.length == 0){
					this.editForm.userId = ''
					this.editForm.teacherName = ''
					return
				}
				if (deptTemp.length) {
					deptTemp.forEach(item => {
						depName.push(item.teacherName)
						depIds.push(item.userId)
					})
				}
				this.editForm.userId = depIds
				this.editForm.teacherName = depName.join(',')
			},
			
			// 选择器的树节点
			filterNode(value, data) {
				if(!value) return true;
				return data.teacherName.indexOf(value) !== -1;
			},
			
			
			
			handleCheck(row) {
		        const $table = this.$refs.theTable
		        
		        $table.toggleRowExpansion(row)
//		        $table.toggleRowSelection(row)
		   },
			handleClose(tag, index) {
				if(index) {
					this.tableData[index].applicationTags.splice(this.tableData[index].applicationTags.indexOf(tag), 1);
				} else {
					this.applicationTags.splice(this.applicationTags.indexOf(tag), 1);
				}

			},
			changeSchoolTerm(val){
				let current = this.yearList.find(item=>{
					return item.yearTermId == val
				})
				this.termId = current.termId;
				this.schoolYearId = current.schoolYearId;
				this.listGradeId = '';
				this.getList(1)
				this.getGradeData()
			},
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTermAll',
					method: 'get',
					contentType: 1,
					//					data: {},
				}, function(data) {
					that.yearList = data.list;
					that.yearTermId = data.yearTermId;
					that.schoolYearId = data.schoolYearId
					that.termId = data.termId
					that.getList()
					that.getGradeData()
				})
			},
			//查询年级
			getGradeData() {
				var that = this
				getCommHttpData({
					url: 'common/queryGradeByParams',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId,
						schoolYearId: this.schoolYearId,
						termId: this.termId
					}
				}, function(data) {
					if(data.code == 0) {
						that.listGrade = data.list
						that.listGradeId = ''
					} else {
						that.listGrade = []
					}
				})
			},
			//根据年级查询班级
			getClassList(val){
				this.listGradeId = this.listGradeId == val ? '' : val
				this.getList()
			},
			labelList(val) {
				this.applicationTags = val
				this.tableData[this.tempIndex].applicationTags = val;
			},
			renderHeader(h, {
				column,
				$index
			}) {
				return h(
					'div', [
						h('span', {
							style: 'color:red;margin-right:5px;'
						}, "*"),
						h('span', column.label),
					],

				)
			}, // 获取表格选中时的数据
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			//禁选
			checkSelectable(row) {
				let temp = false
				if(row.isUpgrade == true) {
					temp = true
				}
				if(row.status == 1) {
					temp = false
				}
				return temp
			},

			// 新增 / 修改
			addOrUpdateHandle(savedata, index) {
				if(savedata == 1) {
					savedata = this.applicationTags
				} else {
					savedata = savedata
				}
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.tempIndex = index
					this.$refs.labelDialog.init(savedata);
				})
			},
			selectRow(val) {
				this.selectlistRow = val
			},
			//			checkSelectable(row) {
			//		      return row.isUpgrade == true
			//		    },

			// 多选
			selectionChangeHandle(val) {
				this.upData = val
			},
			getRowKey(row) {
				return row.classId
			},
			//			升级
			theUpdata() {
				if(this.upData.length == 0) {
					this.$message({
						type: 'error',
						message: '请选择班级'
					});
				} else {
					this.upgradeVisible = true;
					this.upgradeForm.yearTermId = [];
					this.waitList = [];
					this.upgradeList = [];
					let that = this;
					getCommHttpData({
						url: 'common/queryYearTermAfter',
						method: 'get',
						contentType: 1,
						data: {
							yearTermId: this.yearTermId
						},
					}, function(data) {
						if(data.code == 0) {
							that.updataList = data.list;
							that.upgradeForm.yearTermId = data.list[0].yearTermId;
							that.upgradeForm.yearName = data.list[0].yearName;
							that.getUpClass()
						}

					})
				}

			},

			getUpClass() {
				let list = [];
				this.upData.forEach(item => {
					list.push({
						gradeId: item.gradeId,
						classId: item.classId,
						gradeName: item.gradeName,
						className: item.className,
					})
				})
				if(this.upgradeForm.yearTermId != "") {
					let that = this;
					getCommHttpData({
						url: 'eduManageClass/checkUpgrade',
						method: 'post',
						contentType: 2,
						data: {
							schoolId: this.schoolId,
							yearTermId: this.yearTermId,
							yearTermIdNew: this.upgradeForm.yearTermId,
							list: list
						},
					}, function(data) {
						if(data.code == 0) {
							that.waitList = data.waitList;
							that.upgradeList = data.upgradeList;
							that.schoolingNum = data.schoolingNum;
							for(let i in that.updataList) {
								if(that.updataList[i].yearTermId == that.upgradeForm.yearTermId) {
									that.yearTermName = that.updataList[i].yearName
								}
							}

						};
						if(data.code == 500) {
							that.upgradeForm.yearTermId = ''
						}

					})
				} else {
					this.waitList = [];
					this.upgradeList = [];
				}

			},
			//点击升级
			noUpdata() {
				this.innerVisible = false;
				this.upgradeVisible = false
			},
			sureUpdata() {
				let list = [];
				this.upData.forEach(item => {
					list.push({
						gradeId: item.gradeId,
						classId: item.classId,
						gradeName: item.gradeName,
						className: item.className,
					})
				})
				let that = this;
				getCommHttpData({
					url: 'eduManageClass/upgrade',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						yearTermId: this.yearTermId,
						yearTermIdNew: this.upgradeForm.yearTermId,
						schoolingNum: this.schoolingNum,
						list: list
					},
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '班级已全部升级，请查看' + that.yearTermName + '班级信息'
						});

						that.upgradeVisible = false;
						that.innerVisible = false;
						that.getList()
						that.$refs.theTable.clearSelection();
					}

				})
			},
			showInner() {
				this.innerVisible = true

			},
			// 增加行
			addRow() {
				if(this.theNum > 1) {
					for(var i = 1; i <= this.theNum; i++) {
						this.tableData.push({
							className: this.tableData.length + 1 + "班",
							userId: [],
							tagId: [],
							applicationTags: [],
							teacherName:''
						})
					}
				} else {
					var m = this.tableData.length
					var list = {
						className: m + 1 + '班',
						userId: [],
						tagId: [],
						applicationTags: [],
						teacherName:''
					};
					this.tableData.push(list)
				};
			},
			changeSatus(classId, status) {
				let that = this;
				getCommHttpData({
					url: 'eduManageClass/updateStatus',
					method: 'post',
					contentType: 2,
					data: {
						classId: classId,
						status: status,
						yearTermId: this.yearTermId
					},
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '操作成功!'
						});
					}

				})
			},
			getList(type) {
				//	this.listLoading = true
				let that = this

				getCommHttpData({
					url: 'eduManageClass/list',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						order: "",
						sidx: "",
						yearTermId: this.yearTermId,
						eduClassify: this.gradeClassify,
						schoolId: this.schoolId,
						gradeId:this.listGradeId
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getList()
						}
						that.isActivation = data.isActivation;
						that.list = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					if(type == 1) {
						that.$refs.theTable.clearSelection();
					}
					that.listLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getList()
			},
			getClassify() {
				let that = this
				getCommonDictByType(this, 'edu_classify_type', 'classifyList', function(data) {
					that.form.gradeClassify = 1
				});
			},
			getGradetype() {
				getCommonDictByType(this, 'edu_class_type', 'gtypeList');
			},
			getGrade() {
				let that = this;
				getCommHttpData({
					url: 'common/queryAllGradeList',
					method: 'get',
					contentType: 1,
					//					data:'',
				}, function(data) {
					that.gradeList = data.list;
				})
			},
			getTnames(query) {
				// if(query !== '') {
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
						that.userList = data.list;
					})
				// }
			},
			getUser() {
				// if(query !== '') {
					this.loading = true;
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
						that.editForm.userList = data.list;
					})
				// }
			},
			resetTemp() {
				this.form.gradeId = ''
				this.form.schoolClassTypeIdList = []
				this.form.classList = []
			},
			handleCreate() {
				this.dialogFormVisible = true
				this.getGrade()
				this.getClassify()
				this.getGradetype()
				this.getTnames()
				this.form.gradeId = '';
				this.form.gradeClassify = '';
				this.form.gradeType = '';
				this.form.quota = 55;
				this.theNum = 1;
				this.form.showGradeName = "";
				var data = {
					className: "1班",
					userId: [],
					tagId: [],
					applicationTags: [],
					teacherName:''
				};
				this.tableData = [data]
			},
			getGradeName() {
				for(var i = 0; i < this.gradeList.length; i++) {
					if(this.form.gradeId == this.gradeList[i].gradeId) {
						this.form.showGradeName = this.gradeList[i].gradeName
					}
				}
			},
			createData() {

				var dataParma = [];
				for(var i = 0; i < this.tableData.length; i++) {
					let userList = new Array()
					let tagList = new Array()
					for(var j = 0; j < this.tableData[i].userId.length; j++) {
						userList.push({
							userId: this.tableData[i].userId[j]
						})
					}
					for(var j = 0; j < this.tableData[i].applicationTags.length; j++) {
						tagList.push({
							tagId: this.tableData[i].applicationTags[j].tagId
						})
					}
					dataParma.push({
						className: this.tableData[i].className,
						userList: userList,
						tagList: tagList
					})
				}
				let gradeName;
				for(let i in this.gradeList) {
					if(this.form.gradeId == this.gradeList[i].gradeId) {
						gradeName = this.gradeList[i].gradeName
					}
				}

				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						var num = this.form.quota == "" ? 0 : this.form.quota
						getCommHttpData({
							url: 'eduManageClass/saveBatch',
							method: 'post',
							contentType: 2,
							that: this,
							data: {
								gradeId: this.form.gradeId,
								gradeName: gradeName,
								schoolId: this.schoolId,
								eduClassify: this.form.gradeClassify,
								eduClassType: this.form.gradeType,
								classNum: num,
								list: dataParma
							}
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									type: 'success',
									message: '操作成功!'
								});
							}
							that.dialogFormVisible = false
							that.getList();
							that.getGradeData()
						})
					}
				})
			},
			showHandle(parma, id) {
				this.theittle = "激活"
				this.showDisabled = false;
				this.getGrade()
				this.getClassify()
				this.getGradetype()
				this.dialogPvVisible = true;
				this.parmaClassId = parma;
				let that = this;
				if(id != 0) {
					this.editForm.gradeId = id;
				} else {
					this.editForm.gradeId = ''
				}
				getCommHttpData({
					url: 'eduManageClass/queryById',
					method: 'get',
					contentType: 1,
					data: {
						classId: parma,
						yearTermId: this.yearTermId
					},
				}, function(data) {
					that.alive = data.list
					let list = data.list;
					that.editForm.className = list.className;
					that.editForm.classCode = list.classCode;
					that.oldgradeId = list.gradeId;
					if(list.eduClassify != 0) {
						that.editForm.gradeClassify = list.eduClassify;
					} else {
						that.editForm.gradeClassify = ""
					};
					if(list.eduClassType != 0) {
						that.editForm.gradeType = list.eduClassType;
					} else {
						that.editForm.gradeType = ""
					};
					that.editForm.quota = list.classNum;
					that.editForm.userList = list.userList;
					that.editForm.status = list.status;
					that.editForm.userId = [];
					let tempTeacheName = []
					for(var i = 0; i < list.userList.length; i++) {
						that.editForm.userId.push(list.userList[i].userId)
						tempTeacheName.push(list.userList[i].teacherName)
					};
					that.editForm.teacherName = tempTeacheName.toString()
					that.applicationTags = list.tagList;

				})

			},
			editHandle(parma, id, name) {
				this.theittle = "班级管理 | 编辑"
				this.showDisabled = true;
				this.getGrade()
				this.getClassify()
				this.getGradetype()
				this.getTnames()
				this.editForm.showGradeName = name
				if(id != 0) {
					this.editForm.gradeId = id;
				} else {
					this.editForm.gradeId = ''
				};
				this.dialogPvVisible = true;
				let that = this;
				this.parmaClassId = parma;
				getCommHttpData({
					url: 'eduManageClass/queryById',
					method: 'get',
					contentType: 1,
					data: {
						classId: parma,
						yearTermId: this.yearTermId
					},
				}, function(data) {
					let list = data.list;
					that.editForm.className = list.className;
					that.editForm.classCode = list.classCode;
					that.oldgradeId = list.gradeId;
					if(list.eduClassType != 0) {
						that.editForm.gradeType = list.eduClassType;
					} else {
						that.editForm.gradeType = ""
					};
					if(list.eduClassify != 0) {
						that.editForm.gradeClassify = list.eduClassify;
					} else {
						that.editForm.gradeClassify = ""
					}
					if(list.classNum > 0) {
						that.editForm.quota = list.classNum;
					} else {
						that.editForm.quota = ''
					}

					that.editForm.userList = list.userList;
					that.editForm.status = list.status;
					that.editForm.userId = [];
					let tempTeacheName = []
					for(var i = 0; i < list.userList.length; i++) {
						that.editForm.userId.push(list.userList[i].userId)
						tempTeacheName.push(list.userList[i].teacherName)
					};
					that.editForm.teacherName = tempTeacheName.toString()
					that.$nextTick(()=>{
						that.$refs.selectTreeOne.setCheckedKeys(that.editForm.userId)
					})
					that.applicationTags = list.tagList;
				})
			},
			handleUpdate() {
				var tagList = [];
				for(var i = 0; i < this.applicationTags.length; i++) {
					tagList.push({
						tagId: this.applicationTags[i].tagId
					})
				}
				var userList = [];
				for(var j = 0; j < this.editForm.userId.length; j++) {
					userList.push({
						userId: this.editForm.userId[j]
					})
				};
				let status;
				if(this.theittle == "激活") {
					status = 0
				} else {
					status = this.editForm.status
				};
				this.$refs['formEdit'].validate((valid) => {
					if(valid) {
						let that = this
						var num = this.editForm.quota == "" ? 0 : this.editForm.quota
						getCommHttpData({
							url: 'eduManageClass/update',
							method: 'post',
							contentType: 2,
							data: {
								classId: this.parmaClassId,
								classCode: this.editForm.classCode,
								gradeId: this.oldgradeId,
								gradeIdNow: this.editForm.gradeId,
								schoolId: this.schoolId,
								className: this.editForm.className,
								eduClassify: this.editForm.gradeClassify,
								eduClassType: this.editForm.gradeType,
								classNum: num,
								status: status,
								userList: userList,
								tagList: tagList,
								yearTermId: this.yearTermId
							}
						}, function(data) {
							if(data.code == 0) {
								that.$message({
									type: 'success',
									message: '操作成功!'
								});
							}
							that.dialogPvVisible = false
							that.getList();
						})
					}
				})
			},
			submitDelete() {
				let that = this
				let delJson = this.deleteId,
					row = this.deleteRowData
				getCommHttpData({
					url: 'eduManageClass/delete?classId='+that.deleteId+'&yearTermId='+that.yearTermId,
					method: 'get',
					contentType: 2,
					operateType: 3,
//					data: {
//						classId: that.deleteId,
//						yearTermId: that.yearTermId
//					}
				}, function(data) {
					if(data.code == 0){
						that.dialogDelete = false;
						that.deleteId = '';
						that.$message({
							message: '删除成功',
							type: 'success'
						})
						for(let i in that.upData) {
							if(that.upData[i].classId) {
								if(that.upData.length > 0 && that.upData[i].classId == delJson) {
									that.getList()
									that.$refs.theTable.toggleRowSelection(row);
								}
							}
	
						}
						that.getList()	
						that.getGradeData()
						
					}else{
						that.dialogDelete = false;
						that.deleteId = '';
					}
				})
			},
			deleteData(delJson, row) {
				this.isChecked = false;
				this.dialogDelete = true;
				this.deleteId = delJson;
				this.deleteRowData = row
				//				let that = this;
				//				deleteData(this, {
				//					url: 'eduManageClass/delete',
				//					method: 'get',
				//					contentType: 1,
				//					operateType: 1,
				//					data: {
				//						classId: delJson,
				//						yearTermId:this.yearTermId
				//					}
				//				}, function(data) {
				//					for(let i in that.upData){
				//						if(that.upData[i].classId){
				//							if(that.upData.length>0&&that.upData[i].classId==delJson){
				//								that.getList()
				//								that.$refs.theTable.toggleRowSelection(row);
				//							}
				//						}
				//						
				//					}
				//					that.getList()
				//				})
			}
		}
	}
</script>
<style type="text/css">
	.content-box {
		position: relative;
		width: 100%;
	}
	.tb-el-form .el-form-item{
		margin-bottom: 0;
	}
	.left-box {
		width: 250px;
	}
	
	.right-box {
		position: absolute;
		left: 270px;
		top: 0;
		right: 0;
	}
	
	.select-year .el-input input {
		background: #3C85EE!important;
		font-size: 12px;
		color: #FFFFFF;
		height: 40px;
		width: 250px;
		border-radius: 0;
	}
	
	.select-year .el-input .el-input__icon {
		color: #FFFFFF;
	}
	.class-box{
		max-height: 600px;
		overflow: auto;
	}
	.class-box::-webkit-scrollbar{/*滚动条整体部分，其中的属性有width,height,background,border等（就和一个块级元素一样）（位置1）*/  
            width:10px;  
            height:10px;  
    }
    .class-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        background: #c1c1c1;
    }
	.class-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
	        background: #f1f1f1;
	    }
	.class-item {
		background: #FFFFFF;
		border: 1px solid #E6E6E6;
		border-top: none;
		/*color: #B2B2B2;*/
		font-size: 14px;
		height: 45px;
		line-height: 45px;
		padding-left: 20px;
		cursor: context-menu;
	}
	.class-current{
		border-right: 3px solid #3C85EE;
	}
	.el-popover{
		padding: 0;
	}
</style>
<style lang="scss" scoped>
	.search-tree{
		min-width: 380px;
		z-index: 9999;
		background-color: #fff;
		position: absolute;
		overflow: auto;
		border: 1px solid #ddd;
		line-height: normal;
		max-height: 280px;
	}
	.search-tree .el-input__suffix{
		right: 10px;
	}
	.dep-chose-input{
		width: 220px;
	}
</style>