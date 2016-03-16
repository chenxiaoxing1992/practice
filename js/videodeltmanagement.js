//返回主页面
function returnToMedia(time) {
	$("#preview").slideToggle(time);
	$("#pointChannel").slideToggle(time);
}

// 获取video对象
var video = $('video');
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

function formate_(time_val) {
	var time_obj = time_val + ":00";
	return time_obj;
};
// 修改剪切时间left
$(document)
		.on(
				'mousedown',
				'.tl-timeaxis-tick',
				function(ev) {
					var x = ev.pageX;
					var slider = $('.tl-timemarker-slider-left');
					for ( var i = 0; i < slider.length; i++) {
						var left = slider.eq(i).offset().left;
						if (x >= left - 10 && x <= left + 10) {
							slider = slider.eq(i);
						}
					}
					var slider_left = parseInt(slider.offset().left);
					var tl_slider_left = slider.css("left");
					if (x >= slider_left - 8 && x <= slider_left + 8) {
						$(document)
								.on(
										'mousemove',
										'.tl-timeaxis-tick',
										function(ev) {
											var x_ = ev.pageX, tl_slider_right = slider
													.next().offset().left, line_left = slider
													.get(0).style.left, tl_slider_left_ = slider
													.offset().left, width_ = tl_slider_right
													- tl_slider_left_ + 12, txt = $(
													this).find('span').text();
											slider.next().next().css('width',
													width_ + 'px');
											slider.next().next().css('left',
													line_left);
											if (!tl_slider_left) {
												slider.get(0).style.left = -(x - x_)
														+ 'px';
											} else {
												slider.get(0).style.left = -(x - x_)
														+ parseInt(tl_slider_left)
														+ 'px';
											}

											if (txt.length == 5) {
												txt = trim(txt);
												txt = formate_(txt);
											}
											if (txt.length == 2) {
												txt = trim(txt) + ":00:00";
											}
											$('.move_time p').text(txt);
										})
						$(document).on('mouseup', '.tl-timeaxis-tick',
								function() {
									return delt_();
								})
					}

				});

// 滑动获取时间left
$(document)
		.on(
				'mousedown',
				'.tl-timeaxis-tick',
				function(ev) {
					var x = ev.pageX, slider_content = $('.slider-line .content'), slider_left = $('.slider-line .content .left'), slider_right = $('.slider-line .content .right'), slider_content_left = slider_content
							.get(0).offsetLeft + 220;
					if (document.documentElement.clientWidth < 1080) {
						slider_content_left = drag.get(0).offsetLeft + 20;
					}
					if (x >= slider_content_left - 5
							&& x <= slider_content_left + 5) {
						var width_ = parseInt(slider_content.css('width'));
						$(document)
								.on(
										'mousemove',
										'.tl-timeaxis-tick',
										function(ev) {
											var x_ = ev.pageX, real = x - x_, real_width = width_
													+ real, txt = $(this).find(
													'span').text();
											slider_content.css('width',
													real_width + 'px');
											slider_content.get(0).style.left = x_
													- 222 + 'px';
											if (txt.length == 5) {
												txt = trim(txt);
												txt = formate_(txt);
											}
											if (txt.length == 2) {
												txt = trim(txt) + ":00:00";
											}
											$('.move_time p').text(txt);
										});

						$(document).on('mouseup', '.tl-timeaxis-tick',
								function() {
									return delt_();
								});
					}

				});

// 滑动获取时间right
$(document)
		.on(
				'mousedown',
				'.tl-timeaxis-tick',
				function(ev) {
					var x = ev.pageX, slider_content = $('.slider-line .content'), slider_left = $('.slider-line .content .left'), slider_right = $('.slider-line .content .right'), width_ = parseInt(slider_content
							.css('width')), slider_content_right = slider_content
							.get(0).offsetLeft
							+ 218 + width_;
					if (document.documentElement.clientWidth < 1080) {
						slider_content_right = slider_content.get(0).offsetLeft + 20;
					}
					if (x >= slider_content_right - 5
							&& x <= slider_content_right + 5) {
						// var width_=parseInt(slider_content.css('width'));
						$(document)
								.on(
										'mousemove',
										'.tl-timeaxis-tick',
										function(ev) {
											var x_ = ev.pageX, real = x_ - x, real_width = width_
													+ real, txt = $(this).find(
													'span').text();
											// slider_content.get(0).style.right
											// =x_-222+'px';
											slider_content.css('width',
													real_width + 'px');
											if (txt.length == 5) {
												txt = trim(txt);
												txt = formate_(txt);
											}
											if (txt.length == 2) {
												txt = trim(txt) + ":00:00";
											}
											$('.move_time_end p').text(txt);
										});

						$(document).on('mouseup', '.tl-timeaxis-tick',
								function() {
									return delt_();
								});
					}

				});

