//返回主页面
function returnToMedia(time) {
	$("#preview").slideToggle(time);
	$("#pointChannel").slideToggle(time);
}

// 打点信息录入窗口
function addDot() {
	window.onresize = {};
	var desp = $("#time").html();
	console.log(desp);
	desp = trim(desp.replace(":","_").replace(":","_"));
	var str = JSON.stringify(staticJson).toString();
	var has1 = str.indexOf(desp, 0);
	var has2 = tmpStr.indexOf(desp, 0);
	var time=$('.move_time p').text();
	   	$('#time').text(time);
	if (desp == "0_00_00") {
		alert("请选择一个时间点");
	} else {
		if (has1 < 0 && has2<0) {
			$("#myModal").modal("show");
			$("#DotDescription").val("");
			$("#DotType").val("0");
			$('#DotDescription').on("blur", function() {
				if ($("#DotDescription").val() == "") {
					errorPrompt($('#DotDescription'), "描述不能为空");
					return;
				}
			});
		} else {
			alert("该点已打,请选择其他时间点");
		}
	}

}

function showUploadWin() {
	var ie = !-[ 1, ];
	if (ie) {
		jQuery('input:file').trigger('click').trigger('change');
	} else {
		jQuery('input:file').trigger('click');
	}
}

function publishXML() {
	$('#screen').show();
	$('#loading span').text("正在发布请稍候.....");
	$('#loading').show();
	$.ajax({
		type : "post",
		url : xmlURL,
		data : {
			assetId : assetId,
		},
		success : function(data) {
			alert(data.message);
			$('#screen').hide();
			$('#loading').hide();
			}
		});
}

function importTxt() {
	var option = {
		beforeSubmit : function(formData, jqForm, options) {
			var fileName = document.getElementById("inputFile").value;
			if (fileName == null || fileName == "") {
				alert("选择要导入的文件");
				return;
			}
			var file_suffix = fileName.substr(fileName.length - 3);
			if (file_suffix.toUpperCase() != "TXT") {
				alert("只允许导入txt文件,请重新选择");
				return;
			}
		},
		success : function(responseText, statusText, xhr, form) {
			var names = responseText.names;
			var times = responseText.times;
			var endTimes = responseText.endTimes;
			if (names == null || names.length == 0) {
				return;
			}
			var nameArr = [];
			var timeArr = [];
			var endTimeArr = [];
			if (names != null && names.length != 0) {
				nameArr = names.split(",");
				timeArr = times.split(",");
				endTimeArr = endTimes.split(",");
			}
			var ids = $("#grid-table-dotRecord").jqGrid("getDataIDs");
			var maxRowId = 0;
			if (ids.length != 0) {
				maxRowId = Math.max.apply(Math, ids);
				// 将grid中显示的当前数据清空,并不从数据库删除
				$("#grid-table-dotRecord").jqGrid("clearGridData", false);
			}
			var dataRow;
			for ( var i = 0; i < nameArr.length; i++) {
				dataRow = {
					programName : nameArr[i],
					beginTime : timeArr[i],
					endTime : endTimeArr[i]
				};
				$("#grid-table-dotRecord").jqGrid("addRowData",
						maxRowId + i + 1, dataRow, "last");
			}
		}
	};
	document.impDotForm.action = webroot + "live/impDot.htm?assetId=" + assetId;
	bootbox.setDefaults("locale", "zh_CN");
	bootbox.confirm({
		title : '请确认',
		size : 'small',
		message : "同一时间点重复的打点信息将被覆盖，是否继续？",
		callback : function(result) {
			if (result === false) {
			} else {
				$('#screen').show();
				$('#loading span').text("正在导入请稍候.....");
				$('#loading').show();
				center($('#loading').get(0), 300, 22);
				$("#impDotForm").ajaxForm(option);
				$("#impDotForm").ajaxSubmit({
					success : function(data) {
						setTimeout(function() {
							$('#screen').hide();
							$('#loading').hide();
							$('#loading span').text("导入成功.....");
							$("#grid-table-dotRecord").trigger('reloadGrid');
						}, 500);
						refreshTimeLine();
					}
				});
			}
		}
	});
}

function exportTxt() {
	var ids = jQuery("#grid-table-dotRecord").jqGrid('getDataIDs');
	if (ids.length == 0) {
		alert("没有打点信息");
	} else {
		window.open(webroot + "live/expDot.htm?assetId=" + assetId);
	}
}

