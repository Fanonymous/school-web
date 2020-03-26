<template>
    <div class="wrapper">
        <!-- 左边树 -->
        <div class="left-side-tree">
            <el-input v-model="searchValue" suffix-icon="el-icon-search" placeholder="请输入学校名称"></el-input>

            <el-tree :data="treeListData" ref="tree" node-key="id" :props="{label : 'name'}" :filter-node-method="filterNode" highlight-current :expand-on-click-node=false :render-content="readerTree" @node-click="handTreeNodeClick" default-expand-all class="monitor-tree-margin"></el-tree>
        </div>

        <div class="content-area-monitor">
            <!-- 设备总数显示 -->
            <el-row :gutter="12" style="margin-bottom:10px;">
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div class="analysis-body">
                            <div class="body-icon1 primary">
                                <span class="iconfont iconshebeizongshu icon-size"></span>
                                <div class="kpi-icon-text">设备数量</div>
                            </div>
                            <div class="body-text">
                                <div v-if="cardTypeList.length" class="top-box">
                                    <div v-for="(item,index) in cardTypeList" :key="index" class="top-item">
                                        <div class="kpi-value-3"><span class="kpi-num">{{item.deviceNum}}</span>台</div>
                                        <div class="kpi-text-4">{{item.deviceName}}</div>
                                    </div>
                                </div>
                                <div class="no-mess" v-else>暂无设备</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div class="analysis-body">
                            <div class="body-icon1 blue">
                                <span class="iconfont iconzaixianlv icon-size"></span>
                                <div class="kpi-icon-text">当前开机率</div>
                            </div>
                            <div class="body-text">
                                <div v-if="cardTypeList.length" class="top-box">
                                    <div v-for="(item,index) in cardTypeList" :key="index" class="top-item">
                                        <div class="kpi-value-3"><span class="kpi-num">{{Math.ceil(item.onLineNum/item.deviceNum * 100)}}</span>%</div>
                                        <div class="kpi-text-4">{{item.deviceName}}{{item.onLineNum}}/{{item.deviceNum}}</div>
                                    </div>
                                </div>
                                <div class="no-mess" v-else>暂无设备</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>	  
                <el-col :span="8">
                    <el-card shadow="hover">
                        <div class="analysis-body">
                            <div class="body-icon1 green">
                                <span class="iconfont icongaojingxinxi icon-size"></span>
                                <div class="kpi-icon-text">异常设备数</div>
                            </div>
                            <div class="body-text">
                                <div v-if="cardTypeList.length" class="top-box">
                                    <div v-for="(item,index) in cardTypeList" :key="index" class="top-item">
                                        <div class="kpi-value-3"><span class="kpi-num">{{item.anomalyNum}}</span>台</div>
                                        <div class="kpi-text-4">{{item.deviceName}}</div>
                                    </div>
                                </div>
                                <div class="no-mess" v-else>暂无设备</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>	 
            </el-row>

            <!-- 查询 -->
            <div class="search-button" v-if="!isEducation">
                <div class="search-button-left">
                    <el-select placeholder="请选择年级" v-model="gradeValue" clearable>
                        <el-option v-for="item in gradeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div class="search-button-right">当前学校：{{schoolName}}</div>
            </div>

            <!-- 监控列表 -->
            <div class="monitor-list" :class="{'no-data-background' : nodata, 'height-dep' : isEducation}" v-loading="loading">
                <el-row :gutter="12" v-if="!isEducation">
                    <el-col :span="6"  v-for="(item, index) in monitorListData" :key="index" style="margin-bottom:20px;">
                        <el-card class="card-wrapper" :body-style="{ padding: '0px' }">
                            <template v-if="item.equipImgPath != null && item.switchState">
                                <img v-real-img="imgUrl + item.equipImgPath" :src="allPic" class="image"/>
                            </template>
                            <template v-else>
                                <template v-if="item.deviceName == '电子班牌'" >
                                    <img v-if="item.switchState"  src="~@/assets/img/on-1.png">
                                    <img v-else  src="~@/assets/img/off-1.png">
                                </template>
                                
                                <template v-else>
                                    <img v-if="item.switchState"  src="~@/assets/img/on.png">
                                    <img v-else  src="~@/assets/img/off.png">
                                </template>
                            </template>

                            <div class="monitor-mess">
                                <div class="monitor-gclass" v-if="item.gradeName || item.className">{{item.gradeName}}{{item.className}}</div>
                                <div class="monitor-gclass" v-else>{{item.classroomName ? item.classroomName : '--'}}</div>
                                <div class="monitor-bottom">
                                    <div>{{item.deviceName}}</div>
                                    <div>
                                        <span>班主任：
                                            <span v-if="item.teacherName != null">{{item.teacherName}}</span>
                                            <span v-else>--</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="find-button">
                                <span @click="basicLink(item.equipId,item.switchState)">详情</span>
                            </div>
                            <div class="health-mess">
                                <div class="progress-bar-box" v-if="item.switchState == 1">
                                    <div class="progress-bar" :style="{'width' : item.health / 2 + 'px'}" :class="{'excellent' : item.health >= 70, 'good' : item.health < 70 && item.health >= 30, 'poor' : item.health < 30}"></div>
                                </div>
                                <div class="close-computer">
                                    <span v-if="item.switchState == 1" :class="{'excellent' : item.health >= 70, 'good' : item.health < 70 && item.health >= 30, 'poor' : item.health < 30}" style="background-color:#fff;">{{item.healthName}}</span>
                                    <span v-if="item.switchState == 1">开机</span>
                                    <span v-else style="color:#C0C4CC;">关机</span>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-pagination @size-change="handSizeChange" @current-change="handCurChange" v-if="monitorListData.length && !isEducation"
                    :current-page="curPage" class="pagination-bottom"
                    :page-sizes="[8, 16, 40, 80]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
                <div class="histogram-polyline" v-if="isEducation">
                    <chart-bar-line-zoom :id="'cbarLineChart'" @handClick="handHisClick" :height="'630px'" ref="acbarLineZoom" :title="'在线设备数统计'" :series="barLineSeries" style="padding-top:15px;padding-left:5px;"></chart-bar-line-zoom>
                </div>
                <img src="~@/assets/img/no_monitor.png" class="no-data-img" v-if="!isEducation && !monitorListData.length">
            </div>
        </div>
    </div>
