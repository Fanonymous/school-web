<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="app-container">
		<el-card  shadow="hover"  style="width:700px;position: absolute;margin:auto;top: 0; left: 0;right: 0; ">
			<!--<el-row :gutter="12" >
				<el-col :span="22" :offset="1">-->
				<template v-if="dataForm.list.length >0">
					<div  class="margin-bottom-20" style="text-align:right;">
						<!--<el-dropdown @command="shareHandle" style="margin-right: 10px;">
							<el-button type="primary" size="mini">
								分享<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="1">QQ</el-dropdown-item>
								<el-dropdown-item command="2">二维码</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>-->
						<el-button type="primary" size="mini" @click="shareHandle(2)">分享二维码</el-button>
						<!--<el-button type="primary" size="mini" @click="getPdf()">{{$t('table.downLoad')}}</el-button>-->
						<!--<el-button type="primary" size="mini" v-print="'#printContent'">打印</el-button>-->
					</div>
					<el-form ref="dataForm" class="time-table-look" id="printContent"  :model="dataForm" label-position="right">
						<el-form-item>
							<div class="schedule-title">{{dataForm.scheduleName}}</div>
						</el-form-item>
						<el-form-item>
							
							<table id="share-table" width="100%" cellspacing="0" style="text-align: center;">
						      <tbody>
						        <template v-for="(item,index) in dataForm.list">
						          <tr v-if="item.status == 1">
						            <!-- -->
						            <td  colspan="4" style="background-color: #9cdfd8;font-size: 16px;">
										<i class="el-icon-sunrise" v-if="item.lessionCodeName.indexOf('上午') >-1"></i>
										<i class="el-icon-sunny" v-if="item.lessionCodeName.indexOf('下午') >-1"></i>
										<i class="el-icon-moon" v-if="item.lessionCodeName.indexOf('晚上') >-1"></i>
										<template >{{item.lessionCodeName}}（{{item.startTime}} - {{item.endTime}}）</template>
										
						            </td>
						          </tr >
						          <tr v-if="item.status == 2">
						            <td>
										<span class="schedule-lession">{{item.lessionCodeName}}</span>
						            </td>
						            <td >{{item.startTime}}<template v-if="item.hours != 0"> -- {{item.endTime}}</template></td>
						            <td ><template v-if="item.hours != 0">{{item.hours}}分钟</template>
                          <template v-else>--</template>
                        </td>
						          </tr>
						        </template>
						      </tbody>
						   </table>
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
					</template>
					<div v-else align="center">
						<img class="margin-20" src="~@/assets/img/nodata2.png" width="300px" />
						<div class="margin-20">啊哦~ 您访问的作息时间表丢失啦~</div>
					</div>
				<!--</el-col>
				
			</el-row>-->
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
	#share-table tr{height: 45px;}
	#share-table td{border:1px solid #EBEEF5}
</style>
<script>
//	import html2Canvas from 'html2canvas'
	import QRCode from 'qrcodejs2'
	import { getCommHttpData,compareDate} from '@/utils/common'
	export default {
		data() {
			return {
				listLoading: false,
				dialogFormVisible:false,
				htmlTitle: '作息时间',
				dataForm: {
					schoolId: this.GLOBAL.getOrgId(),
					scheduleName: '',
					executionDate: '',
					schoolHours: '',
					remark: '',
					list: []
				},
				rules: {
					scheduleName: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}]
				},
			}
		},
		mounted() {
			this.getTimeTableById()
		},
		methods: {
			//分享
			shareHandle(command) {
				if(command == 1) {
					//QQ 
					let url = window.SITE_CONFIG.webIp+'time-table-detail?id='+this.scheduleId+'&schoolId='+this.schoolId
					let str = `connect.qq.com/widget/shareqq/index.html?url=${url}&title=${this.dataForm.scheduleName}&source=点击查看更多详情`
					window.open('http://' + str);
				} else {
					//二维码
					this.dialogFormVisible = true
					let str = this.$route.query.id
					let id = str.split('-')
					this.$nextTick(function() {
						document.getElementById("qrcode").innerHTML = "";
						let qrcode = new QRCode(this.$refs.qrCodeDiv, {
							text:  window.SITE_CONFIG.webIp+'time-table-detail?id='+id[0]+'&schoolId='+id[1], // 二维码内容  
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
			tableRowClassName({
				row,
				rowIndex
			}) {
				if(row.status === 1) {
					return 'success-row';
				}
				return '';
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
			getTimeTableById() {
				let that = this
				
				let str = this.$route.query.id
				let id = str.split('-')
				getCommHttpData({
					url: 'eduManageSchedule/queryById',
					method: 'post',
					contentType: 2,
					data: {
						schoolId: id[1],
						scheduleId:id[0]
					}
				}, function(data) {
					if(data && data.code == 0) {
						//that.listLoading = false
						that.htmlTitle =  data.list.scheduleName
						that.dataForm = data.list
						that.dataForm.remark = that.dataForm.remark.replace(/\n/g, '<br />');
						let endTime1,startTime2,endTime2,startTime3,afterj=0,moonj=0;
						let list = data.list.list
            let afterIndex = 0,isAfter=false,tespMoon=0,moonIndex = 0,isMoon=false
						for(let j= 0;j<list.length;j++){
							if(compareDate('12:00',list[j].startTime)){
								afterj = j
								endTime1 = list[j].endTime
								startTime2 = list[j+1].startTime
							}
							if(compareDate(list[j].startTime,'11:59') && compareDate('18:00',list[j].startTime)){
							  if(afterIndex ==0){
							    startTime2 =list[j].startTime
							  }
							  endTime2 = list[j].endTime
							  afterIndex++
							  isAfter = true
							}
							if(compareDate('18:00',list[j].startTime)){
								moonj=j
								
								endTime2 = list[j].endTime
								if(j+1<list.length-1){
									startTime3 = list[j+1].startTime
								}
							}
							if(compareDate(list[j].startTime,'17:59')){
							  isMoon=true
							}
						}

						that.dataForm.list.splice(0, 0, {lessionCodeName:'上午',endTime:endTime1,startTime:that.dataForm.list[0].startTime,status: 1});
						if(isAfter){
						  that.dataForm.list.splice(afterj+2, 0, {lessionCodeName:'下午',endTime:endTime2,startTime:startTime2,status: 1});
						  tespMoon = 3
						}else{
						  tespMoon = 2
						}
						if(isMoon){
						  if(moonj+tespMoon != that.dataForm.list.length){
						  	that.dataForm.list.splice(moonj+tespMoon, 0, {lessionCodeName:'晚上',startTime:startTime3,endTime:that.dataForm.list[that.dataForm.list.length-1].endTime,status: 1});
						  }
						}
					} else {
						that.dataForm = {}
					}
				})
			},

		}
	}
</script>