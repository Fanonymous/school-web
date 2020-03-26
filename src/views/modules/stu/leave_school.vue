<template>
	<div class="leave_school">
		<el-card class="blue-shadow">
			<el-input v-model="msg" style="width:300px" @input="getDataList" placeholder="姓名/手机号/邮箱/身份证号/学籍号"></el-input>
			<el-button type="primary" style="float: right;" @click="$router.push({ name : 'stu-add-change'})">添加</el-button>
			
			<el-table border ref="singleTable" :data="dataList" v-loading="listLoading" highlight-current-row element-loading-text="拼命加载中" style="width: 100%;margin-top: 10px;">
				<el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
				<el-table-column label="姓名" align="center">
					<template slot-scope="scope">
						<router-link :to="{name:'show-register3',query:{stuId:scope.row.stuId}}" style="text-decoration: none;">
							<el-button type="text">{{scope.row.stuName}}</el-button>
						</router-link>
					</template>
				</el-table-column>
			    <el-table-column property="className" :render-header="classReader" align="center"  width="150"></el-table-column>
			    <el-table-column property="telphone" label="手机号" align="center"  width="200"></el-table-column>
			    <el-table-column property="email" label="邮箱" align="center"  width="200"></el-table-column>
			    <el-table-column property="identityNum" label="身份证号" align="center" width="200"></el-table-column>
			    <el-table-column property="stuCode" label="学籍号" align="center"  width="200"></el-table-column>
				<el-table-column property="sex" label="性别" align="center"></el-table-column>
				<el-table-column property="changeType" label="异动类型" align="center"></el-table-column>
				<el-table-column property="changeDate" label="时间" align="center"></el-table-column>
			    <el-table-column type="expand" width="1">
			        <template slot-scope="scope">
			            <div class="expand--row--wrapper">
			                <div>
			                    <span>备注：</span>
			                    <span>{{scope.row.changeReason || '/'}}</span>
			                </div>
			                <div>
			                    <span>附件：</span>
			                    <span class="link--type" @click="downloadFile(scope.row.changeFile)">{{scope.row.changeFile || '/'}}</span>
			                </div>
			            </div>
			        </template>
			    </el-table-column>
				<el-table-column fixed="right" label="操作" align="center" min-width="200">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="goChange(scope.row, 0)">详情</el-button>
						<template v-if="['正常死亡','非正常死亡','复学','恢复入学资格','恢复学籍'].indexOf(scope.row.changeType) == -1">
							<el-button type="text" size="small" :disabled="scope.row.canResume == 1" @click="goChange(scope.row, 1)">编辑</el-button>
							<el-button type="text" size="small" :disabled="scope.row.canResume == 1" @click="goChange(scope.row, 2)" v-if="scope.row.changeTypeId == 1">复学</el-button>
							<el-button type="text" size="small" :disabled="scope.row.canResume == 1" @click="goChange(scope.row, 2)" v-if="[2,3,4,5,6].includes(scope.row.changeTypeId)">恢复入学资格</el-button>
							<el-button type="text" size="small" :disabled="scope.row.canResume == 1" @click="goChange(scope.row, 2)" v-if="scope.row.changeTypeId == 7">恢复学籍</el-button>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 20px">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
    data() {
        return {
            baseIp: window.SITE_CONFIG.imgIP,
            schoolId: this.GLOBAL.getOrgId(),
            msg: '',
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            listLoading : false
        }
    },
    watch : {
        msg(n) {
            this.debounce(this.getDataList, 300)
        }
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        debounce(fn, wait) {
            let fun = null
            if (fun !== null){
                clearTimeout(fun)
            }
            fun = setTimeout(fn, wait)
        },
        classReader(h, { column, $index }) {
            return h('span', {
                attrs : { title : '离校显示原班级,入校显示入校后班级'},
                domProps : { innerHTML : '班级<span class="el-icon-question"></span>' }
            })
        },
        getDataList() {
            let that = this
            this.listLoading = true
            this.getCommHttpData({
                url: '/stu/changeInfo/changeInfoList',
                method: 'post',
                contentType: 2,
                data: {
                    limit: this.pageSize,
                    page: this.pageIndex,
                    schoolId: this.schoolId,
                    keywords: this.msg,
                    type : 4
                }
            }, res => {
                if(res.code == 0) {
                    that.listLoading = false
					if(res.page.list.length == 0 && that.pageIndex != 1) {
						that.pageIndex = 1
						that.getDataList()
					}
                    that.dataList = res.page.list
                    that.totalPage = res.page.totalCount
                } else {
                    that.dataList = []
                    that.totalPage = 0
                }
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
        theAdd(){
        },
        downloadFile(u) {
            u && (location.href = encodeURI(this.baseIp + u))
        },
        goChange(item, type) {
            if (type == 0) {
                let table = this.$refs.singleTable
		        table.toggleRowExpansion(item)
		        table.toggleRowSelection(item)
            }else if (type == 1) {
                this.$router.push({ name:'stu-add-change', query : { id : item.stuChangeId, type : type} })
            }else {
                this.$router.push({ name:'stu-add-change', query : { id : item.stuChangeId, changeTypeId : item.changeTypeId, type : type} })
            }
            
        },
    }
}
</script>

<style lang="scss" scoped>
.expand--row--wrapper{
    line-height: 28px;
    .link--type:hover{
        color: #3C85EE;
        text-decoration: underline;
        cursor: pointer;
    }
}
</style>
