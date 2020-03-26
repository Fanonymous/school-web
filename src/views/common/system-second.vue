<template>
	<div class="mod-config">
		<iframe :src="iframeSrc" width="100%" height="800px" frameborder="0"></iframe>
	</div>
</template>
<script>
	import { getCommHttpData ,getDomainType} from '@/utils/common'
	export default {
		data() {
			return {
				iframeSrc:'http://192.168.1.39:8088/ischool/oauth/index?token='+this.$cookie.get('accesstoken')+'&productId=100011',
				domainType:getDomainType(),
				isRead: false,
				dataForm: {
					userName: '',
					name: '',
					userPassword: ''
				},
				date:(new Date()).getFullYear(),

			}
		},
    computed: {
    	sideSubFold: {
            get () { return this.$store.state.common.sideSubFold },
            set (val) { this.$store.commit('common/updateSideSubFold', val) }
       },
       sideMenuApp: {
            get () { return this.$store.state.common.sideMenuApp },
            set (val) { this.$store.commit('common/updateSideMenuApp', val) }
        }
    },

    watch: {
    	keywords(val) {
    		this.getMessageList()
    	},
    	$route(to,from){
        this.sideSubFold = false
        this.sideMenuApp = false
        this.iframeSrc = this.$route.query.url
      }
    },
    mounted() {
    	this.sideSubFold = false
    	this.sideMenuApp = false
      this.iframeSrc = this.$route.query.url
    },
		methods: {

		}
	}
</script>
