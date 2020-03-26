<template>
    <div class="mod-config">
        <el-card class="blue-shadow">
			<el-form :inline="true" @keyup.enter.native="getDataList()">
			    <el-form-item class="item-right" style="float: right;">
			        <el-button @click="getDataList()">查询</el-button>
			    </el-form-item>
			    <el-form-item class="item-right" style="float: right;">
			        <el-input v-model="keywords" placeholder="请输入装备类型名称" clearable></el-input>
			    </el-form-item>
			    <el-form-item>
			        <el-button type="primary" @click="addOrUpdateHandle()">添加设备类型</el-button>
			        <!--<el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
			    </el-form-item>
			</el-form>
			
			<el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" class="table-hover">
			    <el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
			        <template slot-scope="scope">
			            {{scope.$index+1+pageSize*(pageIndex-1)}}
			        </template>
			    </el-table-column>
			    <el-table-column prop="deviceName" header-align="center" align="center" label="名称" :show-overflow-tooltip="true"></el-table-column>
			    <el-table-column header-align="center" align="center" width="80" label="图标">
			        <template slot-scope="scope">
			            <img :src="baseIp+scope.row.deviceTypeIcon" @click="largeImgMessage(baseIp+scope.row.deviceTypeIcon)" :onerror="defaultImg" width="26px" height="26px"/>
			        </template>
			    </el-table-column>
			    <el-table-column prop="deviceYears" header-align="center" align="center" width="80" label="使用年限"></el-table-column>
			
			    <el-table-column header-align="center" align="center" label="品牌">
			        <template slot-scope="scope">
			            <div class="add-device">
			                <span>{{scope.row.brandNames}}</span>
			                <span class="el-icon-circle-plus add-button" @click="dialogVisible = true, brandval = [], deviceId = scope.row.deviceId"></span>
			            </div>
			        </template>
			    </el-table-column>
			
			    <!--<el-table-column
			        prop="faultNames"
			        header-align="center"
			        align="center"
			        label="故障类型">
			    </el-table-column>
			    <el-table-column
			        prop="tagNames"
			        header-align="center"
			        align="center"
			        label="分类">
			    </el-table-column>-->
			    <el-table-column prop="order" header-align="center" align="center" label="排序" width="80"></el-table-column>
			    <el-table-column prop="deviceRemark" header-align="center" align="center" width="300" :show-overflow-tooltip="true" label="备注"></el-table-column>
			    <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
			        <template slot-scope="scope" v-if="userType== '1' || (userType == scope.row.deptType && currentDeptid == scope.row.deptId )">
			            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.deviceId)">修改</el-button>
			            <el-button type="text" size="small" class="btn-text-color-red" @click="deleteHandle(scope.row.deviceId)">删除</el-button>
			        </template>
			    </el-table-column>
			</el-table>
			
			<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
			    :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
		</el-card>
        <!-- 弹窗, 新增 / 修改 -->
        <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->

        <el-dialog title="添加品牌" :visible.sync="dialogVisible" width="500px">
            <label for="">请选择品牌：</label>
            <el-select v-model="brandval" multiple filterable placeholder="请选择品牌" style="width:300px;">
                <el-option-group v-for="(group,index) in brandIdList" :key="index" :label="index">
                    <el-option v-for="item in group" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-option-group>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handSaveBrand">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getCommHttpData,getCommonDictByType,deleteData} from '@/utils/common'
import AddOrUpdate from './config-add-or-update'
export default {
    data () {
        return {
            baseIp :window.SITE_CONFIG.imgIP,
            userType : this.GLOBAL.getUserType(),
            currentDeptid : this.GLOBAL.getOrgId(),
            keywords:undefined,
            defaultImg: 'this.src="' + require('../../../assets/img/nodata.png') + '";this.onerror = null',
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,

            brandIdList : [],
            brandval : [],
            dialogVisible :false,
            deviceId : '',
        }
    },
    components: { AddOrUpdate },

    mounted () {
        this.getDataList()
        this.getBrandList()
    },

    methods: {
        handSaveBrand() {
            if (this.brandval.length) {
                this.getCommHttpData({
                    url : 'device/addBrandRel',
                    method : 'post',
                    contentType : 2,
                    data : {
                        deviceId : this.deviceId,
                        list : this.brandval
                    }
                }, res => {
                    if (res.code == 0) {
                        this.dialogVisible = false
                        this.getDataList()
                    }
                })
            }else {
                this.$message.closeAll()
                this.$message.info('请选择品牌!')
            }
        },

        getBrandList() {
            this.getCommHttpData({
                url : '/device/findAllOfTag',
                method : 'post',
                contentType : 2,
                data : {
                    tagName : '品牌',
					action : '1'
                }
            }, res => {
                res.code == 0 && (this.brandIdList = [], this.brandIdList = res.tagList)
            })
        },

        // 获取数据列表
        getDataList () {
            this.dataListLoading = true
            var that =this
            let keywords = this.keywords == '' ?undefined:this.keywords
            getCommHttpData({url:'device/findTypeList',method:'post',contentType:2,data:{
                page: this.pageIndex,
                limit: this.pageSize,
                keywords:keywords
            }},function(data){
            if (data && data.code === 0) {
                if(data.page.list.length==0 && that.pageIndex !=1){
                                that.pageIndex =1
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
        sizeChangeHandle (val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 多选
        selectionChangeHandle (val) {
            this.dataListSelections = val
        },
        // 新增 / 修改
        addOrUpdateHandle (id) {
            if (id) {
                this.$router.push({name:'type-edit',params:{deviceId:id}})
            }else {
                this.$router.push({name:'type-add',params:{deviceId:id}})
            }
        },
        // 删除
        deleteHandle (id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
            })
            var that =this
            deleteData(this,{url:'device/del',method:'post',contentType:1,operateType:1,data:{deviceId:id}},function(data){
            that.getDataList()
            })

        },
        largeImgMessage(imgSrc){
            this.$alert('<img src="'+imgSrc+'" width="390px" height="auto" onerror="this.src=\"' + require('../../../assets/img/nothing.png') + '\";this.onerror = null" >', '预览', {
            dangerouslyUseHTMLString: true,
            showConfirmButton:false,
            closeOnClickModal:true
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.add-button{
    display: none;
    cursor: pointer;
    color: #3C85EE;
    font-size: 20px;
    vertical-align: middle;
}
.table-hover{
    /deep/ .el-table__row:hover{
        .add-button{
            display: inline;
        }
    }
}
</style>

