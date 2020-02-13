var id;
		var da;
		var pda=0;
		var invalidateMark=0;
		function child(emps,entry,delivery,d) {
			if(d!=null){
				id=d.id;
				pda=d.pda;
				invalidateMark=d.invalidateMark;
				layui.use('form', function(){
				   var form=layui.form;
				   $("input:radio[name=pad][value="+pda+"]").prop('checked','true');
				   $("input:radio[name=invalidateMark][value="+invalidateMark+"]").prop('checked','true');
					for (var i = 0; i < emps.length; i++) {
						$("#emp").append('<option value="' + emps[i].empName + '">' + emps[i].empNo +
							'</option>');
					}
					for (var i = 0; i < entry.length; i++) {
						$("#entry").append('<option value="' + entry[i].id + '">' + entry[i].name+
							'</option>');
					}
					for (var i = 0; i < delivery.length; i++) {
						$("#delivry").append('<option value="' +delivery[i].name + '">' + delivery[i].name+
							'</option>');
					}
					$("#emp").val(d.empName);
					$("#emp").prop('disabled', 'disabled');
					$("#entry").val(d.type);
					$("#delivry").val(d.standardKg);
				   form.render();
				});
				$("#empName").val(d.empName);
				$("#tel").val(d.mobileNo);
				
				$("#length").val(d.standardLength);
				$("#models").val(d.models);
				$("#plantInt").val(d.plateInt);
			}else{
				layui.use('form', function(){
				   var form=layui.form;
					for (var i = 0; i < emps.length; i++) {
						$("#emp").append('<option value="' + emps[i].empName + '">' + emps[i].empNo +
							'</option>');
					}
					for (var i = 0; i < entry.length; i++) {
						$("#entry").append('<option value="' + entry[i].id + '">' + entry[i].name+
							'</option>');
					}
					for (var i = 0; i < delivery.length; i++) {
						$("#delivry").append('<option value="' +delivery[i].name + '">' + delivery[i].name+
							'</option>');
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
				}
			});
			$("#baocun").click(function(){
				var empNo=$("#emp option:checked").text();
				var empName=$("#empName").val();
				var tel=$("#tel").val();
				var type=$("#entry").val();
				var pda=$("input:radio[name=pad]:checked").val();
				var delivry=$("#delivry").val();
				var standardLength=$("#length").val();
				var models=$("#models").val();
				var plateInt=$("#plantInt").val();
				var invalidateMark=$("input:radio[name=invalidateMark]:checked").val();
				if(empNo==null||empNo==""||empName==null||empName==""||tel==null||tel==""||type==null||type==""||pda==null||pda==""||delivry==null||delivry==""||standardLength==null||standardLength==""||models==null||models==""||plateInt==null||plateInt==""||invalidateMark==null||invalidateMark==""){
					layer.msg('请将信息填写完整', {
						icon: 5,
						time: 800
					});
					return;
				}
				var regex=/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
				if(!regex.test(tel)){
					layer.msg('手机号不符合规则', {
						icon: 5,
						time: 800
					});
					return;
				}
				if(standardLength<=0){
					layer.msg('长度不能为负数', {
						icon: 5,
						time: 800
					});
					return;
				}
				if(id!=null&&id!=""){
					$.ajax({
						url: url+'basSubstituteController/upBasSubstituteById',
						type: 'post',
						async: false,
						data: {
							"id":id,
							"empNo": empNo,
							"empName": empName,
							"mobileNo":tel,
							"basBasicArchivesEntry.id":type,
							"pda":pda,
							"standardKg":delivry,
							"standardLength":standardLength,
							"models":models,
							"plateInt":plateInt,
							"invalidateMark":invalidateMark
						},
						success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
						}
					});
				}else{
					$.ajax({
						url: url+'basSubstituteController/saveBasSubstitute',
						type: 'post',
						async: false,
						data: {
							"empNo": empNo,
							"empName": empName,
							"mobileNo":tel,
							"basBasicArchivesEntry.id":type,
							"pda":pda,
							"standardKg":delivry,
							"standardLength":standardLength,
							"models":models,
							"plateInt":plateInt,
							"invalidateMark":invalidateMark,
							"syUnits.id":da.map.syEmps.syUnits.id,
							"syEmp.id":da.map.syEmps.id
						},
						success: function(data) {
							if(data==0){
								layer.msg('取派人已存在', {
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
        //加载'form'模块，使checkbox、select、radio初始化
        layui.use('form', function(){
           var form=layui.form;
		   form.on('select(see)',function(data){
		   	$("#empName").val($("#emp option:checked").val());
		   	form.render();
		   })
        });