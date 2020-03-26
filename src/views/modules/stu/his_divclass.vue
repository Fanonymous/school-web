<template>
	<div class="his_divclass">
		<el-tabs v-model="activeName" @tab-click="handleTabClick" style="background: white;padding-left: 20px;padding-right: 20px;padding-bottom: 20px;">
			<el-tab-pane label="批量调班" name="first">
				<template>
					<el-select v-model="gradeId" placeholder="请选择年级" style="width:150px" @change="changeGrade">
						<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
						</el-option>
					</el-select>
					<el-select v-model="classId" placeholder="请选择班级" style="width:150px" @change="changeClass">
						<el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId">
						</el-option>
					</el-select>
					<!-- <el-input v-model="keywords" style="width:300px" @input="getDataList" placeholder="请输入姓名/用户名/用户拼音查询"></el-input> -->
					<el-button type="primary" style="float: right;margin-left: 10px;" :disabled="isSave" @click="saveData()">保存</el-button>
					<el-button style="float: right;" @click="clearChange()">清空调班</el-button>
					<el-row>
						<el-col :span="11">
							<div class="class-contain" :style="'height: '+appHeight+'px;overflow-y: auto;'">
								<h4>{{gradeName+className}}</h4>
								<div style="margin-left:20px;margin-right: 20px;">
									<el-row :gutter="20">
										<template v-if="studentDataList.length > 0">
											<el-col :span="spanNum" v-for="(item,index) in studentDataList" :key="item.stuId"
											 style="margin-bottom: 15px;">
												<el-popover placement="bottom-start" trigger="hover">
													<el-table :data="[item]">
														<el-table-column property="stuName" label="姓名"></el-table-column>
														<el-table-column property="telPhone" label="手机号"></el-table-column>
														<el-table-column property="email" label="邮箱"></el-table-column>
														<el-table-column property="identityNum" label="身份证号"></el-table-column>
														<el-table-column property="stuCode" label="学籍号"></el-table-column>
													</el-table>
													<el-button v-if="item.isShow" :type="item.isChecked == 1 ? 'primary' : ''" slot="reference" @click="setStudentList(item,index)">{{item.stuName.length > 3 ? item.stuName.substr(0,3)+'..': item.stuName}}</el-button>
												</el-popover>
											</el-col>
										</template>
										<template v-else>
											<div style="text-align: center;">暂无学生</div>
										</template>
									</el-row>
								</div>
							</div>
						</el-col>
						<el-col :span="2" justify="end" :style="'height: '+appHeight+'px;text-align: center;'">
							<div class="center-box">
								<img class="tran-img" :src="allPic" />
								左：选学生<br>
								右：点调入
							</div>
						</el-col>
						<el-col :span="11">
							<div class="class-contain" :style="'height: '+appHeight+'px;overflow-y: auto;'">
								<h4>调入班级</h4>
								<div style="position: relative;">
									<div class="class-name" v-clickoutside="handClose" @click="handleOpen">
										{{changeGradeName}}
										<span class="left-icon">
											<i :class="gradeVisible ? 'el-icon-caret-bottom' : 'el-icon-caret-left'"></i>
										</span>
									</div>
									<div class="el-select-dropdown el-popper" style="position: absolute; top: 37px; left: 0; z-index: 2005;width: 100%;"
									 v-show="gradeVisible">
										<div class="el-scrollbar" style="">
											<div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
												<ul class="el-scrollbar__view el-select-dropdown__list">
													<!---->
													<li class="el-select-dropdown__item" @click="handClick(item)" :class="changeGradeId==item.gradeId ? 'selected hover': ''"
													 v-for="item in gradeList" :key="item.gradeId">
														<span>{{item.gradeName}}</span>
													</li>
												</ul>
											</div>
											<div class="el-scrollbar__bar is-horizontal">
												<div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
											</div>
											<div class="el-scrollbar__bar is-vertical">
												<div class="el-scrollbar__thumb" style="transform: translateY(0%);"></div>
											</div>
										</div>
										<!---->
										<div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
									</div>
								</div>
								<el-table ref="changeTable" :data="cellClassList" :show-header="false" v-loading="loading1">
									<el-table-column align="center" prop="className" width="100">
									</el-table-column>
									<el-table-column align="center">
										<template slot-scope="scope">
											班额：{{scope.row.classNum ? scope.row.classNum : '--'}}
										</template>
									</el-table-column>
									<el-table-column prop="className" label="" align="center">
										<template slot-scope="scope">
											原有人数：{{scope.row.stuNum}}
										</template>
									</el-table-column>
									<el-table-column align="center" width="80">
										<template slot-scope="scope">
											<el-button type="primary" size="mini" @click="transferStudent(scope.$index,scope.row)">调入</el-button>
										</template>
									</el-table-column>
									<el-table-column prop="className" label="" align="center" width="80">
										<template slot-scope="scope">
											<sup class="el-badge__content el-badge__self" style="margin-top: 17px;">{{scope.row.tags.length}}</sup>
										</template>
									</el-table-column>
									<el-table-column prop="className" label="" align="center" width="80">
										<template slot-scope="scope">
											<el-button type="text" @click="handleCheck(scope.row)">详情</el-button>
										</template>
									</el-table-column>
									<el-table-column type="expand" width="1">
										<template slot-scope="scope">
											<template v-if="scope.row.tags.length > 0">
												<el-tag style="margin-left: 10px;" type="info" v-for="(tag,index) in scope.row.tags" :key="index" effect="plain"
												 closable @close="handleCloseTag(tag,index,scope.$index)">
													{{tag.stuName}}
												</el-tag>
											</template>
											<span v-else>暂无调入学生</span>
										</template>
									</el-table-column>
								</el-table>

							</div>
						</el-col>
					</el-row>
				</template>
			</el-tab-pane>
			<el-tab-pane label="调班记录" name="second">
				<template>
					<el-input v-model="keywords1" clearable style="width:300px;margin-bottom: 20px;" @input="getDataList" placeholder="姓名/手机号/邮箱/身份证号/学籍号"></el-input>
					<el-table :data="dataList" border v-loading="loading">
						<el-table-column fixed="left" type="index" label="序号" width="80" align="center">
							<template slot-scope="scope">
								{{scope.$index+1+pageSize*(pageIndex-1)}}
							</template>
						</el-table-column>
						<el-table-column fixed="left" label="学生" align="center">
							<template slot-scope="scope">
								<router-link :to="{name:'show-register1',query:{stuId:scope.row.stuId}}" style="text-decoration: none;">
									<el-button type="text">{{scope.row.stuName}}</el-button>
								</router-link>
							</template>
						</el-table-column>
						<el-table-column fixed="left" prop="telPhone" label="手机号" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="email" label="邮箱" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="stuCode" label="学籍号" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="identityNum" label="身份证号" align="center">
						</el-table-column>
						<el-table-column fixed="left" label="性别" align="center">
							<template slot-scope="scope">
								<span v-if="scope.row.sex ==0">男</span>
								<span v-else-if="scope.row.sex ==1">女</span>
							</template>
						</el-table-column>
						<el-table-column fixed="left" prop="beforeTransfer" label="调班前" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="afterTransfer" label="调班后" align="center">
						</el-table-column>
						<el-table-column fixed="left" prop="transferDate" label="调班时间" align="center">
						</el-table-column>
					</el-table>
					<div style="margin-top: 20px">
						<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
						 :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
						</el-pagination>
					</div>
				</template>
			</el-tab-pane>

		</el-tabs>
	</div>
