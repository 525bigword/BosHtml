var fyy;
	var fyycount;
	var layer, layuiTable;
	$(function(){
		$.ajaxSetup({
			dataType: "json",
			cache: false,
		    headers: {
		        "Authorization": 'bos'+$.cookie('user')
		    },
		    xhrFields: {
			    withCredentials: true
		    } /* ,
		    complete: function(xhr) {
		        //token过期，则跳转到登录页面
		        if(xhr.responseJSON.code == 401){
		            parent.location.href = baseURL + 'login.html';
		        }
		    } */
		}); 
		
		$.ajax({
			url: url + 'basAssociateMemberController/findBasAssociateMember',
			type: 'post',
			async: false,
			dateType: 'json',
			success: function(data) {
				var da = data.BasAssociateMember[0];
				fyy = da;
				console.log(fyy);
				fyycount = da.length;
				sxfy();
			}
		});
	})
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
								item.empNo + '</td><td>' +
								item.empName + '</td><td>' +
								(item.zoneCode==""?"未分配":(item.zoneCode==null?"未分配":item.zoneCode)) + '</td><td>' +
								item.standardKg + '</td><td>' +
								item.standardLength + '</td><td>' +
								item.basStandardTime.timeName + '</td><td>' +
								item.syUnits.name + '</td><td>' +
								item.type + '</td></tr>');
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
//加载'form'模块，使checkbox、select、radio初始化
layui.use('form', function() {
				var form = layui.form;
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

//加载'table'模块
layui.use('table', function(){
  var table = layui.table;
});

$(function(){

	//新增详细信息
	$('#opDetailAdd').click(function(){
		//页面层
		layer.open({
		  title: ['新增', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['650px', '330px'], //宽高
		  content: 'associateMember_add.html',
		  end: function() {
		  	location.reload();
		  }
		});
	});
	//删除
	$("#del").click(function(){
		var a = $("input[name=check]:checked").length;
		if (a!=1){
			layer.msg('请选中一行', {
				icon: 5,
				time: 800
			});
			return;
		}
		var objects = $("input[name=check]:checked")[0].value;
		var grade = fyy[objects];
		if(grade.zoneCode!=null&&grade.zondeCode!=""){
			layer.msg('此关联人员已分配无法删除', {
				icon: 5,
				time: 800
			});
			return;
		}
		layer.confirm('确定是否作废？', {
		  	btn: ['是','否'] //按钮
		}, function(){
			$.ajax({
				url: url + 'basAssociateMemberController/delBasAssociateMemberById',
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
	})
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
		  area: ['650px', '330px'], //宽高
		  content: 'associateMember_add.html',
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
	
});
