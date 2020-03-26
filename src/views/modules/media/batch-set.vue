<template>
	<el-dialog title="设置-定时开关机" @close="handleClose" :close-on-click-modal="false" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
			<el-form-item v-if="!equipMac" label="设备类型" prop="type">
				<el-radio-group v-model="dataForm.type" @change="changeRadio">
					<el-radio v-for="item in typeList" :key="item.terminalType" :label="item.terminalType">{{item.terminalTypeName}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="!equipMac" label="年级" prop="gradeId">
				<el-select v-model="dataForm.gradeId" multiple placeholder="请选择年级" style="margin-right: 5px;">
					<el-option label="全部" value="0" :disabled="dataForm.gradeId.length > 0 && dataForm.gradeId.indexOf('0')==-1"></el-option>
					<el-option v-for="item in gradeList" :disabled="dataForm.gradeId.indexOf('0')>-1" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="equipMac" label="设备">
				<span>{{equipName}}</span>
			</el-form-item>
			<el-form-item label="预设方案" prop="dateTimes">
				<el-time-picker arrow-control v-if="dataForm.type != 1" format="HH:mm" value-format="HH:mm" v-model="dataForm.totalStartTime" :picker-options="{selectableRange:`00:00:00 -${dataForm.totalEndTime ? dataForm.totalEndTime+':00' : '23:59:00'}`}" style="width: 150px;" placeholder="开机时间"></el-time-picker>
				<span v-if="dataForm.type != 1">--</span>
				<el-time-picker arrow-control format="HH:mm" value-format="HH:mm" v-model="dataForm.totalEndTime" :picker-options="{selectableRange:`${dataForm.totalStartTime ? dataForm.totalStartTime+':00' : '00:00:00'}-23:59:00`}" style="width: 150px;" placeholder="关机时间"></el-time-picker>
				<el-button style="margin-left: 15px;" :disabled="!dataForm.totalStartTime && !dataForm.totalEndTime" @click="setWeekDayTime" type="primary">应用到每天</el-button>
			</el-form-item>
			<el-form-item>
				<el-table ref="multipleTable" @selection-change="handleSelectionChange" border :data="tableData" :header-cell-style="tableHeaderColor" style="width: 80%;">
					<el-table-column type="selection" align="center" width="55" header-align="center">
					</el-table-column>
					<el-table-column label="星期" prop="weekName" align="center" header-align="center" width="120">
					</el-table-column>
					<el-table-column label="开机时间" v-if="dataForm.type != 1" align="center" header-align="center">
						<template slot-scope="scope">
							<el-time-picker arrow-control style="width:150px" size="mini" format="HH:mm" value-format="HH:mm" v-model="scope.row.startTime" :picker-options="{selectableRange:`00:00:00 -${scope.row.shutdownTime ? scope.row.shutdownTime+':00' : '23:59:00'}`}" placeholder="开机时间"></el-time-picker>
						</template>
					</el-table-column>
					<el-table-column label="关机时间" align="center" header-align="center">
						<template slot-scope="scope">
							<el-time-picker arrow-control style="width:150px" size="mini" format="HH:mm" value-format="HH:mm" v-model="scope.row.shutdownTime" :picker-options="{selectableRange:`${scope.row.startTime ? scope.row.startTime+':00' : '00:00:00'}-23:59:00`}" placeholder="关机时间"></el-time-picker>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-model="dataForm.isHoliday">节假日不开机</el-checkbox>
				<div style="font-size: 12px;">注：设备会在开机后，获取最新开关机时间。</div>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
      <el-button @click="handleClose()">取消</el-button>
      <el-button @click="handleReset()">重置</el-button>
      <el-button type="primary" @click="dataFormSubmit()">保存</el-button>
    </span>
	</el-dialog>
</template>
<style>
	.el-tag+.el-tag {
		margin-left: 10px;
	}
</style>
<script>
	import { getCommHttpData } from '@/utils/common'
	export default {
		props: ['gradeList'],
		data() {
			return {
				visible: false,
				dataForm: {
					totalStartTime: '',
					totalEndTime: '',
					type: '',
					gradeId: [],
					isHoliday: true
				},
				dataRule: {
					type: [{
						required: true,
						message: '请选择设备类型',
						trigger: 'change'
					}],
					gradeId: [{
						type: 'array',
						required: true,
						message: '请选择年级',
						trigger: 'change'
					}],
				},
				tableData: [{
						'weekDay': 1,
						'weekName': '星期一',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 2,
						'weekName': '星期二',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 3,
						'weekName': '星期三',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 4,
						'weekName': '星期四',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 5,
						'weekName': '星期五',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 6,
						'weekName': '星期六',
						'startTime': '',
						'shutdownTime': ''
					},
					{
						'weekDay': 7,
						'weekName': '星期日',
						'startTime': '',
						'shutdownTime': ''
					}
				],
				typeList: [],
				multipleSelection: [],
				equipMac: '',
				equipName: ''
			}
		},
		methods: {
			init(mac, name1, name2, name3) {
				this.visible = true;
				this.equipMac = ''
				this.dataForm = {
					totalStartTime: '',
					totalEndTime: '',
					type: '',
					gradeId: [],
					isHoliday: true
				}
				this.$nextTick(() => {
					this.tableData.forEach((item, index) => {
						item.startTime = ''
						item.shutdownTime = ''

					})
          if(mac){
          	this.equipMac = mac
          	this.equipName = name2+name3+' '+name1
          	this.dataForm.type = name1=='电子班牌' ? '2' : '1'
          	this.getEquipTime(mac)
          }else{
          	this.getTerminalType()
            this.tableData.forEach((item,index)=>{
            	if(index<5){
            		this.$refs.multipleTable.toggleRowSelection(item);
            	}
            })
            
          }
				})


			},
			handleReset() {
				this.dataForm.totalStartTime = ''
				this.dataForm.totalEndTime = ''
				this.dataForm.gradeId = []
				this.$nextTick(() => {
					this.tableData.forEach((item, index) => {
						item.startTime = ''
						item.shutdownTime = ''
					})
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			changeRadio(val) {
				this.totalStartTime = ''
				this.totalEndTime = ''
			},
			setWeekDayTime() {
				this.tableData.map(item => {
					item.startTime = this.dataForm.totalStartTime
					item.shutdownTime = this.dataForm.totalEndTime
					return item
				})
			},

			// 修改table header的背景色
			tableHeaderColor({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return 'background-color: #3C85EE !important;color: #fff;font-weight: bold;padding:5px 0;'
			},
			//获取设备类型
			getTerminalType() {
				let that = this
				getCommHttpData({
					url: 'equipShutdownTime/getTerminalType',
					method: 'post',
					contentType: 2,
					//					data: {},
				}, function(data) {
					that.typeList = data.list
				})
			},
			//获取设备定时开关机设置
			getEquipTime(mac) {
				let that = this
				getCommHttpData({
					url: 'equipShutdownTime/getEquipTime',
					method: 'post',
					contentType: 2,
					data: {
						equipMac: mac
					},
				}, function(data) {
					let tmpList = data.list
          if(data.list.length >0){
            that.tableData.forEach((item,index)=>{
            //						if(index<5){
            //							that.$refs.multipleTable.toggleRowSelection(item);
            //						}

            tmpList.forEach((cItem)=>{
                if(item.weekDay == cItem.weekDay){
                  item.startTime = cItem.startTime
                  item.shutdownTime = cItem.shutdownTime
                  that.$refs.multipleTable.toggleRowSelection(item);
                }
              })

            })
          }
          that.dataForm.isHoliday = data.isHoliday==0?false:true

				})
			},
			handleClose() {
				this.visible = false
				this.$refs.multipleTable.clearSelection();
				this.$refs['dataForm'].clearValidate()
			},
			// 表单提交
			dataFormSubmit() {
				let that = this
				let setStartTime = [],
				weekSunday = ['星期六','星期日']
        
//				 if(this.dataForm.isHoliday){
//				 	this.multipleSelection.forEach(item=>{
//				 		if(weekSunday.indexOf(item.weekName) == -1){
//				 			setStartTime.push(item)
//				 		}
//				 	})
//				 }else{
//				 	let isWeekDay = 0
//				 	this.multipleSelection.forEach(item=>{
//				 		if(item.weekName == '星期六'||item.weekName == '星期日'){
//				 			isWeekDay++
//				 		}
//				 	})
//				 	setStartTime = this.multipleSelection
//				 	if(isWeekDay !== 2){
//				 		that.$message({
//				 			message: '请选择节假日开关机时间！',
//				 			type: 'error'
//				 		})
//				 		return false;
//				 	}
//				 }
				 if(this.multipleSelection.length > 0) {
				 	let isValidate = false
					this.multipleSelection.forEach(item=>{
							if(that.dataForm.type == 1){
								item.startTime = ''
								if(!item.shutdownTime){
									isValidate = true
								}
							}else{
								if(!item.shutdownTime || !item.startTime){
									isValidate = true
								}
							}
					})
					if(isValidate){
						that.$message({
					 		message: '开关机时间不能为空！',
					 		type: 'error'
					 	})
						return false
					}
					this.$refs['dataForm'].validate((valid) => {
						if(valid) {
							getCommHttpData({
								url: 'equipShutdownTime/addTime',
								method: 'post',
								contentType: 2,
								data: {
									list: this.multipleSelection,
									gradeIds: this.dataForm.gradeId.join(','),
									terminalType: this.dataForm.type,
									isHoliday: this.dataForm.isHoliday ? 1 : 0,
									equipMac: this.equipMac
								},
							}, function(data) {
								that.$message({
									message: '定时开关机设置成功！',
									type: 'success'
								})
								that.visible = false
								that.$refs.multipleTable.clearSelection();
								//					console.log(data,'datatatat')
							})
						}
					})
				 } else {
				 	that.$message({
				 		message: '所选星期不能为空！',
				 		type: 'error'
				 	})
				 }
			}
		}

	}
</script>