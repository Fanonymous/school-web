<template>
	<div>
        <el-radio-group v-model="radioScreen" size="mini" @change="screenChange">
        	<el-radio-button v-for="item in radioList" :label="item.value" :key="item.value">{{item.name}}</el-radio-button>
	        <!--<el-radio-button label="1">全国</el-radio-button>
	        <el-radio-button label="2">省</el-radio-button>
	        <el-radio-button label="3">市</el-radio-button>
	        <el-radio-button label="4">区县</el-radio-button>
	        <el-radio-button label="5">学校</el-radio-button>-->
	    </el-radio-group>
   </div>
</template>

<script>
	
export default {
	props: {
		currScreen: {
			type: String,
			default: '1'
		},
		
	},
	data() {
	    return {
	        radioList:[{name:'全国',value:1},{name:'省',value:2},{name:'市',value:3},{name:'区县',value:4},{name:'学校',value:5}] 
	    }
	},
	created() {
		//this.radioScreen = this.currScreen
		
	},
	mounted(){
		//alert(this.$route.query.currScreen)
		if(this.$route.query.currScreen == undefined){
			this.radioList = []
		}else{
			if(this.currScreen ==1){
				 this.radioList = []
			}else if(this.currScreen ==2){
				 this.radioList = [{name:'全国',value:1}]
			}else if(this.currScreen ==3){
				 this.radioList = [{name:'全国',value:1},{name:'省',value:2}]
			}else if(this.currScreen ==4){
				if(this.$route.query.currScreen == 2){
					this.radioList = [{name:'全国',value:1},{name:'省',value:2},{name:'市',value:3}]
				}else{
					this.radioList = []
				}
			}else{
				 this.radioList = []
			}
		}
	  if(this.$route.name =='screen-school-sc'){
	  	this.radioList = [{name:'区县',value:4}]
	  }
	},
	methods: {
		
//		if(this.$route.name =='screen-school-sc'){
//	  	this.radioList = [{name:'区县',value:4}]
//	  }
		
		
		
		screenChange(){
			
			if(this.radioScreen ==1){
				this.$router.push({name: 'screen-china'})
			}else if(this.radioScreen ==2){
				this.$router.push({name: 'screen-province',query:{currScreen:1}})
			}else if(this.radioScreen ==3){
				this.$router.push({name: 'screen-city',query:{currScreen:2}})
			}else if(this.radioScreen ==4){
				if(this.currScreen == 3 ){
					this.$router.push({name: 'screen-edu',query:{currScreen:3}})
				}else{
					if(this.$route.query.currScreen == 2){
						this.$router.push({name: 'screen-edu',query:{currScreen:2}})
					}else{
						this.$router.push({name: 'screen-edu'})
					}
				}
				
			}else{
				if(this.$route.query.currScreen == 2){
					this.$router.push({name: 'screen-edu',query:{currScreen:2}})
				}else{
					this.$router.push({name: 'screen-edu'})
				}
			}
			
//			if(this.radioScreen ==1){
//				this.$router.push({name: 'screen-link-cc',query:{currScreen:this.currScreen}})
//			}else if(this.radioScreen ==2){
//				this.$router.push({name: 'screen-link-p',query:{currScreen:this.currScreen}})
//			}else if(this.radioScreen ==3){
//				this.$router.push({name: 'screen-link-c',query:{currScreen:this.currScreen}})
//			}else if(this.radioScreen ==4){
//				this.$router.push({name: 'screen-link-e',query:{currScreen:this.currScreen}})
//			}else{
//				this.$router.push({name: 'screen-link-s',query:{currScreen:this.currScreen}})
//			}
		}
	}
}
</script>



