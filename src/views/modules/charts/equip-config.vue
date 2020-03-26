<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<!-- <el-tabs v-model="activeTab" @tab-click="handleClick">
		    <el-tab-pane label="全部" name="1"></el-tab-pane>
		    <el-tab-pane label="触控一体机" name="2"></el-tab-pane>
		    <el-tab-pane label="电子班牌" name="3"></el-tab-pane>
		    <el-tab-pane label="音响" name="4"></el-tab-pane>
		</el-tabs> -->
    <el-col :span="24" style="position: relative;">
      <el-radio-group id="radio-group-types" ref="radioType" v-model="dataType" size="small" class="margin-bottom-10" @change="getRadioType">
        <el-radio-button label="0" key="0"  v-if="dataTypeList.length>1">全部</el-radio-button>
        <el-radio-button v-for="(item,index) in dataTypeList" v-if="( dataTypeList.length > 4 && index<3 )|| (dataTypeList.length <=4 && index<=3)"  :label="item.name" :key="item.name">{{item.name}}</el-radio-button>
        <el-radio-button label="-1" key="-1" v-if="dataTypeList.length > 4">
          <div @click="getRadioType">更多
          <i v-if="moreTypeShow" class="el-icon-arrow-up"></i>
          <i v-else class="el-icon-arrow-down"></i></div>
        </el-radio-button>
      </el-radio-group>
      <div v-if="dataType == -1 && moreTypeShow"  :style="'position: absolute;left: '+widthSelect+'px; top: 32px;z-index: 999;background-color: #FFFFFF;height: 200px;width:200px;overflow: auto;border: 1px #DCDFE6 solid;'">
         <ul class="box-type">
          <li v-for="(item,index) in dataTypeList" class="item-type" v-if="index >2" :class="dataTypeMore==item.name?'item-type-active':''" @click="getMoreType(item.name)">{{item.name}}</li>
         </ul>
      </div>
      <!-- <el-popover
          placement="bottom"
          title=""
          width="200"
          trigger="click">
          <el-select v-model="dataTypeSelect" placeholder="请选择类型" size="small" >
            <el-option
              v-for="(item,index) in dataTypeList"
              v-if="index>2"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          ttttttttttttttttttttt
          <el-button slot="reference">click 激活</el-button>

        </el-popover> -->


      <!-- <el-select v-model="dataTypeSelect" placeholder="请选择类型" size="small" v-if="dataType == 'more'" style="position: absolute;left: 50px;">
        <el-option
          v-for="(item,index) in dataTypeList"
          v-if="index>2"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select> -->
      <div class="margin-bottom-10" v-if="(dataType !=0 && dataType !=-1) || ( dataType ==-1 && dataTypeMore !='')">
        <!-- <img v-real-img="imgFixedIP+'name='+dataType+'&coomType=1'" :src="defaultPic" height="30px"/>&nbsp;&nbsp; -->
        共有<font size="6">&nbsp;{{totalPage}}&nbsp;</font>种配置</div>
    </el-col>

		<el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row>
			<el-table-column align="center" label='序号' width="95">
				<template slot-scope="scope">
					{{scope.$index+1+pageSize*(pageIndex-1)}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="设备类型">
				<template slot-scope="scope">
					{{scope.row.device}}
				</template>
			</el-table-column>
			<el-table-column align="left" label="设备配置">
				<template slot-scope="scope">
          <template v-if="scope.row.appUseVertion ">
          系统：{{scope.row.equipSysname || '未知'}}<br />
          CPU：{{scope.row.equipCpu || '未知'}}<br />
          运行内存：{{scope.row.equipRam || '未知'}}<br />
          存储容量：{{scope.row.equipDisk || '未知'}}<br />
          </template>
          品牌：{{scope.row.tag || '未知'}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="数量">
				<template slot-scope="scope">
					{{scope.row.num  || '--'}}台
				</template>
			</el-table-column>
			<el-table-column align="center" label="设备所在位置">
				<template slot-scope="scope">
          <template v-for="item in scope.row.list">
            <div>{{item.typeName}}：
            <template v-for="citem in item.list">
              {{citem.name}}
            </template>
            </div>
          </template>

				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container fr">
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</div>

	</div>

</template>
<style>
.box-type{
    list-style: none;
    padding: 6px 0;
    margin: 0;
    box-sizing: border-box;
  }
  .item-type{
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .item-type:hover{
    background-color: #f5f7fa
  }
  .item-type-active{
    color: #3C85EE;
    font-weight: 700;
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
				addLoading: false,
				dataList: null,
				listLoading: true,
				pageSize: 10,
				pageIndex: 1,
				totalPage: 0,
				activeTab:'1',
        dataTypeList:[],
        dataType:'0',
        dataTypeSelect:'',
        imgFixedIP:window.SITE_CONFIG.imgFixedIP,
        defaultPic:defaultPic,
        dataTypeMore:'',
        moreTypeShow:false,
        widthSelect:200
			}
		},

		mounted() {
      this.getDeviceTypeList()
			this.getDataList();
		},
		methods: {
      handleCommand(command) {
        this.dataType = command
        this.getDataList()
      },
      getMoreType(moreType){

        this.dataTypeMore = moreType
        this.moreTypeShow = false
        this.getDataList()
      },
      getRadioType(){
        this.$nextTick(function () {
           this.widthSelect = this.$refs.radioType.$el.clientWidth-70;
        })
        if(this.dataType == -1){
          if(this.dataTypeMore ==''){
            this.moreTypeShow = true
          }else{
            if(this.moreTypeShow){
              this.moreTypeShow = false
            }else{
              this.moreTypeShow = true
            }
          }
        }else{
          this.dataTypeMore = ''
        }
        console.log(this.dataTypeMore)
        this.getDataList()
      },
      getDeviceTypeList(){
        let that = this
        getCommHttpData({url:'equipAnalysis/equipType',method:'get',contentType:1,data:{coomType:1}},function(data){
          if (data && data.code === 0) {
            that.dataTypeList = data.list
            if( data.list.length == 1){
              that.dataType =  data.list[0].name
            }
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
			//教室列表
			getDataList() {
				let that = this

        if(that.dataType == -1 && that.dataTypeMore==''){
          return
        }
        that.listLoading = true
        let deviceName = this.dataType == 0?undefined:this.dataType
        if(that.dataType == -1){
          deviceName = that.dataTypeMore !=''?that.dataTypeMore:undefined
        }
				getCommHttpData({
					url: 'equipAnalysis/groupByConfig',
					method: 'get',
					contentType: 1,
					data: {
						page: this.pageIndex,
						limit: this.pageSize,
						sidx: "",
						order: '',
						schoolId: this.schoolId,
            name:deviceName
					}
				}, function(data) {
          that.listLoading = false
					if(data && data.code == 0) {
						if(data.page.list.length==0 && that.pageIndex !=1){
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

			}
		}
	}
</script>
