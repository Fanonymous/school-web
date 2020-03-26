<template>
	<div class="mod-config">
		<el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px" class="retire--foems">
            <el-form-item label="学生：" prop="name">
                <el-input v-model="keyWords" @focus="handleFoucs" placeholder="姓名/手机号/身份证号/邮箱/教籍号" style="width:50%;" v-clickoutside="handleClose" :disabled="!!operateType"></el-input>
                <transition name="el-zoom-in-top">
                    <div class="drop-down el-select-dropdown el-popper" v-show="visible" v-loading="loading">
                        <div class="select--list">
                            <div class="select--title" v-if="teacherList.length">
                                <span style="width:60px;">姓名</span>
                                <span style="width:95px;">手机号</span>
                                <span style="width:140px;">邮箱</span>
                                <span style="width:150px;">身份证号</span>
                                <span style="width:150px;">学籍号</span>
                            </div>
                            <div class="list--wrapper">
                                <div class="list--item" v-for="(item, index) in teacherList" :key="index" @click="handleSelect(item)">
                                    <span style="width:60px;" :title="item.stuName">{{item.stuName}}</span>
                                    <span style="width:95px;" :title="item.telphone">{{item.telphone}}</span>
                                    <span style="width:140px;" :title="item.email">{{item.email}}</span>
                                    <span style="width:150px;" :title="item.identityNum">{{item.identityNum}}</span>
                                    <span style="width:150px;" :title="item.stuCode">{{item.stuCode}}</span>
                                </div>
                            </div>
                            <div class="nodata--item" v-if="!teacherList.length">没有查询到学生信息</div>
                        </div>
                    </div>
                </transition> 
            </el-form-item>
            <el-form-item label="异动类型：" prop="retireType" v-if="operateType != 2">
                <el-select v-model="dataForm.retireType" clearable placeholder="请选择异动类型" style="width:50%;">
                    <el-option v-for="item in retireTypeList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <!-- 复学操作 -->
            <el-form-item label="班级：" prop="gradeId" v-if="operateType == 2">
				<el-row>
					<el-col :span="8">
						<el-form-item>
							<el-select v-model="dataForm.gradeId" clearable placeholder="请选择年级">
							    <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="classId">
							<el-select v-model="dataForm.classId" clearable placeholder="请选择班级">
							    <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
            </el-form-item>

            <el-form-item label="时间：" prop="endDate">
                <el-date-picker v-model="dataForm.endDate" type="date" value-format='yyyy-MM-dd' placeholder="请选择日期" :picker-options="pickerOption" style="width:50%;"></el-date-picker>
            </el-form-item>
            
            <el-form-item label="备注：">
                <el-input type="textarea" :rows="4" maxlength="100" placeholder="备注" v-model="dataForm.remark"></el-input>
                <span style="position:absolute; right:10px;bottom:0px;">{{dataForm.remark.length}}/100</span>
            </el-form-item>
            <el-form-item label="附件：">
                <el-upload class="upload-demo" :action="apiUrl + '/sys/oss/picUpload'" :limit="1" :on-success="handleSuccess" :before-upload="handleBefore" :on-remove="handleRemove" :on-exceed="handleExceed" :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">文件大小不能超过500M</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="gobackClick">取消</el-button>
                <el-button type="primary" @click="dataFormSubmit">确定</el-button>
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
            pickerOption : {},
            teacherList:[],
            retireTypeList:[],
            gradeList : [],
            classList : [],
            keyWords : '',
            dataForm: {
                name : '',
                teacherId:'',
                retireType: '',
                gradeId : '',
                classId : '',
                endDate: this.dateFormat('YYYY-mm-dd', new Date()),
                appendixPath: '',
                remark: '',
            },
            fileList: [],
            rules: {
                name: [{ required: true, message: '请选择学生', trigger: 'change,blur' }],
                retireType : [{ required: true, message: '请选择异动类型', trigger: 'change' }],
                endDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
				gradeId:[{ required: true, message: '请选择年级', trigger: 'change' }],
				classId:[{ required: true, message: '请选择班级', trigger: 'change' }],
            },
            loading:false,
            visible : false,
            operateType : 0,
        }
    },
    watch : {
        'dataForm.name'(n) {
            if (!n) {
                this.dataForm.teacherId = ''
            }
        },
        'dataForm.gradeId'(n) {
            if (n) {
                this.getClass()
            }
        },
        keyWords(n) {
            if (n && n != this.dataForm.name) {
                this.debounce(this.getSearchData, 300)
            }
        },
    },
    computed: {
        tipLabel() {
            if (this.operateType == 2) {
                return '学生复学后，将属于在校学生，且此操作不可逆转，您确定置为在校学生吗？'
            }else {
                return '学生离校后，将不属于在校学生，且此操作不可逆转，您确定置为离校吗？'
            }
        }
    },
    mounted() {
        this.$route.query.type && (this.operateType = this.$route.query.type)
        this.getCommonDictByType(this, 'leaving_school_type', 'retireTypeList')
        let self = this
        if (this.$route.query.id) {
            this.getCommHttpData({
                url : 'stu/changeInfo/changeInfo?stuChangeId=' + this.$route.query.id + '&type=4',
                method : 'post',
                contentType : 2
            }, res => {
                if (res.code == 0) {
                    if (self.operateType == 2) {
                        self.dataForm.name = res.stuChangeInfo.stuName
                        self.keyWords = res.stuChangeInfo.stuName
                        self.dataForm.teacherId = res.stuChangeInfo.stuId
						let startDate = res.stuChangeInfo.termStartTime
						let endDate = res.stuChangeInfo.termEndTime
						self.pickerOption = {
							disabledDate(date) {
								let isBoolean = date.getTime() >= new Date(startDate).getTime() && date.getTime() <= new Date(endDate).getTime()
							    return !isBoolean
							}
						}
                    }else {
                        self.dataForm.name = res.stuChangeInfo.stuName
                        self.keyWords = res.stuChangeInfo.stuName
                        self.dataForm.teacherId = res.stuChangeInfo.stuId
                        self.dataForm.retireType = res.stuChangeInfo.changeTypeId
                        self.dataForm.endDate = res.stuChangeInfo.changeDate
                        self.dataForm.appendixPath = res.stuChangeInfo.changeFile
                        self.dataForm.remark = res.stuChangeInfo.changeReason
                        res.stuChangeInfo.changeFile && (self.fileList.push({url : self.baseIp + res.stuChangeInfo.changeFile, name : res.stuChangeInfo.changeFile}))
                    }
                    
                }
            })
        } 
        this.$route.query.operate && (this.handleSelect(this.$route.query.operate))

        if (this.operateType == 2) {
            this.getGrade()
        }
    },
    methods: {
        debounce(fn, wait) {
            let fun = null
            if (fun !== null){
                clearTimeout(fun)
            }
            fun = setTimeout(fn, wait)
        },
        getGrade() {
            let that = this
            this.getCommHttpData({
                url: 'common/queryGradeListAuthority',
                method: 'get',
                contentType: 1,
            }, function(data) {
                that.gradeList = data.list
            })
        },
        getClass() {
            let that = this
            this.getCommHttpData({
                url: 'common/queryClassListAuthority',
                method: 'get',
                contentType: 1,
                data: {
                    gradeId : this.dataForm.gradeId
                }
            }, function(data) {
                that.classList = data.list
            })
        },
        getSearchData() {
            let self = this
            this.visible = true
            this.loading = true
            this.getCommHttpData({
                url : 'stu/changeInfo/getStuList?keywords=' + this.keyWords,
                method : 'post',
                contentType : 2,
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
            this.visible = false
        },
        handleSelect(item) {
            this.keyWords = item.stuName
            this.dataForm.name = item.stuName
            this.dataForm.teacherId = item.stuId
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
                this.$router.push({ name: 'stu-stu-register' })
            }else {
                this.$router.push({ name: 'stu-leave_school' })
            }
            
        },
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if(valid) {
                    let self = this
                    this.$confirm(`${this.dataForm.name}${this.tipLabel}`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            self.getCommHttpData({
                                url : '/stu/changeInfo/optChangeInfo',
                                method : 'post',
                                contentType : 2,
                                data : {
                                    stuId : self.dataForm.teacherId,
                                    firstChangeType : self.operateType == 2 ? 1 : 4,
                                    secondChangeType : self.operateType == 2 ? self.$route.query.changeTypeId : self.dataForm.retireType,
                                    startTime : self.dataForm.endDate,
                                    changeReason : self.dataForm.remark,
                                    changeFile : self.dataForm.appendixPath,
                                    stuChangeId : self.operateType == 2 ? undefined : self.$route.query.id,
                                    classId : self.dataForm.classId
                                }
                            }, res => {
                                if (res.code === 0) {
                                    self.$router.push({ name : 'stu-leave_school' })
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
	overflow: auto;
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
