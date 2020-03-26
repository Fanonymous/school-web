<template>
  <div class="mod-demo-echarts">
      <basic-analysis :schoolTypeShow="true" :schoolShow="true" :schoolSideTypeShow="false"
      :gradeShow="false" :subjectShow="false" @refreshChartsData="getFilterBasicData"></basic-analysis>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
        	<div class="analysis-body">
        		<div class="body-icon primary"><img src="~@/assets/img/tea-b.png"/></div>
        		<div class="body-text" >
              <div class="kpi-text">专任老师</div>
              <div><span class="kpi-value ">{{kpiData.major.allCount || 0}}</span>人</div>
              <!-- <div>在编：{{kpiData.major.isEditingCount || 0}}人临聘：{{kpiData.major.notEditingCount || 0}}人</div> -->
            </div>
        	</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="analysis-body">
        		<div class="body-icon blue"><img src="~@/assets/img/tea1-b.png"/></div>
        		<div class="body-text" >
              <div class="kpi-text" >工勤人员</div>
              <div><span class="kpi-value">{{kpiData.logistics.allCount || 0}}</span>人</div>
              <!-- <div >在编：{{kpiData.logistics.isEditingCount || 0}}人临聘：{{kpiData.logistics.notEditingCount || 0}}人</div> -->
            </div>
        	</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="analysis-body">
        		<div class="body-icon green"><img src="~@/assets/img/tea2-b.png"/></div>
        		<div class="body-text" >
              <div class="kpi-text">教辅人员</div>
              <div class=""><span class="kpi-value">{{kpiData.auxiliary.allCount || 0}}</span>人</div>
              <!-- <div >在编：{{kpiData.auxiliary.isEditingCount || 0}}人临聘：{{kpiData.auxiliary.notEditingCount || 0}}人</div> -->
            </div>
        	</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover" >
          <div style="height:752px ;">
            <!-- 地图 -->
            <div class="table-title margin-bottom-20">区域分布</div>
            <div class="right"><div>教职工总数</div><div><span style="font-size:30px;">{{total}}</span>人</div> </div>
            <chart-map-area ref="chartbasicmaparea" title="区域分布" :mapdata="mapdata" :id="'edumapareachart'" height="650px" :series="areaMapSeries"></chart-map-area>
          </div>
        </el-card>
      </el-col>
    	<el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <div class="table-title">性别分布</div>
          <el-col :span="4">
            <div><img src="~@/assets/img/sex1.png" width="28px" style="margin-top:70px;"/></div>
            <div><img src="~@/assets/img/sex0.png" width="28px" style="margin-top:50px;"/></div>
          </el-col>
          <el-col :span="20">
            <chart-column-two ref="basicPieChartSex" :id="'basicPieChartSex'" :title="''" :height="'342px'" :series="basicPieSeriesSex"></chart-column-two>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-pie ref="basicPieChart1" :id="'basicPieChart1'" :title="'年龄分布'" :series="basicPieSeries1"></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
           <chart-stacked-column ref="basiccolumnChart3" :id="'basiccolumnChart3'" :title="'政治面貌'" :series="basiccolumnSeries3"></chart-stacked-column>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basiccolumnChart1" :id="'basiccolumnChart1'" :title="'学历分布'" :series="basiccolumnSeries1"></chart-stacked-column>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
       <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover" style="position:relative;">
          <div class="chart-select">
            <el-select v-model="teacherTypecode" clearable size="mini" value-key="id" placeholder="请选择" @change="getTeacherProfessorType" >
                <el-option v-for="item in teacherLevelTypeList" :label="item.dictName" :key="item.value" :value="item.value"></el-option>
            </el-select>
         </div>
         <chart-bar ref="basicfunnelChart" :id="'basicfunnelChart'" :title="'岗位等级'" :series="funnelSeries"></chart-bar>
          <!-- <chart-funnel ref="basicfunnelChart" :id="'basicfunnelChart'" :title="'岗位等级'" :series="funnelSeries"></chart-funnel> -->
        </el-card>
      </el-col>

      <el-col :span="8" v-loading="chartLoading">
        <el-card  shadow="hover">
          <chart-pie ref="basicPieChart2" :id="'basicPieChart2'" :title="'教职工来源'" :series="basicPieSeries2"></chart-pie>
        </el-card>
      </el-col>
      <!-- <el-col :span="8" v-loading="chartLoading">
        <el-card  shadow="hover">
          <chart-pie ref="basicPieChart3" :id="'basicPieChart3'" :title="'婚姻状况'" :series="basicPieSeries3"></chart-pie>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import mediacss from '@/assets/scss/media.scss'
  import ChartBar from '@/components/charts/bar'
  import ChartBarLineZoom from '@/components/charts/bar-line-zoom'
  import ChartBarLine from '@/components/charts/bar-line'
  import ChartColumn from '@/components/charts/column'
  import ChartRings from '@/components/charts/rings'
  import ChartFunnel from '@/components/charts/funnel'
  import ChartPie from '@/components/charts/pie'
  import ChartBarPlusMinus from '@/components/charts/bar-plus-minus'
  import BasicAnalysis from '../common/basic-analysis'
  import ChartMapArea from '@/components/charts/map-area'
  import ChartStackedColumn from '@/components/charts/stacked-column'
  import ChartColumnTwo from '@/components/charts/column-two'

  import {getCommHttpData,getAnalysisChartData,getCommonDictByType,sum} from '@/utils/common'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    ChartFunnel,
  	    BasicAnalysis,
  	    ChartPie,
        ChartBarPlusMinus,
        ChartMapArea,
        ChartStackedColumn,
        ChartColumnTwo
    },
    data () {
      return {
      	schoolId:'',
      	userType:this.GLOBAL.getUserType(),
        total:0,
      	startDate:'',
      	endDate:'',
      	schoolTypeShow:true,
      	gradeShow: false,
      	subjectShow: false,
      	classroomShow: false,
      	gradeIds:[],
      	subjectIds:[],
      	classroomIds:[],
      	schoolSideType:'',
      	schoolType:'',
      	kpiData:{
          major:{
            allCount:0,
            isEditingCount:0,
            notEditingCount:0
          },
          logistics:{
            allCount:0,
            isEditingCount:0,
            notEditingCount:0
          },
          auxiliary:{
            allCount:0,
            isEditingCount:0,
            notEditingCount:0
          }
      	},
        chartLoading:false,
        basicPieSeriesSex:{xValue:[], yValue:[]},
        basicbarSeries1:{xValue:[],yValue:[]},
      	basiccolumnSeries1:{xValue:[],yValue:[]},
      	basiccolumnSeries2:{xValue:[],yValue:[]},
      	basiccolumnSeries3:{xValue:[],yValue:[]},
      	basicPieSeries1:{xValue:[], yValue:[]},
      	basicPieSeries2:{xValue:[],yValue:[]},
      	basicPieSeries3:{xValue:[],yValue:[]},
      	ringsSeries:{xValue:[],yValue:[]},
      	funnelSeries:{xValue:[],yValue:[]},
        areaMapSeries:[],
        mapdata:'',
        teacherLevelTypeList:[],
        teacherTypecode:'',
        schoolSection:'',
        schoolType:'',
        keywords:''
      }
    },
    mounted () {
      //教职工来源
      getCommonDictByType(this, 'teacher_typecode_type', 'teacherLevelTypeList')
    	this.iniChartsData()
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
    },
