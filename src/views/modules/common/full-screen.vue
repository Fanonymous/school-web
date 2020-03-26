<template>
	<div>
        <img :src="fullPic"  @click="fullToggle"/>
   </div>
</template>

<script>
	const fullS = require('../../../assets/img/icons/full-s.png')
	const fullE = require('../../../assets/img/icons/full-e.png')
export default {
	props: {
		label: {
			type: String,
			default: '.example-full-screen'
		},
		
	},
	data() {
	    return {
	        fullPic:fullS
	    }
	},
	created() {
	    this.getIndexByDict();
	},
	methods: {
		fullToggle () {
	      this.$fullscreen.toggle(this.$el.querySelector('.example-full-screen'), {
	        wrap: false,
	        callback: this.fullscreenChange
	      })
	    },
	    fullscreenChange (fullscreen) {
	    	if(fullscreen){
	    		this.fullPic=fullE
	    	}else{
	    		this.fullPic=fullS
	    	}
	      this.fullscreen = fullscreen
	    }
	}
}
</script>



