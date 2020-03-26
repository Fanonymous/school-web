<template>
	<div style="float: left; margin-right: 10px;margin-bottom: 10px;">
		<el-select class="filter-item" v-model="yearTermIndex" @change="setMinMaxDate" :disabled="disabled" clearable  placeholder="请选择学年学期" style="margin-right:5px">
			<el-option v-for="(item,index) in dataList" :key="index" :label="item.yearName" :value="index">
			</el-option>
		</el-select>
    <el-date-picker
      v-model="datapicker"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="iniChartsData"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions2">
    </el-date-picker>
	</div>
</template>

<script>
	import { getCommHttpData,getDateStr,dateDiff } from '@/utils/common'
  const btnOptions = [{id:1,name:'周'}, {id:2,name:'月'}, {id:3,name:'学期'}];
	export default {
		props: {
			require:{
		    	type: Boolean,
		    	default: true
	    	},
	    },
		data() {
			return {
				yearTermId: '',
        yearTermIndex:'',
				dataList: [],
				disabled: false,
        orgId:this.GLOBAL.getOrgId(),
        radioBtn: 1,
        radioGroups: btnOptions,
        minDate: '',
        maxDate: '',
        pickerOptions2: {
            disabledDate(time) {
               return time.getTime() > Date.now() ;
            },
            shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
          ]
        },
        datapicker:'',
        startDate:'',
        endDate:''
			}
		},
		 watch: {
		    gradeIdp (val) {
		    	this.gradeId = val
		    }
		},
		mounted() {
      this.datapicker = [getDateStr(-30),getDateStr(-1)]
			this.getYearTermList();
		},
		methods: {
      iniChartsData() {
        let dateCount = dateDiff(this.datapicker[0],this.datapicker[1])
        if(dateCount  > 30){
          this.$message({
          	type: 'error',
          	message: '时间范围不能大于30天!'
          });
          this.datapicker = [this.datapicker[0],this.datapicker[0]]
          return
        }
      	this.$emit('refreshDataList',this.datapicker[0],this.datapicker[1],this.yearTermId)
      },
			getYearTermList() {
				var that = this
				getCommHttpData({
					url: 'complexEdu/queryYearTermByTime',
					method: 'get',
					contentType: 1,
          serverType: 1,
					data: {}
				}, function(data) {
					that.dataList = data.list
          that.yearTermIndex = 0
          that.yearTermId =  data.list[0].yearTermId
          that.startDate = data.list[0].startDate
          that.endDate = data.list[0].endDate
          let minDate = new Date(that.startDate)
          let maxDate = new Date(getDateStr(-1))
          that.pickerOptions2 = {
            disabledDate(time) {
              return time.getTime() < minDate.getTime() ||  time.getTime() > maxDate;
            }
          }
          that.$emit('refreshDataList', that.datapicker[0],that.datapicker[1],that.yearTermId)
				})
			},
			setMinMaxDate() {
        this.yearTermId = this.dataList[this.yearTermIndex].yearTermId
				this.startDate = this.dataList[this.yearTermIndex].startDate
				this.endDate = this.dataList[this.yearTermIndex].endDate
        let minDate = new Date(this.startDate)
        let maxDate = new Date(this.endDate)
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < minDate.getTime() ||  time.getTime() >  maxDate.getTime() ;
          }
        }
        this.iniChartsData()
			}
		}
	}
</script>
<style scoped>
	.date-group-form{
		display: inline-block;margin-bottom: 10px; position: relative;
	}
	.date-group-form .date-radio-group{
		position: absolute;top: 0px;
	}
	.date-group-form .el-date-editor{
		margin-left: 0px;
	}
	.el-date-editor .el-range-separator{
		width: 10%;
	}
</style>