</template>

<script>
import { spawn } from 'child_process';
import { debug } from 'util';
import { setTimeout, clearInterval } from 'timers';
import echarts from 'echarts'
import { open } from 'fs';
import ChartBarLineZoom from './monitor-historgram'
import mediacss from '@/assets/scss/media.scss'
import allPic from '@/assets/img/on.png'
export default {
    data() {
        return {
            imgUrl : window.SITE_CONFIG.imgIP,
            allPic : allPic,
            searchValue : '',
            treeListData : [],
            monitorTotal : 0,
            currentMonitorNum : 0,
            gradeData : [],
            gradeValue : '',
            schoolName : '',
            monitorListData : [],
            curPage : 1,
            pageSize : 8,
            totalPage : 0,
            deptId : '',
            turnOnMacData : [],
            loading : false,
            barLineSeries:{ xValue : [], yValue : []},
            deptIdsArr : [],
            cardTotal : [],
            cardTypeList:[],
            isEducation : false,
        }
    },
    components : {ChartBarLineZoom},

    computed : {
        nodata() {
            if (!this.monitorListData.length) return true
            return false
        }
    },

    methods : {
        //获取学校树
        getTreeData(orgid) {
            let self = this
            this.getCommHttpData({
                url : 'common/getDept?deptIds='+ orgid + '&deptType=3',
                method : 'get',
                contentType : 2
            }, res => {
                if (res.code === 0) {
                    self.treeListData = res.page
                    if (!self.$route.query.deptId) {
                        // res.page.length && (self.deptId = res.page[0].children[0].id, self.schoolName = res.page[0].children[0].name)
                        res.page.length && (self.deptId = res.page[0].id)
                        self.isEducation = true
                        self.rederHistogram()
                        let timer1 = setTimeout(_ => {
                            timer1 = null
                            self.$refs.tree.setCurrentKey(res.page[0].id);
                        }, 300)
                    }else {
                        self.isEducation = false
                        let timer = setTimeout(_ => {
                            timer = null
                            self.$refs.tree.setCurrentKey(self.$route.query.deptId);
                        }, 300)
                    }
                }
            })
        },

        resizeListener() {
            if (this.$refs.acbarLineZoom.chart != undefined && this.$refs.acbarLineZoom.chart) {
                this.$refs.acbarLineZoom.chart.resize()
            }
        },

        //树渲染
        readerTree(h, { node, data, store }) {
            if (node.level == 1) {
                return (
                <span style="padding:10px 0;">
                    <span class={{'iconfont' : true, 'iconjiaoyuju' : true}} style="padding-right: 5px;color:#2EBBAD;"></span>
                    <span>{data.name}</span>
                </span>)
            }else {
                return (
                <span style="padding:10px 0;">
                    <span class={{'iconfont' : true, 'iconxuexiao' : true}} style="padding-right: 5px;color:#2EBBAD"></span>
                    <span>{data.name}</span>
                </span>)
            }
        },

        //树过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        //树节点点击
        handTreeNodeClick(data, node, el) {
            if (node.level != 1) {
                this.schoolName = data.name
                this.deptId = data.id
                this.isEducation = false
            }else{
                this.schoolName = ''
                this.deptId = ''
                this.rederHistogram()
                this.getTotalRate(data.id)
                this.isEducation = true
            }
        },

        //获取在线率和台数
        getTotalRate(id) {
            let self = this
            this.getCommHttpData({
                url : 'equip/monitoring',
                method : 'post',
                contentType : 2,
                data : {deptId : id}
            }, res => {
                if (res.code === 0) {
                    self.cardTotal = res.list
                    self.cardTypeList = res.list.slice(0, 2)
                    self.turnOnMacData = res.turnOnMac
                }
            })
        },

        //获取年级
        getGradeData(id) {
            let self = this
            this.getCommHttpData({
                url: 'multimemediaEquip/commFilter',
                method: 'post',
                contentType: 2,
                data : {schoolId : id, commType : 5}
            }, res => {
                if (res.code === 0) {
                    self.gradeData = []
                    self.gradeValue = ''
                    self.gradeData = res.list
                }
            })
        },

        //获取设备列表
        getMonitorData(id, cur, size) {
            this.loading = true
            let self = this
            this.monitorListData = []
            this.getCommHttpData({
                url : 'equip/list',
                method : 'post',
                contentType : 2,
                data : {
                    page: cur,
                    limit: size,
                    deptId : id,
                    gradeId : self.gradeValue || undefined
                }
            }, res => {
                if (res.code === 0) {
                    self.totalPage = res.page.totalCount
                    self.monitorListData = res.page.list
                    self.monitorListData.length && (
                        self.monitorListData.map(item => {
                            self.turnOnMacData.indexOf(item.mac) > -1 && (item.switchState = true)
                        })
                    )
                    self.loading = false
                }
            })
        },

        //开机数依赖
        getMonitorDataByNum(id, cur, size) {
            let self = this
            this.loading = true
            this.monitorListData = []
            this.getCommHttpData({
                url : 'equip/monitoring',
                method : 'post',
                contentType : 2,
                data : {deptId : id}
            }, res => {
                self.loading = false
                if (res.code === 0) {
                    self.cardTotal = res.list
                    self.cardTypeList = res.list.slice(0, 2)
                    self.turnOnMacData = res.turnOnMac
                    self.getMonitorData(id, cur, size)
                    let dataTimer = setInterval(_ => {
						self.getMonitorData(this.deptId, this.curPage, this.pageSize)
                    }, 60000)
                    self.$once('hook:beforeDestroy', _ => {
                        clearInterval(dataTimer)
                    })
                }
            })
        },

        handSizeChange(val) {
            this.pageSize = val
            this.curPage = 1
            this.getMonitorData(this.deptId, this.curPage, val)
        },

        handCurChange(val) {
            this.getMonitorData(this.deptId, val, this.pageSize)
        },

        //查询按钮
        handSearchClick() {
            this.getMonitorData(this.deptId, this.curPage, this.pageSize)
        },

        //跳转详情
        basicLink(id, switchState) {
            this.$router.push({
                name : 'a-monitor-basicinfo',
                params : {id: id, mark : 1, deptId : this.deptId, gradeId : this.gradeValue, schoolName : this.schoolName},
                query :{eId : id, state : switchState}})
        },

        //柱状图渲染
        rederHistogram() {
            let self = this
            this.getCommHttpData({
                url : 'equip/ulist',
                method : 'post',
                contentType : 2,
                data : {deptId : this.GLOBAL.getOrgId(), deptType : 2}
            }, res => {
                if (res.code === 0) {
                    self.deptIdsArr = res.list.xValue1
                    self.barLineSeries={
                        xValue : res.list.xValue,
                        yValue : [res.list.yValue, res.list.yValue1],
                        seriaName:['在线设备数', '在线率'],
                        seriaType:['bar', 'line'],
                        yAxis:[
                            {
                                name : '台', min : 0,max : null, interval : 5, axisLabel : ''
                            },
                            {
                                name : '%', min : 0, max : 100, interval : 10, axisLabel : ''
                            }]
                    }
                    self.resizeListener()
                }
            })
            
        },

        handHisClick(params) {
            let deptId = this.deptIdsArr[params.dataIndex]
            this.schoolName = params.name
            this.deptId = deptId
            this.getTotalRate(deptId)
            let timer = setTimeout(_ => {
                timer = null
                this.$refs.tree.setCurrentKey(deptId);
            }, 300)
        }
    },

    watch : {
        searchValue(val) {
            this.$refs.tree.filter(val)
        },
        deptId(n, o) {
            this.getMonitorDataByNum(n, this.curPage, this.pageSize)
            this.getGradeData(n)
        },
        gradeValue(n, o) {
            if (this.deptId) {
                this.getMonitorData(this.deptId, this.curPage, this.pageSize)
            } 
        }
    },

    mounted() {
        //先判断是否是从返回过来的参数
        this.$route.query.deptId && (this.deptId = this.$route.query.deptId)
        this.$route.query.schoolName && (this.schoolName = this.$route.query.schoolName)
        this.getTreeData(this.GLOBAL.getOrgId())
        window.addEventListener('resize', () => {
            this.resizeListener()
        })
        let topTimer = setInterval(_ => {
			this.cardTypeList = this.cardTotal.slice(0, 2)
			this.cardTotal.push(...this.cardTotal.splice(0, 2))
        }, 5000)
        this.$once('hook:beforeDestroy', _ => {
            clearInterval(topTimer)
        })
    },

}
</script>

