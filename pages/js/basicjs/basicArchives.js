var fyy;
			var fyycount;
			var layer, layuiTable;
			$(function() {
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
				//初始化数据
				$.ajax({
					url: url + 'basicArchiveController/findBasicArchives',
					type: 'post',
					async: false,
					dateType: 'json',
					success: function(data) {
						var da = data.BasicArchives[0];
						fyy = da;
						fyycount = da.length;
						sxfy();
					}
				});
				//查询
				$("#chaxun").click(function() {
					var basicFileNumber = $("#basicFileNumber").val();
					var name = $("#name").val();
					var empName = $("#empName").val();
					var operationTime = $("#opTime").val();
					console.log(basicFileNumber + " " + name + " " + empName + " " + operationTime);
					$.ajax({
						url: url + 'basicArchiveController/findBasBasicArchivesByTerm',
						type: 'post',
						async: false,
						data: {
							"basicFileNumber": basicFileNumber,
							"name": name,
							"syEmp.empName": empName,
							"operationTime": operationTime
						},
						success: function(data) {
							fyy = data;
							fyycount = data.length;
							sxfy();
						}
					});
				})
			})
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
										item.basicFileNumber + '<input type="hidden" value=' + item.id + '></td><td>' +
										item.name + '</td><td>' +
										(item.grade == 0 ? "否" : "是") + '</td><td>' +
										item.syEmp.empName + '</td><td>' +
										item.syUnits.name + '</td><td>' +
										item.operationTime + '</td><td>' +
										(item.remarks!=null?item.remarks:"") + '</td><td>' +
										(item.grade == 0 ? '<button type="button" class="layui-btn layui-btn-disabled">查看列表</button>' :
											'<button type="button" onclick="ckk('+item.id+')" class="layui-btn layui-btn-small btnQuery">查看列表</button></td></tr>'));
									console.log(page*4-inde);
									inde--;
									
								});

								return arr.join('');
							}();
							form.render();
						},

					});

				});
				console.log(fyy);
				
			}
			layui.use('laydate', function() {
				var laydate = layui.laydate;
				//执行一个laydate实例
				laydate.render({
					elem: '#opTime' //指定元素
				});
			});
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
			layui.use('table', function() {
				var table = layui.table;
			});

			$(function() {
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
				//显示、隐藏剩余的查询条件
				$('#btnMore').click(function() {
					$("#hQuery").toggle();
				});

				//新增主信息
				$('#opAdd').click(function() {
					//页面层
					layer.open({
						title: ['新增', 'color:#fff;background:#1da02b;'],
						type: 2,
						//skin: 'layui-layer-rim', //加上边框
						area: ['650px', '360px'], //宽高
						content: 'basicArchives_add.html',
						end: function() {
						window.location.reload();
					}
					});
				});
				$("#rest").click(function() {
					$(".layui-input").val("");
				})

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
						area: ['650px', '360px'], //宽高
						content: 'basicArchives_add.html',
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
				$("#del").click(function(){
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
					if(grade.grade==1){
						layer.msg('已分级不可取消', {
							icon: 5,
							time: 800
						});
						return;
					}
					layer.confirm('确定是否取消？', {
						btn: ['是', '否'] //按钮
					}, function() {
						$.ajax({
							url: url + 'basicArchiveController/delBasBasicArchivesById',
							type: 'post',
							async: false,
							data: "id="+grade.id,
							success: function(data) {
								layer.msg('取消成功', {
									icon: 1,
									time: 1000
								});
								window.location.reload();
							}
						});
					
					}, function() {
					
					});
					
				})
				

			});
			//查看列表
			function ckk(id){
				//页面层
				layer.open({
					title: ['列表', 'color:#fff;background:#1da02b;'],
					type: 2,
					//skin: 'layui-layer-rim', //加上边框
					area: ['980px', '440px'], //宽高
					content: 'basicArchives_list.html',
					success: function(layero, index) {
						// 获取子页面的iframe
						var iframe = window['layui-layer-iframe' + index];
							iframe.child(id);
					},
					end: function() {
						window.location.reload();
					}
				});
			}