function deleteByTimeline(){
	var time = $("#clickTime").val();
	if(time == ""){
		alert("请点击图片选择一个时间点");
	} else{
		bootbox.setDefaults("locale", "zh_CN");
		bootbox.confirm({
			title : '请确认',
			size : 'small',
			message : "是否删除？",
			callback : function(result) {
				if (result === false) {
				} else {
					$.ajax({
						type : "post",
						url : deleteDotRecordURL,
						data : {
							dot : time,
							assetId : assetId,
							optype : "timeline"
						},
						success : function(data) {
							if(data.type=="0"){
								st = "N";
							}
							if(data.type=="1"){
								ed = "N";
							}
							setTimeout(function() {
								$("#grid-table-dotRecord").trigger('reloadGrid');
							}, 500);
							refreshTimeLine();
						}
					});
				}
			}
		});
	}
}

function chooseTime() {
	$("#timeModal").modal("show");
	var str = $('.move_time p').text().split(":");
	$("#time_hour").val(str[0]);
	$("#time_minute").val(str[1]);
	$("#time_second").val(trim(str[2]));
}

function saveTime() {
	var get_time=$('#time_hour').val()+":"+$('#time_minute').val()+":"+$('#time_second').val();
		get_time=trim(get_time);
		$('.move_time p').text(get_time);
		$("#time").html(get_time);
	var last_time=formate(get_time);
		$("#timeModal").modal("hide");
		video.get(0).currentTime = last_time;
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

// 点击图片内容那视频跟着动
$(document).on('click', '.tl-timemarker-content', function() {
	var time = $(this).find('span').text();
	$("#clickTime").val(time);
	time = formate(time);
	video.get(0).currentTime = time;
});

// 拖拽获取时间
$("#ready").on('mousedown', '.tl-timeaxis-tick', function(ev) {
	var x = ev.pageX;
	var drag = $('.drag-line');
	var drag_line_left = drag.get(0).offsetLeft + 220;
	if (document.documentElement.clientWidth < 1080) {
		drag_line_left = drag.get(0).offsetLeft + 20;
	}
	if (x >= drag_line_left - 5 && x <= drag_line_left + 5) {
		$(document).on('mousemove', '.tl-timeaxis-tick', function(ev) {
			parseInt($(this).offset().left);
			var x = ev.pageX - 220;
			drag.get(0).style.left = x + 'px';
			var txt = $(this).find('span').text();
			if(txt.length==5){
				txt = trim(txt);
				txt= formate_(txt);
			}
			if(txt.length == 2){
				txt = trim(txt) + ":00:00";
			}
			$('.move_time p').text(txt);
		});

		$(document).on('mouseup', '.tl-timeaxis-tick', function() {
			var get_time = $(this).find('span').text();
			var last_time = formate(get_time);
			if(get_time.length == 2){
				last_time = parseInt(trim(get_time)) * 60 * 60;
			}
			var _this = this;
			video.get(0).currentTime = last_time;
			if (get_time.length == 5) {
				get_time = trim(get_time);
				get_time = formate_(get_time);
			}
			if(get_time.length == 2){
				get_time = trim(get_time) + ":00:00";
			}
			$('.set-time p').text(get_time);
			return delt(_this);
		});
	}

});

// 点击获取时间
$(document).on('mouseup', '.tl-timeaxis-tick', function(ev) {
	parseInt($(this).offset().left);
	var drag = $('.drag-line');
	var _this = this;
	var x = ev.pageX - 220;
	if (document.documentElement.clientWidth < 1080) {
		x = ev.pageX - 20;
	}
	drag.get(0).style.left = x + 'px';
	var txt = $(this).find('span').text();
	if (txt.length == 5) {
		txt = trim(txt);
		txt = formate_(txt);
	}
	if (txt.length == 2) {
		txt = trim(txt) + ":00:00";
	}
	$('.move_time p').text(txt);
	$('.set-time p').text(txt);
	return delt(_this);

});

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
function delt(obj) {
	$(document).off('mousemove', '.tl-timeaxis-tick');
	// $(document).off('mouseup', '.tl-timeaxis-tick');
	real_left = obj.style.left;
}
// 物体居中
function center(obj, Width, Height) {
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	obj.style.left = (width - Width) / 2 + 'px';
	obj.style.top = (height - Height) / 2 + 'px';
}
//视频跟着打点信息时间跑
$(document).on('click','.tl_timemarker-content',function(){
	var time=$(this).find('span').text();
    time=formate(time);
    video.get(0).currentTime=time;
});
// 保存打点信息
function saveDot(id) {
	if($("#DotType").val()=="0"&&st == "Y"){
		alert("片头已存在");
		return;
	}
	if($("#DotType").val()=="1"&&ed == "Y"){
		alert("片尾已存在");
		return;
	}
	var text = $('#DotDescription').val();
	var dotInfo = {
		"description" : $("#DotDescription").val(),
		"type" : $("#DotType").val(),
		"time" : $("#time").html(),
		"assetApplyID" : "",
		"assetId" : id
	};
	if(trim(dotInfo.description) == ""){
		errorPrompt($('#DotDescription'), "描述不能为空");
		return;
	}
	$("#myModal").modal("hide");
	$('#screen').show();
	$('#loading span').text("正在保存请稍候.....");
	$('#loading').show();
	center($('#loading').get(0), 300, 22);

	$
			.ajax({
				type : 'POST',
				url : saveDotInfoURL,
				data : dotInfo,
				success : function(data) {
					if($("#DotType").val() == 0){
						st = "Y";
					}
					if($("#DotType").val() == 1){
						ed = "Y";
					}
					setTimeout(
							function() {
								$('#screen').hide();
								$('#loading').hide();
								$('#loading span').text("正在保存请稍候.....");
								var table_width = $('.page-content').width()*0.5;
								$("#grid-table-dotRecord").setGridParam({
									url : searchDotRecordURL
								}).trigger("reloadGrid", table_width);
								var uri = data.imgBaseURI + data.imgPath;
								if (typeof (real_left) != 'undefined') {
									$('.tl-timenav-item-container')
											.append(
													"<div class=\"tl-timemarker add-left\" style=\"top: 5px;left:"
															+ real_left
															+ "\">"
															+ "<div class=\"tl-timemarker-timespan\" style=\"height: 122px;\">"
															+ "<div class=\"tl-timemarker-timespan-content\" style=\"height: 35.6667px;\">"
															+ "</div>"
															+ "<div class=\"tl-timemarker-line-left\">"
															+ "</div>"
															+ "<div class=\"tl-timemarker-line-right\"></div>"
															+ " </div>"
															+ "<div class=\"tl-timemarker-content-container tl-timemarker-content-container-small\" style=\"height: 35.6667px;\">"
															+ "<div class=\"tl-timemarker-content\">"
															+ "<div class=\"tl-timemarker-media-container\">"
															+ "<img class=\"tl-icon-\" src='"
															+ uri
															+ "'></div>"
															+ "<div class=\"tl-timemarker-text\">"
															+ "<h2 class=\"tl-headline\" style=\"-webkit-line-clamp: 2;\">"
															+ text
															+ "</h2>"
															+"<span class=\"tl-time\">"
															+dotInfo.time
															+"</span>"
															+ "</div>"
															+ "</div>"
															+ "</div>"
															+ "</div>");
									if(tmpStr != "") {
										tmpStr = tmpStr + "," + uri;
									} else {
										tmpStr = uri;
									}
								} else {
									alert('请从下面拖拽选择时间！');
								}
							}, 300);
					$('#loading span').text("保存成功.....");
				},
				error : function(xhr) {
					$("#myModal").modal("hide");
					$('#screen').hide();
					$('#loading').text("保存失败，请重新打点.....");
					$('#loading').hide();
					alert("保存错误：" + xhr.status + "" + xhr.statusText);
				}
			});
	$("#DotDescription").val("");
}

// 获取所有行数据
function getAllDotRecords() {
	var obj = $("#grid-table-dotRecord").jqGrid("getRowData");
	$(obj).each(function() {
	});
}
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

// 从数据库中删除数据-单行操作
function deleteRowData(dotid) {
	// 提示确认是否删除
	bootbox.setDefaults("locale", "zh_CN");
	bootbox.confirm({
		title : '请确认',
		size : 'small',
		message : "是否删除？",
		callback : function(result) {
			if (result === false) {
			} else {
				// 从界面删除数据
				var $tableId = "#grid-table-dotRecord";
				// logAlert("确认要删除所选记录吗!");
				var id = $($tableId).jqGrid("getGridParam", "selrow");
				var rowData = $($tableId).jqGrid("getRowData", id);
				// 从数据库中删除数据
				$.ajax({
					type : "post",
					url : deleteDotRecordURL, // 服务端处理程序
					data : {
						delId : id,
						img_path : rowData.img_path,
						optype : "ids"
					},
					success : function(data) {
						if(data.type=="0"){
							st = "N";
						}
						if(data.type=="1"){
							ed = "N";
						}
						setTimeout(function() {
							$($tableId).trigger('reloadGrid');
						}, 500);
						refreshTimeLine();
					}
				});
			}
		}
	});

}

// 点播放按钮播放
function palytime(td_id) {
	var time_ = $('#' + td_id).find('td').eq(2).text();
	time_ = formate(time_);
	video.get(0).currentTime = time_;
}

// 打点历史记录的表格
function dotRecordTable() {
	var grid_selector = "#grid-table-dotRecord";
	var pager_selector = "#grid-pager-dotRecord";
	// resize to fit page size
	$(window).on('resize.jqGrid', function() {
		$(grid_selector).jqGrid('setGridWidth', $("#video-wrap").width()).jqGrid("setGridHeight",$("#video-wrap").height()-130);
	});
	jQuery(grid_selector)
			.jqGrid(
					{
						url : searchDotRecordURL,
						datatype : "json",
						//height : 280,
						colNames : [ '媒资ID', '图片地址', '时间点', '类型', '描述', '操作' ],
						colModel : [ {
							name : 'asset_id',
							index : 'asset_id',
							align : "center",
							width : 80,
							hidden : true
						}, {
							name : 'img_path',
							index : 'img_path',
							align : "center",
							width : 80,
							hidden : true
						}, {
							name : 'dot',
							index : 'dot',
							align : "center",
							width : 60,
							editable : true,
							edittype : "text"
						}, {
							name : 'type',
							index : 'type',
							align : "center",
							width : 60,
							editable : true,
							formatter : typeFormatter
						}, {
							name : 'detail',
							index : 'detail',
							align : "center",
							width : 120,
							editable : true
						}, {
							name : "act",
							index : "act",
							width : 70,
							editable : false
						} ],
						rowNum : 10,
						rowList : [ 10, 20, 30 ],
						pager : pager_selector,
						viewrecords : true,
						emptyrecords : "无数据显示！",
						altRows : true,
						jsonReader : {
							total : 'total',
							records : 'records',
							root : 'data',
							repeatitems : true
						},
						sortable : true,
						sortname : 'dot', // 排序字段名
						sortorder : "asc", // 排序方式：倒序，本例中设置默认按id倒序排序
						multiselect : false,
						multiboxonly : false,
						loadComplete : function(data) {
							var pageNow = $(grid_selector).jqGrid('getGridParam', 'page');//当前页
							var totalPage = data.total;//总页数
							$(grid_selector).jqGrid('setGridWidth', $("#video-wrap").width()).jqGrid("setGridHeight",$("#video-wrap").height()-132);
							if(totalPage == 0){
								$("#grid-pager-dotRecord_center input.ui-pg-input").val(0);
								$("td.ui-corner-all").addClass("ui-state-disabled");
								$("#grid-pager-dotRecord_right > div").text("无数据显示");
							}else{
								if(pageNow > totalPage){
									var pageInfo = ($(".ui-pg-selbox").val()*(totalPage-1) + 1) + " - " + data.records + "\u3000共  " + data.records + " 条";
									if(totalPage == 1){
										$("td.ui-corner-all").addClass("ui-state-disabled");
									}
									$(".ui-pg-input").val(totalPage);
									$(grid_selector).jqGrid('setGridParam',{page:totalPage});
									$("#grid-pager_right > div").text(pageInfo);
									$("#next_grid-pager").addClass("ui-state-disabled").next().addClass("ui-state-disabled");
								}
							}
							setTimeout(function() {
								updatePagerIcons(grid_selector);
							}, 0);
						},
						gridComplete : function() {
							// 表格的th标签居中显示
							$("th[role=columnheader]").find("div").addClass(
									"center");
							var ids = jQuery(grid_selector)
									.jqGrid('getDataIDs');
							for ( var i = 0; i < ids.length; i++) {
								var id = ids[i];
								var ce = '<a class="play" onclick=palytime('
										+ id
										+ '); title="播放"><i class="ace-icon fa fa-play-circle bigger-150"></i></a>';
								var de = '<a class="red" onclick=deleteRowData('
										+ id
										+ '); title="删除"><i class="ace-icon fa fa-trash-o bigger-150"></i></a>';
								jQuery(grid_selector).jqGrid('setRowData',
										ids[i], {
											act : ce + de,
											align : "center"
										});
							}
							// 表格的th标签居中显示
							$("th[role=columnheader]").find("div").addClass(
									"center");
						},
						ondblClickRow : function(rowid, iRow, iCol, e) {
							// jQuery(grid_selector).toggleSubGridRow(rowid);
						},
						editurl : "",// nothing is saved
					});

	// 打点类型显示转换函数
	function typeFormatter(cellvalue, options, rowObject) {
		if (cellvalue == 0) {
			return "片头";
		}
		if (cellvalue == 1) {
			return "片尾";
		}
		if (cellvalue == 2) {
			return "精彩片段";
		}
	}

	$(window).triggerHandler('resize.jqGrid');// trigger window resize to make
	// the grid get the correct size
	$(document).one('ajaxloadstart.page', function(e) {
		$(grid_selector).jqGrid('GridUnload');
		$('.ui-jqdialog').remove();
	});
	// 解决一直出现水平滚动条的问题
	$(grid_selector).closest('.ui-jqgrid-bdiv').css({
		'overflow-x' : 'hidden'
	});
}

function updatePagerIcons(table) {
	var replacement = {
		'ui-icon-seek-first' : 'ace-icon fa fa-angle-double-left bigger-140',
		'ui-icon-seek-prev' : 'ace-icon fa fa-angle-left bigger-140',
		'ui-icon-seek-next' : 'ace-icon fa fa-angle-right bigger-140',
		'ui-icon-seek-end' : 'ace-icon fa fa-angle-double-right bigger-140'
	};
	$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon')
			.each(function() {
				var icon = $(this);
				var $class = $.trim(icon.attr('class').replace('ui-icon', ''));
				if ($class in replacement)
					icon.attr('class', 'ui-icon ' + replacement[$class]);
			});
}

function refreshTimeLine() {
	$
			.ajax({
				type : "post",
				url : webroot + "live/getAllDotRecords.htm",
				data : {
					"assetId" : assetId
				},
				dataType : "json",
				success : function(data) {
					var json = '{"events":[{"start_date":{"hour":"0","minute":"00","second":"00","millisecond":""}}';
					if (data.data != null) {
						for ( var i = 0; i < data.data.length; i++) {
							var ar = data.data[i];
							json = json
									+ ","
									+ JSON.stringify(dotFormat(ar.dot,
											ar.img_path, ar.detail, data.imgBaseURI));
						}
					} else {
					}
					var dotJson = {
						dot : json + ']}'
					};
					dotJsonData = dotJson.dot.toString();
					staticJson = wrappJson();
					timeline = new TL.Timeline('timeline', staticJson, {});
					window.onresize = function(event) {
						timeline.updateDisplay();
					};
				}
			});
	tmpStr = "";
	$("#clickTime").val("");
}

function initJson() {
	dotJsonData = JSON.stringify(dotJsonData);
	var aa = dotJsonData.substring(0, dotJsonData.length - 2);
	var json = aa + ',{"start_date":{"hour":"' + duration.hours
			+ '","minute":"' + duration.minutes + '","second":"'
			+ duration.seconds + '","millisecond":"","format":""}}]}';
	json = JSON.parse(json);
	return json;
}

function wrappJson() {
	var aa = dotJsonData.substring(0, dotJsonData.length - 2);
	var json = aa + ',{"start_date":{"hour":"' + duration.hours
			+ '","minute":"' + duration.minutes + '","second":"'
			+ duration.seconds + '","millisecond":"","format":""}}]}';
	json = JSON.parse(json);
	return json;
}

// 初始化页面
$(function() {
	$("#return").click(function() {
		returnToMedia(500);
	});
	dotRecordTable();
	staticJson = initJson();
	$(document).off('mousemove', '.tl-timeaxis-tick');
	// $(document).off('mouseup', '.tl-timeaxis-tick');
	var timeline = new TL.Timeline('timeline', staticJson, {});
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
});