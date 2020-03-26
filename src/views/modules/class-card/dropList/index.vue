<template>
    <div class="drop-list-wrapper" v-clickoutside="handleClose">
        <div class="drop-list-input-box" @click="handleFocus">
            <el-input readonly v-model="selectedLabel" :placeholder="placeholder"
            @blur="handleBlur"
            ref="reference" class="drop-list-input" :style="{'width' : size + 'px'}" :suffix-icon="iconName"></el-input>
        </div>
        <transition name="el-zoom-in-top" @after-leave="doDestroy">
            <dropDown ref="popper" v-show="visible" :append-to-body="popperAppendToBody" :selectData="selectData" @allSelect="getLabel"></dropDown>
        </transition>   
    </div>
</template>

<script>
import dropDown from './dropdown.vue'
import Emitter from 'element-ui/src/mixins/emitter'
import { setTimeout } from 'timers';
export default {
    mixins: [Emitter],
    props : {
        data : { type : Array, default : [] },
        popperAppendToBody: { type: Boolean, default: true },
        size : { type : Number, default : 200},
        placeholder : { type : String, default : '请选择'},
        value : { type : Array}
    },
    data() {
        return {
            visible : false,
            selectedLabel : '',
            selectValue : null,
            selectData : [],
        }
    },
    components : { dropDown },
    computed : {
        iconName() {
            if (this.visible) {
                return 'el-icon-arrow-up'
            }else {
                return 'el-icon-arrow-down'
            }
        }
    },
    watch : {
        visible(n) {
            if (!n) {
                this.broadcast('dropDownList', 'destroyPopper');
            }else {
                this.broadcast('dropDownList', 'updatePopper');
            }
        },
        selectValue(n) {
            this.$emit('input', n);
        },
        value : {
            handler(n) {
                setTimeout(_ => {
                    this.selectData.forEach(item => {
                        n.indexOf(item.value) > -1 && (item.checked = true)
                    })
                }, 200)
            },
            deep: true,
            immediate: true
        },
        data(n) {
            let arr = []
            n.forEach(item => {
                if (item.checked == undefined) {
                    item.checked = false
                }
                arr.push(item)
            });
            this.selectData = arr
        }
    },
    methods : {
        handleFocus(event) {
            this.visible = !this.visible
        },
        handleBlur(event) {
            // this.visible = false;
        },
        doDestroy() {
            this.$refs.popper && this.$refs.popper.doDestroy();
        },
        handleClose() {
            this.visible = false;
        },
        getLabel(arr, value) {
            this.selectedLabel = arr.join(',')
            this.selectValue = value
        }
    },
}
</script>

<style lang="scss" scoped>
.drop-list-wrapper{
    display: inline-block;
}
.drop-list-input{
    /deep/ input{
        cursor: pointer;
    }
}
</style>


