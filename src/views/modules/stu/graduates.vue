<template>
	<div class="graduates">
		<el-card class="blue-shadow">
			<el-select v-model="schoolYearId" clearable placeholder="请选择毕业年份" style="width:150px" @change="changeYearId">
				<el-option v-for="item in option1" :key="item.schoolYearId" :label="item.gYear" :value="item.schoolYearId">
				</el-option>
			</el-select>
			<el-select v-model="gradeId" clearable placeholder="请选择年级" style="width:150px" @change="changeGrade">
				<el-option v-for="item in gradeOption" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
				</el-option>
			</el-select>
			<el-select v-model="classId" clearable placeholder="请选择班级" style="width:150px" @change="changeClassId">
				<el-option v-for="item in classOption" :key="item.classId" :label="item.className" :value="item.classId">
				</el-option>
			</el-select>
			<el-input v-model="msg" style="width:300px" @input="getDataList()" clearable placeholder="姓名/手机号/邮箱/身份证号/学籍号"></el-input>
			<div style="float: right;">
				<el-button type="primary" style="border:none;" :disabled="dataList.length == 0 " @click="exportTable()">导出</el-button>
				<el-button type="primary" style="border:none;" @click="openDialog()">毕业设置</el-button>
			</div>
			<el-row v-if="isHaveHistory">
				<div style="text-align: right;margin-top: 15px;"><i class="el-icon-warning" style="color:#e6a23c"></i> 您有历史学年待处理的毕业生设置，
					<el-button type="text"  @click="openDialog()">前往设置</el-button>
				</div>
			</el-row>
			<el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;margin-top: 10px;">
				<el-table-column type="index" label="序号" align="center" width="80">
				</el-table-column>
				<el-table-column label="姓名" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'show-register2',query:{stuId:scope.row.stuId}}" style="text-decoration: none;">
							<el-button type="text">{{scope.row.stuName}}</el-button>
						</router-link>
					</template>
				</el-table-column>
				<el-table-column property="className" label="毕业班级" align="center">
				</el-table-column>
				<el-table-column property="telphone" label="手机号" align="center">
				</el-table-column>
				<el-table-column property="email" label="邮箱" align="center">
				</el-table-column>
				<el-table-column property="identityNum" label="身份证号" align="center">
				</el-table-column>
				<el-table-column property="stuCode" label="学籍号" align="center">
				</el-table-column>
				<el-table-column label="性别" align="center" property="sex">
				</el-table-column>
				<el-table-column property="inDate" label="入校年份" align="center">
				</el-table-column>
				<el-table-column property="graduateDate" label="毕业年份" align="center">
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
				 :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
		<!-- 毕业设置 -->
		<el-dialog title="毕业设置" :visible.sync="logVisible" width="650px" @close="handleCloseDialog1">
			<el-form ref="dataForm" :model="form" label-position="right">
				<div style="font-size: 13px;color: #333333;height: 35px;">敬爱的老师，感谢您，您辛苦了！</div>
				<div style="color: #999999;font-size: 18px;height: 50px;">三尺讲台三寸舌三寸笔三千桃李，十年树木十载风十载雨十万栋梁！</div>
				<el-form-item label="请选择毕业年级：">
					<el-row>
						<el-col :span="8">
							<el-select v-model="form.schoolYearId" placeholder="请选择学年" @change="changeSchoolYears">
								<el-option v-for="item in graduatYearList" :key="item.schoolYearId" :label="item.schoolYearName" :value="item.schoolYearId">
								</el-option>
							</el-select>
						</el-col>
						<el-col :span="8">
							<el-select v-model="form.gradeId" placeholder="请选择年级" @change="changeGrade1">
								<el-option v-for="item in graduatGradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
								</el-option>
							</el-select>
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleCloseDialog1">取消</el-button>
				<el-button type="primary" :disabled="!form.schoolYearId || !form.gradeId" @click="dialogDelete=true">置为毕业</el-button>
			</div>
		</el-dialog>
		<!--删除-->
				<el-dialog title="" :visible.sync="dialogDelete" width="480px" @close="handleDialogClose">
					<div style="font-size:14px;margin-top:-20px;margin-bottom: 20px;"> 您确认将{{schoolYearName}}的{{gradeName1}}置为毕业吗？ 确定后年级下所有学生将变为毕业生，且操作不可逆转。</div>
					<div>
						<el-checkbox v-model="isChecked"><span style="font-size: 12px;;">我已知晓</span></el-checkbox>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="handleDialogClose">取消</el-button>
						<el-button type="primary" :disabled="!isChecked" @click="setGraduateGrade" :loading="addLoading">确定</el-button>
					</div>
				</el-dialog>
				<!-- jindou -->
				<el-dialog title="" :visible.sync="batchClick">
					<el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
				</el-dialog>

	</div>
</template>

