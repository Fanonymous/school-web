<template>
	<!-- $t is vue-i18n global function to translate lang -->
	<div class="teachers_manage_edit">
		
		<el-tabs v-model="activeName">
			<el-tab-pane label="个人档案" name="first">
				<template>
					<el-card>
		
		
		<el-form ref="form" label-width="240px" :loading="dataListLoading">
			<el-row type="flex" class="row-bg">
				<el-col :span="24">
					<header class="header-body-manage">教职工个人基础信息</header>
				</el-col>
			</el-row>
			<el-row class="row-bg">
				<el-col :lg="8">
					<el-form-item label="姓名" prop="teacherName">
						{{form.teacherName}}
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<template slot-scope="scope">
							<span v-if="form.sex === 1" size="small">男</span>
							<span v-else size="small">女</span>
						</template>
					</el-form-item>
					<el-form-item label="民族">
						{{form.folkName || '--'}}
					</el-form-item>
					<el-form-item label="职称">
						{{form.professorName || '--'}}
					</el-form-item>
					<el-form-item label="出生地">
						{{form.birthPlace || '--'}}
					</el-form-item>
					<el-form-item label="微信">
						{{form.WeChat || '--'}}
					</el-form-item>

					<el-form-item label="身份证号">
						{{form.identityNum || '--'}}
					</el-form-item>
					<el-form-item label="联系电话">
						{{form.telPhone || '--'}}
					</el-form-item>
				</el-col>
				<el-col :lg="8">
					<el-form-item label="曾用名" prop="beforeName">
						{{form.beforeName || '--'}}
					</el-form-item>
					<el-form-item label="出生日期">
						{{form.birthday || '--'}}

					</el-form-item>
					<el-form-item label="政治面貌">
						{{form.politicsName || '--'}}

					</el-form-item>
					<el-form-item label="学历">
						{{form.degreeName || '--'}}

					</el-form-item>
					<el-form-item label="籍贯" style="padding-bottom: 5px;">
						{{form.nativePlace || '--'}}
					</el-form-item>
					<el-form-item label="QQ">
						{{form.QQ || '--'}}
					</el-form-item>

					<el-form-item label="邮箱">
						{{form.email || '--'}}
					</el-form-item>
					<el-form-item label="教籍号">
						{{form.teacherCode || '--'}}
					</el-form-item>
				</el-col>
				<el-col :lg="8" class="">
					<div style="text-align: center;">
						<img v-if="form.icon == null" src="~@/assets/img/pic_default.jpg" width="120px" height="auto" />
						<img v-else :src="imgUrl+form.icon" :onerror="errorGoodsImg" width="120px" height="auto" />
					</div>

				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="24">
					<header class="header-body-manage">工作基本信息</header>
				</el-col>
			</el-row>
			<el-row class="row-bg">
				<el-col :lg="8">
					<el-form-item label="教职工来源">
						{{form.teacherOriginName || '--'}}
					</el-form-item>
					<el-form-item label="是否在编">
						<template slot-scope="scope">
							<span v-if="form.isEditing === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="签订合同情况">
						{{form.contractState || '--'}}
					</el-form-item>
					<el-form-item label="教职工号">
						{{form.teacherCode || '--'}}
					</el-form-item>
				</el-col>
				<el-col :lg="12">
					<el-form-item label="教职工类别">
						{{form.teacherTypecodeName || '--'}}
					</el-form-item>
					<el-form-item label="用人形式">
						{{form.modality || '--'}}
					</el-form-item>
					<el-form-item label="进本校年月">
						{{form.enterDate || '--'}}
					</el-form-item>

				</el-col>
			</el-row>
			<el-row type="flex" class="row-bg">
				<el-col :span="24">
					<header class="header-body-manage">教职工个人辅助信息</header>
				</el-col>
			</el-row>
			<el-row class="row-bg">
				<el-col :lg="8">
					<el-form-item label="健康状况">
						{{form.healthName || '--'}}
					</el-form-item>
					<el-form-item label="是否全日制师范类专业毕业">
						<template slot-scope="scope">
							<span v-if="form.isFullTime === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="是否受过特教专业培养培训">
						<template slot-scope="scope">
							<span v-if="form.isSpecialTrain === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="信息技术能力">
						{{form.teacherCode || '--'}}
					</el-form-item>
					<el-form-item label="是否参加基层服务项目">
						<template slot-scope="scope">
							<span v-if="form.informationAbility === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="是否县级以上骨干教师">
						<template slot-scope="scope">
							<span v-if="form.isGrassRoots === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="是否特级教师">
						<template slot-scope="scope">
							<span v-if="form.isSuperfine === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
				</el-col>
				<el-col :lg="10">
					<el-form-item label="婚姻状况">
						{{form.marriage || '--'}}
					</el-form-item>
					<el-form-item label="进本校年月">
						{{form.enterDate || '--'}}
					</el-form-item>
					<el-form-item label="是否有特殊教育从业证书">
						<template slot-scope="scope">
							<span v-if="form.isSpecialCertificate === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="是否属于免费（公费）师范生">
						<template slot-scope="scope">
							<span v-if="form.isFreeTeacherTraining === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
					<el-form-item label="参加基层服务项目年月">
						{{form.grassRootsStartDate}}--{{form.grassRootsEndDate}}
					</el-form-item>
					<el-form-item label="是否心理健康教育教师">
						<template slot-scope="scope">
							<span v-if="form.isInformationHealth === 1" size="small">是</span>
							<span v-else size="small">否</span>
						</template>
					</el-form-item>
				</el-col>
			</el-row>

		</el-form>
		
		
					</el-card>
				</template>
			</el-tab-pane>
			<el-tab-pane label="变动记录" name="second">
				<template>
					<el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
						<el-table-column prop="id" header-align="center" align="center" width="80" label="序号">
							<template slot-scope="scope">
								{{scope.$index+1}}
							</template>
						</el-table-column>
						<el-table-column prop="tagName" header-align="center" align="center" label="变动类型">
						</el-table-column>
						<el-table-column prop="create_date" header-align="center" align="center" label="变动时间">
						</el-table-column>

						<el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
							<template slot-scope="scope">
								<el-button type="text" size="small" @click="">详情</el-button>
							</template>
						</el-table-column>
					</el-table>
					<!--<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
					</el-pagination>-->
				</template>
			</el-tab-pane>
		</el-tabs>
		
	</div>
