<template>
	<div class="mod-config">
		
		<el-form class="form-bottom-10 clear-float" :inline="true" :model="dataSearch" @keyup.enter.native="getStaticsData()">
			<el-form-item v-if="domainType != 1">
				<el-select v-model="dataSearch.deviceId" clearable placeholder="请选择设备类型" @change="getStaticsData" class="adapt-width">
					<el-option v-for="item in typeList" :key="item.deviceId" :label="item.deviceName" :value="item.deviceId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="dataSearch.bootupState" clearable placeholder="请选择设备状态" @change="getStaticsData" class="adapt-width">
					<el-option v-for="item in bootupStateList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="dataSearch.gradeId" clearable placeholder="请选择年级" @change="getStaticsData" class="adapt-width">
					<el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataSearch.keywords" placeholder="请输入设备名称" clearable suffix-icon="el-icon-search" class="adapt-width"></el-input>
			</el-form-item>
			<el-form-item style="float: right;">
				<el-dropdown @command="shareHandle" style="top: 1px;">
					<el-button type="primary">
						操作<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="1">全部短时关机</el-dropdown-item>
						<el-dropdown-item command="2">全部关机</el-dropdown-item>
						<el-dropdown-item command="3">全部开机</el-dropdown-item>
						<el-dropdown-item command="4">全部重启</el-dropdown-item>
						<el-dropdown-item command="5">批量设置</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-radio-group v-model="checkboxGroup1" @change="radioChange">
					<el-radio-button label="卡片" key="0"></el-radio-button>
					<el-radio-button label="列表" key="1"></el-radio-button>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<el-row :gutter="12 " class="margin-bottom-10">
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
        
		<el-row v-loading="dataListLoading" v-if="imgListVisible" :gutter="12" style="margin-bottom: 20px;">
			<el-col :span="6" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 10px;">
				<el-card :body-style="{ padding: '0px' }" class="equip-cont" shadow="hover">
                    <!-- 开机和有图片地址 -->
					<template v-if="item.equipImgPath != null && item.switchState">
                    <!-- <img v-lazy="imgUrl+item.equipImgPath" :key="imgUrl+item.equipImgPath" class="image" > -->
						<img v-if="item.deviceName == '电子班牌'" v-buffer-img:2="imgUrl+item.equipImgPath" :src="allBanPic" class="image" />
                        <img v-else v-buffer-img:1="imgUrl+item.equipImgPath" :src="allPic" class="image" />
					</template>

                    <!-- 没有图片或开机 -->
					<template v-else>
                        <template v-if="item.deviceName == '电子班牌'" >
                            <img v-if="item.switchState" src="~@/assets/img/on-1.png" class="image">
                            <img v-else src="~@/assets/img/off-1.png" class="image">
                        </template>
                        <template v-else>
                            <img v-if="item.switchState"  src="~@/assets/img/on.png" class="image">
                            <img v-else src="~@/assets/img/off.png" class="image">
                        </template>
					</template>

					<div class="equip-btn-group">
						<div class="setting" @click="batchHandle(2,item.mac,item.deviceName,item.gradeName,item.className)">
							<span>设置</span>
						</div>
						<div class="restart" @click="shutDownHandle(2, item.mac)" v-if="item.switchState == 1">
							<span>重启</span>
							<span class="iconfont iconzhongqi"></span>
						</div>
						<div v-if="item.switchState == 1 && item.deviceName =='电子班牌'">
							<el-button type="success" size="mini" @click="handleHibernate(1, [item.mac])" style="width: 200px;margin-bottom: 15px;">短时关机</el-button>
						</div>
						<div>
							<el-button type="danger" size="mini" @click="shutDownHandle(1, item.mac, index)" v-if="item.switchState == 1" style="width: 200px;margin-bottom: 15px;">关 机</el-button>
						</div>
						<div v-if="item.switchHiber && item.deviceName =='电子班牌'">
							<el-button type="danger" size="mini" @click="handleHibernate(2, [item.mac])" style="width: 200px;margin-bottom: 15px;">开机</el-button>
						</div>
						<div>
							<el-button type="primary" size="mini" @click="basicLink(item.equipId,item.switchState)" style="width: 200px;margin-bottom: 15px;">详情</el-button>
						</div>
					</div>
					<div class="setTime" v-if="(setTime&&tapNum==index)||item.setAll==3">
						<span class="timeTop">{{offtime}}s</span></br>
						<span class="timeBottom">关机倒计时</span>
					</div>

					<div class="bottom clearfix monitor-mess" style="margin-bottom: 10px;">
						<el-col :span="24" style="text-align: center;">
							<div class="monitor-gclass" v-if="item.gradeName || item.className">{{item.gradeName}}{{item.className}}</div>
							<div class="monitor-gclass" v-else>{{item.classroomName || item.mac || item.equipmentMAC}} </div>
							<el-col :span="12" class="monitor-remark" style="text-align: left;">{{item.deviceName | textFilter(6)}}</el-col>
							<el-col :span="12" class="monitor-remark" style="text-align: right;"><span>班主任：<span v-if="item.teacherName != null">{{item.teacherName | textFilter(5)}}</span><span v-else>--</span></span>
							</el-col>
						</el-col>
					</div>
					<div class="health-mess">
						<div class="progress-bar-box" v-if="item.switchState == 1">
							<div class="progress-bar" :style="{'width' : item.health / 2 + 'px'}" :class="{'excellent' : item.health >= 70, 'good' : item.health < 70 && item.health >= 30, 'poor' : item.health < 30}"></div>
						</div>
						<div class="close-computer">
							<span v-if="item.switchState == 1 && !item.switchHiber" :class="{'excellent' : item.health >= 70, 'good' : item.health < 70 && item.health >= 30, 'poor' : item.health < 30}" style="background-color:#fff;">{{item.healthName}}</span>
							<span v-if="item.switchState == 1 && !item.switchHiber">开机</span>
							<span v-else-if="item.switchHiber && item.deviceName =='电子班牌'">短时关机</span>
							<span v-else style="color:#C0C4CC;">关机</span>
						</div>
					</div>
				</el-card>
			</el-col>

			<el-col :span="24" v-if="dataList.length ==0" style="height: 280px;">
				<el-card style="width:100%;height: 100%;">
					<img src="~@/assets/img/nodata.png" class="image" style="width:180px;display:block;margin: 40px auto;">
				</el-card>
			</el-col>
		</el-row>

		<el-table v-if="tableListVisible" :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
			<el-table-column type="selection" header-align="center" :selectable="checkSelectable" align="center" width="50">
			</el-table-column>
			<el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
				<template slot-scope="scope">
					{{scope.$index+1+pageSize*(pageIndex-1)}}
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="设备名称">
				<template slot-scope="scope">
					<el-button type="text" @click="basicLink(scope.row.equipId,scope.row.switchState)">{{scope.row.equipName}}</el-button>
					<!-- <a href="#" >{{scope.row.equipName}}</a> -->
				</template>
			</el-table-column>

			<el-table-column prop="deviceName" header-align="center" align="center" label="设备类型">
			</el-table-column>
			<el-table-column header-align="center" align="center" label="所属班级">
				<template slot-scope="scope">
					<label v-if="scope.row.className ==''"></label>
					<label v-else>{{scope.row.gradeName}}{{scope.row.className}}</label>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="班主任">
				<template slot-scope="scope">
					<label v-if="scope.row.teacherName">{{scope.row.teacherName}}</label>
					<label v-else>--</label>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="设备状态">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.switchState == 1" size="small">开机</el-tag>
					<el-tag v-else size="small" type="danger">关机</el-tag>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="center" label="健康度">
				<template slot-scope="scope">
					<span v-if="scope.row.switchState == 1">{{scope.row.healthName}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="runTime" header-align="center" align="center" label="开机时长">
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[8, 16, 24, 40, 80]" 
            :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
		
        
        <!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getStaticsData"></add-or-update>
		<batch-setting :gradeList="gradeList" v-if="isBatchVisible" ref="batchSet"></batch-setting>
	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getDomainType } from '@/utils/common'
	import AddOrUpdate from './config-add-or-update'
	import allPic from '@/assets/img/on.png'
    import allBanPic from '@/assets/img/on-1.png'
	import { setInterval, clearInterval } from 'timers';
	import batchSetting from './batch-set';
	export default {
		data() {
			return {
				imgUrl: window.SITE_CONFIG.imgIP,
				allPic: allPic,
                allBanPic:allBanPic,
				domainType: getDomainType(),
				sumNum: 0,
				moveNum: 0,
				cardNum: 0,
				equipeNum: 0,
				onLineNum: 0,
				healthNum: 0,
				turnOnTime: 0,
				onLineRate: 0,
				anomalyNum: 0,
				avgTime: 0,
				offtime: '',
				tapNum: 0,
				setTime: false,
				timer: null,
				turnOnMac: [],
				hibernateOnMac: [],
				typeList: [],
				bootupStateList: [],

				imgListVisible: true,
				tableListVisible: false,
				currentDate: new Date(),
				dataSearch: {
					deviceId: undefined,
					bootupState: undefined,
					keywords: undefined,
					gradeId: undefined
				},
				checkboxGroup1: '卡片',
				dataList: [],
				pageIndex: 1,
				pageSize: 8,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				isBatchVisible: false,
				websock: '',
				cardTotal: [],
				cardTypeList: [],
				typePage: 0,
				cardTypeAllList: [],
				gradeList: [],

			}
		},
		watch: {
			'dataSearch.keywords' (n) {
				this.getStaticsData()
			}
		},
		components: {
			AddOrUpdate,
			batchSetting
		},
		filters: {
			textFilter(item, len) {
				if(item.length > len) {
					item = item.substr(0, len) + '..'
				}
				return item
			},
		},
		mounted() {
			getCommonDictByType(this, 'bootup_state', 'bootupStateList')
			var that = this
			getCommHttpData({
				url: '/device/findTypeList',
				data: {},
				method: 'post',
				contentType: 2
			}, function(data) {
				if(data && data.code === 0) {
					that.typeList = data.list
				}
			})
			getCommHttpData({
				url: 'common/queryGradeList',
				method: 'get',
				contentType: 1,
				data: {}
			}, function(data) {
				if(data && data.code === 0) {
					that.gradeList = data.list
				}
			})
			this.getStaticsData()
			let topTimer = setInterval(_ => {
				this.cardTypeList = this.cardTotal.slice(0, 2)
				this.cardTotal.push(...this.cardTotal.splice(0, 2))
			}, 5000)
			let dataTimer = setInterval(_ => {
				this.getStaticsData()
			}, 60000)
			this.$once('hook:beforeDestroy', _ => {
				clearInterval(topTimer)
				clearInterval(dataTimer)
			})
		},
		methods: {
			shareHandle(command) {
				if(command == 1) {

					if(this.turnOnMac && this.turnOnMac.length > 0) {
						this.handleHibernate(1, this.turnOnMac)
					} else {
						this.$message({
							message: '暂无可休眠设备',
							type: 'error'
						})
					}
				} else if(command == 2) {
					this.closeAll(1)
				} else if(command == 3) {
					if(this.hibernateOnMac && this.hibernateOnMac.length > 0) {
						this.handleHibernate(2, this.hibernateOnMac)
					} else {
						this.$message({
							message: '暂无可开机设备',
							type: 'error'
						})
					}
				} else if(command == 4) {
					this.closeAll(2)
				} else if(command == 5) {
					this.batchHandle(1)
				}
			},
			//批量设置定时开关机
			batchHandle(type, mac, name1, name2, name3) {
				this.isBatchVisible = true
				this.$nextTick(() => {
					if(type == 1) {
						this.$refs.batchSet.init()
					} else {
						this.$refs.batchSet.init(mac, name1, name2, name3)
					}
				})
            },
            

			getStaticsData() {
				let that = this;
				getCommHttpData({
					url: 'equip/monitoring',
					method: 'post',
					contentType: 2,
					data: {
						deviceId: this.dataSearch.deviceId,
						equipName: this.dataSearch.keywords,
						bootupState: this.dataSearch.bootupState,
						domainType: this.domainType,
						gradeId: this.dataSearch.gradeId
					},
				}, function(data) {
					that.cardTotal = data.list
					that.cardTypeList = data.list.slice(0, 2)
					//在线
					that.turnOnMac = data.turnOnMac
					//息屏
					that.hibernateOnMac = data.hibernateOnMac
					that.getDataList()
				})
            },
            
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true
				this.dataSearch.keywords = this.dataSearch.keywords == '' ? undefined : this.dataSearch.keywords;
				this.dataSearch.deviceId = this.dataSearch.deviceId == '' ? undefined : this.dataSearch.deviceId;
				this.dataSearch.bootupState = this.dataSearch.bootupState == '' ? undefined : this.dataSearch.bootupState;
				this.dataSearch.gradeId = this.dataSearch.gradeId == '' ? undefined : this.dataSearch.gradeId;

				let turnOnMac = this.turnOnMac
				this.$http({
					url: this.$http.adornUrlMedia('/equip/list'),
					method: 'post',
					data: this.$http.adornParams({
						page: this.pageIndex,
						limit: this.pageSize,
						deviceId: this.dataSearch.deviceId,
						equipName: this.dataSearch.keywords,
						bootupState: this.dataSearch.bootupState,
						turnOnMac: turnOnMac,
						domainType: this.domainType,
						gradeId: this.dataSearch.gradeId
					})
				}).then(({ data }) => {
					if(data && data.code === 0) {

						this.dataList = data.page.list
						for(let i in this.dataList) {
							let isEMac = false
							for(let j in this.turnOnMac) {
								if(this.dataList[i].mac === this.turnOnMac[j]) {
									isEMac = true;
								}
							}
							let isHiber = false
							for(let k in this.hibernateOnMac) {
								if(this.dataList[i].mac === this.hibernateOnMac[k]) {
									isHiber = true
								}
							}
							this.dataList[i].switchHiber = isHiber
							if(isEMac) {
								this.dataList[i].switchState = isEMac
							}
						}
						this.totalPage = data.page.totalCount
					} else {
						this.dataList = []
						this.totalPage = 0
					}
					this.dataListLoading = false
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			//禁选
			checkSelectable(row) {
				return row.switchState
			},

			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(id)
				})
			},
			basicLink(id, switchState) {
				this.$router.push({
					name: 'monitor-basicinfo',
					params: {
						id: id
					},
					query: {
						eId: id,
                        state: switchState,
					}
				})
			},
			radioChange(value) {
				if(value == '列表') {
					this.imgListVisible = false;
					this.tableListVisible = true;
				} else {
					this.imgListVisible = true;
					this.tableListVisible = false;
				}
			},
			btnGroupChange() {

			},
			shutDownHandle(type, mac, num) {
        this.tapNum = num;
				this.dataListSelections = [{
					mac: mac
				}]
				this.shutDown(type)
			},
			handleHibernate(type, macs) {
				let that = this
				let content = type == 1 ? '您好，所选设备即将短时关机！<br/>短时关机后，您可通过【开机】一键唤起。' : '您好，所选设备即将开机！<br/>可开启短时关机状态的设备。'
				let title = type == 1 ? '短时关机' : '开机'
				this.$confirm(content, title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
          			dangerouslyUseHTMLString: true,
					type: 'warning'
				}).then(() => {
					getCommHttpData({
						url: 'equip/hibernate',
						method: 'post',
						contentType: 2,
						operateType: 2,
						data: {
							type: type,
							macList: macs
						}
					}, function(data) {
						if(data && data.code === 0) {
//							that.getDataList()
							that.getStaticsData();
						}
					})
				}).catch(() => {});

			},
			closeAll(type) {
        this.tapNum = '';
				let num = 0
				if(this.checkboxGroup1 == '列表') {
					num = 2
				} else {
					this.dataListSelections = []
					this.dataList.forEach(item => {
						if(item.switchState) {
							this.dataListSelections.push(item)
						}
					})
				}
				this.shutDown(type, num)
			},

			shutDown(type, num) {
				if(this.dataListSelections.length == 0) {
					this.$message({
						message: '请选择一台或多台设备',
						type: 'error'
					})
					return;
				}
				var that = this
				let title = type == 1 ? '关机' : '重启';
				let content = type == 1 ? '您好，所选设备即将关机！<br/>关机后，设备会在设定的正常开机时间自动开机。' : '您好，所选设备即将重启!'
				this.$confirm(content, title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
					type: 'warning'
				}).then(() => {

          let diamaCmd = ''
  // alert(that.tapNum)
          if(type == 1) {
            if(num == 2) {
              for(let i in that.dataListSelections) {
                for(let j in that.dataList) {
                  if(that.dataListSelections[i].mac == that.dataList[j].mac) {
             if(that.tapNum.length == 0){
               that.dataList[j]["setAll"] = 3
             }

								}
							}
						}
						//定时器
						that.offtime = 10;
						let timer = null;
						if(!timer) {
							timer = setInterval(() => {
								if(that.offtime > 0) {
									that.offtime--;
								} else {
									that.getStaticsData();
//									that.getDataList()
									clearInterval(timer); // 清除定时器
									timer = null;
								}
							}, 1500)
						}
						//关机
						diamaCmd = 'SHUTDOWN'
					} else {
						//关机
						that.turnOnMac.forEach(item => {
							that.dataList.forEach((dItem, index) => {
								if(item == dItem.mac) {
                  if(that.tapNum.length == 0){
                    dItem.setAll = 3
                  }

								}
							})
						})
						diamaCmd = 'SHUTDOWN'
						//定时器
						that.offtime = 10;
						if(!that.timer) {
							that.setTime = true;
							that.timer = setInterval(() => {
								if(that.offtime > 0) {
									that.offtime--;
								} else {
									that.getStaticsData();
//									that.getDataList();
									that.setTime = false;
									clearInterval(this.timer); // 清除定时器
									that.timer = null;
								}
							}, 1500)
						}
					}
				} else {
					//重启
					diamaCmd = 'REBOOT'
				}

          let equipList = that.dataListSelections
          let macArr = []
          for(var i = 0; i < equipList.length; i++) {
            macArr.push({
              receiveUserId: equipList[i].mac,
              receiveUserName: equipList[i].mac
            })
          }
          let cmd, typeName
          if(diamaCmd == 'REBOOT') {
            //重启
            cmd = 101
            typeName = '设备重启'
          } else {
            //关机
            cmd = 102
            typeName = '设备关机'
          }



					getCommHttpData({
						url: 'message/send',
						method: 'post',
						contentType: 2,
						that: this,
						operateType: 2,
						data: {
							title: typeName,
							receiveUsers: macArr,
							classAndGradeLists: [],
							attachmentFiles: [],
							deptIds: [],
							sendUserId: this.GLOBAL.getUserId(),
							sendUserTypes: [],
							type: cmd,
							typeName: typeName,
							isTask: 0,
							sendTime: '',
							content: JSON.stringify({
								diama_cmd: diamaCmd,
								diama_datetime: '201903181835'
							}),
						}
					}, function(data) {
						if(data && data.code == 0) {
							that.getStaticsData();
//							that.getDataList()
						}
					})
				}).catch(() => {
					clearInterval(that.timer);
					that.setTime = false;
					that.timer = null;
					that.dataList.forEach((dItem) => {
						dItem.setAll = 0
					})
				});

			},
		}
	}
