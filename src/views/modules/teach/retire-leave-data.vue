<template>
	<div class="mod-config">
		<el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" class="retire--foems">
            <el-form-item label="姓名：" prop="name">
                <el-input v-model="keyWords" @focus="handleFoucs" placeholder="姓名/手机号/身份证号/邮箱/教籍号" style="width:50%;" v-clickoutside="handleClose" :disabled="operateType == 0 || operateType == 1"></el-input>
                <transition name="el-zoom-in-top">
                    <div class="drop-down el-select-dropdown el-popper" v-show="visible" v-loading="loading">
                        <div class="select--list">
                            <div class="select--title" v-if="teacherList.length">
                                <span style="width:60px;">姓名</span>
                                <span style="width:95px;">手机号</span>
                                <span style="width:140px;">邮箱</span>
                                <span style="width:150px;">身份证号</span>
                                <span style="width:150px;">教籍号</span>
                            </div>
                            <div class="list--wrapper">
                                <div class="list--item" v-for="(item, index) in teacherList" :key="index" @click="handleSelect(item)">
                                    <span style="width:60px;" :title="item.teacherName">{{item.teacherName}}</span>
                                    <span style="width:95px;" :title="item.telPhone">{{item.telPhone}}</span>
                                    <span style="width:140px;" :title="item.email">{{item.email}}</span>
                                    <span style="width:150px;" :title="item.identityNum">{{item.identityNum}}</span>
                                    <span style="width:150px;" :title="item.teacherNum">{{item.teacherNum}}</span>
                                </div>
                            </div>
                            <div class="nodata--item" v-if="!teacherList.length">没有查询到教师信息</div>
                        </div>
                    </div>
                </transition> 
            </el-form-item>
            <el-form-item label="退休类型：" prop="retireType">
                <el-select v-model="dataForm.retireType" clearable placeholder="请选择退休类型" style="width:50%;" :disabled="!operateType">
                    <el-option v-for="item in retireTypeList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="退休日期：" prop="endDate">
                <el-date-picker v-model="dataForm.endDate" type="date" value-format='yyyy-MM-dd' placeholder="请选择日期" style="width:50%;" :disabled="!operateType"></el-date-picker>
            </el-form-item>
            
            <el-form-item label="备注：">
                <el-input type="textarea" :rows="4" maxlength="100" placeholder="备注" v-model="dataForm.remark" :disabled="!operateType"></el-input>
                <span style="position:absolute; right:10px;bottom:0px;">{{dataForm.remark.length}}/100</span>
            </el-form-item>
            <el-form-item label="附件：">
                <el-upload class="upload-demo" :action="apiUrl + '/sys/oss/picUpload'" :limit="1" :on-success="handleSuccess" :before-upload="handleBefore" :on-remove="handleRemove" :on-exceed="handleExceed" :file-list="fileList" :disabled="!operateType">
                    <el-button size="small" type="primary" :disabled="!operateType">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">文件大小不能超过500M</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="gobackClick">取消</el-button>
                <el-button v-if="operateType" type="primary" @click="dataFormSubmit">确定</el-button>
            </el-form-item>
        </el-form>
	</div>
</template>