</template>
<script>
	import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
	import { pca, pcaa } from 'area-data'; // v5 or higher
	export default {
		data() {
			return {
				schoolId: this.GLOBAL.getOrgId(),
				activeName: 'first',
				imgUrl: window.SITE_CONFIG.imgIP,
				errorGoodsImg: 'this.src="' + require('../../../assets/img/pic_default.jpg') + '";this.onerror = null',
				dataList: [],
				form: {

					schoolYearId: 86,
					termId: 2,
					degreeName:'',
					professorName:'',
					teacherName: '',
					identityNum: '',
					spellName: '',
					icon: '',
					beforeName: '',
					WeChat:'',
					QQ:'',
					sex: '1',
					folk: '',
					birthday: '',
					email: '',
					politics: '',
					nationality: '',
					nativePlace: '',
					telPhone: '',
					birthPlace: '',
					teacherOrigin: '',
					teacherTypecode: '',
					isEditing: '',
					modality: '',
					contractState: '',
					enterDate: '',
					teacherCode: '',
					health: 1,
					marriage: '',
					isFullTime: '1',
					workDate: '',
					grassRootsStartDate: '',
					grassRootsEndDate: '',
					isSpecialTrain: '1',
					isSpecialCertificate: '1',
					informationAbility: '1',
					isFreeTeacherTraining: '1',
					isGrassRoots: '1',
					isCounty: '1',
					isInformationHealth: '1',
					isSuperfine: '1'
				},
				dataListLoading: false

			}
		},
		mounted() {
			this.initData()
		},
		activated() {

		},
		methods: {
			initData() {
				let teacherId = this.$route.query.teacherId
				var that = this
				this.dataListLoading = true
				getCommHttpData({
					url: 'teacherManage/queryByTeacherId',
					method: 'get',
					contentType: 1,
					data: {
						teacherId: teacherId
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.form = data.list
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.dataListLoading = false
				})
				this.queryChange()
			},
			
			queryChange(){
				var that = this
				let teacherId = this.$route.query.teacherId
				getCommHttpData({
					url: 'teacherManage/queryChange',
					method: 'get',
					contentType: 1,
					data: {
						teacherId: teacherId
					}
				}, function(data) {
					if(data && data.code === 0) {
						that.dataList = data.list
					} else {
						that.dataList = []
						that.totalPage = 0
					}
					that.dataListLoading = false
				})
			}
		}
	}
</script>
<style>
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #ffffff;
		margin-bottom: 10px;
	}
	
	.panel-heading {
		font-size: 15px;
		font-weight: 600;
		color: #797979;
		border-left: 6px #3C85EE solid;
		padding: 5px 15px;
		border-top-right-radius: 0px;
		border-top-left-radius: 0px;
	}
</style>