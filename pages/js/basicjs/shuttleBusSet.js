var fyy;
			var fyycount;
			var layer, layuiTable;
			$(function() {
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
				//初始化数据
				$.ajax({
					url: url + 'basShuttleBusController/findBasShuttleBus',
					type: 'post',
					async: false,
					dateType: 'json',
					success: function(data) {
						var da = data.BasShuttleBus[0];
						fyy = da;
						fyycount = da.length;
						sxfy();

						layui.use('form', function() {
							var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
							$("#select").append('<option value="">请选择</option>');
							var ty=$("#city").val();
							for (var i = 0; i < fyy.length; i++) {
								if(ty==fyy[i].lineType){
								$("#select").append('<option value="' + da[i].logLogistics.id + '">' + da[i].logLogistics.lineName +
									'</option>');
									}
							}
							 $("#select option").each(function () {
							 								var text = $(this).text();
							 								if ($("#select option:contains('" + text + "')").length > 1){
							 									$("#select option:contains('" + text + "'):gt(0)").remove();
							 									}
							 								})
							form.render();
						});
					}
				});
				$("#chaxun").click(function() {
					var city=$("#city").val();
					var select=$("#select option:checked").text();
					var carid=$("#carid").val();
					var carname=$("#carname").val();
					var gong=$("#gong").val();
					$.ajax({
						url: url + 'basShuttleBusController/findBasShuttleBusByTerm',
						type: 'post',
						async: false,
						data: {
							"lineType": city,
							"logLogistics.lineName": select,
							"licensePlateInt": carid,
							"driver": carname,
							"carrier": gong
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
				})
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
							var page = $(".layui-laypage-em").next().html();
							var inde = 4;
							document.getElementById('tbody').innerHTML = function() {
								var arr = [],
									thisData = fyy.concat()
									.splice(obj.curr * obj.limit - obj.limit,
										obj.limit);
								layui.each(thisData, function(index, item) {
									arr.push('<tr><td><input type="checkbox" lay-filter="check" name="check" lay-skin="primary" value=' +
										(page * 4 - inde) + '></td><td>' +
										(parseInt(index) + 1) + '</td><td>' +
										(item.lineType == 1 ? "全部":(item.lineType==2?"干线" : (item.lineType == 3 ? "周边" : (item.lineType == 4 ? "省内" : (item.lineType ==
											5 ? "临时" : "市内"))))) + '</td><td>' +
										item.logLogistics.lineName + '</td><td>' +
										item.licensePlateInt + '</td><td>' +
										item.carrier + '</td><td>' +
										item.models + '</td><td>' +
										item.driver + '</td><td>' +
										item.telephone + '</td><td>' +
										item.ton + '</td><td>' +
										item.syEmp.empName + '</td><td>' +
										item.syUnits.name + '</td><td>' +
										item.operationTime + '</td></tr>');
									console.log(page * 4 - inde);
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
				form.on('select(see)',function(data){
					$("#select").html('');
					$("#select").append('<option value="">请选择</option>');
					for (var i = 0; i < fyy.length; i++) {
						if(data.value==fyy[i].lineType){
							$("#select").append('<option value="' + fyy[i].logLogistics.id + '">' + fyy[i].logLogistics.lineName +
								'</option>');
						}
						if(data.value==0){
							$("#select").append('<option value="' + fyy[i].logLogistics.id + '">' + fyy[i].logLogistics.lineName +
								'</option>');
						}
						
					}
					$("#select option").each(function () {
													var text = $(this).text();
													if ($("#select option:contains('" + text + "')").length > 1){
														$("#select option:contains('" + text + "'):gt(0)").remove();
														}
													})
					form.render();
				})
			});

			//加载'laydate'时间组件
			layui.use('laydate', function() {
				var laydate = layui.laydate;
				//执行一个laydate实例
				laydate.render({
					elem: '#opTime' //指定元素
				});
			});

			$(function() {
				//显示、隐藏剩余的查询条件
				$('#btnMore').click(function() {
					$("#hQuery").toggle();
				});

				//新增
				$('#opAdd').click(function() {
					//页面层
					layer.open({
						title: ['新增', 'color:#fff;background:#1da02b;'],
						type: 2,
						//skin: 'layui-layer-rim', //加上边框
						area: ['650px', '430px'], //宽高
						content: 'shuttleBusSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
							// 向子页面的全局函数child传参
							iframe.child(fyy,null);
						},
						end: function() {
							location.reload();
						}
					});
				});

				//编辑
				$('#opUpdate').click(function() {
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
						area: ['650px', '430px'], //宽高
						content: 'shuttleBusSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
							// 向子页面的全局函数child传参
							iframe.child(fyy,grade);
						},
						end: function() {
							location.reload();
						}
					});
				});

				//删除
				$('#opDelete').click(function() {
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
					console.log(grade);
					//询问框
					layer.confirm('确定是否删除？', {
						btn: ['是', '否'] //按钮
					}, function() {
						$.ajax({
							url: url + 'basShuttleBusController/delBasShuttleBusById',
							type: 'post',
							async: false,
							data: {
								"id":grade.id
							},
							success: function(data) {
								layer.msg('删除成功', {
									icon: 1,
									time:800
								});
								window.location.reload();
							}
						});
						
					}, function() {

					});
				});

			});