// 修改剪切时间right
$(document)
		.on(
				'mousedown',
				'.tl-timeaxis-tick',
				function(ev) {
					var x = ev.pageX;
					var slider = $('.tl-timemarker-slider-right');
					for ( var i = 0; i < slider.length; i++) {
						var left = slider.eq(i).offset().left;
						if (x >= left - 10 && x <= left + 10) {
							slider = slider.eq(i);
						}
					}
					var slider_right = parseInt(slider.offset().left);
					var tl_slider_right = slider.get(0).style.right;
					// console.log(x);
					// console.log(slider_right);
					if (x >= slider_right - 8 && x <= slider_right + 8) {
						$(document)
								.on(
										'mousemove',
										'.tl-timeaxis-tick',
										function(ev) {
											var x_ = ev.pageX, tl_slider_left = slider
													.next().offset().left, line_right = slider
													.get(0).style.right, tl_slider_right_ = slider
													.offset().left, width_ = tl_slider_right_
													- tl_slider_left + 12, txt = $(
													this).find('span').text();
											if (!tl_slider_right) {
												slider.get(0).style.right = (x - x_)
														+ 'px';
											} else {
												slider.get(0).style.right = (x - x_)
														+ parseInt(tl_slider_right)
														+ 'px';
											}
											slider.next().css('width',
													width_ + 'px');
											slider.next().css('right',
													line_right);
											if (txt.length == 5) {
												txt = trim(txt);
												txt = formate_(txt);
											}
											if (txt.length == 2) {
												txt = trim(txt) + ":00:00";
											}
											$('.move_time_end p').text(txt);
										});

						$(document).on('mouseup', '.tl-timeaxis-tick',
								function() {
									return delt_();
								});
					}

				});

function delt_() {
	$(document).off('mousemove', '.tl-timeaxis-tick');
	$(document).off('mouseup', '.tl-timeaxis-tick');
	// real_left = obj.style.left;
}

// 向前一屏
$(document).on('click', '.pre_', function() {
	var width = parseInt($('.tl-timenav-slider').css('width'));
	var left = parseInt($('.tl-timenav-slider').get(0).style.left);
	var document_width = document.documentElement.clientWidth;
	if (Math.abs(left) < (width / 2 - document_width)) {
		left -= 1800;
		$('.tl-timenav-slider').animate({
			left : left
		}, 800);
	} else {
		console.log('已经到时间末尾了');
	}
});

// 表格删除

    $('.t_body').on('click', '.pointer', function() {
        $(this).parent().popover('hide');
        $(this).parent().parent().remove();
    });
// 表格提醒

    $(document).on('mouseenter', '.pointer', function() {
        $(this).parent().parent().addClass('danger');
        $(this).parent().popover('show');
    });
    
    $(document).on('mouseleave', '.pointer', function() {
        $(this).parent().parent().removeClass('danger');
        $(this).parent().popover('hide');
    });	
// 物体居中
function center(obj, Width, Height) {
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	obj.style.left = (width - Width) / 2 + 'px';
	obj.style.top = (height - Height) / 2 + 'px';
}
// 视频跟着打点信息时间跑
$(document).on('click', '.tl_timemarker-content', function() {
	var time = $(this).find('span').text();
	time = formate(time);
	video.get(0).currentTime = time;
});
// 毫秒数格式化为时间
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
		hours : hours,
		minutes : minutes,
		seconds : seconds
	};
	return obj;
}

function refreshTimeLine() {
	var staticJson = initJson();
	var timeline = new TL.Timeline('timeline', staticJson, {});
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
	$("#clickTime").val("");
}
function refreshTimeLine1() {
	var staticJson = initJson1();
	var timeline = new TL.Timeline('timeline', staticJson, {});
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
	$("#clickTime").val("");
}
function initJson() {
	var cutData = JSON.stringify(cutJsonData);
	var aa = cutData.substring(0, cutData.length - 2);
	var json = aa + ',{"start_date":{"hour":"' + duration.hours
			+ '","minute":"' + duration.minutes + '","second":"'
			+ duration.seconds + '","millisecond":"","format":""}}]}';
	json = JSON.parse(json);
	
	return json;
}

