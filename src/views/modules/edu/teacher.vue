<template>
	<div class="app-container">
		<el-card class="blue-shadow">
			<el-form :inline="true">
				<el-form-item class="item-right">
					<el-select v-model="yearTermId"  @change="handleClick"> 
				        <el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
				        </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item v-if="activeName=='first'">
					<el-input v-model="keywords"  @input="getTealist" placeholder="姓名/手机号/邮箱/身份证号/教籍号" style="width:300px"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
				</el-form-item>
				<el-form-item  v-else>
					<el-input v-model="keywords"  @input="getClasslist" placeholder="姓名/手机号/邮箱/身份证号/教籍号" style="width:300px"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
				</el-form-item>
				<div style="float:right">
					<router-link :to="{name:'tea-log'}" style="color:white;text-decoration: none;">
						<el-button type="primary" style="float: right;margin-left: 20px;">任课记录</el-button>
					</router-link>
					<router-link :to="{name:'tea-batch',params:{yearTermId:yearTermId}}" style="color:white;text-decoration: none;">
						<el-button type="primary" style="float: right;margin-left: 20px;">批量导入</el-button>
					</router-link>
						<el-button type="primary"  v-if="activeName=='first'" @click="dowmTea" style="float: right;">{{$t('table.downLoad')}}</el-button>
						<el-button type="primary"  v-else @click="dowmClass"  style="float: right;">{{$t('table.downLoad')}}</el-button>
				</div>
			</el-form>
			<!--<nav style="background: white;overflow: hidden;margin-bottom: 10px;">
				<h3 style="text-align: center;">各班教师任课信息表&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<span class="down" v-if="activeName=='first'" style="font-size:12px;color:#3C85EE;cursor:pointer" @click="dowmTea">{{$t('table.downLoad')}}</span>
					<span class="down" v-else style="font-size:12px;color:#3C85EE;cursor:pointer" @click="dowmClass">{{$t('table.downLoad')}}</span>
				</h3></nav>-->
			<el-tabs v-model="activeName"  style="background: white;padding-left: 20px;padding-right: 20px;padding-bottom: 20px;" @tab-click="handleClick">
				
				<el-tab-pane label="班级视图" name="second">
					<template>
						<el-table :data="classDate" border v-loading="loadingClass">
							<el-table-column fixed="left" type="index" label="序号" width="80" align="center">
								<template  slot-scope="scope">
							          {{scope.$index+1+pageSizeClass*(pageIndexClass-1)}}
							    </template>
							</el-table-column>
							<el-table-column fixed="left" prop="className" label="班级" align="center" width="150">
							</el-table-column>
							<el-table-column v-for="(item,index) in classHeader" :label="item.subjectName" align="center" :width="classHeader.length>10 ? 150 : ''">
								<template slot-scope="scope">
									<div class="nalist" style="display: inline-block;">
										<el-tag v-for="tag in scope.row.subjectList[index].teacherList" :key="tag[index]" closable :type="tag.type" @close="handleClose(scope.row,tag,item)">
											<span  @click="editShow(scope.row,item,tag)">{{tag.teacherName.length > 4 ? tag.teacherName.substr(0,4)+'...' : tag.teacherName}}<i style="font-size: 16px;cursor:pointer" class="el-icon-edit"></i></span>
										</el-tag>
										<i class="el-icon-circle-plus showAdd" style="color:#3C85EE;font-size: 20px;cursor:pointer;"  @click="showDailog(scope.row,item,tag)"></i>
									</div>
									<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
									</el-input>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination @size-change="sizeChangeHandleClass" @current-change="currentChangeHandleClass" :current-page="pageIndexClass" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeClass" :total="totalPageClass" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</template>
					<el-dialog :visible.sync="teaShow" width="30%">
						<el-form ref="showForm" :model="showForm" label-position="right" label-width="100px">
							<el-form-item label="班级">
								<div>{{showForm.className}}</div>
							</el-form-item>
							<el-form-item label="科目">
								<div>{{showForm.subjectName}}</div>
							</el-form-item>
							<el-form-item label="老师">
								
								<el-popover
								    placement="bottom-start"
								    width="380"
								    trigger="click" @hide="treeSearchValue=''">
									<div class="search-tree">
										<el-input v-model="treeSearchValue" placeholder="请选择姓名查询" style="padding: 5px 10px;" clearable auto-complete="off"></el-input>
										<el-tree style="min-width: 200px;" check-strictly @check="checkGroupNode" node-key="teacherId" show-checkbox default-expand-all empty-text="暂无数据" :props="defaultProps" :highlight-current=true
											:expand-on-click-node="true" :data="teaList" :filter-node-method="filterNode" @check-change="selectClassfyOne" class="width-tree selectTree-input1" ref="selectTreeOne">
											
										</el-tree>
									</div>
									<div slot="reference">
										<el-input placeholder="请选择姓名" readonly  auto-complete="off" v-model="showForm.teacherName"></el-input>
									</div>
								  </el-popover>
								
								
								
								<!-- <el-select v-model="showForm.checkTea" filterable remote :remote-method="getTnames" :loading="loading" placeholder="请输入姓名">
									<el-option v-for="item in teaList" :key="item.teacherId" :label="item.teacherName" :value="item.teacherId">
									</el-option>
								</el-select> -->
							</el-form-item>
						</el-form>
						<span slot="footer" class="dialog-footer">
						    <el-button v-if="judege==2" type="primary" @click="sureTea">保存</el-button>
						    <el-button v-else type="primary" @click="editTea">保存</el-button>
						</span>
					</el-dialog>
				</el-tab-pane>
				<el-tab-pane label="教师视图" name="first">
					<template>
						<el-table :data="dateList" :span-method="objectSpanMethod" border style="width: 100%; "  v-loading="loadingTea">
							<el-table-column prop="index" label="序号" width="80" align="center">
								<template  slot-scope="scope">
							          {{scope.row.index+pageSize*(pageIndex-1)}}
							    </template>
							</el-table-column>
							<el-table-column prop="teacherName" label="教师" align="center">
							</el-table-column>
							<el-table-column prop="subjectName" label="科目" align="center">
								<!--<template slot-scope="scope">
									{{item.subjectName}}
								</template>-->
							</el-table-column>
							<el-table-column prop="className" label="班级" align="center">
							</el-table-column>
						</el-table>
						<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</template>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<script>
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				treeSearchValue:'',
				defaultProps: {
					children: 'children',
					label: 'teacherName',
				},
				tableData: [],
				keywords:'',
				activeName:"second",
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				pageIndexClass: 1,
				pageSizeClass: 10,
				totalPageClass: 0,
				classDate: [],
				dateList:[],
				classHeader: [],
				teaList: [],
				teaShow: false,
				loading: false,
				inputVisible: false,
				TeaList: [],
				loadingTea:true,
				loadingClass:false,
				showForm: {
					checkTea: '',
					className: '',
					subjectName: '',
					teacherName:''
				},
				submitTea: [],
				judege:"",
				yearList:[],
				subdata:[],
				teadata:[],
				yearTermId:'',
				appHeight:500
			}
		},
		mounted() {
			this.schoolTerm();
			this.getTnames()
		},
		watch: {
			treeSearchValue(val) {
				this.$refs['selectTreeOne'].filter(val);
			}
		},
		methods: {
			selectClassfyOne(){
				let deptTemp = this.$refs.selectTreeOne.getCheckedNodes()
				if(deptTemp.length == 0){
					this.showForm.checkTea = ''
					this.showForm.teacherName = ''
					return
				}
				this.showForm.checkTea = deptTemp[0].teacherId
				this.showForm.teacherName = deptTemp[0].teacherName
			},
			
			// 选择器的树节点
			filterNode(value, data) {
				if(!value) return true;
				return data.teacherName.indexOf(value) !== -1;
			},
			
			checkGroupNode: function (a, b) {
			    if (b.checkedKeys.length > 0) {
			      this.$refs.selectTreeOne.setCheckedKeys([a.teacherId]);
			    }
			},
			
			dowmTea(){
				var data = this.schoolId;
				var parma =this.yearTermId;
				let getstr = '?excelType=xls&schoolId=' + data + '&yearTermId=' + parma + '';
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'eduManageTeachingSubject/teacherListDownLoad'+getstr));
			},
			dowmClass(){
				var data = this.schoolId;
				var parma =this.yearTermId;
				let getstr = '?excelType=xls&schoolId=' + data + '&yearTermId=' + parma + '';
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia+'eduManageTeachingSubject/classListDownLoad'+getstr));
			},
			//切换tab
			handleClick(){
				if(this.activeName=='first'){
					this.getTealist();
				}else if(this.activeName=='second'){
					this.getClasslist()
				}
			},
			schoolTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTermAll',
					method: 'get',
					contentType: 1,
