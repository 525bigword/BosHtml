var citys;
		var shi;
		var qu;
		var id;
		var da;
		function child(pagedate,d) {
			citys=pagedate;
			if(d!=null){
				id=d.id;
				layui.use('form', function(){
					var form=layui.form;
				for(var i=0;i<citys.length;i++){
					$("#shen").append('<option value="'+citys[i].name+'">'+citys[i].name+'</option>');
					}
				$("#shen").val(d.province);
				for(i=0;i<citys.length;i++){
					if($("#shen").val()==citys[i].name){
						shi=citys[i].shen;
						for (var j = 0; j < shi.length; j++) {
							$("#shi").append('<option value="'+shi[j].name+'">'+shi[j].name+'</option>');
						}
						
					}
					
					}
				$("#shi").val(d.city);
				for (var i = 0; i < shi.length; i++) {
					if($("#shi").val()==shi[i].name){
						qu=shi[i].shi;
						for (var j = 0; j < qu.length; j++) {
							$("#qu").append('<option value="'+qu[j].zipcode+'" zipcode="'+qu[j].citycode+'" code="'+qu[j].pinyin+'">'+qu[j].name+'</option>');
						}
					}
				}
				$("#qu").val(d.postalCode);
				$("#shen").prop('disabled','disabled');
				$("#shi").prop('disabled','disabled');
				$("#qu").prop('disabled','disabled');
				$("#jg").val(d.entryUnit.id);
				$("#cg").prop('disabled','disabled');
				$("#cg").val(d.complementUnit.id);
				$("#xz").val(d.nature);
				$("#qy").val(d.theArea);
				form.render();
				})
				$("#bm").val(d.cityCode);
				$("#jm").val(d.simpleCode);
				$("#yz").val(d.postalCode);
				
			}else{
				layui.use('form', function(){
					var form=layui.form;
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
				form.render();
				})
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
							$("#jg").append('<option value="'+gong[i].id+'">'+gong[i].name+'</option>');
							$("#cg").append('<option value="'+gong[i].id+'">'+gong[i].name+'</option>');
						}
					}
				});
				$("#baocun").click(function(){
					var shen=$("#shen").val();
					var shi=$("#shi").val();
					var qu=$("#qu option:checked").text();
					var yz=$("#yz").val();
					var jm=$("#jm").val();
					var bm=$("#bm").val();
					var jg=$("#jg").val();
					var cg=$("#cg").val();
					var xz=$("#xz").val();
					var qy=$("#qy").val();
					if(id!=null&&id!=""){
						if(jg==null||jg==""||xz==null||xz==""||qy==null||qy==""){
							layer.msg('请将信息补充完整', {
								icon: 5,
								time: 800
							});
							return;
						}
						$.ajax({
							url: url + 'basAreaController/upBasAreaById',
							type: 'post',
							async: false,
							data: {
								"id":id,
								"entryUnit.id": jg,
								"nature": xz,
								"theArea":qy
							},
							success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						});
					}else{
						if(shen==null||shen==""||shi==null||shi==""||qu==null||qu==""||yz==null||yz==""||jm==null||jm==""||bm==null||bm==""||jg==null||jg==""||cg==null||cg==""||xz==null||xz==""||qy==null||qy==""){
							layer.msg('请将信息补充完整', {
								icon: 5,
								time: 800
							});
							return;
						}
						$.ajax({
							url: url + 'basAreaController/saveBasArea',
							type: 'post',
							async: false,
							data: {
								"province":shen,
								"city":shi,
								"county":qu,
								"postalCode":yz,
								"simpleCode":jm,
								"cityCode":bm,
								"complementUnit.id":cg,
								"entryUnit.id": jg,
								"nature": xz,
								"theArea":qy,
								"syEmp.id":da.map.syEmps.id
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
        layui.use('form', function(){
           var form=layui.form;
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
			$("#yz").val($('#qu').find("option:selected").val());
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
			$("#yz").val($('#qu').find("option:selected").val());
		   	form.render();
		   })
		   form.on('select(see2)',function(data){
		   	$("#bm").val($('#qu').find("option:selected").attr("zipcode"));
		   	$("#jm").val($('#qu').find("option:selected").attr("code"));
			$("#yz").val($('#qu').find("option:selected").val());
		   	form.render();
		   })
        });