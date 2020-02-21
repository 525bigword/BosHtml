 var fyy;
 var fyycount;
 var layer, layuiTable;
 layui.use('form', function() {
 				var form=layui.form;
 				form.on('checkbox(checkn)', function(data) {
 					if (data.elem.checked) {
 						$('input[name=check]').prop("checked", true);
 					} else {
 						$('input[name=check]').prop("checked", false);
 					}
 					form.render();
 				});
 				form.on('checkbox(check)', function(data) {
 					var bool = 1;
 					var child = $("input[name='check']");
 					for (var a = 0; a < child.length; a++) {
 						if (child[a].checked == false) {
 							bool = 2;
 							$('input[name=checkn]').prop("checked", false);
 							layui.form.render();
 							return;
 						}
 				
 					}
 					if (bool == 1) {
 						$('input[name=checkn]').prop("checked", true);
 						layui.form.render();
 					}
 				
 				
 				});
 			});
			function sxfy() {
							/* if(fyycount<5){
								$("#demo1").hide();
							} */
							layui.use(['laypage', 'layer'], function() {
								var laypage = layui.laypage,
									layer = layui.layer,
									form = layui.form;
								//调用分页
								laypage.render({
									elem: 'demo1',
									count: fyycount,
									layout: ['prev', 'page', 'next', 'count'],
									limit: 4,
									jump: function(obj) {
										//模拟渲染
										var page=$(".layui-laypage-em").next().html(); 
										var inde=4;
										document.getElementById('tbody').innerHTML = function() {
											var arr = [],
												thisData = fyy.concat()
												.splice(obj.curr * obj.limit - obj.limit,
													obj.limit);
											layui.each(thisData, function(index, item) {
												arr.push('<tr><td><input type="checkbox" lay-filter="check" name="check" lay-skin="primary" value=' +
													(page*4-inde) + '></td><td>' +
													(parseInt(index) + 1) + '</td><td>' +
													item.zoneCode + '</td><td>' +
													item.zoneName + '</td><td>' +
													item.syEmp.empName + '</td><td>' +
													item.telPhone + '</td><td>' +
													item.syUnits.name + '</td><td>' +
													(item.stats==1?'<button type="button" class="layui-btn layui-btn-disabled">查看列表</button>':
													'<button type="button" onclick="ckkk(\'' +item.zoneCode+ '\',\''+item.zoneName+'\')" class="layui-btn layui-btn-small btnQuery">查看客户信息</button></td></tr>'));
												inde--;
											});
						
											return arr.join('');
										}();
										form.render();
									}
								});
								
							});
						}
						 function ckkk(code,cityName){
							//页面层
							layer.open({
								title: ['列表', 'color:#fff;background:#1da02b;'],
								type: 2,
								//skin: 'layui-layer-rim', //加上边框
								area: ['980px', '440px'], //宽高
								content: 'zonecustomer_list.html',
								success: function(layero, index) {
									// 获取子页面的iframe
									var iframe = window['layui-layer-iframe' + index];
										iframe.child(code,cityName);
								},
								end: function() {
									window.location.reload();
								}
							});
						}
//加载'form'模块，使checkbox、select、radio初始化
layui.use('form', function(){
   
});


$(function(){
	$.ajaxSetup({
			dataType: "json",
			cache: false,
			headers: {
				"Authorization": 'bos' + $.cookie('user')
			},
			xhrFields: {
				withCredentials: true
			}
			/* ,
	complete: function(xhr) {
	    //token过期，则跳转到登录页面
	    if(xhr.responseJSON.code == 401){
	        parent.location.href = baseURL + 'login.html';
	    }
	} */
		});
		$.ajax({
			url: url + 'syUnitsController/findSyUnits',
			type: 'post',
			async: false,
			success: function(data) {
				var gong=data.SyUnits[0];
				for (var i = 0; i < gong.length; i++) {
					$("#dw").append('<option value="'+gong[i].id+'">'+gong[i].name+'</option>');
				}
			}
		});
		$.ajax({
			url: url + 'basZoneInfoController/findBasZoneInfos',
			type: 'post',
			async: false,
			dateType: 'json',
			success: function(data) {
				var da = data.BasZoneInfo[0];
				fyy = da;
				fyycount = da.length;
				sxfy();
			}
		});
	//显示、隐藏剩余的查询条件
	$('#btnMore').click(function(){
		$("#hQuery").toggle();
	});
	$("#rest").click(function() {
		$(".layui-input").val("");
		$("#dw").val("0");
	})
	$("#show").click(function(){
		layer.open({
			title: ['列表', 'color:#fff;background:#1da02b;'],
			type: 2,
			//skin: 'layui-layer-rim', //加上边框
			area: ['1050px', '440px'], //宽高
			content: 'associateMember_list.html'
			
		});
	})
	$("#chaxun").click(function(){
		var unitId=$("#dw").val();
		var zoneCode=$("#zoneCode").val();
		var empNo=$("#empNo").val();
		$.ajax({
			url: url + 'basZoneInfoController/findBasZoneInfoTrem',
			type: 'post',
			async: false,
			data: {
				"syUnits.id":unitId,
				"zoneCode":zoneCode,
				"syEmp.empNo":empNo
			},
			success: function(data) {
				var da = data;
				fyy = da;
				fyycount = da.length;
				sxfy();
			}
		});
		
	})
	//新增
	$('#opAdd').click(function(){
		//页面层
		layer.open({
		  title: ['新增', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['750px', '404px'], //宽高
		  content: 'zone_add.html',
		   success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  		iframe.child(null);
		  },
		  end: function() {
		  	location.reload();
		  }
		  
		});
	});

	//编辑
	$('#opUpdate').click(function(){
		var a = $("input[name=check]:checked").length;
		if (a == 0 || a > 1||a==null) {
			layer.msg('请选中一行', {
				icon: 5,
				time: 800
			});
			return;
		}
		var objects = $("input[name=check]:checked")[0].value;
		var grade = fyy[objects];
		//页面层
		layer.open({
		  title: ['编辑', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['750px', '404px'], //宽高
		  content: 'zone_add.html',
		  success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  		iframe.child(grade);
		  },
		  end: function() {
		  	location.reload();
		  }
		});
	});

	//删除
	$('#opDelete').click(function(){
		var a = $("input[name=check]:checked").length;
		if (a == 0 || a > 1||a==null) {
			layer.msg('请选中一行', {
				icon: 5,
				time: 800
			});
			return;
		}
		var objects = $("input[name=check]:checked")[0].value;
		var grade = fyy[objects];
		if (grade.stats == 1){
			layer.confirm('确定是否启用？', {
				btn: ['是', '否'] //按钮
			}, function() {
				$.ajax({
					url: url + 'basZoneInfoController/upBasZoneInfoByStats',
					type: 'post',
					async: false,
					data: {
						"zoneCode":grade.zoneCode,
						"stats": 0
					},
					success: function(data) {
						layer.msg('启用成功', {
							icon: 1,
							time: 1000
						});
						
					}
				});
				location.reload();
			}, function() {
			
			});
			return;
		}
		if (grade.stats == 0) {
			layer.confirm('确定是否作废？', {
				btn: ['是', '否'] //按钮
			}, function() {
				$.ajax({
					url: url + 'basZoneInfoController/upBasZoneInfoByStats',
					type: 'post',
					async: false,
					data: {
						"zoneCode":grade.zoneCode,
						"stats": 1
					},
					success: function(data) {
						layer.msg('作废成功', {
							icon: 1,
							time: 1000
						});
						
					}
				});
				location.reload();
			}, function() {
			
			});
			return;
		}
	});
	
});