</script>
<style lang="scss" scoped>
.equip-cont {
    position: relative;
    cursor: pointer;
    .health-mess {
        position: absolute;
        top: 10px;
        right: 10px;
        & div {
            display: inline-block;
        }
        .close-computer {
            vertical-align: top;
            font-size: 12px;
        }
    }
    img {
        width: 60%;
    }
}

.equip-btn-group {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .restart {
        color: #fff;
        position: absolute;
        right: 45px;
        top: 5px;
        padding: 5px;
        border-radius: 4px;
    }
    .setting {
        color: #fff;
        position: absolute;
        right: 5px;
        top: 7px;
        padding: 5px;
        border-radius: 4px;
    }
}

.equip-cont .equip-btn-group {
    display: none;
}

.equip-cont:hover .equip-btn-group {
    display: flex;
}

.contip {
    height: 75px;
}

.tip {
    font-size: 16px;
    color: #9a999a
}

.rank {
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 5px;
    font-size: 18px;
    position: relative;
}

.theD {
    /* width:50%;*/
    position: absolute;
    left: 45%;
}

.theC {
    /*width:20%;*/
    position: absolute;
    left: 65%;
}

.theB {
    position: absolute;
    left: 80%;
}

.theA {
    position: absolute;
    left: 95%;
}

