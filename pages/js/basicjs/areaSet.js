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
									$("#qu").append('<option value="'+qu[j].zipcode+'" zipcode="'+qu[j].citycode+'" code="'+qu[j].pinyin+'">'+qu[j].name+'</option>');
								}
							}
						}
					}
					$("#bm").val($('#qu').find("option:selected").attr("zipcode"));
					$("#jm").val($('#qu').find("option:selected").attr("code"));
					form.render();
				})
				form.on('select(see1)',function(data){
					$("#qu").html('');
					for (var i = 0; i < shi.length; i++) {
						if($("#shi").val()==shi[i].name){
							qu=shi[i].shi;
							for (var j = 0; j < qu.length; j++) {
								$("#qu").append('<option value="'+qu[j].zipcode+'" zipcode="'+qu[j].citycode+'" code="'+qu[j].pinyin+'">'+qu[j].name+'</option>');
							}
						}
					}
					$("#bm").val($('#qu').find("option:selected").attr("zipcode"));
					$("#jm").val($('#qu').find("option:selected").attr("code"));
					form.render();
				})
				form.on('select(see2)',function(data){
					$("#bm").val($('#qu').find("option:selected").attr("zipcode"));
					$("#jm").val($('#qu').find("option:selected").attr("code"));
					form.render();
				})
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
										item.province + '</td><td>' +
										item.city + '</td><td>' +
										item.county + '</td><td>' +
										item.postalCode + '</td><td>' +
										item.simpleCode + '</td><td>' +
										item.cityCode + '</td><td>' +
										item.syEmp.empName + '</td><td>' +
										item.complementUnit.name + '</td><td>' +
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
					$.ajax({
						url: url + 'basAreaController/findBasAreas',
						type: 'post',
						async: false,
						dateType: 'json',
						success: function(data) {
							var da = data.BasArea[0];
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
				$("#shen").val("湖南省");
				for(i=0;i<citys.length;i++){
					if($("#shen").val()==citys[i].name){
						shi=citys[i].shen;
						for (var j = 0; j < shi.length; j++) {
							$("#shi").append('<option value="'+shi[j].name+'">'+shi[j].name+'</option>');
						}
						
					}
					
					}
				$("#shi").val("长沙市");
				for (var i = 0; i < shi.length; i++) {
					if($("#shi").val()==shi[i].name){
						qu=shi[i].shi;
						for (var j = 0; j < qu.length; j++) {
							$("#qu").append('<option value="'+qu[j].zipcode+'" zipcode="'+qu[j].citycode+'" code="'+qu[j].pinyin+'">'+qu[j].name+'</option>');
						}
					}
				}
				$("#qu").val("410013");
				$("#bm").val($('#qu').find("option:selected").attr("zipcode"));
				$("#jm").val($('#qu').find("option:selected").attr("code"));
				//显示、隐藏剩余的查询条件
				$('#btnMore').click(function() {
					$("#hQuery").toggle();
				});
				$("#rest").click(function() {
					$(".layui-input").val("");
					$("#shen").val("");
				})
				$("#chaxun").click(function(){
					var shen=$("#shen").val();
					var shi=$("#shi").val();
					var qu=$("#qu option:checked").text();
					var bm=$("#bm").val();
					var jm=$("#jm").val();
					$.ajax({
						url: url + 'basAreaController/findBasAreaByTerm',
						type: 'post',
						async: false,
						data: {
							"province": shen,
							"city": shi,
							"county": qu,
							"simpleCode": jm,
							"cityCode": bm
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
				$('#opAdd').click(function() {
					//页面层
					layer.open({
						title: ['新增', 'color:#fff;background:#1da02b;'],
						type: 2,
						//skin: 'layui-layer-rim', //加上边框
						area: ['650px', '390px'], //宽高
						content: 'areaSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
							// 向子页面的全局函数child传参
							iframe.child(citys,null);
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
						area: ['650px', '390px'], //宽高
						content: 'areaSet_add.html',
						success: function(layero, index) {
							// 获取子页面的iframe
							var iframe = window['layui-layer-iframe' + index];
							// 向子页面的全局函数child传参
							iframe.child(citys,grade);
						},
						end: function() {
							location.reload();
						}
					});
				});

				//删除
				/* $('#opDelete').click(function() {
					//询问框
					layer.confirm('确定是否删除？', {
						btn: ['是', '否'] //按钮
					}, function() {
						layer.msg('删除成功', {
							icon: 1
						});                       
					}, function() {

					});
				}); */

			});