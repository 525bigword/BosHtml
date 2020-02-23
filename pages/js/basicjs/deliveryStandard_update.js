var basicFileNumber;
			function child(d) {
				basicFileNumber=d.basicFileNumber;
				$("#name").text(d.name);
				$("#minWeight").val(d.minWeight);
				$("#maxWeight").val(d.maxWeight);
				$("#empName").text(d.syEmp.empName);
				$("#untis").text(d.syUnits.name);
				$("#time").text(d.operationTime);
			}
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
				$("#quxiao").click(function() {
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				})
				$("#upda").click(function(){
					var minWeight=$("#minWeight").val();
					var maxWeight=$("#maxWeight").val();
					if(minWeight==null||maxWeight==null||minWeight==""||maxWeight==""){
						layer.msg('请将信息补充完整', {
							icon: 5,
							time: 800
						});
						return;
					}
					if(minWeight<0){
						layer.msg('最小重量不能为负值', {
							icon: 5,
							time: 800
						});
						return;
					}
					if(maxWeight<0){
						layer.msg('最大重量不能为负值', {
							icon: 5,
							time: 800
						});
						return;
					}
					if(maxWeight-minWeight<0){
						layer.msg('最大重量不能小于最小重量', {
							icon: 5,
							time: 1000
						});
						return;
					}
					$.ajax({
						url: 'http://localhost:8089/basDeliveryStandard/upBasDeliveryStandardByBasicFileNumber',
						type: 'post',
						async: false,
						data: {
							"maxWeight": maxWeight,
							"minWeight": minWeight,
							"basicFileNumber":basicFileNumber
						},
						success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
						}
					});
				})
			})
			
			//加载'form'模块，使checkbox、select、radio初始化                                                                                              
			layui.use('form', function() {
				
			});