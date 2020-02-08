var da;
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
				$.ajax({
					url: url + 'jurisdiction/parsetoken',
					type: 'get',
					header:{
						"Authorization": 'bos'+$.cookie('user')
					},
					async: false,
					dateType: 'json',
					success: function(data) {
						da=data;
						console.log(da);
						$("#empName").text(da.map.syEmps.empName);
						$("#unitName").text(da.map.syEmps.syUnits.name);
					}
				});
				getDate();
				setInterval(getDate, 1000);
				$('#minWeight').keyup(function() {
					$("#name").text($("#minWeight").val() + "-" + $("#maxWeight").val() + "公斤");
				});
				$('#maxWeight').keyup(function() {
					$("#name").text($("#minWeight").val() + "-" + $("#maxWeight").val() + "公斤");
				});
				$("#quxiao").click(function() {
					var index = parent.layer.getFrameIndex(window.name);
					parent.layer.close(index);
				})
				$("#add").click(function() {
					var name = $("#name").text();
					var minWeight = $("#minWeight").val();
					var maxWeight = $("#maxWeight").val();
					var status=$("input[type=radio][name=del]:checked").val();
					console.log(status);
					if (minWeight == null || maxWeight == null || minWeight == "" || maxWeight == "") {
						layer.msg('请将信息补充完整', {
							icon: 5,
							time: 800
						});
						return;
					}
					if (minWeight < 0) {
						layer.msg('最小重量不能为负值', {
							icon: 5,
							time: 800
						});
						return;
					}
					if (maxWeight < 0) {
						layer.msg('最大重量不能为负值', {
							icon: 5,
							time: 800
						});
						return;
					}
					if (maxWeight - minWeight < 0) {
						layer.msg('最大重量不能小于最小重量', {
							icon: 5,
							time: 1000
						});
						return;
					}
					$.ajax({
						url: url+'basDeliveryStandard/saveBasDeliveryStandard',
						type: 'post',
						async: false,
						data: {
							"name":name,
							"maxWeight": maxWeight,
							"minWeight": minWeight,
							"syEmp.id":da.map.syEmps.id,
							"syUnits.id":da.map.syEmps.syUnits.id,
							"status":status
						},
						success: function(data) {
							if(data==1){
								layer.msg('收派标准名称已存在', {
									icon: 5,
									time: 1000
								});
							}else{
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						}
					});
				})
			})
			layui.use('form', function() {

			});