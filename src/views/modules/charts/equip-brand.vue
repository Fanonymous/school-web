<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
    <el-col :span="24">
    	<el-card shadow="hover">
        <div class="table-title margin-bottom-20">
          品牌详情
          <!-- <div class="right"><el-button type="primary" size="mini">导出</el-button></div> -->
        </div>
        <el-table :data="dataList" ref="table" v-loading="listLoading" fit row-key="name" :expand-row-keys="expands">
          <el-table-column type="expand"  width="1">
            <template slot-scope="scope">
              <div class="expend-brand">
                <template v-for="item in scope.row.list">
                  <el-col :span="6">
                      <!-- <img v-real-img="imgFixedIP+'name='+item.name+'&coomType=1'" :src="defaultPic" width="26px"/>&nbsp;&nbsp; -->
                      {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.num}}台
                  </el-col>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label='' width="170">
            <template slot-scope="scope">
              <img v-if="scope.row.name =='希沃'" src="~@/assets/img/brand/1.png"  width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='创维'"  src="~@/assets/img/brand/2.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='中师华创'" src="~@/assets/img/brand/3.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='鸿合'"  src="~@/assets/img/brand/4.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='纳吉特'"  src="~@/assets/img/brand/15.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='创凯智能'"  src="~@/assets/img/brand/13.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='东方中原'"  src="~@/assets/img/brand/12.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='小米'"  src="~@/assets/img/brand/16.png" width="160px" height="96px"/>
              <img v-else-if="scope.row.name =='巨龙科教'"  src="~@/assets/img/brand/14.png" width="160px" height="96px"/>
              <!-- <img v-if="scope.row.name !='未知'"  v-real-img="imgFixedIP+'name='+scope.row.name+'&coomType=2'" :src="defaultPic" width="160px" height="96px"/> -->
              <!-- <img v-real-img="fileIP+'equipLogo/'+scope.row.name" :src="defaultPic" width="160px" height="96px"/> -->
              <!-- <img v-if="scope.row.name !='未知'"  v-real-img="imgFixedIP+'name='+scope.row.name+'&coomType=2'" :src="defaultPic" width="160px" height="96px"/> -->
              <img v-else src="~@/assets/img/brand/11.png" width="160px" height="96px"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="品牌">
            <template slot-scope="scope">
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量">
            <template slot-scope="scope">
              {{scope.row.num}}台
            </template>
          </el-table-column>
          <el-table-column align="center" label="占比">
            <template slot-scope="scope">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.rate"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="status" header-align="center" align="center" label=""  width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleCheck(scope.$index,scope.row)">
                <i v-if="scope.row.plusIcon" class="el-icon-plus el-icon-large-table"/>
                <i v-else class="el-icon-minus el-icon-large-table"/>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container fr">
          <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>

      </el-card>
      </el-col>
	</div>

</template>
<style>
  .el-table__expanded-cell[class*=cell]{
    /* padding: 0px; */
    background-color: #e6f6f4;
  }
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
	.el-table__expand-icon{
		display: none;
	}
  .expend-brand{
    /* padding: 20px 20px 20px 63px; */
    margin: 10px 0px 40px 63px;

  }
  .el-icon-large-table{
    font-size: 20px;
    font-weight: bold;
  }
</style>
<script>
	import Grade from '../common/grade'
	import Class from '../common/class'
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData } from '@/utils/common'
  import defaultPic from '@/assets/img/brand/10.png'
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
        imgFixedIP:window.SITE_CONFIG.imgFixedIP,
        defaultPic:defaultPic,
				addLoading: false,
				dataList: null,
				listLoading: true,
				pageSize: 10,
				pageIndex: 1,
				totalPage: 0,
        plusIcon: true,
        expands:[]
			}
		},

		mounted() {

			this.getDataList();
		},
		methods: {
			handleCheck(index,row) {
	        const $table = this.$refs.table
	        $table.toggleRowExpansion(row)
	        $table.toggleRowSelection(row)
          this.dataList[index].plusIcon = !this.dataList[index].plusIcon

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
			//品牌列表
			getDataList() {
				let that = this
				getCommHttpData({
					url: 'equipAnalysis/groupByBrand',
					method: 'get',
					contentType: 1,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: '',
						schoolId: this.schoolId
					}
				}, function(data) {
					if(data && data.code == 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
							that.pageIndex = 1
							that.getDataList()
						}
						that.listLoading = false
            data.page.list.forEach((item,index)=>{
              item.plusIcon =  index == 0?false:true
            })
            that.expands = [data.page.list[0].name]
						that.dataList = data.page.list
						that.totalPage = data.page.totalCount
					} else {
						that.dataList = []
						that.totalPage = 0
					}
				})

			}
		}
	}
</script>
