<template>
	<div class="mod-config" ref="monitor-top">
		<el-row :gutter="12" style="margin-bottom: 20px;">
			<el-col :span="6" st>
				<el-col>
					<div class="header-body">基础信息</div>
					<div class="content-body">
						<div class="margin-10">
							装备名称：{{equipInfo.equipName}}
						</div>
						<div class="margin-10">
							装备类型：{{equipInfo.deviceName}}
						</div>
						<div class="margin-10">
							状态：
							<span v-if="state == 1">开机</span>
							<span v-else size="small">关机</span>
						</div>
						<div class="margin-10">
							班级：{{equipInfo.gradeName}}{{equipInfo.className}}
						</div>
						<div class="margin-10">
							教室：{{equipInfo.classroomName}}
						</div>
						<div class="margin-10">
							MAC: {{equipInfo.mac}}
						</div>
						<div class="margin-10">
							IP: {{equipInfo.localIP}}
						</div>
					</div>
				</el-col>
				<el-col>
					<div class="header-body">配置信息</div>
					<div class="content-body">
						<div class="margin-10">
							系统：{{equipInfo.osVersion}}
						</div>
						<div class="margin-10">
							CPU：{{equipInfo.cpu}}
						</div>
						<div class="margin-10">
							内存：{{equipInfo.memory}}
						</div>
						<div class="margin-10">
							硬盘：{{equipInfo.diskSize}}
						</div>
						<div class="margin-10">
							品牌：{{equipInfo.brandName}}
						</div>
						<div class="margin-10">
							用途：{{equipInfo.equipUseName}}
						</div>
						<div class="margin-10">
							入库时间：{{equipInfo.createDate}}
						</div>
					</div>
				</el-col>
				<!--<el-col>
		  		<div class="header-body">安装应用</div>
		  		<div class="content-body">
		  			<div class="margin-10">
			  			<div class="app-content">安装应用</div>
			  			<div class="app-content">微信</div>
			  			<div class="app-content">excel</div>
			  			<div class="app-content">多媒体集控系统</div>
							<div class="app-content">ppt</div>
						</div>
		  		</div>
		    </el-col>-->
			</el-col>
			<el-col :span="18" class="relative-parrent">
				<el-tabs type="border-card" v-model="tabName">
					<el-tab-pane label="实时桌面" name="1">
						<video-player ref="videoPlayer" v-if="videoShow" class="vjs-custom-skin videoPlayer mointor-play" :options="playerOptions"></video-player>
						<div v-else style="height: 635px; text-align: center;">
							<img src="~@/assets/img/nodata2.png" width="300px" style="margin: 50px 0px 20px 0px;" />
							<div>设备处于关机状态</div>
						</div>
					</el-tab-pane>
					<el-tab-pane label="监控信息" name="2">
						<template v-if="state == 1">
							<el-col :span="domainSpan">
								<!--cpu使用率-->
								<iframe :src="iframeSrc1" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="domainSpan">
								<!--内存-->
								<iframe :src="iframeSrc2" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="domainSpan">
								<!--磁盘-->
								<iframe :src="iframeSrc3" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="domainSpan" v-if="iframeSrc8 !=''">
								<!--网络-->
								<iframe :src="iframeSrc8" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="12">
								<!--CPU总使用率-->
								<iframe :src="iframeSrc4" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="12">
								<!--内存使用量-->
								<iframe :src="iframeSrc5" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="24">
								<!--磁盘使用率-->
								<iframe :src="iframeSrc6" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
							<el-col :span="24" v-if="iframeSrc7 !=''">
								<!--网络流量-->
								<iframe :src="iframeSrc7" width="100%" height="400" frameborder="0"></iframe>
							</el-col>
						</template>

						<template v-else>
							<div style="height: 635px; text-align: center;">
								<img src="~@/assets/img/nodata2.png" width="300px" style="margin: 50px 0px 20px 0px;" />
								<div>设备处于关机状态，无法获取实时监控数据</div>
							</div>
						</template>

					</el-tab-pane>

					<!-- <el-tab-pane label="维修记录">维修记录
					  </el-tab-pane> -->
				</el-tabs>

				<div class="go-back" v-if="areaMark">
					<span class="el-icon-arrow-left" @click="goBack">返回</span>
				</div>
			</el-col>

		</el-row>

	</div>
