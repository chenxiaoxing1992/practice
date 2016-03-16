
$(document).ready(function() {
    var video = $('video');
 // 按钮click事件统一处理
    $(document).on('click', '.btn-all', function(ev) {
        var event = ev.target;
        var this_time = parseInt(video.get(0).currentTime);
        switch (event.id) {
            case "1":
                var next_time = this_time - 10;
                video.get(0).currentTime = next_time;
                break;
            case "2":
                var prev_time = --this_time;
                video.get(0).currentTime = prev_time;
                break;
            case "3":
                var next_time = ++this_time;
                video.get(0).currentTime = next_time;
                break;
            case "4":
                var next_time = this_time + 10;
                video.get(0).currentTime = next_time;
                break;

        }
    });
    
        function setplay(d) {
            var d_length=d.length;
            var index=0;
            if(d.length!=0){
                if(video.get(0).src != null){
                    video.get(0).pause();
                };
            video.get(0).src=d[0].src;
            video.get(0).play();
            video.on('timeupdate', function() {
                var _this = this;
                var Time = video.get(0).currentTime,
                intTime = parseInt(Time);
                for (var i = 0; i <d_length; i++) {
                    if (index==i) {
                        if(intTime==0&&d[index].start!=0){
                            _this.currentTime =d[index].start;
                            // video.get(0).play();
                        }
                        if (intTime==d[index].end&&index!=d_length-1) {
                            index++; 
                            console.log(index);
                            video.get(0).pause();
                            video.get(0).src =d[index].src;
                            video.get(0).play();
                            intTime = -1;
                        }
                        if(index==d_length-1&&intTime==d[index].end){
                        // video.get(0).currentTime=video.get(0).duration;
                            video.get(0).pause();
                            index=-1; 
                        }
                        }
                    }
                });            
               }
           };

       $('.Preview_1').click(function(){
            var d = [];
            var length_tr=$('#taskTable tr').length;
            if(length_tr==0){
               alert('请选择合并视屏后再预览');
               return;
            }
            for(var i=0;i<length_tr;i++){
                 d.push({
                     start:formate($('#taskTable tr').eq(i).find('td').eq(0).text()),
                     end: formate($('#taskTable tr').eq(i).find('td').eq(1).text()),
                     src:$('#taskTable tr').eq(i).find('td').eq(2).text()
                 })

            }
             setplay(d);
       })

    $(window).load(function() {
        var clent_width = document.documentElement.clientWidth - 220 + 'px';
        $('.client-width').css('width', clent_width);
    });

    $(window).resize(function() {
        var clent_width = document.documentElement.clientWidth - 220 + 'px';
        $('.client-width').css('width', clent_width);
    });


    $(document).on('click', '.tl-timemarker-with-end', function() {
        var tl_slider_left = $('.tl-timemarker-slider-right');
        for (var i = 0; i < tl_slider_left.length; i++) {
            $('.tl-timemarker-slider-right').eq(i).css('display', 'none');
            $('.tl-timemarker-slider-left').eq(i).css('display', 'none');
            $('.tl-timemarker-slider-line').eq(i).css('border-top', '0px solid #ff892a');
            $('.tl-timemarker-slider-line').eq(i).css('border-top-style', 'hidden');
        }
        $(this).find('.tl-timemarker-slider-right').get(0).style.display = 'block';
        $(this).find('.tl-timemarker-slider-left').get(0).style.display = 'block';
        $(this).find('.tl-timemarker-slider-line').css('border-top', '5px solid #da8846');
        $(this).find('.tl-timemarker-slider-line').css('border-top-style', 'dotted');
        // console.log($(this).html());do
    });

    // 放到队列
    $('.push_table').click(function() {
        var start_time = $('.move_time p').text();
        var end_time = $('.move_time_end p').text();
        var table = document.getElementById("taskTable");
        var length = table.rows.length;
        var segNew = {
        		start_time : formate(start_time),
        		end_time : formate(end_time)
        };
        if (segNew.start_time >= segNew.end_time) {
        	alert('开始时间不能大于结束时间');
        	return;
        };
        if(length > 0) {
        	for (var i = 0; i < length; i++) {
                var st_time = table.rows.item(i).cells.item(0).innerHTML;
                var en_time = table.rows.item(i).cells.item(1).innerHTML;
                st_time = formate(st_time);
                en_time = formate(en_time);
                var segOld = {
                		start_time : st_time,
                		end_time : en_time
                };
                if(segNew.start_time > segOld.end_time || segNew.end_time < segOld.start_time){
                	continue;
                } else {
                	segNew = combineSegment(segNew, segOld);
                	$("#taskTable tr").eq(i).remove();
                	i--;
                	length--;
                    start_time = formatTime(segNew.start_time);
                    end_time = formatTime(segNew.end_time);
                }
            }
        	tbodyHTML(start_time, end_time);
        	length++;
        }
        if(length == 0) {
        	start_time = formatTime(segNew.start_time);
            end_time = formatTime(segNew.end_time);
        	tbodyHTML(start_time, end_time);
        }
        refreshTimeLine1();
    });

});

