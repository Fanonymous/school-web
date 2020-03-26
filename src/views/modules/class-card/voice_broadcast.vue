<template>
    <div class="wrapper-voice" v-clickoutsides:exactAreaClassName="closeLayer">
        <!-- 头部日期选择 -->
        <div class="voice-header">
            <div class="pre-button el-icon-arrow-left" @click="handNextClick(0)"></div>
            <div class="date-header-chose">
                <div class="date-header-show-mess">{{currentDateShowValue}}<span class="el-icon-date"></span></div>
                <el-date-picker v-model="currentDate" @change="refreshWeek" class="date-header-picker-hiddden" type="date" align="center" :clearable="false" placeholder="选择日期"></el-date-picker>
            </div>
            <div class="next-button el-icon-arrow-right" @click="handNextClick(1)"></div>
            <el-dropdown class="heaser-add-button" placement="bottom">
                <el-button type="primary">添加&nbsp;<span class="el-icon-arrow-down"></span>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>消息简讯</el-dropdown-item>
                    <el-dropdown-item>校内咨询</el-dropdown-item>
                    <el-dropdown-item>视频播报</el-dropdown-item>
                    <el-dropdown-item>已有咨询推送</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!-- 内容区 -->
        <div class="voice-content">
            <div class="calendar-wrapper">
                <div class="calendar-col-0"></div>
                <div v-for="(item, index) in currentWeek" :key="index" :class="'calendar-col-' + (index + 1)" class="calendar-col">
                    <div class="week-date">
                        <div class="week-header">{{item.week}}</div>
                        <div class="date-header">{{item.date}}</div>
                    </div>
                </div>
            </div>
            <div class="calendar-content-box">
                <div class="calebox-col-0">
                    <div v-for="(item, index) in timeArr" :key="index" :class="'time-title-' + index">
                        <div class="time-title-mess">{{item.time}}</div>
                    </div>
                </div>

                <div class="calebox-col-1 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.mon" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @click="switchLayer" @mouseenter="hoverButtonShow=false" @mouseleave="hoverButtonShow=false">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-2 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.tues" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @click="switchLayer">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-3 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.wed" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-4 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.thurs" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-5 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.fri" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-6 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.sat" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-7 calebox-col">
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.sun" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < 2">
                            <div class="event-sourcer-content">
                                <span>{{value.title}}</span>
                                <span>{{value.start}}-{{value.end}}</span>
                                <span v-if="item.isOverFlow && key1 == 1">...</span>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div>
                                <span class="el-icon-circle-plus-outline"></span>
                                <span>添加</span>
                            </div>
                            <div class="add-button-border" v-if="item.isOverFlow" @click.stop="rightShowFloatLayer(item.elArr, $event)">
                                <span>共{{item.elArr.length}}条</span>
                                <span class="el-icon-arrow-right"></span>
                            </div>
                        </div>
                        <div class="hover-three-button" v-if="!item.isOverFlow && hoverButtonShow" :style="{'height' : item.trueHeight + 'px', 'line-height' : item.trueHeight + 'px'}">
                            <span>查看</span>
                            <span>编辑</span>
                            <span>删除</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="event-float-layer exactAreaClassName" v-if="floatLayerShow" :style="{'top' : top + 'px', 'left' : left + 'px'}">
            <div class="layer-wrapper" v-for="(it, i) in layerEventSource" :key="i">
                <div class="layer-event-title">{{it.title}}</div>
                <div class="layer-event-date">{{it.start}}-{{it.end}}</div>
                <div class="layer-event-oprate-button">
                    <span>查看</span>
                    <span>编辑</span>
                    <span>删除</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentDate : new Date(),
            currentWeek : [],
            timeArr : [],
            eventSources : {
                mon : [],
                tues : [],
                wed : [],
                thurs : [],
                fri : [],
                sat : [],
                sun : []
            },
            layerEventSource : [],
            hoverButtonShow : false,
            floatLayerShow : false,
            top : 0,
            left : 0,
        }
    },
    computed : {
        currentDateShowValue() {
            let str = this.currentDate.getFullYear() + '年' + (this.currentDate.getMonth() + 1) + '月' + this.currentDate.getDate() + '日'
            return str
        }
    },

    mounted() {
        this.currentWeek = this.getWeeksByDate()
        this.timeArr = this.getDateTime()
        let obj = {
            mon : [
                {
                    title : '《开学欢迎》',
                    start : '6:30',
                    startHour : 6,
                    end : '6:40',
                    timeLong : 15,
                    offset : 45
                },
                {
                    title : '《校长讲话》',
                    start : '6:40',
                    startHour : 6,
                    end : '6:50',
                    timeLong : 15,
                    offset : 60
                },
                {
                    title : '《班主任训话》',
                    start : '6:50',
                    startHour : 6,
                    end : '7:20',
                    timeLong : 45,
                    offset : 75
                },
                {
                    title : '《编码测试》',
                    start : '8:20',
                    startHour : 8,
                    end : '8:45',
                    timeLong : 37.5,
                    offset : 210
                },
                {
                    title : '《编码测试1》',
                    start : '8:50',
                    startHour : 8,
                    end : '8:55',
                    timeLong : 7.5,
                    offset : 225
                }
            ],
            tues : [
                {
                    title : '《开学欢迎1》',
                    start : '7:30',
                    startHour : 7,
                    end : '7:40',
                    timeLong : 15,
                    offset : 150
                },
                {
                    title : '《校长讲话》',
                    start : '6:40',
                    startHour : 6,
                    end : '6:50',
                    timeLong : 15,
                    offset : 60
                },
                {
                    title : '《班主任训话》',
                    start : '6:50',
                    startHour : 6,
                    end : '7:20',
                    timeLong : 45,
                    offset : 75
                },
                {
                    title : '《编码测试》',
                    start : '8:20',
                    startHour : 8,
                    end : '8:45',
                    timeLong : 37.5,
                    offset : 210
                },
                {
                    title : '《编码测试1》',
                    start : '8:50',
                    startHour : 8,
                    end : '8:55',
                    timeLong : 7.5,
                    offset : 225
                }
            ],
        }
        this.eventSources = this.eventGroupBy(obj)
    },
    methods : {
        //初始头部星期
        getWeeksByDate(date) {
            let arr = []
            let tip = ['日', '一', '二', '三', '四', '五', '六']
            let _date = date || new Date().getTime()
            let time = new Date(_date).getTime()
            let curWeek = new Date(_date).getDay()
            let mon = null
            if (curWeek > 1) {
                time = time - 86400000 * (curWeek - 1)
            }
            for (let i = 0; i < 7; i++) {
                let _timesNum = time + 86400000 * i
                let _obj = new Date(new Date(_timesNum))
                let weekDay = '星期' + tip[_obj.getDay()] 
                let curDate = _obj.getFullYear() + '年' +  (_obj.getMonth() + 1) + '月' + _obj.getDate() + '日'
                let curDates = _obj.getFullYear() + '/' +  (_obj.getMonth() + 1) + '/' + _obj.getDate()
                arr.push({week : weekDay, date : curDate, dates : curDates, timeStamp : _timesNum})
            }
            return arr
        },
        //初始化左侧时间轴
        getDateTime(start = 6, end = 18, interval = 1) {
            let _start = start || 0, arr = []
            while(_start <= end) {
                let strTime = _start + ':00'
                arr.push({time : strTime})
                _start += interval
            }
            return arr
        },

        //事件分组
        eventGroupBy(obj) {
            let _obj = obj
            for (let prop in _obj) {
                let tepObj = {}
                _obj[prop].forEach(item => {
                    !tepObj[item.startHour] && (tepObj[item.startHour] = {}, tepObj[item.startHour].elArr = [])
                    tepObj[item.startHour].elArr.push(item)
                })
                _obj[prop] = tepObj
            }

            for (let p in _obj) {
                for (let v in _obj[p]) {
                    let totalHeight = 0, minOffset = 50000
                    _obj[p][v].elArr.forEach(value => {
                        totalHeight += value.timeLong
                        minOffset > value.offset && (minOffset = value.offset)
                    })
                    if (_obj[p][v].elArr.length > 2) {
                        _obj[p][v].isOverFlow = true
                        totalHeight < 60 && (totalHeight = 60)
                    }else {
                        _obj[p][v].isOverFlow = false
                        _obj[p][v].elArr.length == 2 && totalHeight < 60 && (totalHeight = 60)
                        totalHeight < 40 && (totalHeight = 40)
                    }
                    _obj[p][v].minOffset = minOffset
                    _obj[p][v].trueHeight = totalHeight
                }
            }
            for (let i in _obj) {
                let _arr1 = []
                for (let j in _obj[i]) {
                    if (_obj[i][j].elArr.length > 2) {
                        _arr1.push(_obj[i][j])
                    }else {
                        _obj[i][j].elArr.forEach(val => {
                            let _onlyObj = {}
                            _onlyObj.elArr = [val]
                            val.timeLong < 40 && (_onlyObj.trueHeight = 40)
                            _onlyObj.trueHeight = val.timeLong
                            _onlyObj.minOffset = val.offset
                            _onlyObj.isOverFlow = false
                            _arr1.push(_onlyObj)
                        })
                    }
                }
                _obj[i] = _arr1
            }
            return _obj
        },
        //选择日期后刷新星期
        refreshWeek() {
            this.currentWeek = this.getWeeksByDate(this.currentDate)
        },

        //多个显示浮层
        rightShowFloatLayer(arr, event) {
            let e = event || window.event
            let target = e.target || e.srcElement
            let nodeName = target.tagName || target.nodeName
            let origin = null, wrapper = null
            nodeName == 'DIV' ? origin = e.path[2] : origin = e.path[3]
            nodeName == 'DIV' ? wrapper = e.path[6] : wrapper = e.path[7]
            this.layerEventSource = arr
            this.left = origin.getBoundingClientRect().right - wrapper.getBoundingClientRect().left + 5
            this.top = origin.getBoundingClientRect().top - 150
            this.floatLayerShow = true
            console.log(1)
        },

        //关闭浮层
        closeLayer() {
            this.floatLayerShow = false
        },

        //切换图层上下级
        switchLayer(event) {
            console.log(event)

        },

        //递归获取指定父级
        getParentEle(ele) {
            if (ele.className && ele.className.indexOf('event-source-box') > -1) {
                return ele
            }else {
                this.getParentEle(ele.parentNode)
            }
        },
        //切换周事件
        handNextClick(num) {
            if (num) {
                this.currentWeek = this.getWeeksByDate(this.currentWeek[6].timeStamp + 86400000)
            }else {
                this.currentWeek = this.getWeeksByDate(this.currentWeek[0].timeStamp - (86400000 * 6))
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.wrapper-voice{
    position: relative;
}
.event-float-layer{
    position: absolute;
    width: 220px;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0px 4px 10px 0px rgba(6, 0, 1, 0.25);
    border-radius: 4px;
    .layer-wrapper{
        height: 80px;
        border-top: 1px solid #e6e6e6;
    }
    .layer-event-title,.layer-event-date{
        padding-top: 5px;
        padding-left: 10px;
    }
    .layer-event-oprate-button{
        text-align: center;
        margin-top: 5px;
        span{
            padding: 5px 10px;
            background-color: #2ebbad;
            border-radius: 4px;
            color: #fff;
            line-height: 26px;
            cursor: pointer;
        }
    }
}
.voice-header{
    text-align: center;
}
.heaser-add-button{
    position: absolute;
    left: 0px;
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
.date-header-picker-hiddden{
    position: absolute;
    width: 140px;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    /deep/ input{
        cursor: pointer;
    }
}
.calendar-wrapper{
    margin-top: 10px;
    display: flex;
}
.calendar-content-box{
    display: flex;
}
.calendar-col-0{
    flex-grow: 1;
    background-color: rgba(23, 179, 163, .6);
}
.calebox-col-0{
    flex-grow: 1;
    width: 80px;
    background-color: rgba(23, 179, 163, .6);
}
.calebox-col{
    flex-grow: 0;
    width: 220px;
    border-left: 1px solid #fff;
    position: relative;
}
.time-title-mess{
    height: 90px;
    line-height: 90px;
    text-align: center;
    border-top: 1px solid #fff;
}
.calendar-col{
    background-color: rgba(23, 179, 163, .6);
    flex-grow: 0;
    width: 220px;
    height: 70px;
    border-left: 1px solid #fff;
}
.event-source-box{
    box-sizing: border-box;
    border-top: 1px solid #e6e6e6;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 6px 9px 0px rgba(6, 0, 1, 0.2);
    position: absolute;
    left: 1px;
    width: 98%;
    text-align: center;
    cursor: pointer;
    display: flex;
    min-height: 40px !important;
    flex-direction: column;
    .event-source-box-group{
        padding-top: 3px;
    }
}
.event-source-add-but{
    color: #2ebbad;
    cursor: pointer;
    flex-grow: 0;
    box-sizing: border-box;
    border-top: 1px solid #e6e6e6;
    display: flex;
    div{
        flex-grow: 1;
    }
    .add-button-border{
        border-left: 1px solid #e6e6e6;
    }
}
.addbutton-tipmess{
    padding-left: 20px;
    border-left: 1px solid;
}

.event-source-box-group{
    flex-grow: 1;
}
.hover-three-button{
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
    width: 100%;
    color: #fff;
    min-height: 40px;
    span{
        padding: 5px 10px;
        background-color: #2ebbad;
        z-index: 100;
        border-radius: 4px;
    }
}
.week-date{
    height: 100%;
}
.week-header{  
    color: #333;
}
.date-header{
    color: #666;
    
}
.week-header,.date-header{
    font-size: 16px;
    text-align: center;
    height: 50%;
    line-height: 35px;
}

</style>
<style lang="scss">
.voice-clear-header{
    .el-date-picker__header{
        display: none;
    }
}
</style>



