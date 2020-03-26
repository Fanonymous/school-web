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
            <div class="heaser-add-button">
                <el-button type="primary" @click="handClickImmediate(1)">即时播报</el-button>
                <el-button type="primary" @click="handClickImmediate(2)">定时播报</el-button>
            </div>
        </div>

        <!-- 内容区 -->
        <div class="voice-content">
            <div class="calendar-wrapper">
                <div class="calendar-col-0"></div>
                <div v-for="(item, index) in currentWeek" :key="index" :class="'calendar-col-' + (index + 1)" class="calendar-col">
                    <div class="week-date" :class="{'current-time-stamp' : curTimestamp == item.dateTime}">
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
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[0].dateTime, item.time)"></div>
                    </div>

                    <div class="event-source-box" v-for="(item, key, index) in eventSources.mon" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[0].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[0].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="calebox-col-2 calebox-col">
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[1].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.tues" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[1].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[1].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="calebox-col-3 calebox-col">
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[2].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.wed" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[2].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[2].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-4 calebox-col">
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[3].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.thurs" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[3].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[3].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-5 calebox-col">
                   <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[4].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.fri" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[4].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                   <span class="el-icon-plus" @click="blankClickAdd(currentWeek[4].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-6 calebox-col">
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[5].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.sat" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}"  @click="blankClickAdd(currentWeek[5].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[5].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="calebox-col-7 calebox-col">
                    <div class="bottom-layer-box" v-for="(item, index) in timeArr" :key="index" @mouseenter="blankMouseEnterAdd" @mouseleave="blankMouseLeave">
                        <div class="bottom-layer-box-add-button el-icon-plus" @click="blankClickAdd(currentWeek[6].dateTime, item.time)"></div>
                    </div>
                    <div class="event-source-box" v-for="(item, key, index) in eventSources.sun" :key="index" :style="{'height' : item.trueHeight + 'px','top' : item.minOffset + 'px'}" @mouseenter="handMouseEnter(item.elArr, item.elArr.length, $event)" @mouseleave="handMouseLeave">
                        <div class="event-source-box-group" v-for="(value, key1) in item.elArr" :key="key1" v-if="key1 < (item.trueHeight / 120 * 3)" :class="{'already-color' : value.status == '1', 'noready-color' : value.status == '0', 'ready-color' : value.status == '2'}">
                            <div class="event-sourcer-content">
                                <div class="event-sourcer-content-title">{{value.title ? value.title : value.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                                <div>{{value.startTime}}~{{value.endTime}}</div>
                            </div>
                            <div class="hover-three-button" :style="{'height' : item.trueHeight + 'px'}">
                                <div class="only-add-button el-icon-plus" v-if="item.elArr.length > 1" :style="{'line-height' : item.trueHeight + 'px'}" @click="blankClickAdd(currentWeek[6].dateTime, item.elArr[item.elArr.length - 1].endTime)">
                                </div>
                                <div class="hover-three-button-top" v-if="item.elArr.length == 1">
                                    <span @click="getBroadcastMess(value, 1)">查看</span>
                                    <span @click="getBroadcastMess(value, 2)" v-if=" value.status == '0'">编辑</span>
                                    <span @click="deleteBroadcast(value)" v-if=" value.status == '0'">删除</span>
                                </div>
                                <div class="hover-three-button-bottom" v-if="item.elArr.length == 1">
                                    <span class="el-icon-plus" @click="blankClickAdd(currentWeek[6].dateTime, item.elArr[item.elArr.length - 1].endTime)"></span>
                                </div>
                            </div>
                        </div>
                        <div class="event-source-add-but">
                            <div class="add-button-border" v-if="item.elArr.length > 1">
                                <span>共{{item.elArr.length}}条</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-backtop :bottom="100" style="font-size:12px;width:55px;height:30px;right:25px;bottom:65px;">
            <div style="height: 100%;width: 100%;background-color: #f2f5f6;box-shadow: 0 0 6px rgba(0,0,0, .12);text-align: center;line-height: 30px;color: #1989fa;">返回顶部</div>
        </el-backtop>

        <div class="event-float-layer exactAreaClassName" @mouseenter="floatLayerShow = true" @mouseleave="floatLayerShow = false" v-if="floatLayerShow" :style="{'top' : top + 'px', 'left' : left + 'px', 'bottom' : bottom + 'px'}">
            <div class="layer-wrapper" v-for="(it, i) in layerEventSource" :key="i">
                <div class="layer-event-title">{{it.title ? it.title : it.contentType == 2 ? '图片下发' : '视频播报'}}</div>
                <div class="layer-event-date">{{it.startTime}}-{{it.endTime}}</div>
                <div class="layer-event-oprate-button">
                    <span @click="getBroadcastMess(it, 1)">查看</span>
                    <span @click="getBroadcastMess(it, 2)" v-if=" it.status == '0'">编辑</span>
                    <span @click="deleteBroadcast(it)" v-if=" it.status == '0'">删除</span>
                </div>
            </div>
        </div>

        <!-- dialo弹窗菜单 -->
        <el-dialog :visible.sync="dialogVisible" top="44vh" width="600px">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="menu-card-operate" @click="handClickLink(1)">
                        <img src="~@/assets/img/jianxun.png" alt="消息简讯">
                        <div class="menu-card-operate-mess">消息简讯</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="menu-card-operate" @click="handClickLink(2)">
                        <img src="~@/assets/img/tupianxiafa.png" alt="图片下发">
                        <div class="menu-card-operate-mess">图片下发</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="menu-card-operate" @click="handClickLink(3)">
                        <img src="~@/assets/img/shiping.png" alt="视频播报">
                        <div class="menu-card-operate-mess">视频播报</div>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { setTimeout, clearTimeout, clearInterval } from 'timers';
import { truncate } from 'fs';
export default {
    inject : ['reload'],
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
            floatLayerShow : false,
            top : 0,
            left : 0,
            bottom : null,
            dragParamsStart : 0,
            dragParamsTop : 0,
            dragParamsEle : null,
            dialogVisible : false,
            onMouseDownFlag : false,
            mouseDownAndUpTimer : null,
            routerParams : {
                date : '',
                time : '',
            },
            tempWeek : [],
            isImmediates : 2,
        }
    },
    computed : {
        currentDateShowValue() {
            if (this.currentWeek.length) {
                let begin = this.currentWeek[0].date, end = this.currentWeek[6].date
                let str = begin + '~' + end
                return str
            }
        },
        curTimestamp() {
            let _date = new Date(), monthF = ''
            _date.getMonth() + 1 < 10 ? monthF = '0' + (_date.getMonth() + 1) : monthF = _date.getMonth() + 1
            let dateTime = _date.getFullYear() + '-' +  monthF  + '-' + _date.getDate()
            return dateTime
        }
    },

    watch : {
        dialogVisible(n, o) {
            if (!n) {
                let ele = document.getElementById('active_boxs')
                ele && ele.remove()
                this.isImmediates = 2
            } 
        },
        currentWeek(n) {
            if (n.length == 7) {
                let arr = []
                n.forEach(item => {
                    arr.push({
                        date : item.dateTime
                    })
                })
                this.tempWeek = arr
                this.getEventSource(arr)
            }
        }
    },
    created() {
        if (this.$route.params._timeStamp) {
            this.currentWeek = this.getWeeksByDate(this.$route.params._timeStamp)
        }else {
            this.currentWeek = this.getWeeksByDate()
        }
        this.timeArr = this.getDateTime()
    },

    methods : {
        getEventSource(arr) {
            let self = this
            this.getCommHttpData({
                url : 'eclassbroadcast/list',
                method : 'post',
                contentType : 2,
                data : {
                    currentWeek : arr,
                    start : '6:00',
                    offset : '2'
                }
            }, res => {
                if (res.code === 0) {
                    let obj = {}
                    res.list.forEach(item => {
                        for (let prop in item) {
                            obj[prop] = item[prop]
                        }
                    })

                    self.eventSources = self.eventGroupBy(obj)
                }
            })
        },
        //初始头部星期
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
        //初始化左侧时间轴
        getDateTime(start = 6, end = 22, interval = 1) {
            let _start = start || 0, arr = []
            while(_start <= end) {
                let strTime = ''
                _start < 10 ? strTime = '0' + _start + ':00' : strTime = _start + ':00'
                arr.push({time : strTime})
                _start += interval
            }
            return arr
        },

        //数组相同元素比对
        compareArr(o, t) {
            let att = ''
            for (let i = 0; i < t.length; i++) {
                for (let j = 0; j < o.length; j++) {
                    if (o[j].indexOf(',') > -1) {
                        let attArr = o[j].split(',')
                        for (let n = 0; n < attArr.length; n++) {
                            t[i] === attArr[n] && (att = o[j])
                        }
                    }else {
                        t[i] === o[j] && (att = o[j])
                    }
                }
            }
            return att
        },

        //事件分组
        eventGroupBy(obj) {
            let _obj = obj, self = this
            for (let prop in _obj) {
                let tepObj = {}
                _obj[prop].forEach(item => {
                    let objKey = Object.keys(tepObj)
                    let zone = item.timeSlot.split(',')
                    let att = self.compareArr(objKey, zone)
                    if (att) {
                        tepObj[att].elArr.push(item)
                    }else {
                        tepObj[item.timeSlot] = {}
                        tepObj[item.timeSlot].elArr = []
                        tepObj[item.timeSlot].elArr.push(item)
                    }
                    if (att && att != item.timeSlot) {
                        let str = Array.from(new Set([...att.split(','), ...item.timeSlot.split(',')])).join(',')
                        str != att && (tepObj[str] = tepObj[att], delete tepObj[att])
                    }
                })
                _obj[prop] = tepObj
            }
            for (let month in _obj) {
                for (let time in _obj[month]) {
                    let isOverFlow = false
                    if (time.length > 1) {
                        let _arrs = time.split(',')
                        let num = _arrs.sort((a, b) => {
                            return a - b
                        })[0]
                        _obj[month][time].minOffset = (parseInt(num) - 6) * 120
                        _obj[month][time].trueHeight = _arrs.length * 120
                        _obj[month][time].elArr.length / _arrs.length > 3 ? _obj[month][time].isOverFlow = true : _obj[month][time].isOverFlow = false
                    }else {
                        _obj[month][time].minOffset = (parseInt(time) - 6) * 120
                        _obj[month][time].trueHeight = 120
                        _obj[month][time].elArr.length > 3 ? _obj[month][time].isOverFlow = true : _obj[month][time].isOverFlow = false
                    }
                }
            }
            for (let f in _obj) {
                _obj[f] = Object.values(_obj[f])
            }
            return _obj
        },

        //选择日期后刷新星期
        refreshWeek() {
            this.currentWeek = this.getWeeksByDate(this.currentDate)
        },

        handMouseEnter(arr, is, event) {
            let e = event || window.event, origin = e.target || e.srcElement, wrapper = e.path[4]
            if (is > 1) {
                this.layerEventSource = arr
                let l = origin.getBoundingClientRect().right - wrapper.getBoundingClientRect().left + 3
                l > 1640 ? this.left = l - 442 : this.left = l
                if (e.pageY > 1950) {
                    this.top = null
                    this.bottom = 0
                }else {
                    this.bottom = null
                    this.top = e.pageY - 235
                }
                this.floatLayerShow = true
            }
            origin.firstChild.lastChild.style.display = 'flex'
        },
        handMouseLeave(event) {
            let e = event || window.event, origin = e.target || e.srcElement
            origin.firstChild.lastChild.style.display = 'none'
            this.floatLayerShow = false
        },

        //空白处点击出现按钮
        blankMouseEnterAdd(event) {
            let e = event || window.event
            let target = e.target || e.srcElement
            target.firstChild.style.display = 'block'
        },

        //空白处鼠标离开，影藏添加按钮
        blankMouseLeave(event) {
            let e = event || window.event
            let target = e.target || e.srcElement
            target.firstChild.style.display = 'none'
        },

        //空白处添加按钮事件
        blankClickAdd(date, time) {
            this.dialogVisible = true
            this.routerParams.date = date
            this.routerParams.time = time
        },

        //空白处鼠标拖拽，按下的时候
        blankMouseDownAdd(event, date) {
            this.onMouseDownFlag = false
            this.mouseDownAndUpTimer  = setTimeout(_ => {
                if (!document.getElementById('active_boxs')) {
                    let e = event || window.event
                    let target = e.target || e.srcElement
                    this.dragParamsStart = e.pageY
                    this.dragParamsTop = e.pageY - 235
                    let div = document.createElement("div")
                    let button = document.createElement("div")
                    button.className = 'el-icon-plus'
                    button.style.fontSize = '40px'
                    button.style.color = '#fff'
                    div.appendChild(button)
                    div.className = "drag-add-Box"
                    div.id = 'active_box'
                    div.style.position = 'absolute'
                    div.style.backgroundColor = '#76cfc4'
                    div.style.top = this.dragParamsTop + 'px'
                    div.style.width = '100%'
                    div.style.textAlign = 'center'
                    this.getParentElement(target, 'calebox-col')
                    this.dragParamsEle.appendChild(div)
                }
                this.onMouseDownFlag = true
            }, 200)
        },

        //鼠标移动更新box高度
        blankMouseMoveUpdate(event) {
            let e = event || window.event
            let ele = document.getElementById('active_box')
            if (ele) {
                let height = e.pageY - this.dragParamsStart
                ele.style.height = height + 'px'
                ele.style.lineHeight = height + 'px'
            }
        },

        //鼠标抬起结束
        blankMouseUpEnd() {
            if (this.onMouseDownFlag) {
                let ele = document.getElementById('active_box')
                if (ele) {
                    ele.id = 'active_boxs'
                    this.dialogVisible = true
                }
            }else {
                clearTimeout(this.mouseDownAndUpTimer)
            }
            
        },

        //递归遍历，查找指定类名的父级
        getParentElement(ele, className) {
            let _ele = ele
            if (_ele.className && _ele.className.indexOf(className) > -1) {
                this.dragParamsEle = _ele
                return
            }
            this.getParentElement(_ele.parentNode, className)
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
        },

        //菜单跳转
        handClickLink(num) {
            this.routerParams.week = this.currentWeek
            this.routerParams.isImmediate = this.isImmediates
            sessionStorage.setItem('voiceQuery', JSON.stringify(this.routerParams))
            if (num == 1) {
                this.$router.push({
                    name : 'class-card-news-letter'
                })
            }else if (num == 2) {
                this.$router.push({
                    name : 'class-card-news-image',
                })
            }else {
                this.$router.push({
                    name : 'class-card-news-video'
                })
            } 
        },

        //关闭浮层
        closeLayer() {
            this.floatLayerShow = false
        },

        //切换周事件
        handNextClick(num) {
            if (num) {
                this.currentWeek = this.getWeeksByDate(this.currentWeek[6].timeStamp + 86400000)
            }else {
                this.currentWeek = this.getWeeksByDate(this.currentWeek[0].timeStamp - (86400000 * 6))
            }
        },

        //即时播报按钮点击
        handClickImmediate(num) {
            this.isImmediates = num
            let monthF = '', _obj = new Date()
            _obj.getMonth() + 1 < 10 ? monthF = '0' + (_obj.getMonth() + 1) : monthF = _obj.getMonth() + 1
            let dateTime = _obj.getFullYear() + '-' +  monthF  + '-' + _obj.getDate(), timeH = '', timeM = ''
            _obj.getHours() < 10 ? timeH = '0' + _obj.getHours() : timeH = _obj.getHours()
            _obj.getMinutes() < 10 ? timeM = '0' + _obj.getMinutes() : timeM = _obj.getMinutes()
            this.routerParams.date = dateTime
            this.routerParams.time = timeH + ':' +  timeM
            this.dialogVisible = true
        },

        //删除播报
        deleteBroadcast(value) {
            if (this.isHasEnd(value.startTime, value.bdDay)) {
                this.$message('此播报已经结束，不可删除!')
                this.getEventSource(this.tempWeek)
                return
            }
            let str = '', str1 = '', self = this
            value.title ? str = value.title : value.contentType == '2' ? str = '图片下发' : str = '视频播报'
            value.isRepeat == 2 && (str1 = '所有重复')
            const h = this.$createElement;
            this.$msgbox({
                title: '删除计划',
                message: h('div', null, [
                    h('span', null, '您确定要删除'),
                    h('span', { style: 'font-weight: bold;padding:0 3px;' }, str),
                    h('span', { style: 'font-weight: bold;padding:0 3px;' }, str1),
                    h('span', '计划吗？')
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.getCommHttpData({
                            url : 'eclassbroadcast/delete?id=' + value.id,
                            method : 'post',
                            contentType : 2
                        }, res => {
                            if (res.code == 0) {
                                self.$message.success('删除成功!')
                                let w = self.currentWeek
                                self.currentWeek = []
                                self.currentWeek = w
                                done()
                            }
                        })
                    }else {
                        done()
                    }
                }
            }).catch(_ => {})
        },
        isHasEnd(date, day) {
            let flag = false, _currentDateTime = new Date(), endTimeArr = date.split(':')
            if (new Date(day.replace(/-/g, '/')) < _currentDateTime) {
                _currentDateTime = _currentDateTime.setHours(parseInt(endTimeArr[0]))
                _currentDateTime = new Date(_currentDateTime).setMinutes(parseInt(endTimeArr[1]))
                _currentDateTime < new Date().getTime() && (flag = true)
            }
            return flag
        },
        getBroadcastMess(value, num) {
            let self = this
            if (this.isHasEnd(value.startTime, value.bdDay) && num == 2) {
                this.$message('此播报已经结束，不可编辑!')
                this.getEventSource(this.tempWeek)
                return
            }
            this.routerParams.week = this.currentWeek
            this.routerParams.operateType = num
            this.getCommHttpData({
                url : 'eclassbroadcast/bdInfo?id=' + value.id + '&status=' + value.status,
                method : 'post',
                contentType : 2
            }, res => {
                if (res.code == 0) {
                    self.routerParams.eclassBroadcast = res.eclassBroadcast
                    sessionStorage.setItem('voiceQuery', JSON.stringify(self.routerParams))
                    if (res.eclassBroadcast.contentType == 1) {
                        self.$router.push({
                            name : 'class-card-news-letter',
                        })
                    }else if (res.eclassBroadcast.contentType == 2) {
                        self.$router.push({
                            name : 'class-card-news-image'
                        })
                    }else {
                        self.$router.push({
                            name : 'class-card-news-video'
                        })
                    }
                }
            })
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
    width: 215px;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0px 4px 10px 0px rgba(6, 0, 1, 0.25);
    border-radius: 4px;
    max-height: 455px;
    overflow: auto;
    .layer-wrapper{
        height: 91px;
        padding: 10px 10px 5px 15px;
        border-top: 1px solid #e6e6e6;
    }
    .layer-event-title{
        max-width: 175px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .layer-event-title,.layer-event-date{
        line-height: 22px;
    }
    .layer-event-oprate-button{
        margin-top: 5px;
        span{
            padding: 5px 10px;
            background-color: #2ebbad;
            border-radius: 4px;
            color: #fff;
            line-height: 26px;
            margin-right: 10px;
            cursor: pointer;
        }
    }
}
.bottom-layer-box{
    height: 120px;
    border-bottom: 1px solid #fff;
    background-color: #f8f7fc;
}
.bottom-layer-box-add-button{
    height: 100%;
    width: 100%;
    line-height: 120px;
    text-align: center;
    font-size: 50px;
    font-weight: bolder;
    background-color: #ade6df;
    color: #fff;
    cursor: pointer;
    display: none;
}
.voice-header{
    position: relative;
    text-align: center;
}
.heaser-add-button{
    display: inline-block;
    position: absolute;
    right: 0px;
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
    width: 260px;
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
    width: 80px;
    background-color: #e6f6f4;
}
.calebox-col-0{
    flex-grow: 1;
    width: 80px;
    background-color: #e6f6f4;
}
.calebox-col{
    flex-grow: 0;
    width: 220px;
    border-right: 1px solid #fff;
    position: relative;
    background-color: #f8f7fc;
}
.time-title-mess{
    height: 120px;
    line-height: 120px;
    text-align: center;
    border-top: 1px solid #fff;
    box-sizing: border-box;
}
.calendar-col{
    background-color: #e6f6f4;
    flex-grow: 0;
    width: 220px;
    height: 70px;
    border-left: 1px solid #fff;
}
.event-source-box{
    box-sizing: border-box;
    border-top: 1px solid #e6e6e6;
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
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.event-source-add-but{
    color: #333;
    cursor: pointer;
    line-height: 20px;
    flex-grow: 0;
    box-sizing: border-box;
    display: flex;
    div{
        flex-grow: 1;
    }
}
.addbutton-tipmess{
    padding-left: 20px;
    border-left: 1px solid;
}
.hover-three-button{
    display: none;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    color: #fff;
    min-height: 40px;
    .hover-three-button-top{
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        &:first-child{
            margin-left: 10px;
        }
        span{
            padding: 5px 10px;
            background-color: #2ebbad;
            z-index: 100;
            border-radius: 4px;
            margin-right: 10px;
        }
    }
    .hover-three-button-bottom{
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        span{
            font-size: 30px;
            font-weight: bolder;
        }
    }
}
.only-add-button{
    font-size: 50px;
    font-weight: bolder;
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
.menu-card-operate{
    text-align: center;
    height: 95px;
    border: 1px solid #e6e6e6;
    box-shadow: 5px 4px 10px 0px rgba(6, 0, 1, 0.25);
    cursor: pointer;
    img{
        width: 80px;
        height: 50px;
        margin-top: 12px;
    }
    .menu-card-operate-mess{
        padding: 7px;
    }
    &:hover{
        border: 1px solid #2ebbad;
    }
}
.already-color{
    background-color: #bdbdbd;
}
.noready-color{
    background-color: #0dcfbc;
}
.ready-color{
    background-color: #fbaa33;
}
.current-time-stamp{
    background-color: #bde2de;
}
.event-sourcer-content{
    div{
        display: inline-block;
    }
    .event-sourcer-content-title{
        max-width: 7em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }
}
::-webkit-scrollbar{  
    width: 5px;  
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
<style lang="scss">
.voice-clear-header{
    .el-date-picker__header{
        display: none;
    }
}
</style>



