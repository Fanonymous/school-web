<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card shadow="hover">
			<el-row :gutter="12">
        <el-col :span="22" :offset="2" v-if="schoolSectionList.length>1">
          <el-radio-group v-model="schoolSectionType" class="margin-bottom-10" @change="$router.push({name:'edu-time-table-look',query:{type:0,addType:schoolSectionType}})">
            <el-radio-button v-for="(item,index) in schoolSectionList" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
          </el-radio-group>
        </el-col>
				<el-col :span="14" :offset="2">
					<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="80px">
						<el-form-item prop="scheduleName">
							<el-input v-model="dataForm.scheduleName" placeholder="请在此处输入作息时间的名称，如：春季作息"></el-input>
						</el-form-item>
						<el-form-item>
							<div style="text-align: right;">在校时长：<span v-if="timeHoursCount>0">{{timeHoursCount}}小时</span><span v-if="timeMinusCount>0">{{timeMinusCount}}分钟</span></div>
							<el-table class="time-table" :data="dataForm.list" :show-header=true v-loading="listLoading" border fit highlight-current-row :span-method="arraySpanMethod">

								<el-table-column align="center" label='节次' width="150">
									<template slot-scope="scope">
											<!--<el-form-item prop="lessionCodeName" v-if="scope.row.status ==2" :rules="[{ required: true, message: '节次必填', trigger: 'blur' },{min:1,max:20,message: '节次大于20个字符'}]">
												<el-input placeholder="节次" v-model="scope.row.lessionCodeName"></el-input>
											</el-form-item>-->
										<el-form-item :prop="'list.' + scope.$index+ '.' +'lessionCodeName'"  :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' },{min:1,max:20,message: '姓名长度不能大于20个字符'}]" v-if="scope.row.status ==2" >
											<el-input placeholder="节次" v-model="dataForm.list[scope.$index].lessionCodeName"></el-input>
										</el-form-item>

									</template>
								</el-table-column>
								<!--<el-table-column align="center" label="设置时间" width="380">-->
									<el-table-column align="center" label="开始时间   --  时长" width="280" >
									
									<template slot-scope="scope">
										<template  v-if="scope.row.status ==2">
											<el-time-select v-if="scope.$index == 0" :editable=false  :clearable=false style="width: 40%;" placeholder="结束时间" v-model="scope.row.startTime"  @change="startTimeChange(scope.$index,scope.row.lessionType)"
												 :picker-options="{
											      start: '05:00',
											      step: '00:05',
											      end: '23:00'}">
											</el-time-select>
											<el-time-select v-if="scope.$index > 0" :editable=false :clearable=false style="width: 40%;" placeholder="结束时间" v-model="scope.row.startTime"  @change="startTimeChange(scope.$index,scope.row.lessionType)"
												 :picker-options="{
											      start: '05:00',
											      step: '00:05',
											      end: '23:00',minTime: dataForm.list[scope.$index-1].endTime1}">
											</el-time-select>

										</template>
										<el-select v-if="scope.row.status ==2" v-model="scope.row.hours" style="width: 40%;" placeholder="请选择时长" @change="startTimeChange(scope.$index,scope.row.lessionType)">
                      <el-option :key="0" label="不设置" :value="0"></el-option>
                      <template v-for="index of 40">
                        <el-option  :key="index*5" :label="index*5+'分钟'" :value="index*5">
                      </el-option>
                      </template>
										</el-select>
									</template>
									</el-table-column>
									<el-table-column align="center" label="课程时间">
										<template slot-scope="scope">
                      <template v-if="scope.row.hours == 0">{{scope.row.startTime}}</template>
                      <template v-else>
                        <span v-if="scope.row.status ==2">{{scope.row.startTime}} -- {{scope.row.endTime}}</span>
                      </template>
										</template>
									</el-table-column>
									
									<el-table-column fixed="right" align="center" label="操作">
										<template slot-scope="scope" v-if="scope.row.status ==2">
											<el-button type="primary" icon="el-icon-plus" size="mini" circle @click="plusRow(scope.$index,scope.row.lessionType)"></el-button>
											<el-button v-if="dataForm.list.length == 1" disabled type="danger" icon="el-icon-delete" size="mini" circle @click="minusRow(scope.$index)"></el-button>
											<el-button v-else type="danger" icon="el-icon-delete" size="mini" circle @click="minusRow(scope.$index)"></el-button>
										</template>
									</el-table-column>
								<!--</el-table-column>		-->						
							</el-table>
						</el-form-item>
						
					</el-form>
					<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="80px" style="margin-left: 80px;">
						<el-form-item label="执行时间" prop="executionDate">
							<el-date-picker :picker-options="pickerOptions" v-model="dataForm.executionDate" value-format='yyyy-MM-dd' type="date" placeholder="选择出生日期" class="el-input-width">
							</el-date-picker>
							<div class="form-tips">注：到执行时间自动执行此作息时间表</div>
						</el-form-item>
						<el-form-item label="备注">
							<el-input type="textarea" v-model="dataForm.remark" placeholder="请在此添加备注"></el-input>
						</el-form-item>

					</el-form>
				</el-col>
				<el-col :span="6" :offset="1">
					<div class="margin-bottom-20">
						<el-button type="primary" @click="dataFormSubmit" :loading="addLoading">发布</el-button>
						<el-button type="primary" v-if="activities.length != 0"  @click="$router.push({name:'edu-time-table-look',query:{type:0,addType:schoolSectionType}})">取消</el-button>
						<el-button type="" v-else disabled>取消</el-button>
						
					</div>
				</el-col>
			</el-row>
		</el-card>
		<el-dialog title="二维码" :visible.sync="dialogFormVisible" width="280px">
			<div class="qrcode-box">
				<div class="qrcode-title margin-bottom-10">{{dataForm.title}}</div>
				<div class="margin-bottom-10" id="qrcode" ref="qrCodeDiv"></div>
				<div class="qrcode-remark">请使用手机扫描二维码访问</div>
			</div>
		</el-dialog>
	</div>

