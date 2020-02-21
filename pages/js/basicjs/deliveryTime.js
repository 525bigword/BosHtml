var citys;
 var shi;
 var qu;
 var fyy;
 var fyycount;
 var layer, layuiTable;
//加载'form'模块，使checkbox、select、radio初始化
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

//加载'table'组件
layui.use('table', function(){
  var table = layui.table;
});

//加载'laydate'时间组件
layui.use('laydate', function(){
  var laydate = layui.laydate;
  //执行一个laydate实例
  laydate.render({
    elem: '#opTime' //指定元素
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
										item.timeName + '</td><td>' +
										item.syUnits.name + '</td><td>' +
										item.workingTime + '</td><td>' +
										item.closingTime + '</td><td>' +
										item.saturdayWorkingTime + '</td><td>' +
										item.saturdayClosingTime + '</td><td>' +
										item.sundayWorkingTime + '</td><td>' +
										item.sundayClosingTime + '</td></tr>');
									console.log(page*4-inde);
									inde--;
								});
			
								return arr.join('');
							}();
							form.render();
						}
					});
					
				});
			}
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
			url: url + 'basStandarTimeController/findBasStandarTimes',
			type: 'post',
			async: false,
			dateType: 'json',
			success: function(data) {
				var da = data.BasStandarTime[0];
				fyy = da;
				fyycount = da.length;
				sxfy();
			}
		});
		$("#chaxun").click(function(){
			var dw=$("#dw").val();
			var name=$("#name").val();
			$.ajax({
				url: url + 'basStandarTimeController/findBasStandarTimeByTerm',
				type: 'post',
				async: false,
				data: {
					"syUnits.id":dw,
					"timeName":name
				},
				success: function(data) {
					var da = data;
					fyy = da;
					fyycount = da.length;
					sxfy();
				}
			});
		})
		$("#rest").click(function() {
			$(".layui-input").val("");
			$("#dw").val("0");
		})
	//新增
	$('#opAdd').click(function(){
		//页面层
		layer.open({
		  title: ['新增', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['750px', '340px'], //宽高
		  content: 'deliveryTime_add.html',
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
		  area: ['750px', '340px'], //宽高
		  content: 'deliveryTime_add.html',
		  success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  	// 向子页面的全局函数child传参
		  	iframe.child(grade);
		  },
		  end: function() {
		  	location.reload();
		  }
		});
	});

	//作废
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
		//询问框
		layer.confirm('确定是否删除？', {
		  	btn: ['是','否'] //按钮
		}, function(){
			$.ajax({
				url: url + 'basStandarTimeController/delBasStandarTime',
				type: 'post',
				async: false,
				data: {
					"id":grade.id
				},
				success: function(data) {
						layer.msg('删除成功', {icon: 1});
						location.reload();
				}
			});
		  
		}, function(){
		  	
		});
	});

});