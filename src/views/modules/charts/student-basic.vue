<template>
  <div class="mod-demo-echarts">
  	<!-- <media-analysis v-if="userType == 2" :gradeShow="gradeShow" :classroomShow="classroomShow"  :subjectShow="subjectShow" @refreshChartsData="getFilterMediaData"></media-analysis>
  	<media-analysis v-if="userType == 4" :schoolTypeShow="gradeShow" :schoolSideTypeShow="gradeShow" :gradeShow="gradeShow" :subjectShow="subjectShow"  @refreshChartsData="getFilterMediaData"></media-analysis>
 -->
  	<el-row :gutter="12">
		  <el-col :span="8">
		    <el-card shadow="hover">
		    	<div class="analysis-body">
		    		<div class="body-icon primary"><img src="~@/assets/img/total-stu.png"/></div>
		    		<div class="body-text" >
              <div class="kpi-text">在校生</div>
              <div><span class="kpi-value">{{kpiData.inSchoolCount || 0}}</span>人</div>
              <!-- <div >男：222人 女：183人 未知：358人</div> -->
            </div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="8">
		    <el-card shadow="hover">
		      <div class="analysis-body">
		    		<div class="body-icon blue"><img src="~@/assets/img/stu-1.png"/></div>
		    		<div class="body-text" >
              <div class="kpi-text">累计教学学生</div>
              <div><span class="kpi-value">{{kpiData.allCount || 0}}</span>人</div>
              <!-- <div >男：222人 女：183人 未知：358人</div> -->
            </div>
		    	</div>
		    </el-card>
		  </el-col>
		  <el-col :span="8">
		    <el-card shadow="hover">
			    <div class="analysis-body">
		    		<div class="body-icon green"><img src="~@/assets/img/new-stu.png"/></div>
		    		<div class="body-text" >
              <div class="kpi-text">新加学生</div>
              <div><span class="kpi-value">{{kpiData.newCount || 0}}</span>人</div>
              <!-- <div>男：0人 女：0人</div> -->
            </div>
          </div>
        </el-card>
		  </el-col>
		</el-row>
    <el-row :gutter="10">
    	<el-col :span="8"  v-loading="chartLoading">
        <el-card shadow="hover">
          <!-- <chart-bar-plus-minus ref="basiccolumnChart4" :id="'basiccolumnChart4'" :title="'性别分布'" :series="basicbarSeries1"></chart-bar-plus-minus> -->
          <div class="table-title">性别分布</div>
          <el-col :span="4">
            <div><img src="~@/assets/img/sex1.png" width="28px" style="margin-top:70px;"/></div>
            <div><img src="~@/assets/img/sex0.png" width="28px" style="margin-top:50px;"/></div>
          </el-col>
          <el-col :span="20">
            <chart-column-two ref="basiccolumnChart4" :id="'basiccolumnChart4'" :title="''" :height="'342px'" :series="basicbarSeries1"></chart-column-two>
          </el-col>
          <!-- <chart-stacked-column ref="basiccolumnChart4" :id="'basiccolumnChart4'" :title="'性别分布'" :series="basicbarSeries1"></chart-stacked-column> -->
          <!-- <chart-column ref="basiccolumnChart2" :id="'basiccolumnChart2'" :title="'性别分布'" :series="basiccolumnSeries2"></chart-column> -->
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover" style="position: relative;">
          <!-- <chart-stacked-bar ref="basicStackedColumnChart3" :id="'basicStackedColumnChart3'" :title="'年龄段统计'" :series="stackedColumnSeries3"></chart-stacked-bar> -->
          <chart-column ref="basicStackedColumnChart3" :id="'basicStackedColumnChart3'" :title="'年龄段统计'" :series="stackedColumnSeries3"></chart-column>
          <!-- <chart-pie ref="sbbasicPieChart1" :id="'sbbasicPieChart1'" :title="'年龄段'" :series="basicPieSeries3"></chart-pie> -->
          <div class="right" style="color:#cccccc;position: absolute;right:20px;bottom:20px;">未知：{{ageUnknown}}人</div>
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicPieChart3" :id="'basicPieChart3'" :title="'政治面貌'" :series="basicPieSeries3"></chart-stacked-column>
          <!-- <chart-column ref="basiccolumnChart1" :id="'basiccolumnChart1'" :title="'政治面貌'" :series="basiccolumnSeries1"></chart-column> -->
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicStackedBarChart3" :id="'basicStackedBarChart3'" :title="'就读方式'" :series="stackedColumnSeries2"></chart-stacked-column>
          <!-- <chart-stacked-column ref="basicPieChart2" :id="'basicPieChart2'" :title="'就读方式'" :series="stackedColumnSeries2"></chart-stacked-column> -->
        </el-card>
      </el-col>
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-stacked-column ref="basicPieChart1" :id="'basicPieChart1'" :title="'独生子女'" :series="stackedColumnSeries1"></chart-stacked-column>
        </el-card>
      </el-col>

       <!-- <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-rings ref="ringsChart" :id="'tringsChart'" :title="'学生城乡对比'" :series="ringsSeries"></chart-rings>
        </el-card>
      </el-col> -->
      
      <el-col :span="8" v-loading="chartLoading">
        <el-card shadow="hover">
          <chart-word-cloud ref="basicPieChartMz" :id="'basicPieChartMz'" :title="'民族分布'" :series="basicPieSeries1"></chart-word-cloud>
          <!-- <chart-pie ref="basicPieChartMz" :id="'basicPieChartMz'" :title="'民族分布'" :series="basicPieSeries1"></chart-pie> -->
          <!-- <chart-column ref="basiccolumnChart1" :id="'basiccolumnChart1'" :title="'政治面貌'" :series="basiccolumnSeries1"></chart-column> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style scoped="scoped">
  /* .analysis-body .body-text .kpi-text {
      margin: 15px 0px 5px 0px;
  } */
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
  import MediaAnalysis from '../common/media-analysis'
  import chartWordCloud from '@/components/charts/word-cloud-round'
  import {getCommHttpData,getAnalysisChartData,sum} from '@/utils/common'
  import ChartColumnTwo from '@/components/charts/column-two'
  export default {
  	components: {
  	    ChartBar,
  	    ChartBarLineZoom,
  	    ChartColumn,
  	    ChartRings,
  	    ChartFunnel,
  	    MediaAnalysis,
        ChartStackedBar,
        ChartStackedColumn,
  	    ChartPie,
        ChartBarPlusMinus,
        chartWordCloud,
        ChartColumnTwo
    },
    data () {
      return {
      	schoolId:this.GLOBAL.getOrgId(),
      	userType:this.GLOBAL.getUserType(),
        ageUnknown:0,
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
      	funnelSeries:{xValue:[],yValue:[]}
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
    	getFilterMediaData(jsonParams){
    		this.subjectIds = jsonParams.subjectIds
    		this.gradeIds = jsonParams.gradeIds
    		this.classroomIds = jsonParams.classroomIds
    		this.schoolSideType = jsonParams.schoolSideType
    		this.schoolType = jsonParams.schoolType
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
            // that.funnelSeries={xValue:['展现','点击','访问','咨询','订单'],yValue:[60,40,20,80,100]}
            // that.stackedColumnSeries1={xValue:['一年级','二年级','三年级','四年级','五年级','六年级'],yValue:[[null,null,null,null,null,null],[null,null,null,null,null,null],[157,53,164,159,92,138]],seriaName:['独生子女','非独生子女','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
            // that.stackedColumnSeries2={xValue:['一年级','二年级','三年级','四年级','五年级','六年级'],yValue:[[null,null,null,null,null,null],[null,null,null,null,null,null],[157,53,164,159,92,138]],seriaName:['走读','住校','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
            // that.stackedColumnSeries3={xValue:['一年级','二年级','三年级','四年级','五年级','六年级'],
            // yValue:[
            //   [97,9,null,null,null,null,null],
            //   [null,46,7,null,null,null,null],
            //   [null,null,null,null,null,null,164],
            //   [null,null,1,6,1,null,151],
            //   [null,null,null,3,74,14,1],
            //   [null,null,null,null,11,29,98]
            // ],seriaName:['7岁','8岁','9岁','10岁','11岁','12岁','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'人',tipLabel:'人'}]}
            // that.basicPieSeries1={xValue:['汉族','未知'],yValue:[405,358]}
            // that.basicPieSeries3={xValue:['中共党员','共青团员','群众','未知'],yValue:[0,1,0,762]}
            // that.ringsSeries={xValue:['农村','其他'],yValue:[659,104],seriaName:['使用时长']}
            // that.basicbarSeries1={xValue:['一年级','二年级','三年级','四年级','五年级','六年级'],yValue:[[59,32,27,23,58,23],[47,21,28,21,34,22],[51,0,0,109,105,0,93]],seriaName:['男','女','未知'],
            //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'人',tipLabel:'人'}]}
            // that.basiccolumnSeries1={xValue:['中共党员','共青团员','群众','未知'],yValue:[[0,1,0,762]],seriaName:['多样性'],
            //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:''}]}
            // that.basiccolumnSeries2={xValue:['展现','点击','访问','咨询','订单'],yValue:[[60,40,20,80,100]],seriaName:['多样性'],
            //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:''}]}
            // that.basiccolumnSeries3={xValue:['展现','点击','访问','咨询','订单'],yValue:[[60,40,20,80,100]],seriaName:['多样性'],
            //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:''}]},


              // that.stackedColumnSeries1={xValue:['学前小班','学前中班','学前大班','一年级','二年级','三年级','四年级','初一年级'],yValue:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[19,10,5,4,7,3,4,783]],seriaName:['独生子女','非独生子女','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
              // that.stackedColumnSeries2={xValue:['学前小班','学前中班','学前大班','一年级','二年级','三年级','四年级','初一年级'],yValue:[[19,10,5,null,null,null,null,null],[null,null,null,null,null,null,null,783],[null,null,null,4,7,3,4,null]],seriaName:['走读','住校','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
              // that.stackedColumnSeries3={xValue:['学前小班','学前中班','学前大班','一年级','二年级','三年级','四年级','初一年级'],
              // yValue:[
              //   [15,0,0,0,0,0,0,0],
              //   [4,10,6,2,0,0,0,0],
              //   [0,0,0,2,2,2,0,0],
              //   [0,0,0,0,1,2,4,0],
              //   [0,0,0,0,0,0,0,166],
              //   [0,0,0,0,0,0,0,592],
              //   [0,0,0,0,0,0,0,24],
              //   [0,0,0,0,0,0,0,1]
              // ],seriaName:['2-3岁','4-6岁','7-8岁','9-10岁','13-15岁','16-17岁','18-19岁','未知'],yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'人',tipLabel:'人'}]}
              // that.basicPieSeries1={xValue:['汉族','畲族','其他'],yValue:[806,9,20]}
              // that.basicPieSeries3={xValue:['中共党员','共青团员','群众','未知'],yValue:[0,71,712,52]}
              // that.ringsSeries={xValue:['农村','其他'],yValue:[0,835],seriaName:['数量']}
              // that.basicbarSeries1={xValue:['学前小班','学前中班','学前大班','一年级','二年级','三年级','四年级','初一年级'],yValue:[[11,5,3,2,2,1,3,521],[8,5,2,2,5,2,1,262]],seriaName:['男','女'],
              //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'人',tipLabel:'人'}]}
              // that.basiccolumnSeries1={xValue:['中共党员','共青团员','群众','未知'],yValue:[[0,71,712,52]],seriaName:['数量'],
              //   yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:''}]}

            that.chartLoading = false
          },500)

      		//基础统计数量
          getCommHttpData({url:'stu/statistical/countAll',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
            that.kpiData = {
              inSchoolCount:data.data.inSchoolCount,
              allCount:data.data.allCount,
              newCount:data.data.newCount
            }
          })
          //就读方式分布
          getCommHttpData({url:'stu/statistical/readTypeList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
              that.stackedColumnSeries2={
                xValue:data.list.xValue,
                yValue:data.list.yValue,
                seriaName:data.list.seriaName,
                yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })
          //学生城乡对比
          // getCommHttpData({url:'stu/statistical/cityRuralList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
          //   that.ringsSeries={xValue:['农村','其他'],yValue:[0,835],seriaName:['数量']}
          // })
          //年龄段对比
          getCommHttpData({url:'stu/statistical/ageList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
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
              let nametemp = itemName==null?'未知':itemName
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
          getCommHttpData({url:'stu/statistical/sexList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
            let list = that.getChartDataSex(data.list)
            that.basicbarSeries1={
              xValue:list.xValue,yValue:list.yValue,seriaName:['女','男'],
              yAxis:[{name: '人',min:-list.max,max:-list.max,interval: null,axisLabel:'人',tipLabel:'人'}]}
          })
          //民族分布
          getCommHttpData({url:'stu/statistical/folkList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
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
          getCommHttpData({url:'stu/statistical/politicalsList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){

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

              // data.list.forEach(item=>{
              //   itemName = itemName=='未知'?null:itemName
              //   //同一个类型
              //   if(itemName == item.typeName){
              //     poltotal+=parseInt(item.allCount)
              //   }
              // })
              polTempYValue.push(polList)
            })
            console.log(polTempYValue)
            //return
            that.basicPieSeries3={xValue:polTempXValue,yValue:polTempYValue,
            seriaName:seriaName,
            yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}

          })
          //独生子女
          getCommHttpData({url:'stu/statistical/onlyChildList',method:'post',contentType:2,data:{schoolId:that.schoolId}},function(data){
            that.stackedColumnSeries1={
              xValue:data.list.xValue,
              yValue:data.list.yValue,
              seriaName:data.list.seriaName,
              yAxis:[{name: '人',min: 0,max: null,interval: null,axisLabel:'',tipLabel:'人'}]}
          })

          //common
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
