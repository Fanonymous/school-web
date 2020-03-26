<template>
  <div class="mod-demo-echarts">
  	<basic-analysis :schoolTypeShow="true" :schoolShow="true" :schoolSideTypeShow="false" :gradeShow="false" :subjectShow="false"  @refreshChartsData="getFilterBasicData"></basic-analysis>
    <el-row :gutter="10">
    	<el-col :span="8" v-loading="chartLoading">
    	  <el-card shadow="hover" >
    	    <div style="height:752px ;">
    	      <!-- 地图 -->
    	      <div class="table-title margin-bottom-20">区域分布</div>
    	      <div class="right"><div>学生总数</div><div><span style="font-size:30px;">{{kpiData.allCount}}</span>人</div> </div>
    	      <chart-map-area ref="chartbasicmaparea" title="区域分布" :mapdata="mapdata" :id="'edumapareachart'" height="650px" :series="areaMapSeries"></chart-map-area>
    	    </div>
    	  </el-card>
    	</el-col>
      <el-col :span="8"  v-loading="chartLoading">
        <el-card shadow="hover">
          <div class="table-title">性别分布</div>
          <el-col :span="4">
            <div><img src="~@/assets/img/sex1.png" width="28px" style="margin-top:70px;"/></div>
            <div><img src="~@/assets/img/sex0.png" width="28px" style="margin-top:50px;"/></div>
          </el-col>
          <el-col :span="20">
            <chart-column-two ref="basiccolumnChart4" :id="'basiccolumnChart4'" :title="''" :height="'342px'"  :series="basicbarSeries1"></chart-column-two>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover" style="position: relative;">
          <chart-column ref="basicStackedColumnChart3" :id="'basicStackedColumnChart3'" :title="'年龄段统计'" :series="stackedColumnSeries3"></chart-column>
          <div class="right" style="color:#cccccc;position: absolute;right:20px;bottom:20px;">未知：{{ageUnknown}}人</div>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicPieChart3" :id="'basicPieChart3'" :title="'政治面貌'" :series="basicPieSeries3"></chart-stacked-column>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicStackedBarChart3" :id="'basicStackedBarChart3'" :title="'就读方式'" :series="stackedColumnSeries2"></chart-stacked-column>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicPieChart1" :id="'basicPieChart1'" :title="'独生子女'" :series="stackedColumnSeries1"></chart-stacked-column>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-word-cloud ref="basicPieChartMz" :id="'basicPieChartMz'" :title="'民族分布'" :series="basicPieSeries1"></chart-word-cloud>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped="scoped">

</style>
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
  import ChartStackedBar from '@/components/charts/stacked-bar'
  import ChartStackedColumn from '@/components/charts/stacked-column'
  import ChartBarPlusMinus from '@/components/charts/bar-plus-minus'
  import BasicAnalysis from '../common/basic-analysis'
  import {getCommHttpData,getAnalysisChartData,sum} from '@/utils/common'
  import ChartMapArea from '@/components/charts/map-area'
  import chartWordCloud from '@/components/charts/word-cloud-round'
  import ChartColumnTwo from '@/components/charts/column-two'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    ChartFunnel,
  	    BasicAnalysis,
        ChartStackedBar,
        ChartStackedColumn,
  	    ChartPie,
        ChartBarPlusMinus,
        ChartMapArea,
        chartWordCloud,
        ChartColumnTwo
    },
    data () {
      return {
      	schoolId:null,
      	userType:this.GLOBAL.getUserType(),
        schoolSection:'',
        schoolType:'',
        schoolId:'',
        keywords:'',
      	kpiData:{
          inSchoolCount:0,
          allCount:0,
          newCount:0
      	},
        chartLoading:false,
        basicbarSeries1:{xValue:[],yValue:[]},
      	basiccolumnSeries1:{xValue:[],yValue:[]},
      	basiccolumnSeries2:{xValue:[],yValue:[]},
      	basiccolumnSeries3:{xValue:[],yValue:[]},
      	stackedColumnSeries1:{xValue:[], yValue:[]},
      	stackedColumnSeries2:{xValue:[],yValue:[]},
        stackedColumnSeries3:{xValue:[],yValue:[]},
        basicPieSeries1:{xValue:[],yValue:[]},
      	basicPieSeries3:{xValue:[],yValue:[]},
      	ringsSeries:{xValue:[],yValue:[]},
      	funnelSeries:{xValue:[],yValue:[]},
        total:0,
        areaMapSeries:[],
        mapdata:'',
        ageUnknown:0
      }
    },
    mounted () {
    	this.iniChartsData()
    	window.addEventListener('resize', () => {
	      this.resizeListener()
      })
    },
