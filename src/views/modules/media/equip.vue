<template>
    <div class="mod-config">
		<el-card class="blue-shadow">
			<el-form :inline="true" :model="dataSearch" @keyup.enter.native="getDataList()">
			<el-form-item class="item-right" style="float: right;">
			    <el-button @click="getDataList()">查询</el-button>
			    <!-- <el-button @click="handleManyUpdate">批量编辑</el-button> -->
			</el-form-item>
			<el-form-item class="item-right" style="float: right;">
			    <el-input v-model="dataSearch.keywords" placeholder="请输入设备名称" clearable></el-input>
			</el-form-item>
			
			<el-form-item>
			    <!-- <el-button type="primary" @click="getDataList">刷新</el-button> -->
			    <el-button type="primary" @click="exportFile">导出</el-button>
			    <!--<el-button type="primary" @click="addOrUpdateHandle"  @refreshDataList="getDataList">绑定分类</el-button>-->
			    <!--<el-dropdown  @command="handleCommand">
			            <el-button type="primary">
			                更多<i class="el-icon-arrow-down el-icon--right"></i>
			            </el-button>
			            <el-dropdown-menu slot="dropdown">
			                <el-dropdown-item command="1">删除</el-dropdown-item>
			                <el-dropdown-item command="2">导出</el-dropdown-item>
			                <el-dropdown-item command="3">绑定分类</el-dropdown-item>
			            </el-dropdown-menu>
			            </el-dropdown>-->
			</el-form-item>
			<el-form-item>
			    <!-- <el-select v-model="dataSearch.equipUse" clearable placeholder="请选择用途" @change="getDataList">
			        <el-option
			                v-for="item in equipUseList"
			                :key="item.value"
			                :label="item.dictName"
			                :value="item.value"
			                :disabled="item.disabled">   
			                </el-option>
			        </el-select> -->
			</el-form-item>
			<el-form-item v-if="domainType != 1">
			    <el-select v-model="dataSearch.deviceId" clearable placeholder="请选择装备类型" @change="getDataList">
			        <el-option v-for="item in deviceIdList" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId"></el-option>
			        </el-select>          
			</el-form-item>
			<el-form-item>
			    <el-select v-model="dataSearch.brandId" clearable placeholder="请选择品牌" @change="getDataList">
			        <el-option v-for="item in brandIdList" :key="item.tagId" :label="item.tagValue" :value="item.tagId"></el-option>
			        </el-select>
			</el-form-item>
			<el-form-item>
			    <el-select v-model="dataSearch.gradeId" clearable placeholder="请选择年级" @change="getDataList">
			        <el-option v-for="(item,index) in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
			        </el-select>
			</el-form-item>
			</el-form>
			
			
			<div class="num">
			        <span class="numStyle">装机总量
			            <span style="color:#3C85EE">{{sumNum}}</span>台
			        </span>
			        <span class="numStyle" v-for="item in num">
			            <span>{{item.deviceName}}</span>
			            <span style="color:#3C85EE">{{item.deviceNum}}</span>台
			        </span>
			</div>
			
			
			
			<el-table
			:data="dataList"
			border
			v-loading="dataListLoading"
			@selection-change="selectionChangeHandle"
			style="width: 100%;">
			<el-table-column
			    type="selection"
			    header-align="center"
			    align="center"
			    width="50">
			</el-table-column>
			<el-table-column
			    prop="id"
			    header-align="center"
			    align="center"
			    width="60"
			    label="序号">
			    <template slot-scope="scope">
			        {{scope.$index+1+pageSize*(pageIndex-1)}}
			    </template>
			</el-table-column>
			<el-table-column
			    
			    header-align="center"
			    align="center"
			    label="装备名称"
			    width="200">
			    <template slot-scope="scope">
			    <a href="#" style="color: #3C85EE;" @click="basicLink(scope.row.equipId, scope.row.switchState)">{{scope.row.equipName}}</a>
			    </template>
			</el-table-column>
			<el-table-column
			    prop="mac"
			    header-align="center"
			    align="center"
			    label="MAC"
			    width="150">
			</el-table-column>
			<el-table-column
			    header-align="center"
			    align="center"
			    label="班级">
			    <template slot-scope="scope">
			    {{scope.row.gradeName}}{{scope.row.className}}
			    </template>
			</el-table-column>
			<el-table-column
			    prop="classroomName"
			    header-align="center"
			    align="center"
			    label="教室">
			</el-table-column>
			<el-table-column
			    prop="deviceName"
			    header-align="center"
			    align="center"
			    label="装备类型">
			</el-table-column>
			<el-table-column
			    prop="brandName"
			    header-align="center"
			    align="center"
			    label="品牌">
			</el-table-column>
			<el-table-column
			    prop="appUseVertion"
			    header-align="center"
			    align="center"
			    label="版本号">
			</el-table-column>
			<el-table-column
			    prop="updateDate"
			    header-align="center"
			    align="center"
			    label="更新时间"
			    width="160">
			</el-table-column>
			<!-- <el-table-column
			    fixed="right"
			    header-align="center"
			    align="center"
			    width="150"
			    label="操作">
			    <template slot-scope="scope">
			        <el-button type="text" size="small" @click="$router.push({ name : 'media-equip-edit', query : { equip : JSON.stringify(scope.row) }})">编辑</el-button>
			        <el-button type="text" size="small" style="color:#F56C6C;" @click="deleteHandle(scope)">删除</el-button>
			    </template>
			</el-table-column> -->
			</el-table>
			<el-pagination
			@size-change="sizeChangeHandle"
			@current-change="currentChangeHandle"
			:current-page="pageIndex"
			:page-sizes="[10, 20, 50, 100]"
			:page-size="pageSize"
			:total="totalPage"
			layout="total, sizes, prev, pager, next, jumper">
			</el-pagination>
		</el-card>
        
        <!-- 弹窗, 新增 / 修改 -->
        <label-dialog v-if="addOrUpdateVisible" ref="labelDialog" @refreshDataList="getDataList"></label-dialog>

        <el-dialog title="批量编辑" :visible.sync="dialogVisible" width="400px">
            <div class="batch--dialog">
                <div style="padding:20px 30px;">已选择<span style="color:#F56C6C;">{{dataListSelections.length}}</span>台设备</div>
                <el-form :model="editForm" :rules="rules" ref="editForms" label-width="100px">
                    <el-form-item label="装备类型" prop="deviceId">
                        <el-select v-model="editForm.deviceId" placeholder="请选择装备类型">
                            <el-option v-for="(item,index) in deviceArr" :key="index" :label="item.deviceName" :value="item.deviceId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="装备用途" prop="equipUse">
                        <el-select v-model="editForm.equipUse" placeholder="请选择装备用途">
                            <el-option v-for="(item,index) in equipUse" :key="index" :label="item.tagValue" :value="item.tagId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌" prop="brandId">
                        <el-select v-model="editForm.brandId" placeholder="请选择品牌">
                            <el-option v-for="(item,index) in brandArr" :key="index" :label="item.tagValue" :value="item.tagId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm">确认</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {getCommHttpData,getCommonDictByType,getExportFile,getDomainType} from '@/utils/common'
