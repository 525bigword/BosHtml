var fyy;
	var fyycount;
	var parentID=0;
   function child(d) {
	   parentID=d;
	      $.ajax({
	      	url: url + 'basBasicArchivesEntryController/findBasBasicArchivesEntryByParentID',
	      	type: 'post',
	      	async: false,
	      	data: "parentID="+d,
	      	success: function(data) {
	      		var da = data.BasBasicArchivesEntry[0];
	      		fyy = da;
	      		fyycount = da.length;
	      		sxfy();
	      	}
	      });
   }
	function sxfy() {
		/* if(fyycount<5){
			$("#demo1").hide();
		} */
		layui.use(['laypage', 'layer', 'form'], function() {
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
					console.log(page);
					document.getElementById('tbody').innerHTML = function() {
						var arr = [],
							thisData = fyy.concat()
							.splice(obj.curr * obj.limit - obj.limit,
								obj.limit);
						layui.each(thisData, function(index, item) {
							arr.push('<tr><td><input type="checkbox" lay-filter="check" name="check" lay-skin="primary" value=' +
								(page*4-inde) + '></td><td>' +
								(parseInt(index) + 1) + '</td><td>' +
								item.name + '</td><td>' +
								item.mnemonicCode + '</td><td>' +
								(item.available == 0 ? "否" : "是") + '</td><td>' +
								item.syEmp.empName + '</td><td>' +
								item.syUnits.name + '</td><td>' +
								item.operationTime + '</td><td>' +
								(item.remarks!=null?item.remarks:"") + '</td></tr>');
							console.log(page*4-inde);
							inde--;
							
						});
	
						return arr.join('');
					}();
					form.render();
				},
	
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
	//新增详细信息
	$('#opDetailAdd').click(function(){
		//页面层
		layer.open({
		  title: ['新增', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['650px', '375px'], //宽高
		  content: 'basicArchives_detail_add.html',
		  success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  		iframe.child(parentID);
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
		console.log(grade);
		//页面层
		layer.open({
		  title: ['编辑', 'color:#fff;background:#1da02b;'],
		  type: 2,
		  //skin: 'layui-layer-rim', //加上边框
		  area: ['650px', '375px'], //宽高
		  content: 'basicArchives_detail_add.html',
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
	$('#zuofei').click(function() {
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
			//询问框
			if (grade.available == 1){
				layer.confirm('确定是否启用？', {
					btn: ['是', '否'] //按钮
				}, function() {
					$.ajax({
						url: url + 'basBasicArchivesEntryController/upBasBasicArchivesEntryAvailable',
						type: 'post',
						async: false,
						data: {
							"id":grade.id,
							"available": 0
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
			if (grade.available == 0) {
				layer.confirm('确定是否作废？', {
					btn: ['是', '否'] //按钮
				}, function() {
					$.ajax({
						url: url + 'basBasicArchivesEntryController/upBasBasicArchivesEntryAvailable',
						type: 'post',
						async: false,
						data: {
							"id":grade.id,
							"available": 1
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
