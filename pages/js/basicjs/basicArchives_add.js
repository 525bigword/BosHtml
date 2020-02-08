var id;
		var grade=0;
		var st;
		var da;
        function child(d) {
			if(d!=null){
				clearInterval(st);
				id=d.id;
				$("#name").val(d.name);
				grade=d.grade;
				$("#empName").text(d.syEmp.empName);
				$("#untis").text(d.syUnits.name);
				$("#time").text(d.operationTime);
				$("#remarks").val(d.remarks);
				layui.use('form', function(){
				   var form=layui.form;
				   $("input:radio[value="+grade+"]").prop('checked','true');
				   $("#name").prop('readonly','true');
				   form.render();
				});
			}
			
			
        	
        }
        //加载'form'模块，使checkbox、select、radio初始化
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
						url: 'http://localhost:8089/jurisdiction/parsetoken',
						type: 'get',
						header:{
							"Authorization": 'bos'+$.cookie('user')
						},
						async: false,
						dateType: 'json',
						success: function(data) {
							da=data;
							$("#empName").text(da.map.syEmps.empName);
							$("#untis").text(da.map.syEmps.syUnits.name);
							getDate();
							st=setInterval(getDate, 1000);
						}
					});
			$("#baocun").click(function(){
				var name=$("#name").val();
				var gra=$("input[type=radio]:checked").val();
				var remark=$("#remarks").val();
				if(name==null||name==""){
					layer.msg('请将信息补充完整', {
						icon: 5,
						time: 800
					});
					return;
				}
				if(id!=null&&id!=""){
					if(grade==1&&gra==0){
						layer.msg('无权取消档案分级', {
							icon: 5,
							time: 800
						});
						return;
					}
					$.ajax({
						url:'http://localhost:8089/basicArchiveController/upBasBasicArchivesById',
						type: 'post',
						async: false,
						data: {
							"id":id,
							"grade": gra,
							"remarks": remark
						},
						success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							
						}
					});
				}else{
					$.ajax({
						url:'http://localhost:8089/basicArchiveController/saveBasBasicArchives',
						type: 'post',
						async: false,
						data: {
							"name":name,
							"grade": gra,
							"syEmp.id":da.map.syEmps.id,
							"syUnits.id":da.map.syEmps.syUnits.id,
							"remarks":remark
						},
						success: function(data) {
							if(data==1){
								layer.msg('基础档案名称已存在', {
									icon: 5,
									time: 1000
								});
							}else{
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

			});