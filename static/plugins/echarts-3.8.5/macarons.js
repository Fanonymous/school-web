(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }

    var colorPalette = [
//      '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
//      '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
//      '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
//      '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
//      '#00b1f3','#ff850a','#41cac0', '#a9d96c', '#8386F5', '#F1AAA1', '#27CCEB', '#ffbdd5', '#F8BE5F', '#f9d346', '#6ab7c3'
//       "#41cac0","#00b1f3","#a9d96c","#a77cd1","#7483cb","#5a87c1","#bf6a6a","#bd9974","#f9d346","#6ab7c3"
//      "#37a2da","#32c5e9","#67e0e3","#9fe6b8","#ffdb5c","#ff9f7f","#e062ae","#e690d1","#9d96f5","#96bfff", "#aaeeee"
        '#3C85EE','#FEB23A','#8ABE78','#E1BF6C','#F15643','#8386f5','#5e6afc','#3293fc'
    ];


    var theme = {
        color: colorPalette,

        title: {
            textStyle: {
            	fontSize: '15',
                fontWeight: 'bold',
                color: '#666666'
            }
        },
		
        visualMap: {
            itemWidth: 15,
            color: ['#5ab1ef','#e0ffff']
        },
		
        toolbox: {
        	
//          iconStyle: {
//              normal: {
//                  borderColor: colorPalette[0]
//              }
//          }
        },
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            axisPointer : {
                type : 'line',
                lineStyle : {
                    color: '#008acd'
                },
                crossStyle: {
                    color: '#008acd'
                },
                shadowStyle : {
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#efefff',
            fillerColor: 'rgba(182,162,222,0.2)',
            handleColor: '#008acd'
        },

		grid: {
	        left: '20px',
	        right: '20px',
	        bottom: '25px',
	        containLabel: true,
	        borderColor: '#eee'
	    },
        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#9e9e9e',
                   
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee'],
                     type: 'dashed'
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#9e9e9e'
                   
                }
            },
            splitArea : {
                show : false,
//              areaStyle : {
//                  color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
//              }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee'],
                     type: 'dashed'
                }
            }
        },

        timeline : {
            lineStyle : {
                color : '#008acd'
            },
            controlStyle : {
                normal : { color : '#008acd'},
                emphasis : { color : '#008acd'}
            },
            symbol : 'emptyCircle',
            symbolSize : 3
        },

        line: {
            smooth : true,
            symbol: 'emptyCircle',
            symbolSize: 3
        },

        candlestick: {
            itemStyle: {
                normal: {
                    color: '#d87a80',
                    color0: '#2ec7c9',
                    lineStyle: {
                        color: '#d87a80',
                        color0: '#2ec7c9'
                    }
                }
            }
        },

        scatter: {
            symbol: 'circle',
            symbolSize: 4
        },

        map: {
            label: {
                normal: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#eee',
                    areaColor: '#ddd'
                },
                emphasis: {
                    areaColor: '#fe994e'
                }
            }
        },

        graph: {
            color: colorPalette
        },

        gauge : {
            axisLine: {
                lineStyle: {
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {
                splitNumber: 10,
                length :15,
                lineStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length :22,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            }
        }
    };

    echarts.registerTheme('macarons', theme);
}));