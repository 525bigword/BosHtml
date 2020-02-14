var id;
		function child(d) {
			if(d!=null){
				id=d.id;
				layui.use('form', function(){
					var form=layui.form;
					$("#empNo").val(d.empNo);
					$("#dw").val(d.syUnits.id);
					$("#type").val(d.type);
					$("#spsj").append('<option value="'+d.basStandardTime.id+'">'+d.basStandardTime.timeName+'</option>');
					$("#spsj").val(d.basStandardTime.id);
					$("#empNo").prop("disabled","disabled");
					form.render();
				})
				$("#empName").val(d.empName);
				$("#kg").val(d.standardKg);
				$("#length").val(d.standardLength);
				
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
					url: 'http://localhost:8089/jurisdiction/parsetoken',
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
				url: 'http://localhost:8089/syUnitsController/findSyUnits',
				type: 'post',
				async: false,
				success: function(data) {
					var gong=data.SyUnits[0];
					for (var i = 0; i < gong.length; i++) {
						$("#dw").append('<option value="'+gong[i].id+'">'+gong[i].name+'</option>');
					}
				}
			});
			$.ajax({
				url: 'http://localhost:8089/basSubstituteController/findBasSubstitutes',
				type: 'post',
				async: false,
				success: function(data) {
					var gong = data.BasSubstitute[0];
					for (var i = 0; i < gong.length; i++) {
						$("#empNo").append('<option value="'+gong[i].empNo+'" emp="'+gong[i].empName+'" zipcode="'+gong[i].standardKg+'" code="'+gong[i].standardLength+'">'+gong[i].empNo+'</option>');
					}
				}
			});
			$("#baocun").click(function(){
				var empNo=$("#empNo").val();
				var empName=$('#empName').val();
				var kg=$("#kg").val();
				var length=$("#length").val();
				var dw=$("#dw").val();
				var spsj=$("#spsj").val();
				var type=$("#type").val();
				if(empNo==null||empNo==""||empName==null||empName==""||kg==null||kg==""||length==null||length==""||dw==null||dw==""||spsj==null||spsj==""||type==null||type==""){
					layer.msg('请将信息补充完整', {
						icon: 5,
						time: 800
					});
					return;
				}
				if(id!=null&&id!=""){
				$.ajax({
					url: 'http://localhost:8089/basAssociateMemberController/upBasAssociateMemberById',
					type: 'post',
					async: false,
					data: {
						"id":id,
						"basStandardTime.id": spsj,
						"syUnits.id": dw,
						"type":type
					},
					success: function(data) {
						var index = parent.layer.getFrameIndex(window.name);
						parent.layer.close(index);
					}
				});
				}else{
					$.ajax({
						url: 'http://localhost:8089/basAssociateMemberController/saveBasAssociateMember',
						type: 'post',
						async: false,
						data: {
							"empNo":empNo,
							"empName":empName,
							"standardKg":kg,
							"standardLength":length,
							"basStandardTime.id": spsj,
							"syUnits.id": dw,
							"type":type
						},
						success: function(data) {
							if(data==0){
								layer.msg('关联人员已存在', {
									icon: 5,
									time: 1000
								});
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
		layui.use('form', function() {
			var form=layui.form;
			form.on('select(see)',function(data){
				var Unit=$("#dw").val();
				$("#spsj").html('');
				if(Unit!=""&&Unit!=null){
					$.ajax({
						url: 'http://localhost:8089/basStandarTimeController/findBasAssociateMemberByUId',
						type: 'post',
						async: false,
						data:"id="+Unit,
						success: function(data) {
							var gong=data;
							for (var i = 0; i < gong.length; i++) {
								$("#spsj").append('<option value="'+gong[i].id+'">'+gong[i].timeName+'</option>');
							}
						}
					});
				}
				form.render();
			})
			form.on('select(see1)',function(data){
				$("#empName").val($('#empNo').find("option:selected").attr("emp"));
				$("#kg").val($('#empNo').find("option:selected").attr("zipcode"));
				$("#length").val($('#empNo').find("option:selected").attr("code"));
				form.render();
			})
		});
		
		//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
		layui.use('element', function() {
			var element = layui.element;
		
			//…
		});