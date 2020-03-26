<template>
	<div class="mod-config">
		<el-card class="blue-shadow">
			<el-form :inline="true" @keyup.enter.native="getDataList()">
				<el-form-item label="截止日期">
					<end-date-analysis @refreshChartsData="getDateData"></end-date-analysis>
				</el-form-item>
				<media-analysis :schoolShow=true :schoolTypeShow=true :schoolSideTypeShow=true  @refreshChartsData="getFilterMediaData"></media-analysis>
			</el-form>
			<el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
				<el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
					<template slot-scope="scope">
						{{scope.$index+1+pageSize*(pageIndex-1)}}
					</template>
				</el-table-column>
				<el-table-column prop="schoolName" header-align="center" align="center" label="学校名称">
				</el-table-column>
				<el-table-column prop="equipTotal" header-align="center" align="center" label="装备数量">
				</el-table-column>
				<el-table-column prop="mediaClassroom" header-align="center" align="center" label="多媒体教学比例">
				</el-table-column>
				<el-table-column prop="classroom" header-align="center" align="center" label="班级教室配备率">
				</el-table-column>
				<el-table-column prop="funClassroom" header-align="center" align="center" label="功能教室配备率">
				</el-table-column>
			</el-table>
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
	import { getCommHttpData } from '@/utils/common'
	import EndDateAnalysis from '../common/end-date-analysis'
	import MediaAnalysis from '../common/media-analysis'
	export default {
		components: {
			EndDateAnalysis,
			MediaAnalysis
		},
		data() {
			return {
				startDate:'',
				schoolSideType:'',
				schoolType:'',
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false
			}
		},
		activated() {
			this.getDataList()
		},
		methods: {
			getDateData(startDate, endDate) {
				this.startDate = startDate
				this.getDataList()
			},
			getFilterMediaData(jsonParams){
	    		this.schoolSideType = jsonParams.schoolSideType
    			this.schoolType = jsonParams.schoolType
	    		this.getDataList()
	    	},
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				var that = this
				getCommHttpData({
					url: 'multimemediaEquip/equipRate',
					method: 'get',
					contentType: 1,
					data: {
						date:this.startDate,
						unitId:87,
						page: this.pageIndex,
						limit: this.pageSize,
						tagMsg: this.keywords 
					}
				}, function(data) {
					if(data && data.code === 0) {
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
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			}
		}
	}
</script>