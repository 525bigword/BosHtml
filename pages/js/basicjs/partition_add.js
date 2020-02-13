var citys;
			var shi;
			var qu;
			var id;
			var da;
			function child(pagedate, d) {
				citys = pagedate;
				if (d != null) {
					id = d.id;
					layui.use('form', function() {
						var form = layui.form;
						for (var i = 0; i < citys.length; i++) {
							$("#shen").append('<option value="' + citys[i].name + '">' + citys[i].name + '</option>');
						}
						$("#shen").val(d.province);
						for (i = 0; i < citys.length; i++) {
							if ($("#shen").val() == citys[i].name) {
								shi = citys[i].shen;
								for (var j = 0; j < shi.length; j++) {
									$("#shi").append('<option value="' + shi[j].name + '">' + shi[j].name + '</option>');
								}

							}

						}
						$("#shi").val(d.city);
						for (var i = 0; i < shi.length; i++) {
							if ($("#shi").val() == shi[i].name) {
								qu = shi[i].shi;
								for (var j = 0; j < qu.length; j++) {
									$("#qu").append('<option value="' + qu[j].name + '">' + qu[j].name + '</option>');
								}
							}
						}
						$("#qu").val(d.county);
						$("input:radio[value=" + d.sDInt + "]").prop('checked', 'true');
						$("#fj").val(d.sortingCode);
						$("#dq").val(d.zoneCode);
						form.render();
					})
					$("#key").val(d.keyword);
					$("#start").val(d.startInt);
					$("#end").val(d.terminateInt);
				} else {
					layui.use('form', function() {
						var form = layui.form;
						for (var i = 0; i < citys.length; i++) {
							$("#shen").append('<option value="' + citys[i].name + '">' + citys[i].name + '</option>');
						}
						form.render();
					})
					$.ajax({
						url: url + 'basPartitionController/findCode',
						type: 'post',
						async: false,
						success: function(data) {
							var gong = data;
							$("#fj").val(gong);
						}
					});
					
				}
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
					url: url + 'jurisdiction/parsetoken',
					type: 'get',
					header: {
						"Authorization": 'bos' + $.cookie('user')
					},
					async: false,
					dateType: 'json',
					success: function(data) {
						da = data;
					}
				});
				$.ajax({
					url: url + 'basZoneInfoController/findBasZoneInfos',
					type: 'post',
					async: false,
					success: function(data) {
						var gong = data.BasZoneInfo[0];
						for (var i = 0; i < gong.length; i++) {
							$("#dq").append('<option value="' + gong[i].zoneCode + '">' + gong[i].zoneCode + '</option>');
						}
					}
				});
				$("#baocun").click(function() {
					var shen = $("#shen").val();
					var shi = $("#shi").val();
					var qu = $("#qu").val();
					var fj = $("#fj").val();
					var dq = $("#dq").val();
					var key = $("#key").val();
					var start = $("#start").val();
					var end = $("#end").val();
					var ds = $("input[type=radio]:checked").val();
					if (shen == null || shen == "" || shi == null || shi == "" || qu == null || qu == "" || fj == null || fj == "" ||
						 key == null || key == "" || start == null || start == "" || end == null || end ==
						"" || ds == null || ds == "") {
						layer.msg('请将信息补充完整', {
							icon: 5,
							time: 800
						});
						return;
					}
					if (id != null && id != "") {
						$.ajax({
							url: url + 'basPartitionController/upBasPartitionById',
							type: 'post',
							async: false,
							data: {
								"id": id,
								"province": shen,
								"city": shi,
								"county": qu,
								"keyword": key,
								"startInt": start,
								"terminateInt": end,
								"sDInt": ds,
								"zoneCode":dq
							},
							success: function(data) {
								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.close(index);
							}
						});
					}else{
						$.ajax({
							url: url + 'basPartitionController/saveBasPartition',
							type: 'post',
							async: false,
							data: {
								"province": shen,
								"city": shi,
								"county": qu,
								"keyword": key,
								"startInt": start,
								"terminateInt": end,
								"sDInt": ds,
								"syEmp.id":da.map.syEmps.id,
								"syUnits.id":da.map.syEmps.syUnits.id,
								"sortingCode":fj,
								"zoneCode":dq
							},
							success: function(data) {
								if(data==0){
									layer.msg('该区已存在', {
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
			layui.use('form', function() {
				var form = layui.form;
				form.on('select(see)', function(data) {
					$("#shi").html('');
					$("#qu").html('');
					if ($("#shen").val() !== null && $("#shen").val() != "") {
						for (i = 0; i < citys.length; i++) {
							if ($("#shen").val() == citys[i].name) {
								shi = citys[i].shen;
								for (var j = 0; j < shi.length; j++) {
									$("#shi").append('<option value="' + shi[j].name + '">' + shi[j].name + '</option>');
								}

							}

						}
						for (var i = 0; i < shi.length; i++) {
							if ($("#shi").val() == shi[i].name) {
								qu = shi[i].shi;
								for (var j = 0; j < qu.length; j++) {
									$("#qu").append('<option value="' + qu[j].name + '">' + qu[j].name + '</option>');
								}
							}
						}
					}
					form.render();
				})
				form.on('select(see1)', function(data) {
					$("#qu").html('');
					for (var i = 0; i < shi.length; i++) {
						if ($("#shi").val() == shi[i].name) {
							qu = shi[i].shi;
							for (var j = 0; j < qu.length; j++) {
								$("#qu").append('<option value="' + qu[j].name + '">' + qu[j].name + '</option>');
							}
						}
					}
					form.render();
				})
			});