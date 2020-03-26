<template>
    <div class="new-letter-wrapper" v-loading="loading">
        <div class="news-letter-wrapper-box">
            <div class="news-title" v-show="isPreview == 1">
                <el-input v-model="title" maxlength="15" placeholder="通知" :class="{'white-color-blank' : formModel.backgroundColor == 2, 'blank-color-white' : formModel.backgroundColor == 1}"></el-input>
            </div>
            <div class="new-content" v-show="isPreview == 1">
                <el-input ref="inputContent" v-model="content" :class="{'white-color-blank' : formModel.backgroundColor == 2, 'blank-color-white' : formModel.backgroundColor == 1}"  placeholder="请全体师生于上午11：00至操场集合" type="textarea" rows="10" maxlength="200"></el-input>
                <div class="word-count">
                    <span>{{content.length}}/200</span>
                </div>
            </div>
            <div class="preview-wrapper" v-show="isPreview == 2 || isPreview == 3">
                <div class="preview-box" :class="{'white-color-blanks' : formModel.backgroundColor == 2, 'blank-color-whites' : formModel.backgroundColor == 1}">
                    <div class="preview-title">{{title}}</div>
                    <div class="preview-preson-mess">
                        <span>通知来源:{{personName}}</span>
                        <span style="padding:0 10px;">{{curDate}}</span>
                        <span>{{beginTime}}</span>
                    </div>
                    <div class="preview-content"><pre v-html="content"></pre></div>
                </div>
                <div class="preview-button" v-show="isPreview == 2">
                    <el-button @click="isPreview = 1">返回编辑</el-button>
                    <el-button type="primary" @click="submitMess">提交</el-button>
                </div>
            </div>
            <div class="new-oprate" v-show="isPreview == 1 || isPreview == 3">
                <el-form :rules="rules" :model="formModel" ref="formN">
                    <div class="first-row">
                        <div class="col-1">
                            <el-form-item label="背景色:" prop="backgroundColor">
                                <div class="chose-color-blank" @click="formModel.backgroundColor = 2"><span v-if="formModel.backgroundColor == 2" class="el-icon-check"></span></div>
                                <div class="chose-color-back" @click="formModel.backgroundColor = 1"><span v-if="formModel.backgroundColor == 1" class="el-icon-check" style="color:#fff;"></span></div>
                            </el-form-item>
                        </div>
                        <div class="col-2">
                            <el-form-item label="播报设备:" prop="equipment">
                                <dropList :data="equipmentOption" v-model="formModel.equipment" :size="200" placeholder="请选择播报设备"></dropList>
                            </el-form-item>
                        </div>
                        <div class="col-3">
                            <el-form-item label="播报年级:">
                                <dropList :data="roomOption" v-model="formModel.room" :size="200" placeholder="请选择播报年级"></dropList>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="second-row">
                        <div class="col-2-1">
                            <el-form-item label="播报时间:" v-if="isImmediate == 2" prop="voiceTime">
                                <dropList :data="weekOptions" v-model="formModel.weekTime" :size="200" placeholder="请选择播报时间"></dropList>
                                <el-time-picker v-model="formModel.voiceTime" format='HH:mm' value-format="HH:mm" is-range range-separator="至" start-placeholder="开始时间" @change="checkIsHaved"
                                    end-placeholder="结束时间" placeholder="选择时间范围" clearable style="max-width:200px;"></el-time-picker>
                                <planePreview :week="weekParams"></planePreview>
                            </el-form-item>
                            <el-form-item label="播报时长:" v-if="isImmediate == 1" prop="timeLongValue">
                                <el-select v-model="formModel.timeLongValue" placeholder="请选择播报时长">
                                    <el-option v-for="item in timeLongOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <planePreview :week="weekParams"></planePreview>
                            </el-form-item>
                        </div>
                        <div class="col-2-2" v-if="isImmediate == 2">
                            <el-form-item label="重复:">
                                <el-select v-model="isRepeat" placeholder="请选择" style="width:110px;">
                                    <el-option v-for="item in repeatOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div class="news-oprate-button" v-show="isPreview == 1">
                    <el-button @click="handCancel">取消</el-button>
                    <el-button type="primary" @click="handClickPreview">预览</el-button>
                    <el-button type="primary" @click="submitMess">提交</el-button>
                </div>
                <div class="news-letter-mask-layer" v-if="maskLayerIsShow"></div>
            </div>
        </div>
    </div>
</template>