.setTime {
    background: rgba(60, 133, 238, 0.7);
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    z-index: 99;
    text-align: center;
    padding-top: 20%;
    font-size: 16px;
    color: white;
    opacity: 0.9;
}

.setTime .timeTop {
    font-size: 40px;
    font-weight: 600;
}

.setTime .timeBottom {
    display: inline-block;
    font-weight: 500;
    margin-top: 20px;
    font-size: 18px;
}

.monitor-gclass {
    font-size: 15px;
    font-weight: bold;
}

.monitor-remark {
    color: #666666;
}
.image {
    margin: 30px 0px 20px 20%;
}

.icon-size {
    font-size: 45px;
}

.current-preset {
    padding-left: 20px;
}

.kpi-text {
    margin: 15px 0px 10px 0px;
    font-size: 20px;
}

.monitor-mess {
    div {
        text-align: center;
        padding-bottom: 10px;
    }
}

.progress-bar-box {
    width: 50px;
    height: 10px;
    background-color: #e3e5e8;
    border-radius: 4px;
    .progress-bar {
        height: 100%;
        border-radius: 4px;
        vertical-align: super;
    }
}

.excellent {
    background-color: #3ca3fb;
    color: #3ca3fb !important;
}

.good {
    background-color: #40e346;
    color: #40e346;
}

.poor {
    background-color: #e13e3e;
    color: #e13e3e;
}

.no-mess {
    line-height: 80px;
    color: #C0C4CC;
}

.top-box {
    display: flex;
}

.top-item {
    flex-grow: 1;
}
.clear-float::after{
    content: "";
    clear: both;
    display: block;
}
@media screen and (max-width: 1500px) {
    .adapt-width{
        width: 150px;
    }
    .monitor-remark {
    color: #666666;
    max-width: 114px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
}
</style>