// 求并集
function combineSegment(segNew, segOld) {
	var obj = {start_time : "", end_time : ""};
	obj.start_time = segNew.start_time <= segOld.start_time ? segNew.start_time : segOld.start_time;
	obj.end_time = segNew.end_time >= segOld.end_time ? segNew.end_time : segOld.end_time;
	return obj;
}

// 插入队列
function tbodyHTML(start_time, end_time) {
	var str = "<tr>" + "<td>" + start_time + "</td>" + "<td>" + end_time + "</td>" + "<td data-container=\"body\" data-toggle=\"popover\" data-placement=\"bottom\" data-content=\"删除\">" + "<i class=\"ace-icon fa fa-trash-o bigger-125 red pointer\">" + "</i>" + "</td>" + "</tr>";
	$('#taskTable').append(str);
}

function MillisecondFormat(msd) {
    var time = Math.floor(msd / 1000);
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;
    if (hours == 0) {
        hours = '0';
    } else if (hours < 10) {
        hours = hours.toString();
    }
    if (minutes == 0) {
        minutes = '00';
    } else if (minutes < 10) {
        minutes = '0' + minutes.toString();
    }
    if (seconds == 0) {
        seconds = '00';
    } else if (seconds < 10) {
        seconds = '0' + seconds.toString();
    }
    var obj = {
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
    return obj;
}

formatTime = function(s) {
    // 计算
    var h = 0,
        i = 0;
    if (s > 60) {
        i = parseInt(s / 60);
        s = parseInt(s % 60);
        if (i > 60) {
            h = parseInt(i / 60);
            i = parseInt(i % 60);
        }
    }
    // 补零
    var zero = function(v) {
        return (v >> 0) < 10 ? "0" + v : v;
    };
    var zero_ = function(v) {
        return (v >> 0) < 10 ? "" + v : v;
    };
    return [zero_(h), zero(i), zero(s)].join(":");
};

// 时间转换
function formate(time_val) {
  time_val.substring(':');
  if (time_val.length > 5) {
    var time_1 = time_val[0] * 60 * 60;
    var time_2 = time_val[2] * 60 * 10;
    var time_3 = time_val[3] * 60;
    var time_4 = time_val[5] * 10;
    var time_5 = time_val[6];
    var all_time = parseInt(time_2) + parseInt(time_3) + parseInt(time_1)
        + parseInt(time_4) + parseInt(time_5);
    return all_time;
  } else {
    var time_1 = time_val[0] * 60 * 60;
    var time_2 = time_val[2] * 60 * 10;
    var time_3 = time_val[3] * 60;
    var all_time = parseInt(time_2) + parseInt(time_3) + parseInt(time_1);
    return all_time;
  }

};