<script>
	import {
		getCommHttpData,
		getCommonDictByType,
		getExportFile,
	} from '@/utils/common'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				batchClick: false,
				percentage:0,
				option1: [],
				gradeOption: [],
				classOption: [],
				dataList: [],
				msg: null,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				logVisible: false,
				schoolYearId: null,
				gradeId: null,
				classId: null,
				addLoading: false,
				form: {
					schoolYearId: '',
					gradeId: ''
				},
				graduatYearList:[],
				graduatGradeList: [],
				isChecked: false,
				dialogDelete: false,
				schoolYearName:'',
				gradeName1:'',
				isHaveHistory:'',
				paramClassList:null,
				graduatesClassNum:null
			}
		},
		created() {
			this.getSection()
			this.getDataList();
			// this.getGraduatList();
			this.getIsHaveHistory()
		},
		methods: {
			//导出数据
			exportTable(){
				let keywords = this.msg ? this.msg : ''
				let classId = this.classId ? this.classId : ''
				let gradeId = this.gradeId ? this.gradeId : ''
				let schoolYearId = this.schoolYearId ? this.schoolYearId : ''
				
				getExportFile(this,'stu/changeInfo/downloadStuInfo',{excelName:'毕业生信息表',schoolId:this.schoolId,schoolYearId:schoolYearId,keywords:keywords,type :7 , classId:classId,gradeId:gradeId})
			},
			//是否有毕业年级
			getIsHaveHistory(){
				let that = this;
				getCommHttpData({
					url: 'eduManageClass/isHaveHistory',
					method: 'post',
					contentType: 2,
					//					data: {},
				}, function(data) {
					that.isHaveHistory = data.isHaveHistory;
				})
			},
			getSection() {
				let that = this;
				getCommHttpData({
					url: 'eduManageClass/getGraduateInfo',
					method: 'post',
					contentType: 2,
					//					data: {},
				}, function(data) {
					that.option1 = data.list;
				})
			},
			changeYearId(val){
				
				let tempGradeList = this.option1.find(item=>{
					return val == item.schoolYearId
				})
				
				if(!val){
					this.gradeId = ''
					this.classId = ''
					this.gradeOption = []
					this.classOption = []
				}else{
					let classList = tempGradeList.gradeList[0].classList
						this.gradeOption = tempGradeList.gradeList
						this.gradeId = tempGradeList.gradeList[0].gradeId
						this.classOption = classList
						this.paramClassList = classList.map(item=>{
							return item.classId
						})
				}
				this.getDataList()
			},
			changeGrade(val){
				let tempClassList = this.gradeOption.find(item=>{
					return val == item.gradeId
				})
				
				if(!val){
					this.classId = ''
					this.classOption = []
				}else{
					this.classOption = tempClassList.classList
					this.classId = '',
					this.paramClassList = tempClassList.classList.map(item=>{
						return item.classId
					})
				}
				this.getDataList()
			},
			changeClassId(val){
				this.paramClassList = null
				this.getDataList()
			},
			openDialog() {
				this.getGraduatList()
				// this.logVisible = true
			},
			handleDialogClose(){
				this.dialogDelete=false;
				this.isChecked = false
			},
			handleCloseDialog1(){
				this.logVisible = false
				this.form = {
					schoolYearId: '',
					gradeId: ''
				}
				this.graduatGradeList = []
			},
			changeSchoolYears(val){
				let tempGradeList = this.graduatYearList.find(item=>{
					return val == item.schoolYearId
				})
				this.schoolYearName = tempGradeList.schoolYearName
				let gradeIds = tempGradeList.gradeIds.split(',')
				let gradeNames = tempGradeList.gradeNames.split(',')
				let gradeClassNum = tempGradeList.classCounts.split(',')
				this.graduatGradeList = []
				gradeIds && gradeIds.forEach((item,index)=>{
					this.graduatGradeList.push({
						gradeId:item,
						gradeName : gradeNames[index],
						num: gradeClassNum[index]
					})
				})
				this.form.gradeId = ''
			},
			changeGrade1(val){
				let tempList = this.graduatGradeList.find(item=>{
					return val == item.gradeId
				})
				this.gradeName1 =  tempList.gradeName
				this.graduatesClassNum = tempList.num
			},
			setGraduateGrade(){
				this.addLoading = true
				let that = this
				
				let begin;
				that.batchClick = true
				that.percentage = 1
				let classNum = parseInt(that.graduatesClassNum) 
				begin = setInterval(function() {
					if(that.percentage < 99 ) {
						that.percentage++
					}
					if(that.percentage == 100 && that.batchLoading) {
						that.dialogDelete = false
						that.logVisible = false
						that.getSection()
						that.getDataList()
						clearInterval(begin);
					} else if(that.percentage == 100 && !that.batchLoading) {
						clearInterval(begin);
					}
				}, 50*classNum)
				
				
				getCommHttpData({
					url: '/stu/changeInfo/graduate?schoolYearId='+this.form.schoolYearId+'&gradeId='+this.form.gradeId,
					method: 'post',
					contentType:2,
					operateType: 3,
					// data:{
					// 	schoolYearId: this.form.schoolYearId,
					// 	gradeId: this.form.gradeId
					// }
				}, function(data) {
					that.percentage = 100
					that.batchClick = false
					if (data && data.code == 0) {
						that.batchLoading = true
						// that.dialogDelete = false
						// that.logVisible = false
						// that.getSection()
						// that.getDataList()
					}
					that.addLoading = false
				})
			},
			//获取毕业班级列表
			getGraduatList() {
				let that = this;
				getCommHttpData({
					url: 'eduManageClass/getUnGraduateGrade',
					method: 'post',
					contentType: 2
				}, function(data) {
					if (data && data.code == 0) {
						that.graduatYearList = data.list
						that.logVisible = true
					}
				})
			},
			getDataList() {
				this.dataListLoading = true
				let that = this
				getCommHttpData({
					url: '/stu/changeInfo/changeInfoList',
					method: 'post',
					contentType: 2,
					operateType: 3,
					data: {
						schoolId: this.schoolId,
						schoolYearId: !!this.schoolYearId ? this.schoolYearId : null,
						gradeId: !!this.gradeId ? this.gradeId : null,
						classId: !!this.classId ? this.classId : null,
						keywords: !!this.msg ? this.msg : null,
						limit: this.pageSize,
						page: this.pageIndex,
						type:7,
						classIdList:this.paramClassList
					}
				}, function(data) {
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
		}

	}
</script>

<style>

</style>
