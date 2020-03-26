<template>
    <div class="license-wrapper">
        <div class="license-header">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="私有化部署" name="first">
                    <el-table :data="privateTableData" border style="width: 100%" v-if="refresh">
                        <el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>
                        <el-table-column label="部署点名称" min-width="200" header-align="center" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div class="private-name-set">
                                    <span>{{scope.row.deploymentName}}</span>
                                    <span class="fa fa-edit" @click="openChoseLicenseDialog(scope, 1)"></span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ipAddess" label="服务器地址" width="300" header-align="center" align="center"></el-table-column>
                        <el-table-column prop="location" label="地理位置" width="300" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="person" label="负责人" width="150" header-align="center" align="center"></el-table-column>
                        <el-table-column label="使用许可时长" width="300" header-align="center">
                            <template slot-scope = "scope">
                                <div class="private-license-set">
                                    <span v-if="scope.row.licenseType == 0" class="not-set">未设置</span>
                                    <span v-if="scope.row.licenseType == 1">永久使用</span>
                                    <span v-if="scope.row.licenseType == 2">不可使用</span>
                                    <span v-if="scope.row.licenseType == 3">到期时间:<span class="expire-date">{{scope.row.expiresDate}}</span></span>
                                    <span class="fa fa-edit" @click="openChoseLicenseDialog(scope, 2)"></span>
                                </div>
                                <div class="private-expire-date-box" v-if="scope.row.licenseType == 3">
                                    <span :style="{'color': computeColor(scope.row.expiresDate)}">(剩余：{{computeExpireDate(scope.row.expiresDate)}})</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" label="操作" width="200" header-align="center" align="center">
                            <template slot-scope="scope">
                                <a :href="scope.row.url" class="look-link" target="_blank">查看部署点详情</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange(2, arguments)" @current-change="handleCurrentChange(2, arguments)" :current-page="page"
                        :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                </el-tab-pane>


                <el-tab-pane label="saas平台" name="second">
                    <el-table :data="saasTableData" row-key="id" :tree-props="{children: 'list'}" border style="width: 100%">
                        <el-table-column label="机构名称" min-width="200" header-align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>
                                    <span v-if="scope.row.deptType == '教育局'" class="iconfont iconjiaoyuju"></span>
                                    <span v-else-if="scope.row.deptType == '学校'" class="iconfont iconxuexiao"></span>
                                    <span v-else class="iconfont iconbumen-moren"></span>
                                    <span>{{scope.row.deptName}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deptType" label="机构类型" width="300" header-align="center" align="center"></el-table-column>
                        <el-table-column prop="location" label="地理位置" width="300" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="person" label="公司负责人" width="200" header-align="center" align="center"></el-table-column>
                        <el-table-column prop="date" label="使用许可时长" width="300" header-align="center">
                            <template slot-scope = "scope">
                                <div class="sass-license-set">
                                    <span v-if="scope.row.licenseType == 0" class="not-set">未设置</span>
                                    <span v-if="scope.row.licenseType == 1">永久使用</span>
                                    <span v-if="scope.row.licenseType == 2">不可使用</span>
                                    <span v-if="scope.row.licenseType == 3">到期时间：<span class="expire-date">{{scope.row.expiresDate}}</span></span>
                                    <span class="fa fa-edit" @click="openChoseLicenseDialog(scope, 2)"></span>
                                </div>
                                <div class="saas-expire-date-box" v-if="scope.row.licenseType == 3">
                                    <span :style="{'color': computeColor(scope.row.expiresDate)}">(剩余：{{computeExpireDate(scope.row.expiresDate)}})</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange(1, arguments)" @current-change="handleCurrentChange(1, arguments)" :current-page="page1"
                        :page-sizes="[10, 20, 50, 100]" :page-size="size1" layout="total, sizes, prev, pager, next, jumper" :total="total1"></el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog :visible.sync="dialogVisible" width="40%" :title="title" custom-class="license-dialog" :close-on-click-modal="false">
            <div v-if="dialogTip == 2">
                <div class="set-license-title">请设置部署点的使用许可时长：</div>
                <div class="set-license-content">
                    <el-radio-group v-model="duration" style="line-height:50px;">
                        <el-radio v-for="(item, index) in options" :label="item.value" :key="index">{{item.label}}</el-radio>
                    </el-radio-group>
                    <div class="chose-expire-date" v-show="duration == 3">
                        <el-date-picker v-model="overDate" type="date" :picker-options="pickerOptions" placeholder="请选择时间" style="width:150px;"></el-date-picker>
                        <div class="expire-date-tip" v-show="overDate">剩余:{{tipExpireDate}}</div>
                    </div>
                </div>
                <div class="long-time-tip">注：修改配置后1小时生效</div>
            </div>
            <div v-if="dialogTip == 1">
                <span class="set-license-title">请输入部署点名称：</span>
                <el-input v-model="schoolName" placeholder="请输入部署点名称" maxlength="20" style="margin-top:10px;"></el-input>
            </div>
            <div slot="footer" class="set-license-dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handSetLicenseClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    inject : ['reload'],
    data() {
        return {
            activeName : 'first',
            privateTableData : [],
            saasTableData : [],
            page : 1,
            size : 10,
            total : 0,

            page1 : 1,
            size1 : 10,
            total1 : 0,

            dialogVisible : false,
            dialogTip : 2,
            pickerOptions : {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            scopeRow : {},
            duration : 0,
            overDate : '',
            id : '',
            schoolName : '',
            tipExpireDate : '',

            refresh : true,

        }
    },

    watch : {
        overDate(n) {
            this.tipExpireDate = this.computeExpireDate(n)
        },
    },

    computed : {
        options() {
            return [{
                label : '永久使用',
                value : 1
            }, {
                label : '不可使用',
                value : 2
            }, {
                label : '设置到期时间',
                value : 3
            }]
        },
        title() {
            if (this.dialogTip == 2) {
                return '使用许可时长'
            }else {
                return '部署点名称'
            }
        },
    },

    methods : {
        computeColor(date) {
            if (date) {
                let num = Math.ceil((new Date(date).getTime() - new Date().getTime()) / 86400000)
                if (num > 10) {
                    return '#409eff'
                }else{
                    return '#DC143C'
                }
            }else {
                 return '#333'
            }
        },

        computeExpireDate(date) {
            if (date) {
                let year = 0, day = 0
                let num = Math.ceil((new Date(date).getTime() - new Date().getTime()) / 86400000)
                if (num > 0) {
                    if (num > 364) {
                        year = Math.floor(num / 365)
                        day = num % 365
                        return year + '年' + day + '天'
                    }else {
                        return num + '天'
                    }
                }else{
                    return '0天'
                }
            }else {
                 return '0天'
            }
        },

        openChoseLicenseDialog(item, num) {
            this.dialogTip = num
            this.dialogVisible = true
            this.scopeRow = item
            
            this.id = item.row.id
            if (num == 2) {
                this.duration = item.row.licenseType
                this.overDate = item.row.expiresDate
            }else {
                this.schoolName = item.row.deploymentName
            }
            
        },

        handSetLicenseClick() {
            let self = this
            if (this.dialogTip == 2) {
                if (this.duration) {
                    if (this.duration == 3 && !this.overDate) {
                        this.$message.info('请选择到期时间！')
                        return
                    }
                    let over = undefined
                    this.duration == 3 && (over = this.dateFormat('YYYY-mm-dd', new Date(this.overDate)))
                    this.getCommHttpData({
                        url : 'sys/syslicenseinfo/update',
                        method : 'post',
                        serverType : 3,
                        contentType : 2,
                        data : {
                            id : this.id,
                            licenseType : this.duration,
                            expiresDate : over
                        }
                    }, res => {
                        if (res.code == 0) {
                            self.$message.success('修改成功!')
                            self.getTableList(1, self.page1, self.size1)
                            self.getTableList(2, self.page, self.size)
                            self.dialogVisible = false
                        }
                    })
                }else {
                    this.$message.info('请选择使用许可时长！')
                }
            }else {
                if (this.schoolName) {
                    this.getCommHttpData({
                        url : 'sys/syslicenseinfo/update',
                        method : 'post',
                        serverType : 3,
                        contentType : 2,
                        data : {
                            id : this.id,
                            deploymentName : this.schoolName
                        }
                    }, res => {
                        if (res.code == 0) {
                            self.$message.success('修改成功!')
                            self.scopeRow.row.deploymentName = self.schoolName
                            self.dialogVisible = false
                        }
                    })
                }else {
                    this.$message.info('请输入部署点名称！')
                }
            }
        },

        handleSizeChange(val,num) {
            if (val == 1) {
                this.size1 = num[0]
                this.getTableList(1, this.page1, num[0])
            }else {
                this.size = num[0]
                this.getTableList(2, this.page, num[0])
            }
        },

        handleCurrentChange(val, num) {
            if (val == 1) {
                this.page1 = num[0]
                this.getTableList(1, num[0], this.size1)
            }else {
                this.page = num[0]
                this.getTableList(2, num[0], this.size)
            }
        },

        getTableList(type, page, limit) {
            this.getCommHttpData({
                url : 'sys/syslicenseinfo/list',
                method : 'post',
                serverType : 3,
                contentType : 2,
                data : {
                    deploymentType : type,
                    page : page,
                    limit : limit 
                }
            }, res => {
                if (res.code == 0) {
                    type == 1 && (this.saasTableData = res.page.list, this.total1 = res.page.totalCount)
                    type == 2 && (this.privateTableData = res.page.list, this.total = res.page.totalCount)
                }
            })
        }
    },

    created() {
        this.getTableList(2, this.page, this.size)
        this.getTableList(1, this.page, this.size)
    }
}
</script>

<style lang="scss" scoped>
.fa-edit{
    color: #2ebbad;
    font-size: 18px;
    vertical-align: middle;
    padding-left: 5px;
    cursor: pointer;
    display: none;
}
.set-license-content{
    margin-top: 15px;
}
.look-link{
    cursor: pointer;
    color: #2ebbad;
}
.iconfont{
    margin-right: 5px;
}
.private-name-set{
    min-height: 5px;
}
.private-name-set:hover{
    .fa-edit{
        display: inline-block;
    }
}
.private-license-set:hover{
    .fa-edit{
        display: inline-block;
    }
}
.sass-license-set:hover{
    .fa-edit{
        display: inline-block;
    }
}
.expire-date{
    padding-left: 5px;
}
.not-set{
    color: #F56C6C;
}

.set-license-title{
    font-size: 16px;
    font-weight: 500;
}
.set-license-content{
    line-height: 36px;
    display: flex;
}
.chose-expire-date{
    margin-left: 10px;
}
.expire-date-tip{
    line-height: 26px;
    color: #8c929e;
}
.long-time-tip{
    line-height: 30px;
    padding-left: 5px;
    color: #8c929e;
}
</style>
<style lang="scss">
.license-dialog{
    .el-dialog__header{
        text-align: center;
    }
    .el-dialog__body{
        padding: 10px 20px;
    }
}
</style>