//					data: {},
				}, function(data) {
					that.yearList=data.list;
					that.yearTermId=data.yearTermId;
					that.getClasslist();
				})
			},
			objectSpanMethod(row,column,rowIndex,columnIndex) {
				if (row.columnIndex === 0 || row.columnIndex === 1 ) {
		          if (row.row.classLen>0) {
		          	let rowspan = row.row.classLen==0?1:row.row.classLen
		            return {
		              rowspan:row.row.classLen,
		              colspan: 1
		            };
		          } else {
		            return {
		              rowspan: 0,
		              colspan: 0
		            };
		          }
		        }
			},
			getTealist() {
				let that = this
				that.loadingTea = true
				getCommHttpData({
					url: 'eduManageTeachingSubject/teacherList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						yearTermId: this.yearTermId,
						schoolId: this.schoolId,
						keywords:this.keywords
					}
				}, function(data) {
					that.loadingTea = false
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex!= 1) {
							that.pageIndex= 1
							that.getTealist()
						}
						let tempArr = new Array()
						let list = data.page.list
						for(let i in list){
							for(let j in list[i].subjectList){
								let classLen = j==0?list[i].subjectList.length:0
								//classLen = classLen==1?0:classLen
								tempArr.push({
									index:parseInt(i)+1,
									teacherId:list[i].teacherId,
									classLen:classLen,
									teacherName:list[i].teacherName,
									className:list[i].classList[j].className,
									subjectName:list[i].subjectList[j].subjectName})
							}
							
						}
						that.dateList = tempArr
						that.totalPage = data.page.totalCount
					} else {
						that.dateList = []
						that.totalPage = 0
					}
					//					that.listLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getTealist()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getTealist()
			},
			getClasslist() {
				let that = this
				that.loadingClass = true;
				getCommHttpData({
					url: 'eduManageTeachingSubject/classList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndexClass,
						limit: this.pageSizeClass,
						order: "",
						sidx: "",
						yearTermId: this.yearTermId,
						schoolId: this.schoolId,
						keywords:this.keywords
					}
				}, function(data) {
					that.loadingClass = false;
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndexClass != 1) {
							that.pageIndexClass = 1
							that.getClasslist()
						}
						that.classHeader = data.heardlist
						that.classDate = data.page.list
						that.totalPageClass = data.page.totalCount
					} else {
						that.classDate = []
						that.totalPageClass = 0
					}

				})
			},
			// 每页数
			sizeChangeHandleClass(val) {
				this.pageSizeClass = val
				this.pageIndexClass = 1
				this.getClasslist()
			},
			// 当前页
			currentChangeHandleClass(val) {
				this.pageIndexClass = val
				this.getClasslist()
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
						that.teaList = data.list;
					})
				// }
			},
			//删除
			handleClose(row,data,sub){
				let that = this;
				getCommHttpData({
					url: 'eduManageTeachingSubject/deleteTeacher',
					method: 'post',
					contentType: 2,
					data: {
						teachingId:data.teachingId,
						schoolId: this.schoolId,
						yearTermId: row.yearTermId,
						teacherId:data.teacherId,
						subjectId: sub.subjectId,
						classId: row.classId,
						gradeId: row.gradeId,
					},
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '操作成功!'
						});
						that.getClasslist()
					}
				})
				
			},
			//编辑
			editShow(row,subdata,teadata){
				this.judege="1";
				this.submitTea = row
				this.teaShow = true;
				this.showForm.className = row.className;
				this.showForm.subjectName =subdata.subjectName;
				// this.teaList=[teadata];
				//this.getTnames(teadata.teacherName);
				this.showForm.checkTea=teadata.teacherId;
				this.showForm.teacherName=teadata.teacherName;
				let that = this
				this.$nextTick(()=>{
					that.$refs.selectTreeOne.setCheckedKeys([teadata.teacherId])
				})
				this.subdata=subdata;
				this.teadata=teadata;
			},
			//显示弹框
			showDailog(row,subdata,teadata) {
				this.submitTea = row
				this.judege="2"
				this.teaShow = true;
				this.showForm.className = row.className;
				this.showForm.subjectName =subdata.subjectName,
				this.showForm.teacherName=''
				this.showForm.checkTea="";
				this.subdata=subdata;
				this.teadata=teadata;
				this.$nextTick(()=>{
					this.$refs.selectTreeOne.setCheckedKeys([])
				})
				// this.teaList=[];
			},
			sureTea() {
				let that = this;
				getCommHttpData({
					url: 'eduManageTeachingSubject/saveTeacher',
					method: 'post',
					contentType: 2,
					data: {
						teachingId:this.submitTea.teachingId,
						schoolId: this.schoolId,
						yearTermId: this.submitTea.yearTermId,
						teacherId: this.showForm.checkTea,
						subjectId: this.subdata.subjectId,
						subjectName:this.subdata.subjectName,
						classId: this.submitTea.classId,
						gradeId: this.submitTea.gradeId,
					},
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '操作成功!'
						});
						that.teaShow = false;
						that.getClasslist()
					}
				})
			},
			editTea() {
				let that = this;
				getCommHttpData({
					url: 'eduManageTeachingSubject/updateTeacher',
					method: 'post',
					contentType: 2,
					data: {
						teachingId:this.teadata.teachingId,
						schoolId: this.schoolId,
						yearTermId: this.submitTea.yearTermId,
						teacherId: this.showForm.checkTea,
						subjectName:this.subdata.subjectName,
						subjectId: this.subdata.subjectId,
						classId: this.submitTea.classId,
						gradeId: this.submitTea.gradeId,
					},
				}, function(data) {
					if(data.code == 0) {
						that.$message({
							type: 'success',
							message: '操作成功!'
						});
						that.teaShow = false;
						that.getClasslist()
					}
				})
			}
		}
	}
</script>
<style>
	.el-popover{
		padding: 0;
		position: relative;
	}
	.search-tree{
		min-width: 380px;
		z-index: 9999;
		background-color: #fff;
		position: absolute;
		overflow: auto;
		border: 1px solid #ddd;
		line-height: normal;
		max-height: 300px;
	}
	.selectTree-input1 .el-checkbox__inner{
		border-radius: 50%;
	}
	.search-tree .el-input__suffix{
		right: 10px;
	}
</style>
<style scoped lang="scss">
.el-tabs__nav {
		#tab-first {
			padding-left: 20px;
		}
	}
	.table-width{
		width: 150px;
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
	.is-center .el-button--medium{
		padding: 0 !important;
	}
	.el-tag{
		margin-top: 10px;
	}
	.el-tag:first-child{
		margin-top: 0;
	}
	.el-table th.gutter {
		display: table-cell;
	}
		

</style>