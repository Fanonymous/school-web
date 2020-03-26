<template>
	<div class="breadcrumb" v-if="breadList.length >0 && breadList[0].meta.title != '第三方链接'">
		<el-breadcrumb separator="/">
			<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
			<transition-group name="breadcrumb" separator="/">
				<el-breadcrumb-item v-for="(item,index) in breadList" v-if="item.meta.title" :key="item.path">

					<template v-if="item.meta.parent != undefined">
						<router-link  :replace=true :to="item.meta.parent.path" class="parent-bread">{{item.meta.parent.title}}</router-link>&nbsp;&nbsp;|&nbsp;
					</template>
					<!--<router-link>{{item.meta.title}} :replace=true :to="item.redirect || item.path"</router-link>-->
					<template >
            {{item.meta.title}}
          </template>
				</el-breadcrumb-item>
			</transition-group>
		</el-breadcrumb>
	</div>
</template>
<style>
	.breadcrumb {
		background-color: #FFFFFF;
		padding: 15px 0px 15px 15px;
		margin-bottom: 10px;
		
	}
	.breadcrumb .parent-bread{
		cursor: pointer !important;
	}
</style>
<script>
	 import { getCommHttpData, applicationSave} from '@/utils/common'
	export default {
		data() {
			return {
				breadList:[]
			}
		},
		created(){
			this.getBreadcrumb()
		},
		watch:{
			$route(to,from){
				// window.removeEventListener('beforeunload',e => this.beforeunloadHandler(e));
				// window.removeEventListener('unload',e => this.beforeunloadHandler(e))
				// if(to.name == 'stu-his_divclass'){
				// 	window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
				// 	window.addEventListener('unload', e => this.beforeunloadHandler(e))
				// }
				this.getBreadcrumb()
				
			}
		},
		methods:{
			// beforeunloadHandler(e) {
			// 	e = e || window.event;
			// 	if (e) {
			// 		e.returnValue = "您是否确认离开此页面-您输入的数据可能不会被保存";
			// 	}
			// 	return "您是否确认离开此页面-您输入的数据可能不会被保存";
			// },
			getBreadcrumb(){
				let matched = this.$route.matched.filter(item => item.name)
				
				if(matched.length >1){
					if(matched[1].meta.productId != undefined){
						applicationSave(matched[1].meta.productId)
						sessionStorage.setItem('curApp', JSON.stringify({
							id: matched[1].meta.productId,
							name: matched[1].meta.productName,
							curMenu: ''
						} || ''))
					}
					
				}
				
				const first= matched[0]
				if(this.$route.query.type == undefined){
					matched[1].meta.title = matched[1].meta.title
					if(matched[1].meta.title == '编辑'){
						matched[1].meta.title = '添加'
					}
				}else{
					
					if(this.$route.query.type == 1){
						matched[1].meta.title = matched[1].meta.title.replace('添加','编辑');
						matched[1].meta.title = matched[1].meta.title.replace('查看','编辑');
						if(this.$route.name == 'teach-manage-add'){
							matched[1].meta.title = matched[1].meta.title.replace('编辑','完善信息');
						}
						if(this.$route.name == 'stu-add-change'){
							matched[1].meta.title = '编辑'
						}
					}else if(this.$route.query.type == 2){
						matched[1].meta.title = matched[1].meta.title.replace('添加','查看');
						matched[1].meta.title = matched[1].meta.title.replace('编辑','查看');
						if(this.$route.name == 'stu-add-change'){
							let changeType = this.$route.query.changeTypeId
							if(changeType == 1){
								matched[1].meta.title = '复学'
							}else if([2,3,4,5,6].includes(changeType)){
								matched[1].meta.title = '恢复入学资格'
							}else if(changeType == 7){
								matched[1].meta.title = '恢复学籍'
							}
						}
					}else{
						matched[1].meta.title = matched[1].meta.title.replace('查看','添加');
						matched[1].meta.title = matched[1].meta.title.replace('编辑','添加');
					}
				}
				if(first && first.name.trim().toLocaleLowerCase() != 'a-media-school'.toLocaleLowerCase()){
					//matched = [{path:'/school',meta:{title:'首页'}}].concat(matched)
				}
				
				if(matched[1].name=='index'){
					this.breadList = []
				}else{
					this.breadList = [matched[1]]
				}
			}
		}
	}
</script>