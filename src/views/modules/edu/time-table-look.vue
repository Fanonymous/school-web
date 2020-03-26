<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card shadow="hover" v-if="schoolSectionList.length > 0">
			<el-row :gutter="12">
				<el-col :span="22" :offset="2" v-if="schoolSectionList.length >1">
					<el-radio-group v-model="schoolSectionType" class="margin-bottom-10" @change="getDataList">
						<el-radio-button v-for="(item,index) in schoolSectionList" :label="item.id" :key="item.id">{{item.name}}</el-radio-button>
					</el-radio-group>
				</el-col>
				<el-col :lg="12" :offset="leftOffset">
					<section ref="print" style="width:720px;" id="printContent" v-if="activities.length>0">
						<el-form :rules="rules" class="time-table-look" ref="dataForm" :model="dataForm" label-position="right">
							<el-form-item>
								<div class="schedule-title">{{dataForm.scheduleName}}</div>
							</el-form-item>
							<el-form-item>
								<!--<div style="text-align: right;">在校时长：<span v-if="timeHoursCount>0">{{timeHoursCount}}小时</span><span v-if="timeMinusCount>0">{{timeMinusCount}}分钟</span></div>-->
								<el-table :data="dataForm.list" :row-class-name="tableRowClassName" :show-header=false v-loading="listLoading" border fit :span-method="arraySpanMethod">
									<el-table-column align="center" label='节次' width="200px">
										<template slot-scope="scope">
											<div>
												<i class="el-icon-sunrise" v-if="scope.row.lessionCodeName.indexOf('上午') >-1"></i>
												<i class="el-icon-sunny" v-if="scope.row.lessionCodeName.indexOf('下午') >-1"></i>
												<i class="el-icon-moon" v-if="scope.row.lessionCodeName.indexOf('晚上') >-1"></i>

												<template v-if="scope.row.status == 1">{{scope.row.lessionCodeName}}（{{scope.row.startTime}} - {{scope.row.endTime}}）</template>
												<span v-else class="schedule-lession">{{scope.row.lessionCodeName}}</span>
											</div>
										</template>
									</el-table-column>
									<el-table-column align="center" label="开始时间" width="300px">
										<template slot-scope="scope" v-if="scope.row.status ==2">
											<span>{{scope.row.startTime}}<template v-if="scope.row.hours != 0"> -- {{scope.row.endTime}}</template></span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="时长">
										<template slot-scope="scope" v-if="scope.row.status ==2">
											<span v-if="scope.row.hours != 0">{{scope.row.hours}}分钟</span>
											<span v-else>--</span>
										</template>
									</el-table-column>
								</el-table>
							</el-form-item>
							<el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px" class="schedule-bg">
								<el-form-item label="执行时间：" prop="executionDate">
									{{dataForm.executionDate}}
								</el-form-item>
								<el-form-item label="备注：" v-if="dataForm.remark != ''">
									<span v-html="dataForm.remark"></span>
								</el-form-item>
							</el-form>
						</el-form>
					</section>
					<template v-else>
						<div style="text-align: center;margin: 200px 0px;">
							<img src="~@/assets/img/datano.png" width="150px" class="margin-bottom-20" />
							<div style="font-size: 16px;color:#CCCCCC;">暂无作息时间</div>
						</div>

					</template>
				</el-col>
				<el-col :lg="9" :offset="rightOffet">
					<div class="margin-bottom-20" style="text-align: right;">
						<template v-if="activities.length>0">
							<el-dropdown @command="shareHandle" style="margin-right: 10px;margin-bottom: 10px;">
								<el-button type="primary" size="mini">
									分享<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="1">QQ</el-dropdown-item>
									<el-dropdown-item command="2">二维码</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-button style="margin-bottom: 10px;" type="primary" size="mini" @click="$router.push({name:'edu-time-table',query:{type:0,id:scheduleId,stype:schoolSectionType}})">复制</el-button>
							<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="$router.push({name:'edu-time-table',query:{type:0,stype:schoolSectionType}})">添加</el-button>
							<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="downLoadFile()">{{$t('table.downLoad')}}</el-button>
							<!--v-print="'#printContent'" -->
							<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click="printHandle">打印</el-button>
							<el-button :type="type==1 ? '':'primary'" size="mini" style="margin-bottom: 10px;" :disabled="type == 1" @click="deleteHandle">删除</el-button>
							<!--<el-button type="primary" size="mini" style="margin-bottom: 10px;" v-else  @click="deleteHandle">删除</el-button>-->
						</template>
						<template v-else>
							<el-dropdown @command="shareHandle" style="margin-right: 10px;margin-bottom: 10px;">
								<el-button type="" size="mini" disabled>
									分享<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="1">QQ</el-dropdown-item>
									<el-dropdown-item command="2">二维码</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
							<el-button style="margin-bottom: 10px;" type="" size="mini" disabled @click="$router.push({name:'edu-time-table',query:{type:0,id:scheduleId,stype:schoolSectionType}})">复制</el-button>
							<el-button style="margin-bottom: 10px;" type="primary" size="mini" @click="$router.push({name:'edu-time-table',query:{type:0,stype:schoolSectionType}})">添加</el-button>
							<el-button style="margin-bottom: 10px;" type="" size="mini" disabled @click="downLoadFile()">{{$t('table.downLoad')}}</el-button>
							<!--v-print="'#printContent'" -->
							<el-button style="margin-bottom: 10px;" type="" size="mini" disabled @click="printHandle">打印</el-button>
							<el-button style="margin-bottom: 10px;" type="" size="mini" disabled @click="deleteHandle">删除</el-button>
						</template>
					</div>
					<el-col :lg="20" :offset="4">
						<el-timeline v-if="activities.length >=2" style="height:600px;overflow: auto;padding-top: 10px;margin-left: 20px;">
							<!--type：0 过去已使用 type：1 为正在使用 type：2 未来未在使用-->
							<template v-for="(activity, index) in activities">
								<el-timeline-item :key="index" :color="timelineColor[activity.type]" :size="large" :timestamp="activity.executionDate">
									<span v-if="activity.scheduleId == scheduleId" style="cursor: pointer;color: #17B3A3">{{activity.scheduleName}} <span v-if="activity.type == 1" style="color: #17B3A3">&nbsp;(使用中)</span><span v-if="activity.type == 2" style="color: #0598FF;">&nbsp;(待使用)</span></span>
									<span v-else @click="getTimeTableById(activity.scheduleId,index)" style="cursor: pointer;">{{activity.scheduleName}}<span v-if="activity.type == 1" style="color: #17B3A3">&nbsp;(使用中)</span><span v-if="activity.type == 2" style="color: #0598FF;">&nbsp;(待使用)</span></span>
								</el-timeline-item>
							</template>
						</el-timeline>
					</el-col>
				</el-col>
			</el-row>
		</el-card>
		<el-card shadow="hover" v-else>
			<div style="text-align: center; margin: 200px 0px;">
				<img src="~@/assets/img/nodata2.png" width="180px" class="margin-bottom-20" />
				<div>暂无作息时间可使用的班级，请先录入班级。
					<el-button type="primary" @click="$router.push({name:'edu-class',query:{type:0}})">班级管理</el-button>
				</div>
			</div>
		</el-card>
		<el-dialog title="" :visible.sync="dialogFormVisible" width="290px">
			<div class="qrcode-box">
				<div class="qrcode-title margin-bottom-20">{{dataForm.scheduleName}}</div>
				<div class="margin-bottom-20" id="qrcode" ref="qrCodeDiv"></div>
				<div class="qrcode-remark">请使用手机扫描二维码访问</div>
			</div>
		</el-dialog>
	</div>

