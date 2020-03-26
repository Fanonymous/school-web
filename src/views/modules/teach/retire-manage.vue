<template>
	<div class="teachers_manage_retire">
		<el-card class="blue-shadow">
			<div class="search--head">
			    <div class="head--left">
			        <!-- <span style="padding: 0 10px 0 5px;">时间</span>
			        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="入职时间" end-placeholder="退休时间" value-format="yyyy-MM-dd"></el-date-picker>     
			        <el-select v-model="theType" clearable placeholder="请选择退休类型">
			            <el-option v-for="item in retireTypeList" :key="item.value" :label="item.dictName" :value="item.value"></el-option>
			        </el-select> -->
			        <el-input v-model="msg" style="width:300px" placeholder="姓名/手机号/身份证号/邮箱/教籍号"></el-input>
			    </div>
			    
			    <el-button type="primary" @click="$router.push({ name:'teach-retire-data' })" >添加</el-button>
			</div>
			
			<el-table ref="singleTable" :data="dataList" fit border v-loading="listLoading" element-loading-text="拼命加载中" highlight-current-row style="width:100%;margin-top:10px">
				<el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
				<el-table-column property="teacherName" label="姓名" align="center"></el-table-column>
			    <el-table-column property="telPhone" label="手机号码" align="center"></el-table-column>
			    <el-table-column property="email" label="邮箱" align="center"></el-table-column>
				<el-table-column property="identityNum" label="身份证号" align="center"></el-table-column>
				<el-table-column property="teacherNum" label="教籍号" align="center"></el-table-column>
				<el-table-column property="sex" label="性别" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.sex == 0" size="small">男</span>
						<span v-if="scope.row.sex == 1" size="small" type="danger">女</span>
					</template>
				</el-table-column>
				<el-table-column property="retireTypeName" label="退休类型" align="center"></el-table-column>
				<el-table-column property="endDate" label="退休时间" align="center"></el-table-column>
			    <el-table-column type="expand" width="1">
			        <template slot-scope="scope">
			            <div class="expand--row--wrapper">
			                <div>
			                    <span>备注：</span>
			                    <span>{{scope.row.remark || '/'}}</span>
			                </div>
			                <div>
			                    <span>附件：</span>
			                    <span class="link--type" @click="downloadFile(scope.row.appendixPath)">{{scope.row.appendixPath || '/'}}</span>
			                </div>
			            </div>
			        </template>
			    </el-table-column>
				<el-table-column fixed="right" label="操作" align="center">
					<template slot-scope="scope">
			            <el-button @click="goChange(scope.row, 0)" type="text" size="small">详情</el-button>
						<el-button @click="goChange(scope.row, 1)" type="text" size="small">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="this.totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
	
	</div>
</template>

<script>
import { getCommHttpData, getCommonDictByType, deleteData } from '@/utils/common'
import { setTimeout, clearTimeout } from 'timers';
export default {
    data() {
        return {
            baseIp: window.SITE_CONFIG.imgIP,
            schoolId: this.GLOBAL.getOrgId(),
            dateRange : "",
            retireTypeList: [],
            dataList: [],
            msg : '',
            theType : '',
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            loading: false,
            listLoading : false
        }
    },
    watch : {
        // dateRange(n) {
        //     this.getDataList() 
        // },
        msg(n) {
            let self = this
            let timer = setTimeout(_ => {
                clearTimeout(timer)
                timer = null
                self.getDataList()
            }, 300)
        },
        // theType(n) {
        //     this.getDataList()
        // }
    },
    mounted() {
        this.getCommonDictByType(this, 'retire_type', 'retireTypeList')
        this.getDataList()
    },
    methods: {
        getDataList() {
            let that = this
            this.listLoading = true
            this.getCommHttpData({
                url: 'teacherManage/queryLeaveList',
                method: 'post',
                contentType: 2,
                data: {
                    limit: this.pageSize,
                    page: this.pageIndex,
                    schoolId: this.schoolId,
                    state: 2,
                    startDate : this.dateRange.length ? this.dateRange[0] : '',
                    endDate : this.dateRange.length ? this.dateRange[1] : '',
                    keywords: this.msg,
                    retireType: this.theType + '',
                }
            }, function(data) {
                if(data && data.code == 0) {
                    that.listLoading = false
                    that.dataList = data.page.list
                    that.totalPage = data.page.totalCount
                } else {
                    that.dataList = []
                    that.totalPage = 0
                }
            })
        },
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        goChange(item, type) {
            if (type) {
                this.$router.push({ name:'teach-retire-data', query : { id : item. teacherId, type : type} })
            }else {
                let table = this.$refs.singleTable
		        table.toggleRowExpansion(item)
		        table.toggleRowSelection(item)
            }
            
        },
        downloadFile(u) {
            u && (location.href = encodeURI(this.baseIp + u))
        }
    }
}
</script>

<style lang="scss" scoped>
.search--head{
    display: flex;
    justify-content: space-between;
}
.expand--row--wrapper{
    line-height: 28px;
    .link--type:hover{
        color: #3C85EE;
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>