</template>
<style>
	/*.time-table .el-table .success-row:hover>td {
	    background-color: #17B3A3 !important;
	}
	.time-table .el-table__body tr.current-row>td{
		background-color: #6ac8be !important;
	}*/
	/*.time-table .el-table__row{
		height: 50px;
	}
	.time-table .cell{
		height:50px;
	}*/
</style>
<script>
	import QRCode from 'qrcodejs2'
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData,setTimeAddZero,getDateStr,getTimeMinus,compareDate } from '@/utils/common'
	export default {
		data() {
			const validateNameInput = (rule, value, callback) => {
		      if (!value) {
		        return callback(new Error('此项必填！'))
		      } else {
		        callback()
		      }
			}
			return {
				schoolId: this.GLOBAL.getOrgId(),
				addLoading: false,
				timelineType: ['info', 'primary', null],
				timelineColor: ['#cccccc', '#0bbd87', '#409eff'],
				active: 1,
				configList: null,
				listLoading: false,
				dataList: [],
				schoolType: '',
				//stepList: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,65,70,75,80,85,90,95,100,105,110,115,120],
				timeHoursCount:8,
				timeMinusCount:10,
				lessionAfterIndex:8,
				lessionMoonIndex:12,
				dataForm: {
          schoolSection:this.schoolSectionType,
					schoolId: this.GLOBAL.getOrgId(),
					scheduleName: '',
					executionDate: getDateStr(0),
					schoolHours: 490,
					remark: '',
					list: [
//						{
//							lessionCodeName: '上午',
//							startTime: '07:10',
//							endTime: '11:30',
//							hours: 40,
//							status: 1,
//							lessionType:1
//						},
						{
							lessionCodeName: '早读',
							startTime: '07:10',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '07:50',
							endTime1:'07:45',
							hours: 40,
							status: 2,
							lessionType:1
						},
						{
							lessionCodeName: '第一节',
							startTime: '08:00',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '08:40',
							endTime1:'08:35',
							hours: 40,
							status: 2,
							lessionType:1
						},
						{
							lessionCodeName: '第二节',
							startTime: '08:50',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '09:30',
							endTime1:'09:25',
							hours: 40,
							status: 2,
							lessionType:1
						},
						{
							lessionCodeName: '课间操',
							startTime: '09:30',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '09:50',
							endTime1:'09:45',
							hours: 20,
							status: 2,
							lessionType:1
						},
						{
							lessionCodeName: '第三节',
							startTime: '10:00',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '10:40',
							endTime1:'10:35',
							hours: 40,
							status: 2,
							lessionType:1
						},
						{
							lessionCodeName: '第四节',
							startTime: '10:50',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '11:30',
							endTime1:'11:25',
							hours: 40,
							status: 2,
							lessionType:1
						},
//						{
//							lessionCodeName: '下午',
//							startTime: '14:00',
//							endTime: '16:20',
//							endTime1:'16:15',
//							hours: 40,
//							status: 1,
//							lessionType:2
//						},
						{
							lessionCodeName: '第五节',
							startTime: '14:00',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '14:40',
							endTime1:'14:35',
							hours: 40,
							status: 2,
							lessionType:2
						}, {
							lessionCodeName: '第六节',
							startTime: '14:50',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '15:30',
							endTime1:'15:25',
							hours: 40,
							status: 2,
							lessionType:2
						}, {
							lessionCodeName: '第七节',
							startTime: '15:40',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '16:20',
							endTime1:'16:15',
							hours: 40,
							status: 2,
							lessionType:2
						}, 
//						{
//							lessionCodeName: '晚上',
//							startTime: '19:00',
//							endTime: '20:30',
//							hours: 40,
//							status: 1,
//							lessionType:3
//						},
						{
							lessionCodeName: '第一节晚自习',
							startTime: '19:00',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '19:40',
							endTime1:'19:35',
							hours: 40,
							status: 2,
							lessionType:3
						}, {
							lessionCodeName: '第二节晚自习',
							startTime: '19:50',
							//						startTime: new Date(2016, 9, 10, 0, 0),
							endTime: '20:30',
							endTime1:'20:25',
							hours: 40,
							status: 2,
							lessionType:3
						}
					]
				},
				sectionOptions: null,
				sTypeOptions: null,
				showReviewer: false,
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '添加',
					look: '查看'
				},
				dialogPvVisible: false,
				pvData: [],
				rules: {
					scheduleName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					},{
						min: 1,
						max: 50,
						message: '名称的长度不能大于50 个字符'
					}],
					executionDate: [{
						required: true,
						message: '不能为空',
						trigger: 'change'
					}],
					remark:[{
						max: 500,
						message: '备注的长度不能大于500 个字符'
					}],
					lessionCodeName:[{
						validator: validateNameInput, trigger: 'blur'
					}]
				},
				activities: [],
				pickerOptions: {
//					disabledDate(time) {
//						return time.getTime() > Date.now();
//					}
				},
        schoolSectionType:null,
        schoolSectionList:[]
			}
		},
		mounted() {
      this.getSchoolSectionList()
      this.schoolSectionType = this.$route.query.stype
			this.dataForm.scheduleName = this.GLOBAL.getOrgName()+'作息时间表'
			this.getDataList()
			if(this.$route.query.id != undefined) {
				this.getTimeTableById(this.$route.query.id)
			}
		},
		methods: {
      //学段查询
      getSchoolSectionList(){
        let that = this
        getCommHttpData({
        	url: 'eduManageSchedule/getSchoolSection',
        	method: 'get',
        	contentType: 1,
        	data: {}
        }, function(data) {
        	if(data && data.code == 0) {
        		that.schoolSectionList = data.list
        		that.schoolSectionType = this.$route.query.stype
            
        	}
        })
      },
			getTimeTableById(scheduleId) {
				let that = this
				getCommHttpData({
					url: 'eduManageSchedule/queryById',
					method: 'post',
					contentType: 2,
					data: {
						scheduleId: scheduleId,
					}
				}, function(data) {
					if(data && data.code == 0) {
						//that.listLoading = false
						for(let i in data.list.list){
							 data.list.list[i].hours = parseInt(data.list.list[i].hours)
						}
						that.dataForm = data.list
					} else {
						that.dataForm = {}
					}
				})
			},
			
			
			tableRowClassName({
				row,
				rowIndex
			}) {
//				if(row.status === 1) {
//					return 'success-row';
//				}
				return '';
			},
			//开始时间，步长，计算结束时间
			startTimeChange(index) {
				let startTimeStr = this.dataForm.list[index].startTime
				let startTimeArr = startTimeStr.split(':')
				let startHour    = parseInt(startTimeArr[0])
				let startMinut   = parseInt(startTimeArr[1])
				startMinut = startMinut +parseInt(this.dataForm.list[index].hours)
				
				if(startMinut >= 60){
					startHour = startHour + parseInt(startMinut/60)
					startMinut= startMinut%60
				}
				
				let endTime =  setTimeAddZero(startHour)+':'+setTimeAddZero(startMinut)
				this.dataForm.list[index].endTime = endTime
				let startHour1 = startHour
				let startMinut1 = startMinut-5
				if(startMinut1 < 0){
					startHour1= startHour1-1
					startMinut1=55
				}

				this.dataForm.list[index].endTime1 = setTimeAddZero(startHour1)+':'+setTimeAddZero(startMinut1)
				//剩下的所有开始和结束值修改
        this.listLoading = true
				for(let j= index+1;j<this.dataForm.list.length;j++){
					//lessiontype相同是连动
					//if(this.dataForm.list[j].lessionType == this.dataForm.list[index].lessionType){
						let step = 1
						if(this.dataForm.list[j-1].status == 1){
							step = 2
						}
						let startTimeStrNext = this.dataForm.list[j-step].endTime
						
						let startTimeArrNext = startTimeStrNext.split(':')
						let startHourNextStart = parseInt(startTimeArrNext[0])
						let startMinutNextStart = parseInt(startTimeArrNext[1])+10
						let startHourNextEnd   = startHourNextStart
						let startMinutNextEnd  = startMinutNextStart +parseInt(this.dataForm.list[j].hours)
						
						if(startMinutNextStart >= 60){
							startHourNextStart = startHourNextStart + parseInt(startMinutNextStart/60)
							startMinutNextStart= startMinutNextStart%60
						}
						if(startMinutNextEnd >= 60){
							startHourNextEnd = startHourNextEnd + parseInt(startMinutNextEnd/60)
							startMinutNextEnd= startMinutNextEnd%60
							
						}
						let startMinutNextEnd1 = startMinutNextEnd-5
						let startHourNextEnd1 = startHourNextEnd
						if(startMinutNextEnd1 < 0){
							startHourNextEnd1= startHourNextEnd1-1
							startMinutNextEnd1=55
						}
						
						this.dataForm.list[j].startTime = setTimeAddZero(startHourNextStart)+':'+setTimeAddZero(startMinutNextStart)
					    this.dataForm.list[j].endTime   = setTimeAddZero(startHourNextEnd)+':'+setTimeAddZero(startMinutNextEnd)
					    this.dataForm.list[j].endTime1 = setTimeAddZero(startHourNextEnd1)+':'+setTimeAddZero(startMinutNextEnd1)
				   // }

				}
				//计算早中晚时间，在校时长
				let timeCount = 0
				let morningEnd = ''
				let afterEndTime = '',moonEndTime=''
				//上午 开始时间 12点之前
				//下午 开始时间 12 18点之前
				//晚上 开始时间 18之后
				let endTime1='0:0',startTime2='0:0',endTime2='0:0',startTime3='0:0'
				let isMoon = false,isAfter = false,afterIndex =0,moonIndex=0
				for(let j= 0;j<this.dataForm.list.length;j++){
          //nsole.log('12:00',this.dataForm.list[j].startTime)
          //判断开始时间大于12点，下午第一节 compareDate(t1,t2) t1>t2 早上最后一节
					if(compareDate('12:00',this.dataForm.list[j].startTime)){

						endTime1 = this.dataForm.list[j].endTime
						if(j+1<this.dataForm.list.length-1){
							//After = true
							startTime2 = this.dataForm.list[j+1].startTime
						}
					}
          if(compareDate(this.dataForm.list[j].startTime,'11:59') && compareDate('18:00',this.dataForm.list[j].startTime)){
            if(afterIndex ==0){
              startTime2 = this.dataForm.list[j].startTime
            }
            endTime2 = this.dataForm.list[j].endTime
            afterIndex++
            isAfter = true
          }
          //晚上第一节
					if(compareDate('18:00',this.dataForm.list[j].startTime)){
						//endTime2 = this.dataForm.list[j].endTime
						if(j+1<this.dataForm.list.length-1){
							isMoon = true
							startTime3 = this.dataForm.list[j+1].startTime
						}
					}
          if(compareDate(this.dataForm.list[j].startTime,'17:59')){
            isMoon = true
            if(moonIndex ==0){
              startTime3 = this.dataForm.list[j].startTime
            }
            moonIndex++
          }else{
            isMoon = false
          }
				}

				let stepMorg = getTimeMinus(endTime1,this.dataForm.list[0].startTime)
				let stepAfter = 0
				let stepMoon = 0
				if(isAfter){
					stepAfter = getTimeMinus(endTime2,startTime2)
				}
        console.log(endTime2,startTime2)
        //console.log(this.dataForm.list[this.dataForm.list.length-1].endTime,startTime3)
				if(isMoon) {
					stepMoon = getTimeMinus(this.dataForm.list[this.dataForm.list.length-1].endTime,startTime3)
				}

				timeCount = stepMorg+stepAfter+stepMoon 
				this.dataForm.schoolHours = timeCount
				this.timeHoursCount = parseInt(timeCount/60)
				this.timeMinusCount = timeCount%60
        setTimeout(() => {
          this.listLoading = false
        }, 300)

			},
			
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(row.status === 1) {
					return [1, 4];
				}
			},
			// 向后插入一行数据
			plusRow(rowIndex,lessionType) {
				this.dataForm.list.splice(rowIndex + 1, 0, {
					lessionCodeName: '',
					startTime: '00:00',
					endTime: '00:00',
					hours: 40,
					status: 2,
					lessionType:lessionType
				});
				
				for(let j= 0;j<this.dataForm.list.length;j++){
					if(this.dataForm.list[j].lessionType ==2 && this.dataForm.list[j].status == 2  ){
						this.lessionAfterIndex = j
						break;
					}
				}
				for(let j= 0;j<this.dataForm.list.length;j++){
					if(this.dataForm.list[j].lessionType ==3 && this.dataForm.list[j].status == 2  ){
						this.lessionMoonIndex = j
						break;
					}
				}
				
			},
			// 删除当前行
			minusRow(rowIndex) {
				this.dataForm.list.splice(rowIndex, 1);
//				for(let j= 0;j<this.dataForm.list.length;j++){
//					if(this.dataForm.list[j].lessionType ==2 && this.dataForm.list[j].status == 2  ){
//						this.lessionAfterIndex = j
//						break;
//					}
//				}
//				for(let j= 0;j<this.dataForm.list.length;j++){
//					if(this.dataForm.list[j].lessionType ==3 && this.dataForm.list[j].status == 2  ){
//						this.lessionMoonIndex = j
//						break;
//					}
//				}
			},
			//查询List
			getDataList() {
				let that = this
				getCommHttpData({
					url: 'eduManageSchedule/queryList',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
					}
				}, function(data) {
					if(data && data.code == 0) {
						//that.listLoading = false
						that.activities = data.list
					} else {
						that.activities = []
					}
				})
			},
			//添加&编辑数据
			dataFormSubmit(type) {
				this.$refs['dataForm'].validate((valid) => {
					if(valid) {
						var that = this
						that.addLoading = true
						let list = this.dataForm.list
						let lastArr = list[list.length-1].endTime.split(':')
						
						if(parseInt(lastArr[0]) == 23 && parseInt(lastArr[1])>0 ){
							this.$message({
					            message: '最晚时间到23点，请重新选择',
					            type: 'error'
					        })
							that.addLoading = false
							return
						}
						let isNull=false,isNameRight = false,isRepeat=false,tempNameList = []
						for(let i in list){
							if(list[i].lessionCodeName == ''){
								isNull = true
								break;
							}else{
								if(list[i].lessionCodeName.length>20){
									isNameRight = true
									break;
								}else{
                  tempNameList.push(list[i].lessionCodeName)
                }
							}
							
						}
						if(isNull){
							this.$message({
					            message: '请填写节次名称',
					            type: 'error'
					        })
							that.addLoading = false
							return
						}
						if(isNameRight){
							this.$message({
					            message: '请输入正确的节次名称',
					            type: 'error'
					        })
							that.addLoading = false
							return
						}
            let tempList = Array.from(new Set(tempNameList))
            if(tempNameList.length > tempList.length){
            	this.$message({
                  message: '请不要输入重复的节次名称',
                  type: 'error'
              })
            	that.addLoading = false
            	return
            }
            this.dataForm.schoolSection = this.schoolSectionType
						getCommHttpData({
							url: 'eduManageSchedule/checkSave',
							method: 'post',
							contentType: 2,
							data: this.dataForm
						}, function(data) {
							that.addLoading = false
							if(data && data.code ==0){
								if(data.msg != 'success'){
									that.$confirm(data.msg, '系统提示', {
								      confirmButtonText: '确定',
								      cancelButtonText: '取消',
								      type: ''
								    }).then(() => {
										that.saveSchedule()
								    }).catch(() => {
								      
								    });
								}else{
									that.$confirm('作息时间发布后不可更改，您确定发布吗？', '系统提示', {
								      confirmButtonText: '确定',
								      cancelButtonText: '取消',
								      type: ''
								    }).then(() => {
										that.saveSchedule()
								    }).catch(() => {
								      
								    });
								}
								
								
							}
							
						})
					}
				})
			},
			saveSchedule(){
				var that = this
				that.addLoading = true
        that.dataForm.schoolSection = that.schoolSectionType
				getCommHttpData({
					url: 'eduManageSchedule/save',
					method: 'post',
					contentType: 2,
					operateType: 2,
					that: that,
					data: that.dataForm
				}, function(data) {
					that.addLoading = false
					that.$router.push({name:'edu-time-table-look',query:{type:0,addType:that.schoolSectionType}})
					that.getDataList();
				})
			}

		}
	}
</script>