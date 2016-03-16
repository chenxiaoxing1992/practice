

function formate_(time_val) {
	var time_obj = time_val + ":00";
	return time_obj;
};


// 向前一屏
// $(document).on('click', '.pre_', function() {
// 	var width = parseInt($('.tl-timenav-slider').css('width'));
// 	var left = parseInt($('.tl-timenav-slider').get(0).style.left);
// 	var document_width = document.documentElement.clientWidth;
// 	if (Math.abs(left) < (width / 2 - document_width)) {
// 		left -= 1800;
// 		$('.tl-timenav-slider').animate({
// 			left : left
// 		}, 800);
// 	} else {
// 		console.log('已经到时间末尾了');
// 	}
// });

// 物体居中
function center(obj, Width, Height) {
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	obj.style.left = (width - Width) / 2 + 'px';
	obj.style.top = (height - Height) / 2 + 'px';
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

function refreshTimeLine() {
	var staticJson = initJson();
	var timeline = new TL.Timeline('timeline', staticJson, {});
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
	$("#clickTime").val("");
}

function initJson() {
	var json = '{"events": [{"start_date": {"minute": "0","second": "0","millisecond":  "" }},'+tablejson()+'{"start_date": {"minute": "300","second": "0","millisecond":  "","format":""}}]}';
	json = JSON.parse(json);
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
		if(i==0){
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
		}else{
			var start_=table.find('tr').eq(i-1).find('td').eq(1).text();
			var end_=formate(table.find('tr').eq(i).find('td').eq(1).text())-formate(table.find('tr').eq(i).find('td').eq(0).text())+formate(start_);
			console.log(end_);
				end_=formatTime(end_);
			var tablejson = {
				"start_date": {
					"hour" : start_.split(':')[0],
	                "minute":       start_.split(':')[1],
	                "second":       start_.split(':')[2]
	            },
	            "end_date":{
	                "hour" : end_.split(':')[0],
	                "minute":       end_.split(':')[1],
	                "second":       end_.split(':')[2]
	            }
			}

		}
			json+=JSON.stringify(tablejson)+",";	

	}
	return json;
};
// 初始化页面
$(function() {
	$("#return").click(function() {
		returnToMedia(500);
	});
	var staticJson = initJson();
	var timeline = new TL.Timeline('timeline', staticJson, {});
	$(document).off('mousemove', '.tl-timeaxis-tick');
	$(document).off('mouseup', '.tl-timeaxis-tick');
	window.onresize = function(event) {
		timeline.updateDisplay();
	};
});
$(document).ready(function(){
	$('.selectmerge').click(function(){
		$('#screen').show();
		$('#selectmerge').show();
		chosenSelectInit();
		LoadGrid();
		$(document).one('ajaxloadstart.page', function(e) {
			$(grid_selector).jqGrid('GridUnload');
			$('.ui-jqdialog').remove();
		});
	});
	$('.merge-close').click(function(){
		$('#selectmerge').hide();
		$('#screen').hide();
	});
//视屏播放	
	$('.t_body').on('click','.auto_play',function(){
		var this_src=$(this).parent().parent().find('td').eq(2).text();
			$('#video').get(0).src=this_src;
			$('#video').get(0).play();
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

//合并视屏时间修改
	$('#taskTable').on('click','td',function(event){
		event.stopPropagation();
		$('option').val(0);
		if($(this).text()!=""){
			var str = "";
				tableSelectTop=$(this).offset().top-57;
			 	tableSelectLeft=$(this).offset().left-130;
			if($('#_contents').html()==undefined){
				$('.page-content').append("<div id=\"_contents\" style=\"padding:6px; font-size: 12px; position:absolute; left:"+tableSelectLeft+"px; top:"+tableSelectTop+"px; width:?px; height:?px; z-index:1;\">");
				str += "<select name=\"_hour\"id=\"_hour\"style=\"padding:0px;\">";
				for (h = 0; h <= 9; h++) {
				    str += "<option value=\"" + h + "\">" + h + "</option>";
				}
				str += "</select>：<select name=\"_minute\"id=\"_minute\"style=\"padding:0px;\">";
				for (m = 0; m <= 9; m++) {
				    str += "<option value=\"0" + m + "\">0" + m + "</option>";
				}
				for (m = 10; m <= 59; m++) {
				    str += "<option value=\"" + m + "\">" + m + "</option>";
				}
				str += "</select>：<select name=\"_second\"id=\"_second\"style=\"padding:0px;\">";
				for (s = 0; s <= 9; s++) {
				    str += "<option value=\"0" + s + "\">0" + s + "</option>";
				}
				for (s = 10; s <= 59; s++) {
				    str += "<option value=\"" + s + "\">" + s + "</option>";
				}
				str += "</select> <input name=\"queding\" type=\"button\" onclick=\"_select()\" value=\"\u786e\u5b9a\" style=\"font-size:12px\" /></div>";
				$('#_contents').append(str);
			}
			$('#_contents').css({'left':tableSelectLeft,'top':tableSelectTop});
		}
	});
	
});

//点击确认修改时间
function _select(){
	var tex=$('#_hour').find("option:selected").text()+":"+$('#_minute').find("option:selected").text()+":"+$('#_second').find("option:selected").text();
		tex=trim(tex);
		console.log(tex);	
	     var length=$('#taskTable').find('td').length;
		for(var i=0;i<length;i++){
			if($('#taskTable').find('td').eq(i).offset().top-57==tableSelectTop&&$('#taskTable').find('td').eq(i).offset().left-130==tableSelectLeft){
				var tex_=formate($('#taskTable').find('td').parent().find('td').eq(i+1).text());
				console.log(tex_);
				if(isNaN(tex_)){
					tex_=formate($('#taskTable').find('td').parent().find('td').eq(i).text());
				}
					tex=formate(tex);
				if(tex<tex_){
					tex=formatTime(tex);
					$('#taskTable').find('td').eq(i).text(tex);	
					refreshTimeLine();				
				}else{
					alert('您输入的时间大于视频总共时间,请您重新输入');
				}
			}
		}

}
//修改时间select的隐藏
// $('#taskTable').on('click',function(event){
// 	event.preventDefault();
// 	// alert($('#_contents').get(0).style.display);
// 	if($('#_contents')){
// 		$('#_contents').get(0).style.display="none";
// 	}
// })

//可合并视频表格信息
function LoadGrid() {
	var grid_selector = "#pointChannelGrid";
	var pager_selector = "#grid-pager";
	// resize to fit page size
	$(window).on(
			'resize.jqGrid',
			function() {
				if (window.screen.width <= 1366) {
					$(grid_selector).jqGrid('setGridWidth',
							$("#selectmerge").width()/2).jqGrid('setGridHeight',
							$(window).height()/2);
				} else {
					$(grid_selector).jqGrid('setGridWidth',
							$("#selectmerge").width()/2).jqGrid('setGridHeight',
							$(window).height()/2);
				}
			});
	// resize on sidebar collapse/expand
	var parent_column = $(grid_selector).closest('[class*="col-"]');
	$(document).on(
			'settings.ace.jqGrid',
			function(ev, event_name, collapsed) {
				if (event_name === 'sidebar_collapsed'
						|| event_name === 'main_container_fixed') {
					setTimeout(function() {
						$(grid_selector).jqGrid('setGridWidth',
								parent_column.width());
					}, 0);
				}
			});

	$(grid_selector)
			.jqGrid(
					{
						url : webroot + "live/queryPointAsset.htm",
						mtype : 'post',
						datatype : "json",
						/* height : 400, */
						colNames : [ '', '媒资编号', '媒资名称', '主分类', '媒资简称' 
								 ],
						colModel : [ {
							name : 'id',
							index : 'id',
							width : 100,
							sorttype : "int",
							editable : true,
							hidden : true
						}, {
							name : 'assetId',
							index : 'assetId',
							width : 100,
							sorttype : "int",
							editable : true
						}, {
							name : 'name',
							index : 'name',
							width : 100,
							editable : true
						}, {
							name : 'displayName',
							index : 'displayName',
							width : 80,
							editable : true
						}, {
							name : 'shortName',
							index : 'shortName',
							width : 90,
							editable : true
						},],
						viewrecords : true,
						rowNum : 20,
						rowList : [ 10, 20, 30 ],
						pager : pager_selector,
						altRows : true,
						multiselect : true,
						jsonReader : {
							total : 'total',
							records : 'records',
							root : 'rows',
							repeatitems : true
						},
						loadComplete : function(data) {
							var table = this;
							var pageNow = $(grid_selector).jqGrid('getGridParam', 'page');// 当前页
							var totalPage = data.total;// 总页数
							if(totalPage == 0){
								$(".ui-pg-input").val(0);
								$("td.ui-corner-all").addClass("ui-state-disabled");
								$("#grid-pager_right > div").text("无数据显示");
							}else{
								if (pageNow > totalPage) {
									var pageInfo = ($(".ui-pg-selbox").val()
											* (totalPage - 1) + 1)
											+ " - "
											+ data.records
											+ "\u3000共  "
											+ data.records + " 条";
									if (totalPage == 1) {
										$("td.ui-corner-all").addClass(
												"ui-state-disabled");
									}
									$(".ui-pg-input").val(totalPage);
									$(grid_selector).jqGrid('setGridParam', {
										page : totalPage
									});
									$("#grid-pager_right > div").text(pageInfo);
									$("#next_grid-pager").addClass(
											"ui-state-disabled").next().addClass(
											"ui-state-disabled");
								}
							}
							
							setTimeout(function() {
								updatePagerIcons(table);
							}, 0);
						},
						ondblClickRow : function(rowid, iRow, iCol, e) {
							var selected = $(this).getRowData(rowid);
							dblclickCut(selected.assetId);
						}
					});
	$(window).triggerHandler('resize.jqGrid');
	$(grid_selector).jqGrid('navGrid', pager_selector, {
		edit : false,
		editicon : 'ace-icon fa fa-pencil blue',
		add : false,
		addicon : 'ace-icon fa fa-plus-circle purple',
		del : false,
		delicon : 'ace-icon fa fa-trash-o red',
		search : false,
		searchicon : 'ace-icon fa fa-search orange',
		refresh : false,
		refreshicon : 'ace-icon fa fa-refresh green',
		view : false,
		viewicon : 'ace-icon fa fa-search-plus grey',
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
function reloadGrid() {
	var assetId = $("#assetId").val();
	var name = $("#name").val();
	var displayType = $("#displayType").val();
	$("#pointChannelGrid").setGridParam(
			{
				url : webroot + "live/queryPointAsset.htm?assetId=" + assetId
						+ "&&name=" + name + "&&displayType=" + displayType
			}).trigger("reloadGrid");
}
function dblclickCut(assetId) {
	$
			.ajax({
				type : "post",
				url : webroot + "live/getDuration.htm",
				data : {
					"assetId" : assetId
				},
				dataType : "json",
				success : function(data) {
					if (data.success == false) {
						alert(data.message);
					} else {
						var duration = data.duration;
							duration=MillisecondFormat(duration);
						var remote_source = data.remote_source;
						var json = '{"events":[{"start_date":{"hour":"0","minute":"00","second":"00","millisecond":""}}]}';
						var cutJson = {
								cut : json
							};
//						$("#preview")
//								.load(
//										webroot
//												+ "pages/live/imitativeChannel/videodeltManagement.jsp?remote_source="
//												+ remote_source + "&&duration="
//												+ duration + "&&assetId="
//												+ assetId, cutJson);
//						$("#pointChannel").slideToggle();
//						$("#preview").slideToggle();
						var start_time=0+":"+0+0+":"+0+0;
						var end_time=duration.hours+":"+duration.minutes+":"+duration.seconds;
						var length=$('.t_body tr').length;
						if(length==0){
							 tbodyHTML(start_time,end_time,remote_source);
						}
						if(length>0){
							for(var i=0;i<=length;i++){
								if($('.t_body tr').eq(i).find('td').eq(2).text()==remote_source){
									alert('该视频已经在列表中');
									return;
								}
	                        }
//							alert($('.t_body tr').find('td').siblings().eq(2).text());
							if($('.t_body tr').find('td').eq(2).text()!=remote_source){
								 tbodyHTML(start_time,end_time,remote_source);
							}
						}
					}
				}
			});
}

//表格添加视屏
function tbodyHTML(start_time, end_time,src) {
	var str = "<tr>" + "<td>" + start_time + "</td>" + "<td>" + end_time + "</td>"+ "<td style=\"display:none;\">" + src + "</td>" + "<td>" 
	+ "<i class=\"ace-icon fa fa-trash-o bigger-125 red pointer\"style=\"margin-left:10%;\"title=\"删除\">" + "</i>"+"<i class=\"ace-icon fa fa-play-circle bigger-150 red auto_play\"title=\"播放\"style=\"float:right;margin-right:20%;\">" + "</i>" + "</td>" + "</tr>";
	$('#taskTable').append(str);
}


function change() {
	var flag = $("#searchTitle").attr("flag");
	if (flag == 'show') {
		$("#searchDiv").slideUp();
		$("#searchTitle").find("i").removeClass("fa-minus").addClass("fa-plus")
				.end().attr("flag", "hide");
		$("#showAllLists").hide();
	} else {
		$("#searchDiv").slideDown();
		$("#searchTitle").find("i").removeClass("fa-plus").addClass("fa-minus")
				.end().attr("flag", "show");
		$("#showAllLists").show();
	}
}
function formateFormType(cellvalue, options, rowObject) {
	var result = '';
	switch (parseInt(cellvalue)) {
	case 6:
		result = "剧集";
		break;
	case 7:
		result = "单集";
		break;
	case 8:
		result = "单片";
		break;
	case 10:
		result = "内容集";
		break;
	default:
		break;
	}
	return result;
};

function formateHasVideo(cellvalue, options, rowObject) {
	if (cellvalue == true) {
		return "是";
	} else {
		return "否";
	}
};

// 打点时间格式化
function dotFormat(dot, img_path, detail, imgBaseURI) {
	var obj = {
		"start_date" : {
			"hour" : "",
			"minute" : "",
			"second" : "",
			"millisecond" : "",
			"format" : ""
		},
		"group" : "",
		"media" : {
			"caption" : "",
			"credit" : "",
			"url" : "",
			"thumb" : ""
		},
		"text" : {
			"headline" : "",
			"time_" : ""
		}
	};
	var str = new Array();
	str = dot.split(":");
	obj.start_date.hour = str[0];
	obj.start_date.minute = str[1];
	obj.start_date.second = str[2];
	obj.media.url = imgBaseURI + img_path;
	obj.text.headline = detail;
	obj.text.time_ = dot;
	return obj;
}
// chosen select init
function chosenSelectInit() {
	if (!ace.vars['touch']) {
		$('.chosen-select').chosen({
			allow_single_deselect : true
		});
		// resize the chosen on window resize
		$("#displayType").next().find("div.chosen-search").hide();
		$(window).off('resize.chosen').on('resize.chosen', function() {
			$('.chosen-select').each(function() {
				var $this = $(this);
				$this.next().css({
					'width' : "100%"
				});
			});
		}).trigger('resize.chosen');
		// resize chosen on sidebar collapse/expand
		$(document).on('settings.ace.chosen',
				function(e, event_name, event_val) {
					if (event_name != 'sidebar_collapsed')
						return;
					$('.chosen-select').each(function() {
						var $this = $(this);
						$this.next().css({
							'width' : "100%"
						});
					});
				});
	}
}
// reset function
function reset() {
	var $searchDiv = $('#searchDiv');
	$searchDiv.find("input").val("");
	$searchDiv.find("displayType").val("");
}


