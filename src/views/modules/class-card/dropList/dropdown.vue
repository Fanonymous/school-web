<template>
    <div class="drop-down el-select-dropdown el-popper" :style="{'width' : $parent.size + 'px'}">
        <div class="el-select-dropdown__item drop-down-list-ite" @click="handClickChoseAll" v-if="refreshIs">
            <input type="checkbox" v-if="option.length" :checked="isChecked">
            <span v-if="option.length">全部</span>
            <span v-if="!option.length">暂无数据</span>
        </div>
        <div class="drop-down-list-ite el-select-dropdown__item" v-for="(item, index) in option" :key="index" @click="handCheckBoxClick(item, $event)" v-if="refreshIs">
            <input type="checkbox" :value="item.label" :checked="item.checked">
            <span>{{item.label}}</span>
        </div>
    </div>
</template>

<script>
import Popper from 'element-ui/src/utils/vue-popper';
import { truncate } from 'fs';
import { setTimeout } from 'timers';
export default {
    name : 'dropDownList',

    componentName : 'dropDownList',

    mixins: [Popper],

    props: {
        selectData : {type : Array},
        placement: {
            default: 'bottom-start'
        },

        boundariesPadding: {
            default: 0
        },

        popperOptions: {
            default() {
                return {
                    gpuAcceleration: false
                }
            }
        },

        visibleArrow: {
            default: true
        },

        appendToBody: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            option : [],
            refreshIs : true,
            isChecked : false,
            selected : [],
        }
    },

    computed : {
        
    },
    watch : {
        selectData : {
            handler(n) {
                setTimeout(_ => {
                    let strArr = [], valueArr = []
                    n.forEach(value => {
                        value.checked && (strArr.push(value.label), valueArr.push(value.value))
                    });
                    this.option = n
                    if (valueArr.length == this.option.length) {
                        strArr = ['全部']
                        this.isChecked = true
                    }else {
                        this.isChecked = false
                    }
                    this.$emit('allSelect', strArr, valueArr)
                }, 200)
            },
            deep: true,
            immediate: true
        }
    },

    methods : {
        handClickChoseAll(event) {
            if (this.option.length) {
                let is = false, strArr = [], valueArr = []
                for (let i = 0; i < this.option.length; i ++) {
                    if (this.option[i].checked) {
                        is = true
                        break
                    }
                }
                this.option.map(item => {
                    item.checked = !is
                })
                this.isChecked = !is
                this.refreshIs = false
                this.$nextTick(_ => {
                    this.refreshIs = true
                })
                if (!is) {
                    this.option.forEach(value => {
                        // strArr.push(value.label)
                        valueArr.push(value.value)
                    });
                    strArr.push('全部')
                }
                this.$emit('allSelect', strArr, valueArr)
            }
        },
        handCheckBoxClick(value, event) {
            value.checked = !value.checked
            this.refreshIs = false
            this.$nextTick(_ => {
                this.refreshIs = true
            })
            let strArr = [], valueArr = []
            this.option.forEach(value => {
                value.checked && (strArr.push(value.label), valueArr.push(value.value))
            });
            // strArr.length == this.option.length && (strArr = ['全部'], this.isChecked = true)
            if (strArr.length == this.option.length) {
                strArr = ['全部']
                this.isChecked = true
            }else {
                this.isChecked = false
            }
            this.$emit('allSelect', strArr, valueArr)
        }
    },

    mounted() {
        this.referenceElm = this.$parent.$refs.reference.$el;
        this.$parent.popperElm = this.popperElm = this.$el;
        this.$on('updatePopper', () => {
            if (this.$parent.visible) this.updatePopper();
        });
        this.$on('destroyPopper', this.destroyPopper);
        // this.option = this.selectData
        
    }
    
}
</script>

<style lang="scss" scoped>
.drop-down{
    min-height: 200px;
    max-height: 300px;
    overflow: auto;
}
.drop-down-list-ite{
    cursor: pointer;
    input[type=checkbox]{
        vertical-align: middle;
    }
    span{
        padding-left: 5px;
    }
    z-index: 9999999;
}
::-webkit-scrollbar{  
    width: 5px;  
    height: 5px;  
    background-color: #F5F5F5;  
}   
::-webkit-scrollbar-track{  
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
    border-radius: 10px;  
    background-color: #F5F5F5;  
}    
::-webkit-scrollbar-thumb{  
    border-radius: 10px;  
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #bdbdbd;  
}  
::-webkit-scrollbar-thumb:hover{
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.4);
}
</style>