<script>
import dropList from './dropList/index.vue'
import { valid } from 'semver';
import { truncate } from 'fs';
import planePreview from './plan-preview';
export default {
    components : { dropList, planePreview },
    data() {
        return {
            title : '通知',
            content : '',
            curDate : '',
            beginTime : '',
            formModel : {
                backgroundColor : 1,
                equipment : [],
                room : [],
                weekTime : [],
                voiceTime : [],
                timeLongValue : 5,
            },
            personName : '',
            isPreview : 1,
            isRepeat : 1,
            timeLongOptions : [], 
            repeatOptions : [
                {
                    label : '不重复',
                    value : 1
                },
                {
                    label : '每周重复',
                    value : 2
                }
            ],
            equipmentOption : [],
            weekOptions : [],
            weekParams : [],
            roomOption : [],
            isImmediate : 2,
            operate : false,
            maskLayerIsShow : false,
            broadcastId : '',
            loading: false,
            dayOfWeek : 0,
        }
    },
    computed : {
        rules() {
            return {
                equipment: [
                    { type: 'array', required: true, message: '请选择播报设备', trigger: 'blur' }
                ],
                voiceTime : [
                    { type: 'array', required: true, message: '请选择播报时间', trigger: 'change' }
                ],
                timeLongValue : [
                    { required: true, message: '请选择播报时长', trigger: 'change' }
                ],
                backgroundColor : [
                    { required: true, message: '请选择背景色', trigger: 'change' }
                ],
            }
        },

    },
    mounted() {
        let weekarr = JSON.parse(sessionStorage.getItem('voiceQuery')).week || [], arr = []
        this.weekParams = weekarr
        weekarr.forEach(item => {
            arr.push({
                label : item.week,
                value : item.dateTime
            })
        })
        this.weekOptions = arr
        this.dayOfWeek = weekarr[0].dateTime
        this.isPreview == 1 && (this.$refs.inputContent.focus())
    },
    methods : {
        checkIsHaved(n) {
            if (parseInt(n[0].split(':')[0]) < 6 || parseInt(n[1].split(':')[0]) > 22) {
                this.$message.info('请选择作息范围内时间06：00~22：00')
                this.formModel.voiceTime = ['06:00', '07:00']
                return
            }
            if (n.length == 2 && this.formModel.weekTime.length) {
                this.getCommHttpData({
                    url : 'eclassbroadcast/isBdRepeat',
                    method : 'post',
                    contentType : 2,
                    data : {
                        bdDay : this.formModel.weekTime.join(','),
                        startTime : this.formModel.voiceTime[0],
                        endTime : this.formModel.voiceTime[1],
                        id : this.broadcastId
                    }
                })
            }
        },
        handClickPreview() {
            if (!this.content || !this.title) {
                !this.content && this.title && (this.$message.info('请输入播报内容!'))
                this.content && !this.title && (this.$message.info('请输入标题!'))
                !this.content && !this.title && (this.$message.info('请输入标题,播报内容!'))
            }else {
                this.isPreview = 2
            }
        },
        submitMess() {
            let self = this
            if (!this.content || !this.title) {
                !this.content && this.title && (this.$message.info('请输入播报内容!'))
                this.content && !this.title && (this.$message.info('请输入标题!'))
                !this.content && !this.title && (this.$message.info('请输入标题,播报内容!'))
            }else {
                this.$refs.formN.validate(valid => {
                    if (valid) {
                        let bdEquip = ''
                        if (this.formModel.equipment.length == 0) {
                            bdEquip = 0
                        }else if (this.formModel.equipment.length == this.equipmentOption.length) {
                            bdEquip = null
                        }else {
                            bdEquip = this.formModel.equipment.join(',')
                        }
                        this.loading = true
                        if (this.broadcastId) {
                            this.getCommHttpData({
                                url : 'eclassbroadcast/update',
                                method : 'post',
                                contentType : 2,
                                operateType : 3,
                                data : {
                                    id : this.broadcastId,
                                    title : this.title,
                                    content : this.content,
                                    contentType : 1,
                                    contentStyle : this.formModel.backgroundColor,
                                    startTime : this.formModel.voiceTime[0],
                                    endTime : this.formModel.voiceTime[1],
                                    bdDay : this.formModel.weekTime.join(','),
                                    bdEquip : bdEquip,
                                    isRepeat : this.isRepeat,
                                    bdType : this.isImmediate,
                                    gradeIds : this.formModel.room.length == this.roomOption.length ? null : this.formModel.room.join(','),
                                    bdDuration : this.formModel.timeLongValue
                                }
                            }, res => {
                                self.loading = false
                                if (res.code === 0) {
                                    this.$message.success('播报计划更新成功!')
                                    this.$router.push({
                                        name : 'class-card-broadcast',
                                        params : {
                                            _timeStamp : this.dayOfWeek
                                        }
                                    })
                                }
                            })
                        }else {
                            this.getCommHttpData({
                            url : 'eclassbroadcast/save',
                            method : 'post',
                            contentType : 2,
                            operateType : 3,
                            data : {
                                title : this.title,
                                content : this.content,
                                contentType : 1,
                                contentStyle : this.formModel.backgroundColor,
                                startTime : this.formModel.voiceTime[0],
                                endTime : this.formModel.voiceTime[1],
                                bdDay : this.formModel.weekTime.join(','),
                                bdEquip : bdEquip,
                                isRepeat : this.isRepeat,
                                bdType : this.isImmediate,
                                gradeIds : this.formModel.room.length == this.roomOption.length ? null : this.formModel.room.join(','),
                                bdDuration : this.formModel.timeLongValue
                            }
                        }, res => {
                            self.loading = false
                            if (res.code === 0) {
                                this.$message.success('播报计划创建成功!')
                                this.$router.push({
                                    name : 'class-card-broadcast',
                                    params : {
                                        _timeStamp : this.dayOfWeek
                                    }
                                })
                            }
                        })
                        }
                    }else {
                        this.$message.error('请填写*必填项!')
                    }
                })
            }
        },
        handCancel() {
            if (this.content && !this.broadcastId) {
                this.$confirm('取消操作后,播报内容将删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({
                        name : 'class-card-broadcast',
                        params : {
                            _timeStamp : this.dayOfWeek
                        }
                    })
                })
            }else {
                this.$router.push({
                    name : 'class-card-broadcast',
                    params : {
                        _timeStamp : this.dayOfWeek
                    }
                })
            }
            
        },
        //初始化时长段数组
        initTimeLong(num) {
            let arr = [], sum = num
            while(sum < 60 + num) {
                arr.push({
                    label : sum + '分钟',
                    value : sum
                })
                sum += num
            }
            return arr
        },
        getEquipment(obj) {
            let self = this
            if (obj === 1 || obj == null) {
                this.getCommHttpData({
                    url : 'device/findTypeList',
                    method : 'post',
                    contentType : 2,
                }, res => {
                    if (res.code === 0) {
                        let arr = []
                        res.list.forEach(item => {
                            self.equipmentOption.push({
                                label : item.deviceName,
                                value : item.deviceId + ''
                            })
                            arr.push(item.deviceId + '')
                        })
                        self.formModel.equipment = arr
                    }
                })
            }else {
                let _a = obj.split(',')
                this.getCommHttpData({
                    url : 'device/findTypeList',
                    method : 'post',
                    contentType : 2,
                }, res => {
                    if (res.code === 0) {
                        res.list.forEach(item => {
                            self.equipmentOption.push({
                                label : item.deviceName,
                                value : item.deviceId + ''
                            })
                        })
                        self.formModel.equipment = _a
                    }
                })
            }
        },
        getClassData(obj) {
            let self = this
            if (obj === 1 || obj == null) {
                this.getCommHttpData({
                    url : 'common/queryGradeListAuthority',
                    method : 'get',
                    contentType : 2,
                }, res => {
                    if (res.code === 0) {
                        res.list.map(item => {
                            item.label = item.gradeName
                            item.value = item.gradeId
                        })
                        self.roomOption = res.list
                        let arr = []
                        self.roomOption.forEach(value => {
                            arr.push(value.value)
                        })
                        self.formModel.room = arr
                    }
                })
            }else if (obj == 0) {
                this.getCommHttpData({
                    url : 'common/queryGradeListAuthority',
                    method : 'get',
                    contentType : 2,
                }, res => {
                    if (res.code === 0) {
                        res.list.map(item => {
                            item.label = item.gradeName
                            item.value = item.gradeId
                        })
                        self.roomOption = res.list
                    }
                })
            }else {
                let _a = obj.split(',')
                this.getCommHttpData({
                    url : 'common/queryGradeListAuthority',
                    method : 'get',
                    contentType : 2,
                }, res => {
                    if (res.code === 0) {
                        res.list.map(item => {
                            item.label = item.gradeName
                            item.value = item.gradeId
                        })
                        self.roomOption = res.list
                        self.formModel.room = _a
                    }
                })
            }
            
        },
        initPage(obj) {
            this.timeLongOptions = this.initTimeLong(5)
            if (obj.operateType) {
                obj.operateType == 1 && (this.isPreview = 3, this.maskLayerIsShow = true)
                let cast = obj.eclassBroadcast
                this.getClassData(cast.gradeIds)
                this.getEquipment(cast.bdEquip)
                this.isImmediate = cast.bdType
                this.title = cast.title
                this.content = cast.content
                this.formModel.backgroundColor = cast.contentStyle
                this.formModel.weekTime = cast.bdDay.split(',')
                this.formModel.timeLongValue = parseInt(cast.bdDuration)
                this.personName = cast.bdName
                this.formModel.voiceTime = [cast.startTime, cast.endTime]
                this.beginTime = cast.startTime
                this.curDate = cast.bdDay
                this.broadcastId = cast.id
                this.isRepeat = cast.isRepeat
            }else {
                this.getClassData(1)
                this.getEquipment(1)
                this.isImmediate = obj.isImmediate
                this.curDate = obj.date
                this.beginTime = obj.time
                if (this.isImmediate == 2) {
                    this.formModel.weekTime = [this.curDate]
                    let timeNum = parseInt(obj.time.split(':')[0]) + 1, str = ''
                    timeNum > 10 ? str = timeNum + ':00' : str = '0' + timeNum + ':00' 
                    this.formModel.voiceTime = [obj.time, str]
                }
                this.getCommHttpData({
                    url : 'uc/user/userInfo',
                    method: 'get',
                    contentType: 1,
                    data: {
                        userId: this.GLOBAL.getUserId()
                    }
                }, res => {
                    if (res.code == 0) {
                        this.personName = res.user.userInfo[0].deptName
                    }
                })
            }
        },
    },
    created() {
        this.initPage(JSON.parse(sessionStorage.getItem('voiceQuery')))
    }
}
</script>
<style lang="scss" scoped>
.news-title{
    /deep/ input{
        text-align: center;
        height: 55px;
        line-height: 55px;
        font-size: 35px;
    }
}
.preview-wrapper{
    background-color: #fff;
}
.preview-title{
    text-align: center;
    height: 55px;
    line-height: 55px;
    font-size: 35px;
}
.preview-preson-mess{
    text-align: center;
    font-size: 16px;
    line-height: 30px;
}
.preview-button{
    text-align: right;
    padding: 10px;
}
.new-content{
    margin-top: 10px;
    position: relative;
    /deep/ textarea{
        font-size: 30px;
    }
    .word-count{
        position: absolute;
        right: 10px;
        bottom: 5px;
        color: #2ebbad;
    }
}
.preview-content{
    font-size: 30px;
    min-height: 462px;
    margin-top: 5px;
    padding: 5px 20px;
    pre{
        word-wrap: break-word;
        white-space: pre-wrap;
    }
}
.news-oprate-button{
    text-align: right;
}
.help-mess{
    padding-left: 5px;
    cursor: pointer;
    color: #2ebbad;
    &:hover{
        color: #0dcfbc;
    }
}
.chose-color-blank,.chose-color-back{
    width: 30px;
    height: 30px;
    display: inline-block;
    cursor: pointer;
    border: 1px solid #2ebbad;
    border-radius: 50%;
    vertical-align: middle;
    text-align: center;
    line-height: 30px;
}
.chose-color-blank{
    background-color: #fff;
}
.chose-color-back{
    margin-left: 5px;
    background-color: #000;
}
.new-oprate{
    background-color: #fff;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    margin-top: 10px;
    padding: 20px;
    position: relative;
}
.news-letter-mask-layer{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: rgba(133,142,159,.1);
    cursor: not-allowed;
}
.white-color-blank{
    @mixin common{
        background-color: #fff;
        color: #333;
    }
    /deep/ textarea{
        @include common
    }
    /deep/ input{
        @include common
    }
    @include common;
}
.blank-color-white{
    @mixin comm{
        background-color: #333;
        color: #fff;
    }
    /deep/ textarea{
        @include comm
    }
    /deep/ input{
        @include comm
    }
}
.white-color-blanks{
    background-color: #fff;
    color: #333;
}
.blank-color-whites{
    background-color: #333;
    color: #fff;
}

.first-row{
    display: flex;
    .col-1{
        min-width: 185px;
    }
    .col-2{
        min-width: 337px;
    }
    .col-3{
        flex-grow: 1;
    }
}
.second-row{
    display: flex;
    .col-2-1{
        min-width: 640px;
    }
    .col-2-2{
        flex-grow: 1;
    }
}
::-webkit-scrollbar{  
    width: 0px;  
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




