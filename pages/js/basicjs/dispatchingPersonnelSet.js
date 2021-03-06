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
					all();
					$("#rest").click(function() {
						$(".layui-input").val("");
						$("#pda").val(3);
					})
					$("#chaxun").click(function(){
						var empNo=$("#empNo").val();
						var empName=$("#empName").val();
						var tel=$("#tel").val();
						var pda=$("#pda option:checked").val();
						$.ajax({
							url: url + 'basSubstituteController/findBasSubstituteByTerm',
							type: 'post',
							async: false,
							data: {
								"empNo": empNo,
								"empName": empName,
								"mobileNo": tel,
								"pda": pda
							},
							success: function(data) {
								var da = data;
								fyy = da;
								fyycount = da.length;
								sxfy();
							}
						});
					})
			})
			function all(){
			$.ajax({
				url: url + 'basSubstituteController/findBasSubstitutes',
				type: 'post',
				async: false,
				dateType: 'json',
				success: function(data) {
					var da = data.BasSubstitute[0];
					fyy = da;
					console.log(fyy);
					fyycount = da.length;
					sxfy();
				}
			});
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
										item.empNo + '</td><td>' +
										item.empName + '</td><td>' +
										item.mobileNo + '</td><td>' +
										(item.pda==0?"没有":"有") + '</td><td>' +
										(item.invalidateMark==0?"否":"是") + '</td><td>' +
										item.basBasicArchivesEntry.name + '</td><td>' +
										item.syUnits.name + '</td><td>' +
										item.models + '</td><td>' +
										item.plateInt + '</td><td>' +
										item.syEmp.empName + '</td><td>' +
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
			});

			//加载'table'组件
			layui.use('table', function() {
				var table = layui.table;
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
				var emps;
				var entry;
				var delivery;
				$.ajax({
					url: url + 'jurisdiction/findSyEmp',
					type: 'post',
					async: false,
					success: function(data) {
						emps=data;
					}
				});
				$.ajax({
					url: url + 'basBasicArchivesEntryController/findBasBasicArchivesEntryByParentID',
					type: 'post',
					data:{
						"parentID":6
					},
					async: false,
					success: function(data) {
						entry=data.BasBasicArchivesEntry[0];
					}
				});
				$.ajax({
					url: url + 'basDeliveryStandard/findBasDeliveryStandardAll',
					type: 'post',
					async: false,
					success: function(data) {
						delivery=data.BasDeliveryStandardAll[0];
					}
				});
				//新增
				$('#opAdd').click(function() {
					
					//页面层
					layer.open({
						title: ['新增', 'color:#fff;background:#1da02b;'],
						type: 2,
						//skin: 'layui-layer-rim', //加上边框
						area: ['900px', '378px'], //宽高
						content: 'dispatchingPersonnelSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
								iframe.child(emps,entry,delivery,null);
						},
						end: function() {
							location.reload();
						}
					});
				});

				//编辑
				$('#opUpdate').click(function() {
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
					//页面层
					layer.open({
						title: ['编辑', 'color:#fff;background:#1da02b;'],
						type: 2,
						//skin: 'layui-layer-rim', //加上边框
						area: ['900px', '378px'], //宽高
						content: 'dispatchingPersonnelSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
								iframe.child(emps,entry,delivery,grade);
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
					//询问框
					if (grade.invalidateMark == 1){
						layer.confirm('确定是否启用？', {
							btn: ['是', '否'] //按钮
						}, function() {
							$.ajax({
								url: url + 'basSubstituteController/upBasSubstituteStateById',
								type: 'post',
								async: false,
								data: {
									"id":grade.id,
									"invalidateMark":0
								},
								success: function(data) {
									layer.msg('启用成功', {
										icon: 1,
										time:3000
									});
									
								}
							});
							all();

						}, function() {

						});
						return;
					}
					if (grade.invalidateMark == 0) {
						layer.confirm('确定是否作废？', {
							btn: ['是', '否'] //按钮
						}, function() {
							$.ajax({
								url: url + 'basSubstituteController/upBasSubstituteStateById',
								type: 'post',
								async: false,
								data: {
									"id":grade.id,
									"invalidateMark":1
								},
								success: function(data) {
									layer.msg('作废成功', {
										icon: 1,
										time: 3000
									});
								}
							});
							all();
						}, function() {

						});
						return;
					}
				});

			});