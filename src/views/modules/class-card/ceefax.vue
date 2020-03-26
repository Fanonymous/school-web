<template>
	<div class="ceefax">
		<el-card class="blue-shadow">
			<el-row>
				<el-col :span="24">
					<!-- 
					<el-select v-model="gradeClassId" clearable placeholder="请选择年级班级" v-if="theType==2002" style="width:250px;margin-right: 10px;" @change="gradeClass">
						<el-option v-for="(item,index) in theGcoption" :key="index" :label="item.gradeName+item.className" :value="index">
						</el-option>
					</el-select> -->
					<el-input placeholder="请输入名称" :inline="true" style="width: 300px;" v-model="msg" @input="getCeefax"></el-input>
			
			        <el-dropdown style="float: right;">
			            <span class="el-dropdown-link el-button el-button--primary">发布资讯</span>
			            <el-dropdown-menu slot="dropdown">
			                <el-dropdown-item @click.native="handJump(1)">新建图文</el-dropdown-item>
			                <el-dropdown-item @click.native="handJump(2)">转载文章</el-dropdown-item>
			            </el-dropdown-menu>
			        </el-dropdown>
				</el-col>
			</el-row>
			
			<div class="table" style="padding-top: 10px;">
				<el-table :data="tableList"  border >
					<el-table-column type="index" label="序号"  align="center" width="80">
					</el-table-column>
					<el-table-column prop="informationTitle"  label="文章标题" align="center">
					</el-table-column>
					<el-table-column  label="栏目" align="center">
						<template slot-scope="scope">
					         <p>{{scope.row.informationName}}
					         	<span v-if="scope.row.informationClassName">{{"-"+scope.row.informationClassName}}</span>
					         </p>
					   </template>
					</el-table-column>
					<el-table-column prop="createNameBy" label="发布人" align="center"></el-table-column>
			        <el-table-column label="是否置顶" align="center" header-align="center">
			            <template slot-scope="scope">
			                <span>{{scope.row.isStick == 1 ? '是' : '否'}}</span>
			            </template>
			        </el-table-column>
					<el-table-column prop="address" label="操作" align="center">
						<template slot-scope="scope">
			                <el-button type="text" size="small" @click="handView(0, scope.row.informationId)">查看</el-button>
			                <el-button type="text" size="small" @click="handView(1, scope.row.informationId)">编辑</el-button>
							<el-button  @click="goDel(scope.row)"  type="text" size="small">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div style="margin-top: 20px">
					<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
					</el-pagination>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
export default {
    data () {
        return {
            msg : '',
            gradeClassId:undefined,
            theGcoption:[],
            typeList:[],
            theType : 2001,
            schoolId:this.GLOBAL.getOrgId(),
            dataListLoading: true,
            tableList:[],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
        }
    },

    created() {
        this.gradeClass();
        this.getType();
    },

    methods:{
        handView(v, id) {
            if (v) {
                this.$router.push( { name : 'edit_publish', query : { informationId : id } } )
            }else {
                this.$router.push( { name : 'view_new', query : { informationId : id, isView : '1' } } )
            }
        },
        handJump(mark) {
            this.$router.push({ name : 'publish_infor', query : { theType : this.theType, mark : mark } })
        },
        gradeClass(){
                let that=this;
                this.getCommHttpData({
                url: 'common/queryGradeAndClassByUser',
                method: 'get',
                contentType:1,
                data:{
                    yearTermId:'0'
                },
            }, function(data) {
                that.theGcoption=data.list;
                that.getCeefax()
            })
        },
        getType() {
            this.getCommonDictByType(this, 'information_type', 'typeList');
        },
        getCeefax(){
            var gradeId,classId
            if(this.theType==2002){
                if(this.gradeClassId){
                    gradeId=this.theGcoption[this.gradeClassId].gradeId
                }else{
                    gradeId=undefined
                }
            }else{
                gradeId=undefined
            };
            if(this.theType==2002){
                if(this.gradeClassId){
                    classId=this.theGcoption[this.gradeClassId].classId
                }
                else{
                    classId=undefined
                }
            }else{
                classId=undefined
            };
            let that = this;
            this.getCommHttpData({
                url: 'cms/information/list',
                method: 'get',
                contentType: 1,
                data: {
                    informationType:this.theType,
                    keywords:this.msg,
                    page: this.pageIndex,
                    size: this.pageSize,
                    gradeId:gradeId,
                    classId:classId
                },
            }, function(data) {
                if(data && data.code === 0) {
                    if(data.list.list.length == 0 && that.pageIndex != 1) {
                            that.pageIndex = 1
                            that.getCeefax()
                    }
                    that. tableList= data.list.list
                    that.totalPage = data.list.totalCount
                } else {
                    that.tableList = []
                    that.totalPage = 0
                }
            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getCeefax()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getCeefax()
        },
        goDel(row){
            let that = this;
            this.deleteData(this,{
                url:'cms/information/delete',
                method:'get',
                contentType:1,
                operateType:1,
                data:{
                    informationId:row.informationId
                }
            },function(data){
                that.getCeefax()
                })
    },
    }
}
</script>
