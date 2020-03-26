<template>
	<el-dialog :title="!dataForm.id ? '绑定分类' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
		
		<el-input class="right margin-bottom-10" style="width:200px;"  v-model="keywords" @input="getDataList" placeholder="请输入关键字" clearable></el-input>
		<el-table :data="dataList" ref="tableData" border :row-key="getRowKey" @selection-change="selectionChangeHandle" style="width: 100%;">
			<el-table-column type="selection" :reserve-selection="true" header-align="center" align="center" width="50">
			</el-table-column>
			<el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
				<template slot-scope="scope">
					 {{scope.$index+1+pageSize*(pageIndex-1)}}
				</template>
			</el-table-column>
			<el-table-column prop="tagName" header-align="center" align="center" label="分类名称">
			</el-table-column>
			<el-table-column prop="tagValue" header-align="center" align="center" label="分类值">
			</el-table-column>
			<!--<el-table-column prop="bindNum" header-align="center" align="center" label="绑定数据源数">
			</el-table-column>
			<el-table-column prop="deptTypeName" header-align="center" align="center" label="用户类型">
			</el-table-column>-->
		</el-table>
		<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>   
		<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @labelList="getDataList"></add-or-update>
	</el-dialog>
</template>
<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
</style>
<script>
	import { getCommHttpData, deleteData } from '@/utils/common'
	import AddOrUpdate from '../media/config-add-or-update'
	export default {
		props: {
			tagLabelName: {
				type: String,
				default: '班级'
			},
	    },
		data() {
			return {
				keywords: undefined,
				visible: false,
				dataForm: {
					paramKey: ''
				},
				equipList: [],
				labelList: [],
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				tagTemp: [],
				tagName: [],
				savedata:[]
			}
		},
		components: {
			AddOrUpdate
		},
		mounted() {
		},
		methods: {
			init(savedata) {
				//历史数据 初始化
			
				this.save=savedata
				this.visible = true
//				this.pageIndex = 1
				this.getDataList()

			},
//			selectRow (val) {
//		        this.selectlistRow = val
//		      },
		    clearRow (){
		      this.$refs.tableData.clearSelection()
		    },
			getRowKey (row) {
			      return row.tagId
			    },
			// 获取数据列表
			getDataList() {
				
				this.dataListLoading = true
				let that = this
				this.keywords = this.keywords == '' ? undefined : this.keywords;
				getCommHttpData({
					url: 'device/findAllOfTag',
					method: 'post',
					contentType: 2,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						tagMsg: this.keywords,
						tagName: this.tagLabelName
					}
				}, function(data) {
					if(data && data.code === 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex = 1
							that.getDataList()
						}
						that.clearRow()
						
						//选中历史数据
						for(var m=0;m<that.save.length;m++){
							 that.$refs.tableData.toggleRowSelection(that.save[m]); 
							 that.selectionChangeHandle(that.save[m])
						}
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
						//that.dataListSelections = that.labelList
						//编辑赋值
						that.dataListSelections = that.save
						
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
				this.dataListSelections = val;
			},
			dataFormSubmit() {
				let tagList = this.dataListSelections
				if(tagList.length == 0 &&this.save.length==0) {
					this.$message({
						message: '请选择分类',
						type: 'error'
					})
					return;
				}else{
					this.$emit('labelList', tagList)
					this.visible = false;
				}

			}
		}
	}
</script>