<script>
import { clearTimeout } from 'timers';
export default {
    data() {
        return {
            apiUrl: window.SITE_CONFIG.baseUrlMedia,
            baseIp: window.SITE_CONFIG.imgIP,
            teacherList:[],
            retireTypeList:[],
            keyWords : '',
            dataForm: {
                name : '',
                schoolId:'',
                teacherId:'',
                retireType: '',
                endDate: this.dateFormat('YYYY-mm-dd', new Date()),
                appendixPath: '',
                remark: '',
            },
            fileList: [],
            rules: {
                name: [{ required: true, message: '请选择教师', trigger: 'change,blur' }],
                retireType : [{ required: true, message: '请选择退休类型', trigger: 'change' }],
                endDate: [{ required: true, message: '请选择离职时间', trigger: 'blur' }],
            },
            loading:false,
            visible : false,
            popperAppendToBody : true,
            operateType : 2,
        }
    },
    watch : {
        'dataForm.name'(n) {
            if (!n) {
                this.dataForm.schoolId = ''
                this.dataForm.teacherId = ''
            }
        },
        keyWords(n) {
            if (n && n != this.dataForm.name) {
                this.debounce(this.getSearchData, 300)
            }
        },
    },
    mounted() {
        this.$route.query.type && (this.operateType = this.$route.query.type)
        this.getCommonDictByType(this, 'retire_type', 'retireTypeList')
        if (this.$route.query.id) {
            this.getCommHttpData({
                url : 'teacherManage/queryByTeacherId?teacherId=' + this.$route.query.id,
                method : 'get',
                contentType : 2
            }, res => {
                if (res.code === 0) {
                    this.dataForm.name = res.list.teacherName
                    this.keyWords = res.list.teacherName
                    this.dataForm.schoolId = res.list.schoolId
                    this.dataForm.teacherId = res.list.teacherId
                    this.dataForm.retireType = res.list.retireType
                    this.dataForm.endDate = res.list.endDate
                    this.dataForm.appendixPath = res.list.appendixPath
                    this.dataForm.remark = res.list.remark
                    res.list.appendixPath && (this.fileList.push({url : this.baseIp + res.list.appendixPath, name : res.list.appendixPath}))
                }
            })
        } 
        this.$route.query.operate && (this.handleSelect(this.$route.query.operate))
    },
    methods: {
        debounce(fn, wait) {
            let fun = null
            if (fun !== null){
                clearTimeout(fun)
            }
            fun = setTimeout(fn, wait)
        },
        getSearchData() {
            let self = this
            this.visible = true
            this.loading = true
            this.getCommHttpData({
                url : 'teacherManage/queryList',
                method : 'post',
                contentType : 2,
                data : {
                    keywords : this.keyWords
                }
            }, res => {
                if (res.code === 0) {
                    self.loading = false
                    self.teacherList = res.list;
                }
            })
        },
        handleFoucs() {
            this.keyWords && (this.visible = true)
        },

        handleClose() {
            this.visible = false;
        },
        handleSelect(item) {
            this.keyWords = item.teacherName
            this.dataForm.name = item.teacherName
            this.dataForm.teacherId = item.teacherId
            this.dataForm.schoolId = item.schoolId
        },
        handleBefore(file) {
            let size = file.size / 1024 /1014
            if (size > 500) {
                this.$message.error('上传文件大小不能超过500MB!')
                return false
            }
        },
        handleSuccess(response, file, fileList) {
            if (response.code == 0 ) {
                this.dataForm.appendixPath = response.url
            }
        },
        handleExceed(files, fileList) {
            this.$message.info('只能上传一个附件')
        },
        handleRemove() {
            this.dataForm.appendixPath = ''
        },
        gobackClick(){
            if (this.$route.query.operate) {
                this.$router.push({ name: 'teach-entry-manage' })
            }else {
                this.$router.push({ name: 'teach-retire-manage' })
            }
            
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if(valid) {
                    let self = this
                    this.$confirm(`${this.dataForm.name}教师退休后，当前所有任职将撤销，您确定退休吗？`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let url = 'teacherManage/saveLeave'
                            if (self.operateType && self.$route.query.id) {
                                url = 'teacherManage/updateLeave'
                            }
                            self.getCommHttpData({
                                url : url,
                                method : 'post',
                                contentType : 2,
                                data : {
                                    teacherId : self.dataForm.teacherId,
                                    schoolId : self.dataForm.schoolId,
                                    retireType : self.dataForm.retireType,
                                    endDate : self.dataForm.endDate,
                                    appendixPath : self.dataForm.appendixPath,
                                    remark : self.dataForm.remark,
                                    state : 2
                                }
                            }, res => {
                                if (res.code === 0) {
                                    self.$router.push({ name : 'teach-retire-manage' })
                                }
                            })
                        })
                    
                }
            })
        }
    }
}
</script>


<style lang="scss" scoped>
.mod-config{
    background-color: #fff;
    padding: 10px;
}
.retire--foems{
    width: 50%;
}
.select--list{
    min-height: 200px;
    min-width: 350px;
    padding: 5px 0;
    .select--title{
        display: flex;
        color: #C0C4CC;
        padding: 0 10px;
        span{
            text-align: center;
        }
    }
    .list--wrapper{
        max-height: 360px;
        overflow-y: auto;
    }
    .list--item{
        cursor: pointer;
        padding: 0 10px;
        display: flex;
        &:hover{
            background-color: #F2F6FC;
        }
        span{
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .nodata--item{
        text-align: center;
        color: #C0C4CC;
    }
}
::-webkit-scrollbar{  
    width: 2px;  
    height: 5px;  
    background-color: #F5F5F5;  
}   
::-webkit-scrollbar-track{  
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}    
::-webkit-scrollbar-thumb{  
    border-radius: 10px;  
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #bdbdbd;  
}  
::-webkit-scrollbar-thumb:hover{
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.4);
}
</style>
