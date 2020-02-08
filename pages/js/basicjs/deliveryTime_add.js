var id;
			var da;
			function child(d) {
				if (d != null) {
					id = d.id;
					layui.use('form', function() {
						var form=layui.form;
						$("#dw").val(d.syUnits.id);
						$("#timeName").prop("readonly","readonly");
						form.render();
					});
					$("#timeName").val(d.timeName);
					$("#workingTime").val(d.workingTime);
					$("#closingTime").val(d.closingTime);
					$("#saturdayWorkingTime").val(d.saturdayWorkingTime);
					$("#saturdayClosingTime").val(d.saturdayClosingTime);
					$("#sundayWorkingTime").val(d.sundayWorkingTime);
					$("#sundayClosingTime").val(d.sundayClosingTime);
				}
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
						url: url+'jurisdiction/parsetoken',
						type: 'get',
						header:{
							"Authorization": 'bos'+$.cookie('user')
						},
						async: false,
						dateType: 'json',
						success: function(data) {
							da=data;
						}
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
				$("#baocun").click(function(){
					var dw=$("#dw").val();
					var timeName=$("#timeName").val();
					var workingTime=$("#workingTime").val();
					var closingTime=$("#closingTime").val();
					var saturdayWorkingTime=$("#saturdayWorkingTime").val();
					var saturdayClosingTime=$("#saturdayClosingTime").val();
					var sundayWorkingTime=$("#sundayWorkingTime").val();
					var sundayClosingTime=$("#sundayClosingTime").val();
					if(dw==0||dw=="0"||timeName==null||timeName==""||workingTime==null||workingTime==""||closingTime==null||closingTime==""||saturdayWorkingTime==null||saturdayWorkingTime==""||saturdayClosingTime==null||saturdayClosingTime==""||sundayWorkingTime==null||sundayWorkingTime==""||sundayClosingTime==null||sundayClosingTime==""){
						layer.msg('请将信息补充完整', {
							icon: 5,
							time: 1000
						});
						return;
					}
					if(workingTime>closingTime||saturdayWorkingTime>saturdayClosingTime||sundayWorkingTime>sundayClosingTime){
						layer.msg('下班时间必须大于上班时间', {
							icon: 5,
							time:1000
						});
						return;
					}
					if(id!=null&&id!=""){
						$.ajax({
							url: url + 'basStandarTimeController/upBasStandarTimeById',
							type: 'post',
							async: false,
							data: {
								"id":id,
								"syUnits.id":dw,
								"workingTime":workingTime,
								"closingTime":closingTime,
								"saturdayWorkingTime":saturdayWorkingTime,
								"saturdayClosingTime":saturdayClosingTime,
								"sundayWorkingTime":sundayWorkingTime,
								"sundayClosingTime": sundayClosingTime
							},
							success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						});
					}else{
						$.ajax({
							url: url + 'basStandarTimeController/saveBasStandarTime',
							type: 'post',
							async: false,
							data: {
								"timeName":timeName,
								"syUnits.id":dw,
								"workingTime":workingTime,
								"closingTime":closingTime,
								"saturdayWorkingTime":saturdayWorkingTime,
								"saturdayClosingTime":saturdayClosingTime,
								"sundayWorkingTime":sundayWorkingTime,
								"sundayClosingTime": sundayClosingTime
							},
							success: function(data) {
								if(data==0){
									layer.msg('时间名称重复', {
										icon: 5,
										time: 800
									});
									return;
								}
								if(data==1){
									var index = parent.layer.getFrameIndex(window.name);
									parent.layer.close(index);
								}
								
							}
						});
					}
				})
				$("#quxiao").click(function() {
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				})
			})
			//加载'form'模块，使checkbox、select、radio初始化
			layui.use('form', function() {

			});
			layui.use('laydate', function(){
				var laydate = layui.laydate;
				 //执行一个laydate实例
				laydate.render({
				  elem: '#workingTime' ,//指定元素
					type:'time'
				});
				 //执行一个laydate实例
				laydate.render({
				  elem: '#closingTime' ,//指定元素
					type:'time'
				});
				 //执行一个laydate实例
				laydate.render({
				  elem: '#saturdayWorkingTime' ,//指定元素
					type:'time'
				});
				 //执行一个laydate实例
				laydate.render({
				  elem: '#saturdayClosingTime' ,//指定元素
					type:'time'
				});
				 //执行一个laydate实例
				laydate.render({
				  elem: '#sundayWorkingTime' ,//指定元素
					type:'time'
				});
				 //执行一个laydate实例
				laydate.render({
				  elem: '#sundayClosingTime' ,//指定元素
					type:'time'
				});
 
			});