//  activated () {
//			this.resizeListener()
//  },
    methods: {
    	getFilterBasicData(jsonParams) {
        this.schoolSection = jsonParams.schoolSection
    	  this.schoolType = jsonParams.schoolType
    	  this.schoolId = jsonParams.schoolIds
    	  this.keywords = jsonParams.keywords
    	  this.iniChartsData()
    	},
    	resizeListener(){
    		if (this.$refs.ttbarLineZoom1.chart) {
	        this.$refs.ttbarLineZoom1.chart.resize()
	      }
    		if (this.$refs.ttbarLineZoom2.chart) {
	        this.$refs.ttbarLineZoom2.chart.resize()
	      }
	    	if (this.$refs.columnChart1.chart) {
	        this.$refs.columnChart1.chart.resize()
	      }
	    	if (this.$refs.columnChart2.chart) {
	        this.$refs.columnChart2.chart.resize()
	      }
	    	if (this.$refs.columnChart3.chart) {
	        this.$refs.columnChart3.chart.resize()
	      }
	    	if (this.$refs.columnChart4.chart) {
	        this.$refs.columnChart4.chart.resize()
	      }
	    	if (this.$refs.columnChart5.chart) {
	        this.$refs.columnChart5.chart.resize()
	      }
	    	if (this.$refs.ringsChart.chart) {
	        this.$refs.ringsChart.chart.resize()
	      }
	    	if (this.$refs.barChart1.chart) {
	        this.$refs.barChart1.chart.resize()
	      }
	    	if (this.$refs.barChart2.chart) {
	        this.$refs.barChart2.chart.resize()
	      }
	    	if (this.$refs.barChart3.chart) {
	        this.$refs.barChart3.chart.resize()
	      }
    	},
        iniChartsData (){
        	let that = this
          that.chartLoading = true
          setTimeout(() => {
            that.chartLoading = false
          },500)
          let dataParams = {}
          that.schoolSection = that.schoolSection==''?null:that.schoolSection
          that.schoolId = that.schoolId==''?null:that.schoolId
          that.keywords = that.keywords==''?null:that.keywords
          dataParams ={schoolSection:that.schoolSection,schoolId:that.schoolId,keywords:that.keywords},

          //区域地图
          getCommHttpData({url:'edu/teacher/statistical/areaDataMessage',method:'post',contentType:2,data:dataParams},function(data){
            let tempSeries = []
            that.total = data.area.allCount
            let mapCode = ''
            if(data.area.codeType == 1){
              mapCode = 'county/'+data.area.areaCode
            }else if(data.area.codeType == 2){
              mapCode = 'city/'+data.area.cityCode
            }else if(data.area.codeType == 3){
              mapCode = 'province/'+data.area.provinceCode
            }else{
              mapCode = data.area.areaCode
            }
            that.mapdata = mapCode

            //getCommonDictByType(this, 'teacher_typecode_type', 'teacherLevelTypeList',function(){
            //let temArr = []  
            data.list.forEach(item=>{
              tempSeries.push({typeList:[{name:'专任老师',value:item.majorCount},{name:'工勤人员',value:item.logisticsCount},{name:'教辅人员',value:item.auxiliaryCount}],locations:[item.longitude,item.latitude],name:item.schoolName,value:item.allCount})
            })
            that.areaMapSeries = tempSeries
          })

          //基础统计数量
          getCommHttpData({url:'edu/teacher/statistical/countAll',method:'post',contentType:2,data:dataParams},function(data){
            that.kpiData = data.data
            //that.total = parseInt(data.data.auxiliary.allCount?data.data.auxiliary.allCount:0) + parseInt(data.data.logistics.allCount?data.data.logistics.allCount:0) + parseInt(data.data.major.allCount?data.data.major.allCount:0)
          })
          //教师学历分布
          getCommHttpData({url:'edu/teacher/statistical/degreeList',method:'post',contentType:2,data:dataParams},function(data){
              let list = that.getChartData(data.list)
              that.basiccolumnSeries1={xValue:list.xValue,yValue:list.yValue,
              seriaName:list.seriaName,
              yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
          //教师岗位等级分布
          getCommHttpData({url:'edu/teacher/statistical/professorList',method:'post',contentType:2,data:dataParams},function(data){
            that.funnelSeries={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()], yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}],seriaName:['岗位等级']}
          })
          //教师年龄分布
          getCommHttpData({url:'edu/teacher/statistical/ageList',method:'post',contentType:2,data:dataParams},function(data){
            let list = that.getChartPieData(data.list,1)
            console.log(list.yValue)
            that.basicPieSeries1={xValue:list.xValue,yValue:list.yValue,
            yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'人',tipLabel:'人'}]}
          })
          //性别分布
          getCommHttpData({url:'edu/teacher/statistical/sexList',method:'post',contentType:2,data:dataParams},function(data){
            let list = that.getChartDataSex(data.list)
            that.basicPieSeriesSex={xValue:list.xValue,yValue:list.yValue,seriaName:['女','男'],
            yAxis:[{name: '人',min: -list.max,max: list.max,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
          //政治面貌
          getCommHttpData({url:'edu/teacher/statistical/politicalsList',method:'post',contentType:2,data:dataParams},function(data){
            let list = that.getChartData(data.list,0)
            that.basiccolumnSeries3={xValue:list.xValue,yValue:list.yValue,
            seriaName:list.seriaName,
            yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
          // //婚姻状况分布
          // getCommHttpData({url:'edu/teacher/statistical/marriageList',method:'post',contentType:2,data:dataParams},function(data){
          //   that.basicPieSeries3={
          //     xValue:data.list.xValue,
          //     yValue:data.list.yValue,
          //     yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          // })
          //来源分布
          getCommHttpData({url:'edu/teacher/statistical/fromList',method:'post',contentType:2,data:dataParams},function(data){
            let list = that.getChartPieData(data.list,0)
            that.basicPieSeries2={
              xValue:list.xValue,
              yValue:list.yValue,
              yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })

      },
      getTeacherProfessorType(){
        //教师岗位等级分布
        let that = this
        let dataParams = {}
        that.schoolSection = that.schoolSection==''?null:that.schoolSection
        that.schoolId = that.schoolId==''?null:that.schoolId
        that.keywords = that.keywords==''?null:that.keywords
        dataParams ={schoolSection:that.schoolSection,schoolId:that.schoolId,keywords:that.keywords,teacherTypecode:that.teacherTypecode}
        getCommHttpData({url:'edu/teacher/statistical/professorList',method:'post',contentType:2,data:dataParams},function(data){
          //that.funnelSeries={xValue:data.list.xValue,yValue:data.list.yValue, yAxis:[{tipLabel:'人'}]}
          that.funnelSeries={xValue:data.list.xValue.reverse(),yValue:[data.list.yValue.reverse()], yAxis:[{name: '',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}],seriaName:['岗位等级']}
        })
      },
      getChartDataSex(list,type){
        let tempXValue = [],tempYValue = [],totalCount = 0,seriaList=['男','女']
        let dataXValue = [],temmArrMax= []
        list.forEach(item=>{
          tempXValue.push(item.teacherTypeName)
          totalCount+=parseInt(item.allCount)
          if(item.typeName != '未知'){
            temmArrMax.push(parseInt(item.allCount))
          }
        })
        let max = Math.max.apply(Math,temmArrMax )
        tempXValue = Array.from(new Set(tempXValue))
        seriaList = Array.from(new Set(seriaList))
        //计算总数 教师类型总数
        tempXValue.forEach(itemName=>{
          let c = 0
          list.forEach(item=>{
            if( itemName === item.teacherTypeName){
              c+=parseInt(item.allCount)
            }
          })
          dataXValue.push(itemName+'\n\n'+c+'人')
        })
        seriaList.forEach(sitem=>{
          //类型
          let ttotal = 0
          let tList = [],infoList=[]

          tempXValue.forEach(itemName=>{
            let yyTemp = 0
            list.forEach(item=>{
              if(sitem === item.typeName && itemName === item.teacherTypeName){
                yyTemp = parseInt(item.allCount)
                yyTemp = item.typeName == '男'?-yyTemp:yyTemp
              }
            })
            tList.push(yyTemp)
            infoList.push({name:sitem,value:yyTemp})
          })
          if(type == 1){
            tempYValue.push({value:tList,list:infoList})
          }else{
            tempYValue.push(tList)
          }
        })
        let tCount = sum(tempYValue[1])+sum(tempYValue[0])
        max = tCount == 0 ?100:max
        return {xValue:dataXValue,yValue:[tempYValue[1],tempYValue[0]],seriaName:seriaList,max:max}
      },
      getChartData(list,type){
        let tempXValue = [],tempYValue = [],totalCount = 0,seriaList=[]
        list.forEach(item=>{
          tempXValue.push(item.typeName==null?'未知':item.typeName)
          totalCount+=parseInt(item.allCount)
          seriaList.push(item.teacherTypeName)
        })
        tempXValue = Array.from(new Set(tempXValue))
        seriaList = Array.from(new Set(seriaList))
        seriaList.forEach(sitem=>{
          //类型
          let ttotal = 0
          let tList = [],infoList=[]
          tempXValue.forEach(itemName=>{
            let yyTemp = 0
            list.forEach(item=>{
              if(sitem === item.teacherTypeName && itemName === item.typeName){
                yyTemp = parseInt(item.allCount)
              }
            })
            tList.push(yyTemp)
            infoList.push({name:sitem,value:yyTemp})
          })
          if(type == 1){
            tempYValue.push({value:tList,list:infoList})
          }else{
            tempYValue.push(tList)
          }
        })
        return {xValue:tempXValue,yValue:tempYValue,seriaName:seriaList}
      },
      getChartPieData(list,type){
        let tempXValue = [],tempYValue = [],totalCount = 0,seriaList=[]
        list.forEach(item=>{
          tempXValue.push(item.typeName==null?'未知':item.typeName)
          totalCount+=parseInt(item.allCount)
          seriaList.push(item.teacherTypeName)
        })
        tempXValue = Array.from(new Set(tempXValue))
        seriaList = Array.from(new Set(seriaList))
        tempXValue.forEach(sitem=>{
          //类型
          let ttotal = 0
          let tList = [],infoList=[]
          let yyTemp = 0
          list.forEach(item=>{
            if(sitem === item.typeName){
              yyTemp += parseInt(item.allCount)
              infoList.push({name:item.teacherTypeName,value:parseInt(item.allCount)})
            }
          })
          tempYValue.push({value:yyTemp,list:infoList})
        })
        return {xValue:tempXValue,yValue:tempYValue,seriaName:seriaList}
      }

    }
  }
</script>