import LabelDialog from './equip-label-dialog'
export default {
    data () {
        return {
            gradeList:[],
            domainType:getDomainType(),
            schoolId:this.GLOBAL.getOrgId(),
            equipUseList:[],
            brandIdList:[],
            deviceIdList:[],
            teacherIdList:[],
            dataSearch: {
                keywords: undefined,
                equipUse:undefined,
                brandId:undefined,
                gradeId:undefined,
                deviceId:undefined,
                teacherId:undefined
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            sumNum:0, 
            num : {},
            dialogVisible : false,
            editForm : {
                deviceId : null,
                equipUse : null,
                brandId : null
            },
            rules : {},
            deviceArr : [],
            equipUse : [],
            brandArr : []
        }
    },
    components: {
        LabelDialog
    },
    mounted () {
        getCommonDictByType(this,'equip_use_type','equipUseList')
        var that = this
        getCommHttpData({url:'device/findTypeList',method:'post',contentType:2,data:{}},function(data){
            that.deviceIdList = data.list
        })
        getCommHttpData({url:'device/findAllOfTag',method:'post',contentType:2,data:{
            tagName: '品牌'
        }},function(data){
            that.brandIdList = data.tagList
        })
        getCommHttpData({
            url: 'common/queryGradeList',
            method: 'get',
            contentType: 1,
            data: {}
        }, function(data) {
            if(data && data.code === 0) {
                that.gradeList = data.list
            }
        })
    //			getCommHttpData({url:'equip/equipCommon',method:'post',contentType:2,data:{type:1}},function(data){
    //	      that.resumeIdList = data.list
    //    })
        this.getDataList()
        // this.getNum()
        this.getType()
        this.getUse()
        this.getBrand()
    },
    methods: {
        //获取年级
        
        //获取装备数量
    //  	getNum(){
    //  		let that = this;
    //				getCommHttpData({
    //					url: 'equip/deviceCountList',
    //					method: 'post',
    //					contentType: 2,
    //					data:{
    //					},
    //				}, function(data) {
    //					that.num = data.list;
    //					if(data.list.length>0){
    //						for (let i in data.list) {
    //						    that.sumNum=that.sumNum+data.list[i].deviceNum
    //						}
    //					}
    //					
    //				})
    //  	},
        // 获取数据列表
        getDataList () {
            this.dataListLoading = true
            this.dataSearch.keywords = this.dataSearch.keywords == ''? undefined : this.dataSearch.keywords;
            this.dataSearch.equipUse = this.dataSearch.equipUse==''?undefined:this.dataSearch.equipUse;
            this.dataSearch.brandId = this.dataSearch.brandId==''?undefined:this.dataSearch.brandId;
            this.dataSearch.gradeId = this.dataSearch.gradeId==''?undefined:this.dataSearch.gradeId;
            this.dataSearch.deviceId = this.dataSearch.deviceId==''?undefined:this.dataSearch.deviceId;
            this.dataSearch.teacherId = this.dataSearch.teacherId==''?undefined:this.dataSearch.teacherId;
            let that = this
            getCommHttpData({
                url: 'equip/deviceCountList',
                method: 'post',
                contentType: 2,
                data:{
                    schoolId:this.schoolId,
                    page: this.pageIndex,
                    limit: this.pageSize,
                    equipName:this.dataSearch.keywords,
                    equipUse:this.dataSearch.equipUse,
                    brandId:this.dataSearch.brandId,
                    gradeId:this.dataSearch.gradeId,
                    deviceId:this.dataSearch.deviceId,
                    teacherId:this.dataSearch.teacherId,
                    domainType:this.domainType
                },
            }, function(data) {
                that.num = data.list;
                that.sumNum = 0;
                if(data.list.length>0){
                    for (let i in data.list) {
                        that.sumNum=that.sumNum+data.list[i].deviceNum
                    }
                }
                
            })

            function getLineNum() {
                return that.$api({
                    url : 'equip/monitoring',
                    method : 'post',
                    contentType : 2,
                })
            }

            function getTableList() {
                return that.$api({
                    url : '/equip/list',
                    method : 'post',
                    contentType : 2,
                    data : {
                        schoolId:that.schoolId,
                        page: that.pageIndex,
                        limit: that.pageSize,
                        equipName:that.dataSearch.keywords,
                        equipUse:that.dataSearch.equipUse,
                        brandId:that.dataSearch.brandId,
                        gradeId:that.dataSearch.gradeId,
                        deviceId:that.dataSearch.deviceId,
                        teacherId:that.dataSearch.teacherId,
                        domainType:that.domainType
                    }
                })
            }

            async function getTableData() {
                let onlineData = await getLineNum()
                let _tableList = await getTableList()
                let _turnOn = onlineData.data.turnOnMac, _tableListData = _tableList.data.page
                if (onlineData.data.code == 0 && _tableList.data.code == 0 && _turnOn.length) {
                    _turnOn.forEach(item => {
                        _tableListData.list.forEach(value => {
                            if (item == value.mac) {
                                value.switchState = 1
                            }else {
                                value.switchState = 0
                            }
                        })
                    }) 
                }
                that.dataList = _tableListData.list
                that.totalPage = _tableListData.totalCount
                that.dataListLoading = false

                // console.log(_tableList)
                if (onlineData.data.code == 0) {
                    // that.$http({
                    //     url: that.$http.adornUrlMedia('/equip/list'),
                    //     method: 'post',
                    //     data: that.$http.adornData({
                    //         schoolId:that.schoolId,
                    //         page: that.pageIndex,
                    //         limit: that.pageSize,
                    //         equipName:that.dataSearch.keywords,
                    //         equipUse:that.dataSearch.equipUse,
                    //         brandId:that.dataSearch.brandId,
                    //         gradeId:that.dataSearch.gradeId,
                    //         deviceId:that.dataSearch.deviceId,
                    //         teacherId:that.dataSearch.teacherId,
                    //         domainType:that.domainType
                    //     })
                    // }).then(data => {
                    //     if (data && data.code === 0) {
                    //         debugger
                    //         console.log(data)
                    //         that.dataList = data.page.list
                    //         that.totalPage = data.page.totalCount
                    //     }else {
                    //         that.dataList = []
                    //         that.totalPage = 0
                    //     }
                    //     that.dataListLoading = false
                    // })
                }
            }

            getTableData()           
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
            this.addOrUpdateVisible = true
            this.$nextTick(() => { 	
                let equipList = this.dataListSelections
                let equipTemp = new Array()
                let lebelArr1 = new Array()
                let lebelArr2 = new Array()
                if(equipList.length==0){
                    this.$message({
                    message: '请选择装备',
                    type: 'error'
                    })
                    return;
                }
                for(let i in equipList){
                    let tempIds = []
                    
                    if(equipList[i].tagIds != '' && equipList[i].tagIds != null ){
                        tempIds = equipList[i].tagIds.split(',')
                    }
                    if(tempIds.length>0){
                        lebelArr1.push(tempIds)
                        lebelArr2.push(new Set(tempIds))
                    }
                    equipTemp.push(equipList[i].equipId)
                }
                let intersection = [] 
                for(let j=0;j<lebelArr1.length-1;j++){
                    intersection = Array.from(new Set(lebelArr1[j].filter(v => lebelArr2[j+1].has(v))))
                }
                
        //	      let a = [1, 2, 3] 
        //  			let b = [2, 4, 5]
        //  			let aSet = new Set(a)
        //  			let bSet = new Set(b)
        //	      let intersection = Array.from(new Set(a.filter(v => bSet.has(v))))

                this.$refs.labelDialog.init(equipTemp,intersection)
            })
        },

        handleCommand(command){
        if(command == 1){
            //删除
        }else if(command ==2){
            //导出
        }else{
            //绑定分类
            this.addOrUpdateHandle();
        }
        //this.$message('click on item ' + command);
        },
        exportFile(){
    //    	this.dataListLoading = true
                this.dataSearch.type = 1
                this.dataSearch.excelName = this.GLOBAL.getOrgName()+'装备表'
                this.dataSearch.deptId = this.GLOBAL.getOrgId()
            this.dataSearch.keywords = this.dataSearch.keywords==''?undefined:this.dataSearch.keywords;
            this.dataSearch.equipUse = this.dataSearch.equipUse==''?undefined:this.dataSearch.equipUse;
            this.dataSearch.brandId = this.dataSearch.brandId==''?undefined:this.dataSearch.brandId;
            this.dataSearch.resumeId = this.dataSearch.resumeId==''?undefined:this.dataSearch.resumeId;
            this.dataSearch.deviceId = this.dataSearch.deviceId==''?undefined:this.dataSearch.deviceId;
            this.dataSearch.teacherId = this.dataSearch.teacherId==''?undefined:this.dataSearch.teacherId;
            getExportFile(this,'equip/exportFile',this.dataSearch)
                //window.location.href = window.SITE_CONFIG.baseUrlMedia+'equip/exportFile?deptId=1&excelType=excel&type=1'

    //      this.$http({
    //        url: this.$http.adornUrlMedia('/equip/exportFile'),
    //        method: 'get',
    //        params: this.$http.adornParams({
    //        	deptId:1,
    //          excelType: 'excel',
    //          type: 1,
    //          equipName:this.dataSearch.keywords,
    //	          equipUse:this.dataSearch.equipUse,
    //	          brandId:this.dataSearch.brandId,
    //	          resumeId:this.dataSearch.resumeId,
    //	          deviceId:this.dataSearch.deviceId,
    //	          teacherId:this.dataSearch.teacherId
    //        })
    //	      }).then(({data}) => {
    //	        if (data && data.code === 0) {
    //	          this.$message({
    //	            message: '操作成功',
    //	            type: 'success',
    //	            duration: 1500,
    //	            onClose: () => {
    //	              this.getDataList()
    //	            }
    //	          })
    //	        } else {
    //	          this.$message.error(data.msg)
    //	        }
    //	      })
        },
        basicLink (id,switchState){
            this.$router.push({ name : 'monitor_mana', params : { id : id }, query : { eId : id, state : switchState } })
        },
        deleteHandle(item) {
            const h = this.$createElement
            let self = this
            this.$msgbox({
                title: '删除',
                message: h('div', null, [
                    h('span', null, '是否删除 '),
                    h('span', { style: 'color: #F56C6C' }, item.row.classroomName || ''),
                    h('span', '设备信息，删除后不可恢复。')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(action => {
               this.getCommHttpData({
                    url : 'equip/deleteEquipBatch',
                    method : 'post',
                    contentType : 2,
                    data : {
                        equipIdList : [item.row.equipId],
                        equipMacList : [item.row.mac]
                    }
                }, res => {
                    if (res.code == 0) {
                        self.dataList.splice(item.$index, 1)
                        self.$message.success('删除成功！')
                    }
                })
            }).catch(res => {})
            
        },
        handleManyUpdate() {
            if (this.dataListSelections.length) {
                this.dialogVisible = true
            }else {
                this.$message.info('请选择设备！')
            }
        },
        submitForm() {
            let arr = [], arr1 = []
            this.dataListSelections.forEach(item => {
                arr.push(item.equipId)
                arr1.push(item.mac)
            })
            this.getCommHttpData({
                url : 'equip/updateEquipBatch',
                method : 'post',
                contentType : 2,
                data : {
                    equipIdList : arr,
                    equipMacList : arr1,
                    deviceId : this.editForm.deviceId,
                    equipUse : this.editForm.equipUse,
                    tagId : this.editForm.brandId,
                }
            }, res => {
                if (res.code == 0) {
                    this.getDataList()
                    this.$message.success('修改成功！')
                }
                this.dialogVisible = false
                this.$refs.editForms.resetFields()
            })
        },
        getType() {
            this.getCommHttpData({
                url : 'authorization/getDevice',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    userId : this.GLOBAL.getUserId()
                }
            }, res => {
                if (res.code == 0) {
                    this.deviceArr = res.list
                }
            })
        },
        getUse() {
            this.getCommHttpData({
                url : 'authorization/getUseAndBrand',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    type : 1
                }
            }, res => {
                if (res.code == 0) {
                    this.equipUse = res.list
                }
            })
        },
        getBrand() {
            this.getCommHttpData({
                url : 'authorization/getUseAndBrand',
                method : 'post',
                contentType : 2,
                data : {
                    deptId : this.GLOBAL.getOrgId(),
                    userType : this.GLOBAL.getUserType(),
                    type : 2
                }
            }, res => {
                if (res.code == 0) {
                    this.brandArr = res.list
                }
            })
        }
    }
    }
</script>
<style scoped lang="scss">
	.num{
		height: 50px;
		line-height: 50px;
		background: white;
		font-size: 20px;
		color:#787878
	}
	.numStyle{
		padding: 0 20px;
	}
</style>