</template>

<script>
	import {
		getCommHttpData,
		getCommonDictByType,
		getExportFile,
		deleteData
	} from '@/utils/common'
	import allPic from '@/assets/img/change-stu.png'
	export default {
		data() {
			return {
				allPic: allPic,
				schoolId: this.GLOBAL.getOrgId(),
				gradeList: [],
				classList: [],
				gradeId: '',
				classId: '',
				gradeName: '',
				className: '',
				activeName: 'first',
				studentDataList: [],
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				loading: false,
				keywords1: '',
				appHeight: 800,
				changClassList: [],
				cellClassList: [],
				gradeVisible: false,
				changeGradeId: '',
				changeGradeName: '',
				loading1: false,
				spanNum: '',
				changeStudent: [],
				beforeGrade: '',
				beforeClass: '',
				isSave: true
			}
		},
		watch: {
			cellClassList: {
				 handler(newVal, oldVal) {
					 this.isSave = true
				      newVal.forEach(item => {
				      	item.tags && item.tags.forEach(item1 => {
				      		this.isSave = false
				      	})
				      })
				},
				deep:true,
			},
			changeStudent:{
				handler(newVal, old){
					let tmpBeal = localStorage.getItem("isShowLeave")
					if(newVal.length > 0 && tmpBeal == 'false'){
						localStorage.setItem("isShowLeave", "true");
						// this.$store.commit('common/updateIsShowLeave',true)
					}else if(newVal.length == 0 && this.isSave && tmpBeal == 'true'){
						localStorage.setItem("isShowLeave", "false");
					}
				}
			}
		},
		activated() {
			//this.getGrade()
		},
		mounted() {
			console.log(this.$router,'dhdhhdhd')
			window.addEventListener('resize', () => {
				this.appHeight = window.innerHeight - 300
			})
			this.appHeight = window.innerHeight - 300
			let width = document.body.clientWidth
			if (width > 1700) {
				this.spanNum = 4
			} else if (width < 1700 && width > 1350) {
				this.spanNum = 6
			} else if (width < 1300) {
				this.spanNum = 8
			}
			// window.addEventListener('beforeunload', e => this.beforeunloadHandler());
			// window.addEventListener('unload', e => this.beforeunloadHandler(e))
			this.getGrade()
			localStorage.setItem("isShowLeave", "false");
		},
		destroyed(){
		  // window.removeEventListener("scroll",this.handleFun)
		  // window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		  // window.removeEventListener('unload', e => this.beforeunloadHandler(e))
		},
		methods: {
			// beforeunloadHandler(e) {
			// 	if (this.changeStudent.length > 0) {
			// 		e = e || window.event;
			// 		if (e) {
			// 			e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
			// 		}
			// 		return "您是否确认离开此页面-您输入的数据可能不会被保存";
			// 	}
			// },
			clearChange() {
				this.changeStudent = []
				this.studentDataList.length > 0 && this.studentDataList.map(item => {
					item.isShow = true
					item.isChecked = 0
					return item
				})
				this.cellClassList.length > 0 && this.cellClassList.map(item => {
					item.tags = []
					return item
				})
			},
			changeSelect(callback, errfun) {
				this.$confirm('当前还有未保存的调班学生，请先保存后再离开。', '离开此班级？', {
					confirmButtonText: '继续离开',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.clearChange()
					callback()
				}).catch(() => {
					errfun()
				});
			},
			handleTabClick() {
				if (this.activeName == 'first') {
					this.getGrade()
				} else {
					if (this.changeStudent.length > 0) {
						let that = this
						this.changeSelect(that.getDataList(), function() {
							that.activeName = 'first'
						})
					} else {
						this.getDataList()
					}
				}
			},
			setStudentList(item, index) {
				if (item.isChecked == 0) {
					this.studentDataList[index].isChecked = 1
					this.changeStudent.push({
						stuName: item.stuName,
						stuId: item.stuId,
						beforeGradeId: this.gradeId,
						beforeClassId: this.classId
					})
				} else {
					this.studentDataList[index].isChecked = 0
					let tempIndex = this.changeStudent.findIndex(item1 => {
						return item1.stuId == item.stuId
					})
					this.changeStudent.splice(tempIndex, 1)
				}
			},
			transferStudent(index, row) {
				if (this.changeStudent.length > 0) {
					this.changeStudent.map(item => {
						item.afterGradeId = this.changeGradeId
						item.afterClassId = row.classId
						return item
					})
					this.studentDataList.map(item => {
						if (item.isChecked == 1) {
							item.isShow = false
						}
						return item
					})
					let that = this
					let tmpTags = [...that.changeStudent]
					let tmpBeforeTags = [...this.cellClassList[index].tags]
					this.cellClassList[index].tags = tmpBeforeTags.concat(tmpTags)
					this.changeStudent = []
					this.$forceUpdate()
				}
			},
			handleCloseTag(row, index, pIndex) {
				this.cellClassList[pIndex].tags.splice(index, 1)
				this.studentDataList.map(item => {
					if (row.stuId == item.stuId) {
						item.isShow = true
						item.isChecked = 0

					}
					return item
				})
				this.$forceUpdate()

			},
			handleCheck(row) {
				const $table = this.$refs.changeTable

				$table.toggleRowExpansion(row)
				$table.toggleRowSelection(row)
			},
			handleOpen() {
				this.gradeVisible = !this.gradeVisible
			},
			handClose() {
				this.gradeVisible = false
			},
			handClick(item) {
				if (this.changeStudent.length > 0) {
					let that = this
					this.changeSelect(function(){
						that.changeGradeId = item.gradeId
						that.changeGradeName = item.gradeName
						that.getChangeClass()
						that.gradeVisible = false
					},function(){
						return false
					})
				}else{
					this.changeGradeId = item.gradeId
					this.changeGradeName = item.gradeName
					this.getChangeClass()
					this.gradeVisible = false
				}
				// this.changeGradeId = item.gradeId
				// this.changeGradeName = item.gradeName
				// this.getChangeClass()
				// this.gradeVisible = false
			},
			getChangeClass() {
				let that = this;
				this.loading1 = true
				getCommHttpData({
					url: 'eduManageClass/list',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						gradeId: this.changeGradeId
					}
				}, function(data) {
					that.loading1 = false
					let list = data.list
					if (list && list.length > 0) {
						list.forEach(item => {
							item.tags = []
						})
						that.cellClassList = list.filter(item => {
							return item.classId != that.classId;
						})
					} else {
						that.cellClassList = []
					}
				})
			},
			getGrade() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeByParamsAuthority',
					method: 'get',
					contentType: 1,
					data: {
						schoolId: this.schoolId
					}
				}, function(data) {
					that.gradeList = data.list;
					if (data.list && data.list.length > 0) {
						that.gradeId = data.list[0].gradeId
						that.beforeGrade = data.list[0].gradeId
						that.gradeName = data.list[0].gradeName
						that.changeGradeName = data.list[0].gradeName
						that.changeGradeId = data.list[0].gradeId
						that.getClass();
					}
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
						gradeId: this.gradeId
					}
				}, function(data) {
					that.classList = data.list;
					if (data.list && data.list.length > 0) {
						that.classId = data.list[0].classId
						that.className = data.list[0].className
						that.beforeClass = data.list[0].classId
						that.getClassStudent();
						that.getChangeClass()
					} else {
						that.classId = ''
						that.className = ''
						that.cellClassList = []
					}
				})
			},
			changeGrade(val) {
				if (this.changeStudent.length > 0) {
					let that = this
					this.changeSelect(function() {
						let checkGrade = that.gradeList.find(item => {
							return item.gradeId == val
						})
						that.gradeName = checkGrade.gradeName
						that.changeGradeName = checkGrade.gradeName
						that.changeGradeId = checkGrade.gradeId
						that.beforeGrade = checkGrade.gradeId
						that.getClass()
					}, function() {
						that.gradeId = that.beforeGrade
					})
				} else {
					let checkGrade = this.gradeList.find(item => {
						return item.gradeId == val
					})
					this.gradeName = checkGrade.gradeName
					this.changeGradeName = checkGrade.gradeName
					this.changeGradeId = checkGrade.gradeId
					this.beforeGrade = checkGrade.gradeId
					this.getClass()
				}
			},
			changeClass(val) {
				if (this.changeStudent.length > 0) {
					let that = this
					this.changeSelect(function() {
						let checkClass = that.classList.find(item => {
							return item.classId == val
						})
						that.className = checkClass.className
						that.beforeClass = checkClass.classId
						that.getChangeClass()
						that.getClassStudent()
					}, function() {
						that.classId = that.beforeClass
					})
				} else {
					let checkClass = this.classList.find(item => {
						return item.classId == val
					})
					this.className = checkClass.className
					this.beforeClass = checkClass.classId
					this.getChangeClass()
					this.getClassStudent()
				}
			},
			getClassStudent() {
				let that = this;
				getCommHttpData({
					url: '/common/queryStudentByGradeAndClass',
					method: 'get',
					contentType: 1,
					data: {
						gradeId: this.gradeId,
						classId: this.classId
					}
				}, function(data) {
					if (data && data.code === 0) {
						// debugger
						let list = data.list
						list.length > 0 && list.forEach(item => {
							item.isChecked = 0
							item.isShow = true
						})
						that.studentDataList = list
					} else {
						that.studentDataList = []
					}
				})
			},
			saveData() {
				let list = []
				this.cellClassList.forEach(item => {
					item.tags && item.tags.forEach(item1 => {
						list.push(item1)
					})
				})
				let that = this
				getCommHttpData({
					url: 'stu/stuTransferClassRecord/saveBatch',
					method: 'post',
					contentType: 2,
					data: {
						'schoolId': this.schoolId,
						list: list
					},
				}, function(data) {
					if (data && data.code === 0) {
						that.$message({
							message: '调班成功！',
							type: 'success'
						});
						that.getChangeClass()
						that.getClassStudent()
					}
				})
			},
			getDataList() {
				this.loading = true
				let that = this
				getCommHttpData({
					url: 'stu/stuTransferClassRecord/queryTransferClass',
					method: 'post',
					contentType: 2,
					operateType: 3,
					data: {
						'keywords': this.keywords1,
						'limit': this.pageSize,
						'page': this.pageIndex,
						schoolId: this.schoolId
					},
				}, function(data) {
					that.loading = false;
					if (data && data.code === 0) {
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
		}
	}
</script>

<style scoped lang="scss">
	.class-contain {
		margin-top: 20px;
		border: 1px solid #EBEEF5;

		h4 {
			color: #666666;
			font-weight: 700;
			font-size: 18px;
			text-align: center;
		}
	}

	.class-name {
		border-bottom: 1px solid #EBEEF5;
		background-color: #fafafa;
		height: 37px;
		text-align: center;
		line-height: 37px;
		position: relative;
		cursor: pointer;
	}

	.left-icon {
		position: absolute;
		right: 0;
		top: 0;
		width: 21px;
		background: rgba(255, 255, 255, 1);
		border: 1px solid rgba(235, 238, 245, 1);
		height: 37px;
		color: #CCCCCC;
		cursor: pointer;
	}

	.center-box {
		color: #999999;
		height: 100%;
		font-size: 14px;
		line-height: 26px;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		flex-direction: column // margin-top: 200px;
	}

	.tran-img {
		width: 65%;
	}
	.el-badge__self{
		border: 1px solid #3C85EE;
		background: #FFFFFF;
		color: #3C85EE;
	}
</style>