//  activated () {
//			this.resizeListener()
//  },
    methods: {
    	getFilterBasicData(jsonParams){
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
          getCommHttpData({url:'edu/stu/statistical/areaDataMessage',method:'post',contentType:2,data:dataParams},function(data){
            let tempSeries = []
            that.kpiData.allCount = data.area.allCount
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
            //查询学段
            getCommHttpData({url:'multimemediaEquip/commFilter',method:'post',contentType:2,data:{commType:2}},function(resData){
              let temArr = []
              data.list.forEach((item,index)=>{
                temArr = []
                resData.list.forEach((titem,tindex)=>{
                  let typeValue = data.list[index]['stuCount'+(parseInt(tindex)+2)]
                  typeValue = typeValue == null?0:typeValue
                  temArr.push({name:titem.name,value:typeValue})
                })
                tempSeries.push({typeList:temArr,locations:[item.longitude,item.latitude],name:item.schoolName,value:item.allCount == null?0:item.allCount})
              })
              that.areaMapSeries = tempSeries
            })
          })

      		//基础统计数量
          // getCommHttpData({url:'edu/stu/statistical/countAll',method:'post',contentType:2,data:dataParams},function(data){
          //   that.kpiData = {
          //     inSchoolCount:data.data.inSchoolCount,
          //     allCount:data.data.allCount,
          //     newCount:data.data.newCount
          //   }
          // })
          //就读方式分布
          getCommHttpData({url:'edu/stu/statistical/readTypeList',method:'post',contentType:2,data:dataParams},function(data){
              that.stackedColumnSeries2={
                xValue:data.list.xValue,
                yValue:data.list.yValue,
                seriaName:data.list.seriaName,
                yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
          //年龄段对比
          getCommHttpData({url:'edu/stu/statistical/ageList',method:'post',contentType:2,data:dataParams},function(data){
            let ageTempXValue = [],ageTempYValue = [],unknown = 0
            data.list.forEach(item=>{
              if(item.age == '未知'){
                unknown += parseInt(item.allCount)
              }else{
                ageTempXValue.push(item.age)
              }
            })
            ageTempXValue = Array.from(new Set(ageTempXValue))
            ageTempXValue.forEach(itemName=>{
              let temptotal = 0
              let list=[]
              data.list.forEach(item=>{
                if(itemName == item.age){
                  temptotal+=parseInt(item.allCount)
                  list.push({name:item.gradeName,value:item.allCount})
                }
              })
              ageTempYValue.push({value:temptotal,list:list})
            })
            that.ageUnknown = unknown
            that.stackedColumnSeries3={
              xValue:ageTempXValue,
              yValue:[ageTempYValue],
              seriaName:['总数'],
              yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人',xtipLabel:'岁'}]}
          })
          //性别分布
          getCommHttpData({url:'edu/stu/statistical/sexList',method:'post',contentType:2,data:dataParams},function(data){
            let list = that.getChartDataSex(data.list)
            that.basicbarSeries1={
              xValue:list.xValue,
              yValue:list.yValue,
              seriaName:['女','男'],
              yAxis:[{name: '人',min:-list.max,max:-list.max,interval: null,axisLabel:'人',tipLabel:'人'}]}
          })
          //民族分布
          getCommHttpData({url:'edu/stu/statistical/folkList',method:'post',contentType:2,data:dataParams},function(data){
            let folkTempXValue = [],folkTempYValue = [],totalCount = 0
            data.list.forEach(item=>{
              folkTempYValue.push(item.typeName)
              totalCount+=parseInt(item.allCount)
            })
            folkTempYValue = Array.from(new Set(folkTempYValue))
            folkTempYValue.forEach(itemName=>{
              let folktotal = 0
              let folkList = []
              data.list.forEach(item=>{
                if(itemName == item.typeName){
                  folktotal+=parseInt(item.allCount)
                  folkList.push({name:item.gradeName==null?'未知':item.gradeName,value:parseInt(item.allCount)})
                }
              })
              //console.log((Math.round(folktotal/totalCount*10000)/100))
              //+'\n'+(Math.round(folktotal/totalCount*1000)/10) +'%'
              let nametemp = itemName==null?'未知':itemName
              folkTempXValue.push({name:nametemp,value:folktotal,list:folkList})
            })
            that.basicPieSeries1={xValue:folkTempXValue,yValue:data.list.yValue,
            yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}

          })
          //政治面貌
          getCommHttpData({url:'edu/stu/statistical/politicalsList',method:'post',contentType:2,data:dataParams},function(data){

            let polTempXValue = [],polTempYValue = [],totalCount = 0,seriaName=[]
            data.list.forEach(item=>{
              polTempXValue.push(item.typeName)
              totalCount+=parseInt(item.allCount)
              seriaName.push(item.gradeName)
            })
            polTempXValue = Array.from(new Set(polTempXValue))
            seriaName = Array.from(new Set(seriaName))
              //年级
            seriaName.forEach(sitem=>{
              //类型
              let poltotal = 0
              let polList = []
              polTempXValue.forEach(itemName=>{
                let yyTemp = 0
                data.list.forEach(item=>{
                  if(sitem === item.gradeName && itemName === item.typeName){
                    yyTemp = parseInt(item.allCount)
                  }
                })
                polList.push(yyTemp)
              })

              polTempYValue.push(polList)
            })
            console.log(polTempYValue)
            //return
            that.basicPieSeries3={xValue:polTempXValue,yValue:polTempYValue,
            seriaName:seriaName,
            yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}

          })
          //独生子女
          getCommHttpData({url:'edu/stu/statistical/onlyChildList',method:'post',contentType:2,data:dataParams},function(data){
            that.stackedColumnSeries1={
              xValue:data.list.xValue,
              yValue:data.list.yValue,
              seriaName:data.list.seriaName,
              yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
      },
      getChartDataSex(list,type){
        let tempXValue = [],tempYValue = [],totalCount = 0,seriaList=['男','女']
        let dataXValue = [],temmArrMax = []
        list.forEach(item=>{
          tempXValue.push(item.gradeName)
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
            if( itemName === item.gradeName){
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
              if(sitem === item.typeName && itemName === item.gradeName){
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

    }
  }
</script>