<style lang="scss" scoped>
.wrapper{
    display: flex;
    justify-content: space-between;
    @extend .scrollbar-commn;
    div{
        box-sizing: border-box;
    }
}
.left-side-tree{
    width: 280px;
}
.content-area-monitor{
    flex-grow: 1;
    margin-left: 10px;
}
.search-button{
    display: flex;
    justify-content: space-between;
}
.current-preset{
    padding-left: 20px;
}
.search-button-right{
    line-height: 36px;
    background-color: #fff;
    border-radius: 4px;
    padding: 0px 20px;
    cursor: default;
    color: #3C85EE;
    font-weight: bold;
}
.monitor-tree-margin{
    min-width: 280px;
    margin-top: 10px;
    height: 730px;
    overflow: auto;
    /deep/ .el-tree-node__children{
        max-width: 280px;
        overflow-x: auto;
    }
    /deep/ .el-tree-node.is-current > .el-tree-node__content{
        background-color: rgba(87, 199, 242, .3) !important;
    }
}
.icon-size{
    font-size: 45px;
}
.card-wrapper{
    position: relative;
    cursor: pointer;
}
.find-button{
    position: absolute;
    top: 40%;
    width: 100%;
    text-align: center;
    display: none;
    span{
        background-color: #3C85EE;
        padding: 10px 50px;
        border-radius: 4px;
        color: #fff;
    }
}
.card-wrapper:hover .find-button{
    display: block;
}

