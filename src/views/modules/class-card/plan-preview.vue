<template>
    <div class="plan-preview-wrapper">
        <div><span class="el-icon-info help-mess" @click="openDialog">播报计划</span></div>
        <el-dialog :visible.sync="dialogVisible" width="75%" title="播报计划" class="dialog-plane">
            <div class="plane-wrapper">

                <div class="voice-header">
                    <div class="pre-button el-icon-arrow-left" @click="handNextClick(0)"></div>
                    <div class="date-header-chose">
                        <div class="date-header-show-mess">{{currentDateShowValue}}<span class="el-icon-date"></span></div>
                        <el-date-picker v-model="currentDate" @change="refreshWeek" class="date-header-picker-hiddden" type="date" align="center" :clearable="false" placeholder="选择日期"></el-date-picker>
                    </div>
                    <div class="next-button el-icon-arrow-right" @click="handNextClick(1)"></div>
                </div>

                <div class="plane-header">
                    <div class="plane-week" v-for="(item, index) in weekOptions" :key="index">
                        <div>{{item.week}}</div>
                        <div>{{item.date}}</div>
                    </div>
                </div>
                <div class="plane-content" v-if="!isPlaneDataNull">
                    <div class="plane-mess" v-for="(i, j) in planeData" :key="j">
                        <div class="plane-box" v-for="(value, o) in i" :key="o">
                            <span v-if="value.startTime">{{value.startTime}}~{{value.endTime}}<span style="padding-left:0.8em;">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</span></span>
                            <span v-else> </span>
                        </div>
                    </div>
                </div>
                <div v-if="isPlaneDataNull" style="line-height:350px;color:#C0C4CC;text-align:center;font-size:22px;">暂无播报计划</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props : {
        week : {
            type : Array,
            default : []
        }
    },

    data() {
        return {
            currentDate : new Date(),
            dialogVisible : false,
            weekOptions : [],
            isPlaneDataNull : true,
            planeData : [],
        }
    },

    watch : {
        week(n) {
            this.weekOptions = JSON.parse(JSON.stringify(n))
        },
        weekOptions() {
            this.getPlanData()
        }
    },

    mounted() {
        this.weekOptions = this.week
    },

    computed : {
        currentWeek() {
            let arr = []
            this.weekOptions.forEach(item => {
                arr.push( { date : item.dateTime } )
            })
            return arr
        },
        currentDateShowValue() {
            if (this.currentWeek.length) {
                let begin = this.currentWeek[0].date, end = this.currentWeek[6].date
                let str = begin + '~' + end
                return str
            }
        },
    },

    methods : {
        openDialog() {
            this.dialogVisible = true
            this.getPlanData()
        },
        getPlanData() {
            this.planeData = []
            let self = this
            this.getCommHttpData({
                url : 'eclassbroadcast/list',
                method : 'post',
                contentType : 2,
                data : {
                    currentWeek : this.currentWeek,
                    start : '6:00',
                    offset : '2'
                }
            }, res => {
                if (res.code === 0) {
                    let l = 0
                    res.list.forEach(value => {
                        for (let p in value) {
                            value[p].length > l && (l = value[p].length)
                            self.planeData.push(value[p])
                        }
                    })
                    if (l > 0) {
                        self.isPlaneDataNull = false
                        self.planeData.forEach(item => {
                            if (item.length != l) {
                                let num = l - item.length
                                while(num) {
                                    item.push({})
                                    num --
                                }
                            }
                        })
                    }else {
                        self.isPlaneDataNull = true
                    }
                }
            })
        },

        handNextClick(num) {
            if (num) {
                this.weekOptions = this.getWeeksByDate( this.weekOptions[6].timeStamp + 86400000 )
            }else {
                this.weekOptions = this.getWeeksByDate(this.weekOptions[0].timeStamp - (86400000 * 6))
            }
        },

        refreshWeek() {
            this.weekOptions = this.getWeeksByDate(this.currentDate)
        },

        getWeeksByDate(date) {
            let arr = []
            let tip = ['日', '一', '二', '三', '四', '五', '六']
            let _date = date || new Date().getTime()
            let time = new Date(_date).getTime()
            let curWeek = new Date(_date).getDay()
            let mon = null
            if (curWeek > 0) {
                time = time - 86400000 * (curWeek - 1)
            }else {
                time = time - 86400000 * 6
            }
            for (let i = 0; i < 7; i++) {
                let _timesNum = time + 86400000 * i
                let _obj = new Date(_timesNum)
                let weekDay = '星期' + tip[_obj.getDay()] 
                let monthF = '', dateF = ''

                _obj.getMonth() + 1 < 10 ? monthF = '0' + (_obj.getMonth() + 1) : monthF = _obj.getMonth() + 1
                _obj.getDate() < 10 ? dateF = '0' + _obj.getDate() : dateF = _obj.getDate()
                
                let curDate = _obj.getFullYear() + '年' +  (_obj.getMonth() + 1) + '月' + _obj.getDate() + '日'
                let curDates = _obj.getFullYear() + '/' +  (_obj.getMonth() + 1) + '/' + _obj.getDate()
                let dateTime = _obj.getFullYear() + '-' +  monthF  + '-' + dateF
                arr.push({week : weekDay, date : curDate, dates : curDates, timeStamp : _timesNum, dateTime : dateTime})
            }
            return arr
        },
    }
}
</script>

<style lang="scss" scoped>
.voice-header{
    position: relative;
    text-align: center;
}
.pre-button,.next-button{
    padding: 5px 5px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    &:hover{
        color: #3C85EE;
    }
}
.date-header-chose{
    position: relative;
    display: inline-block;
}
.date-header-show-mess{
    display: inline-block;
    line-height: 36px;
    font-size: 16px;
    padding: 0 10px;
    span{
        color: #3C85EE;
    }
}
.plan-preview-wrapper{
    display: inline-block;
}
.help-mess{
    padding-left: 5px;
    cursor: pointer;
    color: #2ebbad;
    &:hover{
        color: #0dcfbc;
    }
}
.plane-header{
    display: flex;
    border-left: 1px solid #DCDFE6;
}
.plane-week{
    flex-grow: 1;
    text-align: center;
    background-color: #e6f6f4;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    line-height: 28px;
    width: 0;
}
.plane-content{
    display: flex;
    border-left: 1px solid #DCDFE6;
    max-height: 500px;
    overflow: auto;
}
.plane-mess{
    flex-grow: 1;
    width: 0;
    .plane-box{
        overflow: hidden;
        border-bottom: 1px solid #DCDFE6;
        border-right: 1px solid #DCDFE6;
        width: 100%;
        border-top: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-height: 28px;
        line-height: 27px;
        padding-left: 5px;
    }
}
.date-header-picker-hiddden{
    position: absolute;
    width: 210px;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    /deep/ input{
        cursor: pointer;
    }
}
.dialog-plane{
    /deep/ .el-dialog__body{
        min-height: 400px;
        padding-top: 0;
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