function initJson1() {
	var cutData = JSON.stringify(cutJsonData);
	var aa = cutData.substring(0, cutData.length - 2);
	var table_json=tablejson();
	var json = aa + "," + table_json+'{"start_date":{"hour":"' + duration.hours
			+ '","minute":"' + duration.minutes + '","second":"'
			+ duration.seconds + '","millisecond":"","format":""}}]}';
	json = JSON.parse(json);
	console.log(json);
	return json;
}


function tablejson(){
	var table = $("#taskTable");
	var length = table.find('tr').length;
	// var rowdata = table.rows;
	var json="";
	for(var i=0;i<length;i++){
		var start = table.find('tr').eq(i).find('td').eq(0).text();
		var end = table.find('tr').eq(i).find('td').eq(1).text();
		var tablejson = {
			"start_date": {
				"hour" : start.split(':')[0],
                "minute":       start.split(':')[1],
                "second":       start.split(':')[2]
            },
            "end_date":{
                "hour" : end.split(':')[0],
                "minute":       end.split(':')[1],
                "second":       end.split(':')[2]
            }
		}
			json+=JSON.stringify(tablejson)+",";	

	}

	return json;   
}
function cutVideo() {
	var str = genStr();
	if(str == "") {
		alert("请添加一个任务");
	} else{
		$('#screen').show();
		$('#loading span').text("正在剪切请稍候.....");
		$('#loading').show();
		center($('#loading').get(0), 300, 22);
		$.ajax({
			type : 'POST',
			url : cutVideoURL,
			data : {
				timeList : str,
				assetId : assetId
			},
			success : function(data) {
				setTimeout(function() {
					$('#screen').hide();
					$('#loading').hide();
					if (data.success == true) {
						alert("剪切成功");
						returnToMedia(500);
					} else {
						alert("剪切失败");
					}
				}, 300);
			},
			error : function(info) {
				alert("发生错误，剪切失败");
			}
		});
	}
}

// 拼接参数
function genStr() {
	var str = "";
	var table = document.getElementById("taskTable");
	var length = table.rows.length;
	var rowdata = table.rows;
	var array = new Array();
	if(length > 0){
		for (var i = 0; i < length; i++) {
			var jsonObj = {
					start : formate(rowdata.item(i).cells.item(0).innerHTML),
					end : formate(rowdata.item(i).cells.item(1).innerHTML)
			};
			array[i] = jsonObj;
		}
		var comparray = complement(sort(array));
		var str_array = convertStruct(comparray);
		for(var i=0; i< str_array.length; i++){
			str += JSON.stringify(str_array[i]) + ";";
		}
	}
	return str;
}

// 排序
function sort(array) {
	var myarray = new Array();
	for(var i = 0; i < array.length; i++) {
		for(var j = i + 1; j <array.length; j++) {
			if(array[i].start > array[j].start) {
				var tempObj = array[i];
				array[i] = array[j];
				array[j] = tempObj;
			}
		}
	}
	return array;
}

// 取补集
function complement(array){
	var start = 0;
	var initend = Math.floor(duration_str / 1000);
	var comparray = new Array();
	comparray[0] = {
			start : 0,
			end : array[0].start
	};
	for(var i = 1; i < array.length; i++){
		comparray[i] = {
			start : array[i-1].end,
			end : array[i].start
		}
	}
	comparray[array.length] = {
			start : array[array.length-1].end,
			end : initend
	}
	return comparray;
}

// 数据结构转换
function convertStruct(array) {
	for(var i = 0; i < array.length; i++){
		var obj = {
				start : formatTime(array[i].start),
				duration : formatTime(array[i].end - array[i].start)
		}
		array[i] = obj;
	}
	return array;
}

// 初始化页面
$(function() {
	$("#return").click(function() {
		returnToMedia(500);
	});
	$(window).resize(function(){
		$("#taskTable-wrap").height($("#video").height()-37);
	});
	var staticJson = initJson();
	var timeline = new TL.Timeline('timeline', staticJson, {});
	$(document).off('mousemove', '.tl-timeaxis-tick');
	$(document).off('mouseup', '.tl-timeaxis-tick');
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
});