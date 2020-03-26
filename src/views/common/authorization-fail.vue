<template>
  <div class="site-wrapper site-page--not-found">
    <div class="site-content__wrapper">
      <div class="site-content">
        <img src="~@/assets/img/fail-text.png" width="100%" />
      </div>
    </div>
    <p class="not-found-desc">啊哦~您访问的页面跑到火星去了~<br/>为了不影响您的正常使用，建议您尽快与相关负责人联系。</p>
    <img src="~@/assets/img/fail-bg-foot.png" height="400px" width="100%" style="position: absolute;top: 39%;z-index: 99;"/>
    <com-footer style="margin-top: 90px;"></com-footer>
  </div>
</template>

<script>
  import ComFooter from './com-footer'
  export default {
  	data() {
			return {
				second:5
			}
		},
    components: {
    	ComFooter
    },
		mounted() {
			let that = this

		}
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--not-found {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;

    .site-content__wrapper {
      padding: 0;
      margin: 0;
      background: url(~@/assets/img/fail-bg.png) no-repeat;
      background-size: 100% 75%;
      // background: url(~@/assets/img/fail-bg-foot.png) no-repeat;
      // background-size: 100% 400px;
      // background-position-y: 350px;
      // z-index: 99999;
    }
    .site-content {
      position: absolute;
      top: 10%;
      left: 50%;
      z-index: 2;
      padding: 30px;
      text-align: center;
      transform: translate(-50%, 0);
    }
    .not-found-title {
      margin: 20px 0 15px;
      font-size: 10em;
      font-weight: 400;
      color: rgb(55, 71, 79);
    }
    .not-found-desc {
      text-align: center;
      width: 100%;
      position: absolute;
      top:61%;
      z-index: 100;
      margin: 10px 0 30px;
      font-size: 26px;
      line-height:45px;
      text-transform: uppercase;
      color: rgb(118, 131, 143);
      > em {
        font-style: normal;
        color: #ee8145;
      }
    }
    .not-found-btn-gohome {
      margin-left: 30px;
    }
    .footer-main {
		    position: absolute;
		    top: auto;
		    bottom: 0px !important;
		    z-index: 2222;
		    width: 100%;
		    text-align: center;
		}
  }
  
</style>
