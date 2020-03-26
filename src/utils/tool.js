//格式化时间  （yyyy-mm-dd, '2019-08-12'）
import Vue from 'vue'
function dateFormat(fmt, date) {
    let ret
    let opt = {
        "Y+": date.getFullYear().toString(),       
        "m+": (date.getMonth() + 1).toString(),     
        "d+": date.getDate().toString(),            
        "H+": date.getHours().toString(),           
        "M+": date.getMinutes().toString(),         
        "S+": date.getSeconds().toString()         
    }
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
    }
    return fmt
}

Vue.prototype.dateFormat = dateFormat