</template>

<script>
	import { getCommHttpData, getCommonDictByType, getDomainType } from '@/utils/common'
	import { videoPlayer } from 'vue-video-player'
	import 'video.js/dist/video-js.css'
	import 'vue-video-player/src/custom-theme.css'
	import 'videojs-flash'
	// import 'videojs-contrib-hls'
	import { fail } from 'assert';
	export default {
		inject: ['reload'],
		data() {
			return {
				domainType: getDomainType(),
				domainSpan: getDomainType() == 1 ? 8 : 6,
				startTime: new Date().getTime() - 60 * 60 * 1000,
				endTime: new Date().getTime(),
				state: 1,
				mac: '',
				iframeSrc1: '',
				iframeSrc2: '',
				iframeSrc3: '',
				iframeSrc4: '',
				iframeSrc5: '',
				iframeSrc6: '',
				iframeSrc7: '',
				iframeSrc8: '',
				equipInfo: {
					startTime: '',
					endTime: '',
					equipName: '',
					deviceName: '',
					status: '',
					teacherName: '',
					resumeName: '',
					classroomName: '',
					mac: '',
					localIP: '',
					osVersion: '',
					cpu: '',
					memory: '',
					diskSize: '',
					brandNames: '',
					equipUseName: '',
					createDate: '',
				},
				areaMark: false,
				deptId: '',
				gradeId: '',
				schoolName: '',
				playerOptions: {
                    preload: 'auto',
                    // fluid: true,
                    height: 650,
					techOrder: ['flash','html5'],
					sources: [{
						src: '',
						type: 'rtmp/mp4'
					}],
					// poster: window.SITE_CONFIG.imgIP + 'M00/01/36/rBAACl1dIfyACzvDAANaYOSVs3k287.gif',
					autoplay: true,
					notSupportedMessage: '视频暂无法播放，请刷新重试',
					controlBar: {
						timeDivider: false,
						durationDisplay: false,
                        remainingTimeDisplay: false,
                        progressControl: false,
					}
				},
				tabName: '1',
			}
		},
		components: {
			videoPlayer
		},
		mounted() {
			this.state = this.$route.query.state
			this.$route.params.mark && (this.areaMark = true)
			this.$route.params.deptId && (this.deptId = this.$route.params.deptId)
			this.$route.params.gradeId && (this.gradeId = this.$route.params.gradeId)
			this.$route.params.schoolName && (this.schoolName = this.$route.params.schoolName)
			if(this.state) {
				let self = this
				this.getCommHttpData({
					url: 'nlg/push?equipId=' + this.$route.query.eId,
					method: 'get',
					contentType: 2
				}, res => {
					if(res.code === 0) {
						self.playerOptions.sources[0].src = res.url
					}
				})
			}
			this.getDataInfo()
			this.$refs.videoPlayer.initialize()
//			site-content
		},
		computed: {
			player() {
				return this.$refs.videoPlayer.player
			},
			videoShow() {
				if(this.state) return true
				return false
			}
		},
		watch: {
			tabName(n, o) {
				if(n == '2') {
				this.iframeSrc1=''
				  this.iframeSrc2=''
				  this.iframeSrc3=''
				  this.iframeSrc4=''
				  this.iframeSrc5=''
				  this.iframeSrc6=''
				  this.iframeSrc7=''
				  this.iframeSrc8=''
				  this.getDataInfo ()	
					this.$refs.videoPlayer.dispose()
				} else {
					this.$refs.videoPlayer.initialize()
				}
			}
		},
		methods: {
			// 获取数据列表
			getDataInfo() {
				var that = this
				var grafanaInfo = window.SITE_CONFIG.grafanaIp + '/d-solo/F_Kj_rBmk1111/telegraf-and-influx-windows-host-overview?';
				getCommHttpData({
					url: 'equip/list',
					method: 'post',
					contentType: 2,
					data: {
						equipId: this.$route.query.eId
					}
				}, function(data) {
					if(data && data.code === 0) {
						// getCommHttpData({url:'equip/turnOnByMac',method:'get',contentType:1,data:{mac: data.list[0].mac}},function(dataMac){
						// 	that.state = dataMac.status 
						// })
						getCommHttpData({
							url: 'equip/monitoring',
							method: 'post',
							contentType: 2,
							data: {
								equipId: that.$route.query.eId
							}
						}, res => {
							if(res.code == 0) {
								if(res.hibernateOnMac.length) {
									that.state = 0
								} else if(!res.hibernateOnMac.length && res.turnOnMac.length) {
									that.state = 1
								}
							} else {
								that.state = 0
							}
						})
						that.equipInfo = data.list[0]
						that.mac = data.list[0].mac

						if(data.list[0].deviceName == '电子班牌') {
							that.domainSpan = 8
							grafanaInfo = window.SITE_CONFIG.grafanaIp + '/d-solo/Pzy4oGNZk/linux-system-overview-adv?';
							that.iframeSrc1 = grafanaInfo + 'orgId=1&panelId=2&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc2 = grafanaInfo + 'orgId=1&panelId=12&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc3 = grafanaInfo + 'orgId=1&panelId=19&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc4 = grafanaInfo + 'orgId=1&panelId=4&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc5 = grafanaInfo + 'orgId=1&panelId=5&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc6 = grafanaInfo + 'orgId=1&panelId=13&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'

						} else {
							that.domainSpan = 6
							that.iframeSrc1 = grafanaInfo + 'orgId=1&panelId=4&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc2 = grafanaInfo + 'orgId=1&panelId=5&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc3 = grafanaInfo + 'orgId=1&panelId=52&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc4 = grafanaInfo + 'orgId=1&panelId=46&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc5 = grafanaInfo + 'orgId=1&panelId=48&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc6 = grafanaInfo + 'orgId=1&panelId=56&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc7 = grafanaInfo + 'orgId=1&panelId=25&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'
							that.iframeSrc8 = grafanaInfo + 'orgId=1&panelId=1&tab=axes&from=' + that.startTime + '&to=' + that.endTime + '&var-hostname=' + that.mac + '&var-disk=All&var-process=All&var-network=All&theme=light'

						}
						that.$nextTick( () => {  //图片列表栏始终左对齐
		                    that.$refs['monitor-top'].scroll(0,0)                 
		                })

					}
				})
			},

			goBack() {
				this.$router.push({
					name: 'a-media-area-monitor',
					query: {
						deptId: this.deptId,
						gradeId: this.gradeId,
						schoolName: this.schoolName
					}
				})
			},
		}
	}
</script>
<style lang="scss">
.margin-10 {
    margin: 20px;
}

.header-body {
    background-color: #f5f7fa;
    border: #e4e7ed 1px solid;
    border-bottom: none;
    padding: 10px 10px 10px 20px;
    font-weight: bold;
    margin: 0 !important;
}

.content-body {
    background-color: #FFFFFF;
    border: #e4e7ed 1px solid;
    margin-bottom: 10px;
}

.app-content {
    display: inline-block;
    padding: 10px;
}

.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
<style lang="scss" scoped>
.relative-parrent {
    position: relative;
}

.go-back {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
}

.go-back:hover {
    color: #3C85EE;
}

.mointor-play {
    /deep/ .vjs-big-play-button {
        display: none;
    }
}
</style>