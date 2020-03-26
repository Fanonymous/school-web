<template>

  <div class="analysis-echarts">
    <el-row :gutter="12">
      <el-col :span="24" class="margin-bottom-10">
        <el-card shadow="hover">
          <!-- <chart-pie :id="'ecstbarPieRingChart'" ref="ecstPieRingZoom" :title="'各类型设备数量'" :series="stPieRingSeries"></chart-pie> -->
          <chart-pie-ring-line v-loading="pieRingsLoading" :id="'ecstbarPieRingChart'" ref="ecstPieRingZoom" :title="'各类型设备数量'" :series="stPieRingSeries"></chart-pie-ring-line>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="table-title margin-bottom-10">各教室设备配备</div>
          <div>
            <el-col :span="24">
              <div style="position: relative;" >
                <el-radio-group id="radio-group-types" ref="radioType" v-model="dataType" size="small" class="margin-bottom-10" @change="getRadioType">
                  <el-radio-button label="0" key="0" v-if="dataTypeList.length>1">全部</el-radio-button>
                  <el-radio-button v-for="(item,index) in dataTypeList" v-if="( dataTypeList.length > 4 && index<3 )|| (dataTypeList.length <=4 && index<=3 && dataTypeList.length>1)" :label="item.name" :key="item.name">{{item.name}}</el-radio-button>
                  <el-radio-button label="-1" key="-1" v-if="dataTypeList.length > 4">
                    <div @click="getRadioType">更多
                    <i v-if="moreTypeShow" class="el-icon-arrow-up"></i>
                    <i v-else class="el-icon-arrow-down"></i></div>
                  </el-radio-button>
                </el-radio-group>
                <div v-if="dataType == -1 && moreTypeShow"  :style="'position: absolute;left: '+widthSelect+'px; top: 32px;z-index: 999;background-color: #FFFFFF;height: 200px;width:200px;overflow: auto;border: 1px #DCDFE6 solid;'">
                   <ul class="box-type">
                    <li v-for="(item,index) in dataTypeList"  v-if="index >2 " class="item-type" :class="dataTypeMore==item.name?'item-type-active':''" @click="getMoreType(item.name)">{{item.name}}</li>
                   </ul>
                </div>
              </div>
            </el-col>
            <el-col :span="24" v-if="dataType != 0" >
              <el-col :lg="6"  style="margin: 10px  0px 10px 100px;" v-if="classTotalNum!=0" >
                <el-col :lg="6"><el-progress type="circle" :show-text="false" :stroke-width="10" color="#41cac0" :percentage="classRate" width="65">
                </el-progress>
                 </el-col>
                 <el-col :lg="12">
                <div style="display: inline-block;height: 65px;line-height: 30px;text-align: left;">
                  <div>班级教室</div>
                  <div>配备率：{{classRate}}%</div>
                </div>
                 </el-col>
              </el-col>
              <el-col :lg="6"   style="margin: 10px 0px;" v-if="functionTotalNum!=0">
                <el-col :lg="6" >
                  <el-progress type="circle" :show-text="false"  :stroke-width="10" color="#41cac0" :percentage="functionRate" width="65"></el-progress>
                </el-col>
                <el-col :lg="12">
                <div style="display: inline-block;height: 65px;line-height: 30px;text-align: left;">
                  <div>功能部室</div>
                  <div>配备率：{{functionRate}}%</div>
                </div>
                </el-col>
              </el-col>
            </el-col>
            <el-col :span="18" v-loading="dataListLoading" class="left-table" v-if="dataList.length > 0">
              <el-table :data="dataList" ref="table" fit :show-header="false" >
                <el-table-column align="left" prop="typeName" width="100">
                  <template slot-scope="scope">
                    {{scope.row.typeName}}
                    <template v-if="scope.row.typeName == '闲置教室'">
                      <el-tooltip class='item' effect='dark' content='闲置教室为当前暂未使用的教室。您可在【教室管理】中添加使用班级。' placement='bottom-start'>
                        <i class='el-icon-info i-index-question'></i>
                      </el-tooltip>
                    </template>

                  </template>
                </el-table-column>
                <el-table-column align="left">
                  <template slot-scope="scope">
                    <template v-for="citem in scope.row.list">
                      <div class="classroom-info" >
                        <template v-if="dataType!=0">
                          <div v-if="citem.num >0" class="classroom-num-pra"  @click="currGradeClass = scope.row.typeName+'：'+citem.name,getClassroomInfoById(citem.classroomId)">{{citem.num}}</div>
                          <div v-else class="classroom-num-grey"></div>
                        </template>
                        <template v-else>
                          <div v-if="citem.num >0" :class="classroomId !=citem.classroomId ? 'classroom-num-pra':'classroom-num-pra-active'"  @click="currGradeClass = scope.row.typeName+'：'+citem.name,getClassroomInfoById(citem.classroomId)">{{citem.num}}</div>
                          <div v-else class="classroom-num-grey"></div>
                        </template>
                        <div>{{citem.name}}</div>
                      </div>
                    </template>
                  </template>
                </el-table-column>
              </el-table>
              <div style="height: 14px;line-height: 14px;margin: 20px 0px; text-align: center;color: #333333;">
                <span style="display: inline-block;width:11px;height:11px;background-color: #0cc9b6;"></span> &nbsp;有设备&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="display: inline-block;width:11px;height:11px;background-color: #e5e9f2;"></span> &nbsp;无设备
              </div>
            </el-col>
            <template v-else>
              <el-col :span="24" style="text-align: center;">
                <img src="~@/assets/img/nodata.png" width="180px" class="margin-bottom-20" />
              </el-col>
            </template>
            <el-col :span="6" v-if="classRoomInfoList.length > 0 && dataType==0">
              <el-table :data="classRoomInfoList" ref="table" v-loading="listLoading" border fit class="right-table">
                <el-table-column  align="left" :label="currGradeClass" >
                  <template slot-scope="scope">
                    <!-- <img v-real-img="imgFixedIP+'name='+scope.row.name+'&coomType=1'" :src="defaultPic" width="26px" height="26px"/> -->
                    {{scope.row.name}} <div class="right">{{scope.row.num}}台</div>
                  </template>
                </el-table-column>
              </el-table>
              <div></div>
            </el-col>

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .classroom-info{
    display: inline-block;width: 130px;text-align: center;margin:0px 10px 5px 0px;
  }
  .classroom-active{
    display: inline-block;width: 130px;text-align: center;margin:0px 10px 5px 0px;
    color: #008855;
  }
  .classroom-num-pra{
    height: 32px;line-height:32px;background-color: #0cc9b6;color: #FFFFFF;margin-bottom: 5px;
    cursor: pointer;
  }
  .classroom-num-pra-active{
    cursor: pointer;
    height: 32px;line-height:32px;background-color: #15a196;color: #FFFFFF;font-size: 16px;font-weight: bold;margin-bottom: 5px;

  }
  .classroom-num-grey{
    height: 32px;line-height:32px;background-color: #CCCCCC;color: #FFFFFF;margin-bottom: 5px;
  }
  .device-type-info{
    margin: 10px 0px;
  }
  .left-table .el-table--medium td,.left-table .el-table--medium th{
    padding: 0px;
  }
  .left-table .el-table__row>td{
    vertical-align: top;
    border: none;
  }
  .left-table .el-table::before {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0px;
  }
  .right-table .el-table tr{
    border: 1px #000000 solid;
  }
  .box-type{
    list-style: none;
    padding: 6px 0;
    margin: 0;
    box-sizing: border-box;
  }
  .item-type{
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #606266;
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .item-type:hover{
    background-color: #f5f7fa
  }
  .item-type-active{
    color: #3C85EE;
    font-weight: 700;
  }
</style>
<script>
  import ChartPieRingLine from '@/components/charts/pie-ring-line'
  import {
    getCommHttpData,
    getAnalysisChartData,
    getIntervalByArr,
    getDateStr
  } from '@/utils/common'
  import defaultPic from '@/assets/img/brand/10.png'
  export default {
    components: {
      ChartPieRingLine,
    },
    data() {
      return {
        schoolId: this.GLOBAL.getOrgId(),
        imgFixedIP: window.SITE_CONFIG.imgFixedIP,
        defaultPic:defaultPic,
        listLoading:false,
        dataListLoading: false,
        stPieRingSeries: {
          xValue: [],
          yValue: []
        },
        checkboxGroup3: [],
        cities: ['全部', '触控一体机', '电子班牌', '音响', '其他'],
        dataTypeList:[],
        dataList:[],
        dataType:0,
        classTypeList:[],
        classRoomInfoList:[],
        classRate:0,
        functionRate:0,
        classroomId:'',
        currGradeClass:'',
        classTotalNum:0,
        functionTotalNum:0,
        pieRingsLoading:false,
        dataTypeMore:'',
        moreTypeShow:false,
        widthSelect:200,
      }
    },
    watch: {
      keywords(val) {
        this.getStudentList()
      }
    },
    mounted() {

      this.getDeviceTypeList()
      let that = this
       // that.dataList= [
       //   {name:'年级',list:[{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'},{className:'1班',count:'50'}]},
       // {name:'年级',list:[{className:'1班',count:'50'}]},
       // {name:'年级',list:[{className:'1班',count:'50'}]}]
      // that.stPieRingSeries = {
      //   xValue: ['触控一体机', '电子班牌', '印象', '话筒','其他'],
      //   yValue: [3, 4,4,5,6],
      //   seriaName: ['3', '4'],
      //   yAxis: [{
      //     name: '等级占比',
      //     min: 0,
      //     max: null,
      //     interval: 0,
      //     axisLabel: ''
      //   }]
      // }
      window.addEventListener('resize', () => {
        this.resizeListener()
      })
      this.iniChartsData();
    },

    methods: {
      handleCommand(command) {
        this.dataType = command
        this.getDataList()
      },
      getDeviceTypeList(){
        let that = this
        getCommHttpData({url:'equipAnalysis/equipType',method:'get',contentType:1,data:{coomType:1,noclassType:1}},function(data){
          if (data && data.code === 0) {
            that.dataTypeList = data.list
            if( data.list.length == 1){
              that.dataType =  data.list[0].name
            }
            that.$nextTick(function () {
               that.widthSelect = that.$refs.radioType.$el.clientWidth + 'px';
            })
            //that.widthSelect = document.getElementById("radio-group-types").clientWidth
            //alert(that.widthSelect)
          }
        })
      },
      resizeListener() {
        if (this.$refs.aspieChart.chart) {
          this.$refs.aspieChart.chart.resize()
        }
      },

      iniChartsData() {

        let that = this;
        let commParams = {
          schoolId: this.schoolId,noclassType:1
        }
        //占比
        that.pieRingsLoading = true
        getCommHttpData({
          url: 'equipAnalysis/groupByDeviceType',
          method: 'get',
          contentType: 1,
          data: commParams
        }, function(data) {

          setTimeout(() => {
            that.stPieRingSeries = {
              xValue: data.page.xValue,
              yValue: data.page.yValue,
              seriaName: data.page.xValue,
              yAxis: [{
                name: '等级占比',
                min: 0,
                max: null,
                interval: 0,
                axisLabel: ''
              }],
              titleCenter:'设备总数',
              titleCenterValue:data.page.totalNum
            }
            that.pieRingsLoading = false
          }, 500)
        })
        that.getClassroomList()


      },
      getMoreType(moreType){
        this.dataTypeMore = moreType
        this.moreTypeShow = false
        this.getClassroomList()
      },
      getRadioType(){
        this.$nextTick(function () {
           this.widthSelect = this.$refs.radioType.$el.clientWidth-70;
        })
        if(this.dataType == -1){

          if(this.dataTypeMore ==''){
            this.moreTypeShow = true
          }else{
            if(this.moreTypeShow){
              this.moreTypeShow = false
            }else{
              this.moreTypeShow = true
            }
          }
        }else{
          this.dataTypeMore = ''
        }
        this.getClassroomList()
      },
      getClassroomList(){
        let that = this

        if(that.dataType == -1 && that.dataTypeMore==''){
          return
        }
        let deviceName = that.dataType == 0?undefined:that.dataType
        if(that.dataType == -1){
          deviceName = that.dataTypeMore !=''?that.dataTypeMore:undefined
        }
        that.dataListLoading = true
        getCommHttpData({
          url: 'equipAnalysis/groupByClassRoom',
          method: 'get',
          contentType: 1,
          data: {name:deviceName,noclassType:1}
        }, function(data) {
          that.dataListLoading = false
          if(data && data.code ==0){
            that.dataList = data.list
            if(data.page != ''){
              that.classTypeList = data.page
              that.classTotalNum = that.classTypeList[0].totalNum
              that.functionTotalNum = that.classTypeList[1].totalNum
              that.classRate = Math.round(that.classTypeList[0].isNum/that.classTypeList[0].totalNum*100*10)/10
              that.functionRate = Math.round(that.classTypeList[1].isNum/that.classTypeList[1].totalNum*100*10)/10
            }
            let isNum = false
            for(let i in data.list){
              if(isNum){
                break
              }
              for(let j in data.list[i].list){
                if(data.list[i].list[j].num>0){
                  isNum = true
                  that.currGradeClass = data.list[i].typeName+'：'+data.list[i].list[j].name
                  that.classroomId = data.list[i].list[j].classroomId
                  that.getClassroomInfoById(data.list[i].list[j].classroomId)
                  break;
                }
              }
            }
          }
        })
      },
      getClassroomInfoById(classroomId){
        let that = this
        that.classroomId = classroomId
        getCommHttpData({
          url: 'equipAnalysis/classRoomInfo',
          method: 'get',
          contentType: 1,
          data: {classroomId:classroomId,noclassType:1}
        }, function(data) {
          if(data && data.code ==0){
            that.classRoomInfoList = data.list
          }
        })
      }

    }
  }
</script>
