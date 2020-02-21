			var citys;
			var shi;
			var qu;
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
				form.on('select(see)',function(data){
					$("#shi").html('');
					$("#qu").html('');
					if($("#shen").val()!==null&&$("#shen").val()!=""){
						for(i=0;i<citys.length;i++){
							if($("#shen").val()==citys[i].name){
								shi=citys[i].shen;
								for (var j = 0; j < shi.length; j++) {
									$("#shi").append('<option value="'+shi[j].name+'">'+shi[j].name+'</option>');
								}
								
							}
							
							}
						for (var i = 0; i < shi.length; i++) {
							if($("#shi").val()==shi[i].name){
								qu=shi[i].shi;
								for (var j = 0; j < qu.length; j++) {
									$("#qu").append('<option value="'+qu[j].name+'">'+qu[j].name+'</option>');
								}
							}
						}
					}
					form.render();
				})
				form.on('select(see1)',function(data){
					$("#qu").html('');
					for (var i = 0; i < shi.length; i++) {
						if($("#shi").val()==shi[i].name){
							qu=shi[i].shi;
							for (var j = 0; j < qu.length; j++) {
								$("#qu").append('<option value="'+qu[j].name+'">'+qu[j].name+'</option>');
							}
						}
					}
					form.render();
				})
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
			url: url + 'basPartitionController/findBasPartitions',
			type: 'post',
			async: false,
			dateType: 'json',
			success: function(data) {
				var da = data.BasPartition[0];
				fyy = da;
				fyycount = da.length;
				sxfy();
			}
		});
		$.ajax({
			url: url + 'cityController/findCities',
			type: 'post',
			async: false,
			dateType: 'json',
			success: function(data) {
				citys=data;
			}
		});
		for(var i=0;i<citys.length;i++){
			$("#shen").append('<option value="'+citys[i].name+'">'+citys[i].name+'</option>');
			}
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
										item.sortingCode + '</td><td>' +
										(item.zoneCode==""?"未分配":(item.zoneCode==null?"未分配":item.zoneCode)) + '</td><td>' +
										item.province + '</td><td>' +
										item.city + '</td><td>' +
										item.county + '</td><td>' +
										item.keyword + '</td><td>' +
										item.startInt + '</td><td>' +
										item.terminateInt + '</td><td>' +
										(item.sDInt==1?"单号":"双号") + '</td><td>' +
										item.syEmp.empName + '</td><td>' +
										item.syUnits.name + '</td><td>' +
										item.operationTime + '</td></tr>');
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
	//显示、隐藏剩余的查询条件
	$('#btnMore').click(function(){
		$("#hQuery").toggle();
	});
	$("#rest").click(function() {
		$(".layui-input").val("");
		$("#shen").val("");
	})
	$("#chaxun").click(function(){
		var shen=$("#shen").val();
		var shi=$("#shi").val();
		var qu=$("#qu").val();
		var dqbm=$("#dqbm").val();
		var key1=$("#key").val();
		$.ajax({
			url: url + 'basPartitionController/findBasPartitionByTerm',
			type: 'post',
			async: false,
			data: {
				"province": shen,
				"city": shi,
				"county": qu,
				"zoneCode": dqbm,
				"keyword": key1
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
		  area: ['900px', '280px'], //宽高
		  content: 'partition_add.html',
		  success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  		iframe.child(citys,null);
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
		  area: ['900px', '280px'], //宽高
		  content: 'partition_add.html',
		  success: function(layero, index) {
		  	// 获取子页面的iframe
		  	var iframe = window['layui-layer-iframe' + index];
		  		iframe.child(citys,grade);
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
		if(grade.zoneCode!=""&&grade.zoneCode!=null){
			layer.msg('该分区已被分配无法删除', {
				icon: 5,
				time: 800
			});
			return;
		}
		//询问框
		layer.confirm('确定是否删除？', {
		  	btn: ['是','否'] //按钮
		}, function(){
			$.ajax({
				url: url + 'basPartitionController/delBasPartition',
				type: 'post',
				async: false,
				data: "id="+grade.id,
				success: function(data) {
					layer.msg('删除成功', {icon: 1,
					time:1500});
					window.location.reload();
				}
			})
		  	
		}, function(){
		  	
		});
	});

});