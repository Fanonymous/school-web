<template>
  <transition name="fade">
    <router-view v-if='isRouterlive'></router-view>
  </transition>
</template>

<script>
import { truncate } from 'fs';
  export default {
    provide(){
      return {
        reload:this.reload
      }
    },
    data() {
      return {
        isRouterlive : true
      }
    },
    methods : {
      reload() {
        this.isRouterlive = false
        this.$nextTick(function () {
          this.isRouterlive = true
        })
      }
    }
  }
</script>
<style>
	.el-tabs__item:focus.is-active.is-focus:not(:active) {
			-webkit-box-shadow: none !important;
			box-shadow: none !important;
			border-radius: 0;
	}
</style>

