var da;
		var id;
		var adminD;
		function child(pagedate,d) {
			da=pagedate;
			if(d!=null){
				id=d.id;
				$("#carid").val(d.licensePlateInt);
				$("#gong").val(d.carrier);
				$("#carmodel").val(d.models);
				$("#driver").val(d.driver);
				$("#phone").val(d.telephone);
				$("#weight").val(d.ton);
				if(d.remarks!=null){
					$("#remarks").val(d.remarks);
				}
				$("#city").val(d.lineType);
				layui.use('form', function() {
					var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
					
						for (var i = 0; i < da.length; i++) {
							if(da[i].lineType==d.lineType){
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
					$("#select").val(d.logLogistics.id);
					form.render();
				});
			}else{
				layui.use('form', function() {
					var form = layui.form; //只有执行了这一步，部分表单元素才会自动修饰成功
					var ty=$("#city").val();
						for (var i = 0; i < da.length; i++) {
							if(ty==da[i].lineType){
								$("#select").append('<option value="' + da[i].logLogistics.id + '">' + da[i].logLogistics.lineName +
									'</option>');
							}
							
						}
					form.render();
				});
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
						adminD=data;
					}
				});
				$("#baocun").click(function(){
					var city=$("#city").val();
					var select=$("#select").val();
					var licensePlateInt=$("#carid").val();
					var carrier=$("#gong").val();
					var models=$("#carmodel").val();
					var driver=$("#driver").val();
					var telephone=$("#phone").val();
					var ton=$("#weight").val();
					var remarks=$("#remarks").val();
					if(licensePlateInt==null||licensePlateInt==""||carrier==null||carrier==""||models==null||models==""||driver==null||driver==""||telephone==null||telephone==""||ton==null||ton==""){
						layer.msg('请将信息填写完整', {
							icon: 5,
							time: 800
						});
						return;
					}
					var regex=/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
					if(!regex.test(telephone)){
						layer.msg('手机号不符合规则', {
							icon: 5,
							time: 800
						});
						return;
					}
					if(ton<0){
						layer.msg('吨位不能为负', {
							icon: 5,
							time: 800
						});
						return;
					}
					if(id!=null&&id!=""){
						$.ajax({
							url: url+'basShuttleBusController/upBasShuttleBusById',
							type: 'post',
							async: false,
							data: {
								"id":id,
								"lineType": city,
								"logLogistics.id": select,
								"licensePlateInt":licensePlateInt,
								"carrier":carrier,
								"models":models,
								"driver":driver,
								"telephone":telephone,
								"ton":ton,
								"remarks":remarks
							},
							success: function(data) {
									var index = parent.layer.getFrameIndex(window.name);
									parent.layer.close(index);
								
							}
						});
					}else{
							$.ajax({
								url: url+'basShuttleBusController/saveBasShuttleBus',
								type: 'post',
								async: false,
								data: {
									"lineType": city,
									"logLogistics.id": select,
									"licensePlateInt":licensePlateInt,
									"carrier":carrier,
									"models":models,
									"driver":driver,
									"telephone":telephone,
									"ton":ton,
									"remarks":remarks,
									"syUnits.id":adminD.map.syEmps.syUnits.id,
									"syEmp.id":adminD.map.syEmps.id
								},
								success: function(data) {
										var index = parent.layer.getFrameIndex(window.name);
										parent.layer.close(index);
									
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
        	var form = layui.form;
			form.on('select(see)',function(data){
				$("#select").html('');
				for (var i = 0; i < da.length; i++) {
					if(data.value==da[i].lineType){
						$("#select").append('<option value="' + da[i].logLogistics.id + '">' + da[i].logLogistics.lineName +
							'</option>');
					}
					if(data.value==0){
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
			})
        });