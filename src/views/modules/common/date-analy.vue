<template>
	<div class="date-group-form">
		<el-radio-group v-model="radioBtn" @change="radioChange" class="date-radio-group">
	      <el-radio-button v-for="item in radioGroups" :label="item.id" :key="item.id" >{{item.name}}</el-radio-button>
	    </el-radio-group>
      <el-date-picker
      v-model="datapicker"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="getList"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions2">
    </el-date-picker>
   </div>
</template>
<style>
	.date-group-form{
		display: inline-block;margin-bottom: 10px; position: relative;
	}
	.date-group-form .date-radio-group{
		position: absolute;top: 0px;
	}
	.date-group-form .el-date-editor{
		margin-left: 320px;
	}
	.el-date-editor .el-range-separator{
		width: 10%;
	}
</style>
<script>
	import {getCommHttpData,getDateStr} from '@/utils/common'
	const btnOptions = [{id:4,name:'今天'},{id:1,name:'近7天'}, {id:2,name:'近30天'}, {id:3,name:'本学期'}];
	export default {
	data() {
	    return {
	    	orgId:this.GLOBAL.getOrgId(),
	    	radioBtn: 4,
	    	radioGroups: btnOptions,
	    	pickerOptions2: {
            shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },{
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
          },{
            text: '本学期',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      	datapicker:'',
      	startDate:'',
      	endDate:''
	    }
	},
	mounted() {
		this.datapicker = [getDateStr(0),getDateStr(0)]
		this.$emit('refreshChartsData',this.datapicker[0],this.datapicker[1])
		var filterParams = {commType:1};
		if(this.$cookie.get('userType') ==2){
			filterParams['schoolId'] = this.orgId
		}else{
			filterParams['unitId'] = this.orgId
		}
		this.getCommFilterMedia(filterParams);
	},
	created() {
	    this.getCommFilterMedia({commType:1,schoolId:6});
	},
	methods: {
		radioChange(){
			if(this.radioBtn ==1){
				this.datapicker = [getDateStr(-7),getDateStr(0)]
			}else if(this.radioBtn ==2){
				this.datapicker = [getDateStr(-30),getDateStr(0)]
			}else if(this.radioBtn ==4){
				this.datapicker = [getDateStr(0),getDateStr(0)]
			}else{ 
				this.datapicker = [this.startDate,this.endDate]
			}
			this.getList()
			
		},
		getCommFilterMedia (params) {
			let that = this
			getCommHttpData({url:'multimemediaEquip/commFilter',method:'post',contentType:2,data:params},function(data){
		    	that.startDate = data.list[0].startDate
		    	that.endDate = data.list[0].endDate
		    })
	    },
		getList() {
			this.$emit('refreshChartsData',this.datapicker[0],this.datapicker[1])
		}
	}
}
</script>