</template>
<style>
	@media print {
		html,
		body {
			-webkit-print-color-adjust: exact;
			height: inherit;
		}
	}
</style>
<script>
	import QRCode from 'qrcodejs2'
	import { getCommHttpData, getCommonDictByType, getExportFile, deleteData, compareDate } from '@/utils/common'

	export default {
		data() {
			return {
				leftOffset: 2,
				rightOffet: 1,
				schoolId: this.GLOBAL.getOrgId(),
				timelineType: ['info', 'primary', null],
				timelineColor: ['#cccccc', '#0bbd87', '#409eff'],
				active: 1,
				configList: null,
				listLoading: false,
				dataList: [],
				schoolType: '',
				scheduleId: '',
				type: '',
				stepList: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
				htmlTitle: '作息时间',
				timeHoursCount: 8,
				timeMinusCount: 20,
				isSchoolHours: true,
				dataForm: {
					schoolId: this.GLOBAL.getOrgId(),
					scheduleName: '',
					executionDate: '',
					schoolHours: '',
					remark: '',
					list: []
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
					}]
				},
				activities: [],
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				schoolSectionType: null,
				schoolSectionList: []
			}
		},
		mounted() {
			//			this.scheduleId = '598121690064486400'
			//			this.getTimeTableById(this.$route.query.id)
			this.getSchoolSectionList()
			window.addEventListener('resize', () => {
				this.getOffet()
			})
			this.getOffet()
			//this.getDataList()
		},
		methods: {
			//学段查询
			getSchoolSectionList() {
				let that = this
				getCommHttpData({
					url: 'eduManageSchedule/getSchoolSection',
					method: 'get',
					contentType: 1,
					data: {}
				}, function(data) {
					if(data && data.code == 0) {
						that.schoolSectionList = data.list
						that.schoolSectionType = that.$route.query.addType != undefined ? that.$route.query.addType : data.list[0].id
						that.getDataList()
					}
				})
			},
			getOffet() {
				if(window.innerWidth < 1400 && window.innerWidth > 1200) {
					this.leftOffset = 0
					this.rightOffet = 3
				} else if(window.innerWidth >= 1400) {
					this.leftOffset = 2
					this.rightOffet = 1
				} else {
					this.leftOffset = 0
					this.rightOffet = 0
				}
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if(row.status === 1) {
					return 'success-row';
				}
				return '';
			},
			//开始时间，步长，计算结束时间
			startTimeChange(index) {
				this.dataForm.list[index].endTime = this.dataForm.list[index].startTime + this.dataForm.list[index].hours
			},
			//分享
			shareHandle(command) {
				if(command == 1) {
					//QQ 
					let url = window.SITE_CONFIG.webIp + 'time-table-detail?id=' + this.scheduleId + '-' + this.schoolId
					let str = `connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.dataForm.scheduleName}&source=点击查看更多详情`
					window.open('http://' + str);
				} else {
					//二维码

					this.dialogFormVisible = true
					this.$nextTick(function() {
						document.getElementById("qrcode").innerHTML = "";
						let qrcode = new QRCode(this.$refs.qrCodeDiv, {
							text: window.SITE_CONFIG.webIp + 'time-table-detail?id=' + this.scheduleId + '&schoolId=' + this.schoolId, // 二维码内容  
							width: 150,
							height: 150, // 高度  [图片上传失败...(image-9ad77b-1525851843730)]
							// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）  
							colorDark: "#333333", //二维码颜色
							colorLight: "#ffffff", //二维码背景色
							correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H  
						})

					})
				}

			},
			printHandle() {
				this.$print(this.$refs.print)
			},
			deleteHandle() {
				let that = this
				if(this.type == 1) {
					return;
				}
				deleteData(this, {
					url: 'eduManageSchedule/delete',
					method: 'get',
					contentType: 1,
					operateType: 1,
					data: {
						scheduleId: this.scheduleId,
						type: this.type
					}
				}, function(data) {
					that.getDataList()
				})

			},
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if(row.status === 1) {
					return [1, 3];
				}
			},
			getTimeTableById(scheduleId, index) {
				let that = this
				this.scheduleId = scheduleId
				getCommHttpData({
					url: 'eduManageSchedule/queryById',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						scheduleId: scheduleId
					}
				}, function(data) {
					if(data && data.code == 0) {
						//that.listLoading = false

						//上午 开始时间 12点之前
						//下午 开始时间 12 18点之前
						//晚上 开始时间 18之后
						that.timeHoursCount = parseInt(parseInt(data.list.schoolHours) / 60)
						that.timeMinusCount = parseInt(data.list.schoolHours) % 60
						that.htmlTitle = data.list.scheduleName
						that.type = data.list.type
						that.dataForm = data.list

						that.dataForm.remark = that.dataForm.remark.replace(/\n/g, '<br />');

						let endTime1, startTime2, endTime2, startTime3, afterj = 0,
							moonj = 0;
						let list = data.list.list
						let afterIndex = 0,
							isAfter = false,
							tespMoon = 0,
							moonIndex = 0,
							isMoon = false
						for(let j = 0; j < list.length; j++) {
							if(compareDate('12:00', list[j].startTime)) {
								afterj = j
								endTime1 = list[j].endTime
							}
							if(compareDate(list[j].startTime, '11:59') && compareDate('18:00', list[j].startTime)) {
								if(afterIndex == 0) {
									startTime2 = list[j].startTime
								}
								endTime2 = list[j].endTime
								afterIndex++
								isAfter = true
							}
							if(compareDate('18:00', list[j].startTime)) {
								moonj = j

								endTime2 = list[j].endTime
								if(j + 1 < list.length - 1) {
									startTime3 = list[j + 1].startTime
								}

							}
							if(compareDate(list[j].startTime, '17:59')) {
								isMoon = true
							}
						}
						that.dataForm.list.splice(0, 0, {
							lessionCodeName: '上午',
							endTime: endTime1,
							startTime: that.dataForm.list[0].startTime,
							status: 1
						});
						if(isAfter) {
							that.dataForm.list.splice(afterj + 2, 0, {
								lessionCodeName: '下午',
								endTime: endTime2,
								startTime: startTime2,
								status: 1
							});
							tespMoon = 3
						} else {
							tespMoon = 2
						}
						if(isMoon) {
							if(moonj + tespMoon != that.dataForm.list.length) {
								that.dataForm.list.splice(moonj + tespMoon, 0, {
									lessionCodeName: '晚上',
									startTime: startTime3,
									endTime: that.dataForm.list[that.dataForm.list.length - 1].endTime,
									status: 1
								});
							}
						}

					} else {
						that.dataForm = {}
					}
				})
			},
			getDataList() {
				let that = this
				getCommHttpData({
					url: 'eduManageSchedule/queryList',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: this.schoolId,
						schoolSection: this.schoolSectionType
					}
				}, function(data) {
					if(data && data.code == 0) {
						if(data.list.length == 0) {
							//跳转到添加页面
							that.activities = []
							//that.$router.push({name:'edu-time-table',query:{type:0,stype:that.schoolSectionType}})
							return;
						}
						//that.listLoading = false
						let scheduleId, hasSchedle = true
						for(let i in data.list) {
							if(data.list[i].type == 1) {
								scheduleId = data.list[i].scheduleId
								hasSchedle = false
							}
						}
						if(hasSchedle) {
							if(data.list.length == 1) {
								scheduleId = data.list[0].scheduleId
							} else {
								let index = data.list.length - 1
								scheduleId = data.list[index].scheduleId
							}
							hasSchedle = false
						}
						that.getTimeTableById(scheduleId)
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

						getCommHttpData({
							url: 'eduManageSchedule/save',
							method: 'post',
							contentType: 2,
							operateType: 2,
							that: this,
							data: this.dataForm
						}, function(data) {
							//							that.dialogFormVisible = false
							that.addLoading = false
							that.getDataList();
						})
					}
				})
			},
			downLoadFile() {
				window.location.href = encodeURI(encodeURI(window.SITE_CONFIG.baseUrlMedia + 'eduManageSchedule/download?scheduleId=' + this.scheduleId));
			}

		}
	}
</script>