//html 转 pdf
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
  	
  	Vue.prototype.getPdf = function() {
  			const file_id = 'printContent'
	      const title = this.htmlTitle
	      const Dom_height = document.getElementById(file_id).offsetHeight //获取要截取的dom元素内容高度
	      console.log(Dom_height)
	      const Dom_width = document.getElementById(file_id).offsetWidth
	      const outer_height = document.getElementById(file_id).offsetHeight+22 //获取dom元素的外部高度
	      const outer_width = document.getElementById(file_id).offsetWidth+22
	      const window_height = window.screen.availHeight //窗口高度
	      const window_width = window.screen.availWidth
	      console.log(window_height)

	      // console.log($('#' + file_id).height())
	      html2Canvas(document.querySelector('#' + file_id), {
	        allowTaint: true,
	        // height: window.screen.availHeight,
	        width:Dom_width < window_width ? window_width : outer_width,
	        height: Dom_height < window_height ? window_height : outer_height, //canvas画布的具体高度
	        /*以上这个高度非常重要，如果dom内容高度在窗口高度内的话，那就用窗口高度，
	        确保把当前页的内容都截取，如果超过一页，那就用外部高度*/
	        windowHeight: document.getElementById(file_id).scrollHeight, 
	        y: window.pageYOffset +120, //页面在垂直方向的滚动距离
	        x:200
	      }).then(function (canvas) {
	      	console.log(canvas.height)
	        let contentWidth = canvas.width
	        let contentHeight = canvas.height
	        let pageHeight = contentWidth / 592.28 * 841.89
	        let leftHeight = contentHeight
	        let position = 0
	        let imgWidth = 595.28
	        let imgHeight = 592.28 / contentWidth * contentHeight
	        let pageData = canvas.toDataURL('image/jpeg', 1.0)
	        
	        let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
		      saveLink.href = pageData
		      saveLink.download = title
		      let event = document.createEvent('MouseEvents')
		      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		      saveLink.dispatchEvent(event)

	        
	        console.log(pageData)
	        return;
	        let PDF = new JsPDF('', 'pt', 'a4')
	        if (leftHeight < pageHeight) {
	          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
	        } else {
	          while (leftHeight > 0) {
	            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
	            leftHeight -= pageHeight
	            position -= 841.89
	            if (leftHeight > 0) {
	              PDF.addPage()
	            }
	          }
	        }
	        PDF.save(title + '.pdf')
	      })
	      //不用理会then中的内容，主要改动在html2Canvas中
	      
	 }

  	
//  Vue.prototype.getPdf = function () {
//    var title = this.htmlTitle
//    html2Canvas(document.querySelector('#printContent'), {
//      allowTaint: true
//    }).then(function (canvas) {
//    	console.log(canvas.width)
//      let contentWidth = canvas.width
//      let contentHeight = canvas.height
//      let pageHeight = contentWidth / 592.28 * 720
//      let leftHeight = contentHeight
//      let position = 0
//      let imgWidth = 595.28
//      let imgHeight = 592.28 / contentWidth * contentHeight
//      let pageData = canvas.toDataURL('image/jpeg', 1.0)
//      let PDF = new JsPDF('', 'pt', 'a4')
//      if (leftHeight < pageHeight) {
//        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
//      } else {
//        while (leftHeight > 0) {
//          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
//          leftHeight -= pageHeight
//          position -= 720
//          if (leftHeight > 0) {
//            PDF.addPage()
//          }
//        }
//      }
//      PDF.save(title + '.pdf')
//    }
//    )
//  }
  }
}