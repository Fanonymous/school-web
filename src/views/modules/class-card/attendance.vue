<template>
	<div class="attendance">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="考勤记录" name="first">
				<date-analy @refreshChartsData="getDateData"></date-analy>
				<el-input v-model="keywords" @input="getList" placeholder="请输入姓名查询" style="width:300px"></el-input>
				<el-table :data="attlist" v-loading="listLoading" border fit highlight-current-row>
					<el-table-column align="center" type="index" label='序号' width="95">
						<template slot-scope="scope">
							{{scope.$index+1+pageSize*(pageIndex-1)}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="照片">
						<template slot-scope="scope">
							<img :src="baseIp+scope.row.imagePath" @click="largeImgMessage(baseIp+scope.row.imagePath,scope.row.imagePath)" :onerror="defaultImg" width="26px" height="26px" />
						</template>
					</el-table-column>
					<el-table-column align="center" prop="name" label="姓名">
					</el-table-column>
					<el-table-column align="center" prop="createTime" label="时间">
					</el-table-column>
					<el-table-column align="center" prop="status" label="状态">
					</el-table-column>
					<el-table-column align="center" prop="" label="考勤方式">
						<template slot-scope="scope">
							<span v-if="scope.row.type === 1" >人脸识别</span>
							<span v-else size="small">刷卡</span>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</el-tab-pane>
			<el-tab-pane label="学生名单" name="second">
				<el-select v-model="gradeClassId" clearable placeholder="请选择年级班级" @change="getStuList" clearable style="margin-bottom: 10px;">
					<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
					</el-option>
				</el-select>
				<el-select v-model="yearTermId" clearable placeholder="请选择学年学期" @change="getStuList" style="margin-bottom: 10px;">
					<el-option v-for="item in yearList" :key="item.yearTermId" :label="item.yearName" :value="item.yearTermId">
					</el-option>
				</el-select>
				<el-input v-model="stuwords" @input="getStuList" placeholder="请输入姓名查询" style="width:300px"></el-input>
				<el-table :data="stulist" v-loading="stuLoading" border fit highlight-current-row>
					<el-table-column align="center" type="index" label='序号' width="80">
						<template slot-scope="scope">
							{{scope.$index+1+pageSizeStu*(pageIndexStu-1)}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="照片">
						<template slot-scope="scope">
							<img :src="baseIp+scope.row.imagePath" @click="largeImgMessage(baseIp+scope.row.imagePath,scope.row.imagePath)" :onerror="defaultImg" width="26px" height="26px" />
						</template>
					</el-table-column>
					<el-table-column align="center" prop="username" label="用户名">
					</el-table-column>
					<el-table-column align="center" prop="stuName" label="姓名">
					</el-table-column>
					<el-table-column align="center" prop="userType" label="身份">
					</el-table-column>
					<el-table-column align="center" prop="className" label="班级">
					</el-table-column>
					<el-table-column align="center" prop="mobile" label="联系电话">
					</el-table-column>
					<el-table-column align="center" prop="stuCode" label="学籍号/工号">
					</el-table-column>
					<el-table-column align="center" prop="" label="性别">
						<template slot-scope="scope">
							<span v-if="scope.row.sex === 0">女</span>
							<span v-else size="small" >男</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="birthday" label="出生日期">
					</el-table-column>
					<el-table-column align="center" prop="nativePlace" label="籍贯">
					</el-table-column>
				</el-table>
				<el-pagination @size-change="sizeChangeHandleStu" @current-change="currentChangeHandleStu" :current-page="pageIndexStu" :page-sizes="[10, 20, 50, 100]" :page-size="pageSizeStu" :total="totalPageStu" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</el-tab-pane>
			</el-tab-pane>
		</el-tabs>

	</div>
</template>

<script>
	import DateAnaly from '../common/date-analy'
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	export default {
		data() {
			return {
				keywords: "",
				stuwords:"",
				baseIp: window.SITE_CONFIG.imgIP,
				defaultImg: 'this.src="' + require('../../../assets/img/nodata.png') + '";this.onerror = null',
				activeName: 'first',
				listLoading:false,
				stuLoading:false,
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				pageIndexStu: 1,
				pageSizeStu: 10,
				totalPageStu: 0,
				gradeClassId: undefined,
				yearTermId: "",
				startDate:'',
      			endDate:'',
      			attlist:[],
      			stulist:[],
      			theGcoption:[],
      			yearList:[],
      			yearTermId:''
			}
		},
		components: {
			DateAnaly
		},
		methods: {
			//日期
			getDateData(startDate, endDate) {

				this.startDate = startDate
				this.endDate = endDate
				this.getList()
			},
			//切换
				handleClick(){
				if(this.activeName=='first'){
					this.getList();
				}else if(this.activeName=='second'){
					this.gradeClass();
					this.getYearTerm();
					
				}
			},
			//考勤
			getList() {
				this.listLoading = true
				let that = this
				let startDate = this.startDate.length == 0 ? undefined : this.startDate;
				let endDate = this.endDate.length == 0 ? undefined : this.endDate;
				let keywords = this.keywords.length == 0 ? undefined : this.keywords
				getCommHttpData({
					url: 'attendance/getList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						startDate: startDate,
						endDate:endDate,
						keywords: keywords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndex != 1) {
							that.pageIndex = 1
							that.getList()
						}
						that.attlist = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.attlist = []
						that.totalPage = 0
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
			//	年级班级
			gradeClass() {
				let that = this;
				getCommHttpData({
					url: 'common/queryGradeAndClassByUser',
					method: 'get',
					contentType: 1,
					data: {
						yearTermId: "0"
					},
				}, function(data) {
					that.theGcoption = data.list;
					if(data.list.length>0){
						that.gradeClassId=0
					}
					
					that.getStuList();
				})
			},
			//学年学期
			getYearTerm() {
				let that = this;
				getCommHttpData({
					url: 'common/queryYearTerm',
					method: 'get',
					contentType: 1,
				}, function(data) {
					that.yearList = data.list;
				})
			},
			//图片预览
			largeImgMessage(imgSrc,num) {
				if(num&&num!=""){
					this.$alert('<img src="'+imgSrc+'" width="390px" height="auto" onerror="this.src=\"' + require('../../../assets/img/nothing.png') + '\";this.onerror = null" >', '预览', {
			          dangerouslyUseHTMLString: true,
			          showConfirmButton:false,
			          closeOnClickModal:true
			        });
				}
      			
			},
			//学生名单
			getStuList() {
				this.stuLoading = true
				let that = this
				let stuwords = this.stuwords.length == 0 ? undefined : this.stuwords;
				let yearTermId = this.yearTermId.length == 0 ? undefined : this.yearTermId;
				let classId,gradeId;
				console.log(classId,gradeId)
				if(this.gradeClassId!=undefined&&this.theGcoption.length>0){
					
					classId=this.theGcoption[this.gradeClassId].classId;
					gradeId=this.theGcoption[this.gradeClassId].gradeId;
				}else{
					classId=undefined;
				    gradeId=undefined
				}
				getCommHttpData({
					url: 'attendance/getStuList',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndexStu,
						limit: this.pageSizeStu,
						classId: classId,
						gradeId:gradeId,
						yearTermId:yearTermId,
						keywords: stuwords
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length == 0 && that.pageIndexStu != 1) {
							that.pageIndexStu = 1
							that.getStuList()
						}
						that.stulist = data.page.list
						that.totalPageStu = data.page.totalCount
					} else {
						that.stulist = []
						that.totalPageStu = 0
					}
					that.stuLoading = false
				})
			},
			// 每页数
			sizeChangeHandleStu(val) {
				this.pageSizeStu = val
				this.pageIndexStu = 1
				this.getStuList()
			},
			// 当前页
			currentChangeHandleStu(val) {
				this.pageIndexStu = val
				this.getStuList()
			},
		}
	}
</script>

<style>

</style>