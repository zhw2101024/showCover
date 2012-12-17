/*
 * jQuery.showCover(options)
 * (en)html: content to show for browser
 * (zh)html: 访问者要看到的内容
 * (en)anchor: click anchor to see advertising
 * (zh)anchor: 点击后重新观看广告
 * (en)timeout: time to keep cover
 * (zh)timeout: 遮罩层保持的时间
 * (en)hidetime: time spend to hide cover
 * (zh)hidetime: 显示内容需要的时间
 * (en)debug: set debug as true to enable debug mode
 * (zh)debug: 设置为true以启用debug模式
 */
(function($) {
    $.fn.showCover = function(options) {
        if(this.length != 1) {
            return this;
        } else {
            //是否使用点击弹出的功能
            var hasanchor = true;
            //(en)if some parameters are not given, then use the default ones
            //(zh)若参数未给出则使用默认值
            var settings = $.extend({
                "html": $(),
                "anchor": $(),
                "timeout": "5",
                "hidetime": "1",
                "debug": false
            },options);
            var content = this;
            var html = settings["html"];
            var anchor = settings["anchor"];
            var timeout = settings["timeout"];
            var hidetime = settings["hidetime"];
            var debug = settings["debug"];
            //(en)check if the anchor is an existing element on page(dealing with different versions of jquery)
            //(zh)检测锚点参数是否有效(兼容jquery不同版本获取属性的方式)
            if(!(anchor.prop ? anchor.prop("tagName") : anchor.attr("tagName"))) {
                hasanchor = false;
            }

            //(en)popup the layer
            //(zh)弹出遮罩层
            var cover = $("<div>", {
                "id": "cover",
                css: {position: "absolute",
                      backgroundColor: "#999999",
                      opacity: "0.9",
                      width: function() {
                        return content.outerWidth();
                      },
                      height: function() {
                        return content.outerHeight();
                      },
                      left: function() {
                        return content.position().left + parseFloat(content.css("marginLeft")) + "px";
                      },
                      top: function() {
                        return content.position().top + parseFloat(content.css("marginTop")) + "px";
                      }
                }
            }).appendTo("body");
            var close = $("<span>", {
                "id": "close",
                text: "x",
                css: {position: "absolute",
                      right: "0",
                      top: "-6px",
                      lineHeight: "18px",
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      color: "red",
                      cursor: "pointer"
                },
                click: function() {
                           box.remove();
                           cover.remove();

                           clearInterval(interval);
                           anchor.one("click",function(){
                               content.showCover(options);
                           });
                       }
            }).prependTo(cover);
            var notice = $("<span>", {
                html: "<span id='timeout'></span>seconds left",
                css: {color: "red",
                      marginLeft: "10px"
                }
            }).prependTo(cover);

            //(en)define the popup box(it won't be visible before ready)
            //(zh)定义弹出窗部分（准备好之前不显示）
            var box;
            box = $("<div>", {
                "id": "box",
                html: html,
                css: {position: "absolute",
                      display: "none",
                      cursor: "pointer",
                      left: function() {
                          return cover.position().left;
                      },
                      top: function() {
                          return cover.position().top;
                      },
                      border: "medium solid green"
                }
            }).appendTo("body");

            //(en)adjust the box's position
            //(zh)调整弹出框位置并显示
            box.css({
                left: function(index,value) {
                          return parseFloat(value) + (cover.outerWidth() - box.outerWidth()) / 2 + "px";
                },
                top: function(index,value) {
                         var boxTop = parseFloat(value) + (cover.outerHeight() - box.outerHeight()) / 2;
                         var maxTop = $(window).height() / 3;
                         if(boxTop > maxTop) {
                             var minTop = cover.position().top;
                             if(maxTop < minTop) {
                                 return minTop + "px";
                             }
                             return maxTop + "px";
                         }
                         return boxTop + "px";
                },
                display: "block"
            });

            //(en)show the left seconds and hide the layer when time is out
            //(zh)显示剩余秒数，超时后隐藏遮罩层
            $("#timeout").text(timeout--).css({
                "color": "blue",
                "fontFamily": "Arial",
                "fontWeight": "bold"
            });
            var interval = setInterval(function() {
                $("#timeout").text(timeout--);
                if(timeout == -1) {
                    if(hasanchor) {
                        var position = anchor.position();
                        var coverLeft = position.left + parseFloat(anchor.css("marginLeft")) + "px";
                        var coverTop = position.top + parseFloat(anchor.css("marginTop")) + "px";
                    } else {
                        var coverLeft = box.position().left + box.outerWidth() / 2;
                        var coverTop = box.position().top + box.outerHeight() / 2;
                    }
                    cover.animate({
                        left: coverLeft,
                        top: coverTop,
                        opacity: "0",
                        width: "0",
                        height: "0"
                    },hidetime*1000,function() {
                        cover.remove();
                    });
                    box.animate({
                        left: coverLeft,
                        top: coverTop,
                        opacity: "0",
                        width: "0",
                        height: "0"
                    },hidetime*1000,function() {
                        box.remove();
                        if(hasanchor) {
                            anchor.one("click",function(){
                                content.showCover(options);
                            });
                        }
                    });
                    clearInterval(interval);
                }
            },1000);
            //(en)set debug as true to use debug mode, thus all animations won't work
            //(zh)如果debug设置为true，则停止倒计时，即进入调试模式
            if(debug) {
                clearInterval(interval);
                $("<br /><span style='color:red'>The page is now in debug mode!</span>").appendTo($("#timeout").parent());
            }
            return this;
        };
    }
})(jQuery);