.monitor-list{
    img{
        width: 70%;
        min-width: 200px;
        margin: 30px 0 20px 15%;
        height: 128px;
    }
    min-height: 635px;
    position: relative;
    margin-top: 10px;
}
.height-dep{
    min-height: 684px;
}
.monitor-mess{
    div{
        text-align: center;
        padding-bottom: 10px;
    }
}
.click-first-level{
    position: absolute;
    text-align: center;
    img{
        margin: 0 !important;
    }
    span{
        color: #909399;
    }
    height: 330px;
    top: 50%;
    left: 50%;
    margin-top: -165px;
    margin-left: -115px;
}
.kpi-text{
	margin: 15px 0px 10px 0px !important;
	font-size: 20px !important;
}
.no-data-img{
    position: absolute;
    width: 200px !important;
    margin: -85px -100px 0 0 !important;
    margin-left: -85px !important;
    height: 170px;
    left: 50%;
    top: 50%;

}
.no-data-background{
    background-color: #fff;
}
.pagination-bottom{
    position: absolute;
    bottom: 5px;
    right: 0;
}
.histogram-polyline{
    // max-width: 5000px;
    overflow-x: auto;
}
.monitor-bottom{
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
}
.health-mess{
    position: absolute;
    top: 5px;
    right: 5px;
    & div{
        display: inline-block;
    }
    .close-computer{
        vertical-align: top;
        font-size: 12px;
    }
}
.progress-bar-box{
	width: 50px;
	height: 10px;
	background-color: #e3e5e8;
	border-radius: 4px;
	.progress-bar{
		height: 100%;
		border-radius: 4px;
		vertical-align: super;
	}
}
.excellent{
	background-color: #3ca3fb;
	color: #3ca3fb !important;
}
.good{
	background-color: #40e346;
	color: #40e346;
}
.poor{
	background-color: #e13e3e;
	color: #e13e3e;
}
.no-mess{
    line-height: 80px;
    color: #C0C4CC;
}
.top-box{
    display: flex;
}
.top-item{
    flex-grow: 1;
}

.scrollbar-commn{
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
    div{
        scrollbar-face-color:#bfbfbf;
        scrollbar-highlight-color:#000;
        scrollbar-3dlight-color:#000;
        scrollbar-darkshadow-color:#000;
        scrollbar-Shadow-color:#adadad;
        scrollbar-arrow-color:rgba(0,0,0,0.4);
        scrollbar-track-color:#eeeeee;
    }
}

</style>


