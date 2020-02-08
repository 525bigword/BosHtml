var id;
		var grade=0;
		var st;
		var da;
		var parentID=0;
         function child(d) {
        	if(d.name!=null&&d.name!=""){
        		clearInterval(st);
        		id=d.id;
        		$("#name").val(d.name);
        		grade=d.available;
				$("#mnemonicCode").text(d.mnemonicCode);
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
        	}else{
				parentID=d;
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
					url:'http://localhost:8089/jurisdiction/parsetoken',
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
				$.ajax({
					url: 'http://localhost:8089/basBasicArchivesEntryController/findBasBasicArchivesEntryMCode',
					type: 'post',
					async: false,
					dateType: 'json',
					success: function(data) {
						$("#mnemonicCode").text(data);
					}
				});
			$("#qd").click(function(){
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
					$.ajax({
						url:'http://localhost:8089/basBasicArchivesEntryController/upBasBasicArchivesEntryById',
						type: 'post',
						async: false,
						data: {
							"id":id,
							"available": gra,
							"remarks": remark
						},
						success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							
						}
					});
				}else{
					var mnemonicCode=$("#mnemonicCode").text();
					$.ajax({
						url: 'http://localhost:8089/basBasicArchivesEntryController/saveBasBasicArchivesEntry',
						type: 'post',
						async: false,
						data: {
							"name":name,
							"parentID":parentID,
							"mnemonicCode": mnemonicCode,
							"available":gra,
							"remarks":remark,
							"syEmp.id":da.map.syEmps.id,
							"syUnits.id":da.map.syEmps.syUnits.id
						},
						success: function(data) {
								if(data==1){
									layer.msg('基础档案条目名称已存在', {
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
        //加载'form'模块，使checkbox、select、radio初始化
        layui.use('form', function(){
           
        });