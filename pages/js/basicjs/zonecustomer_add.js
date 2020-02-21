var da;
var id;
var name11;
var zoneCode;

function child(parentID, cName, d) {
	zoneCode = parentID;
	if (d != null) {
		id = d.customCode;
		name11 = d.customName;
		$("#cusName").val(d.customName);
		$("#mobile").val(d.mobileNo);
		$("#cityName").val(d.cityName);
		$("#address").val(d.cstomAddress);
	} else {
		$("#cityName").val(cName);
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
			console.log(da);
		}
	});
	$("#baocun").click(function() {
		var cusName = $("#cusName").val();
		var mobile = $("#mobile").val();
		var cityName = $("#cityName").val();
		var address = $("#address").val();
		if (cusName == "" || cusName == null || mobile == "" || mobile == null || cityName == "" || cityName == null ||
			address == "" || address == null) {
			layer.msg('请将信息补充完整', {
				icon: 5,
				time: 1000
			});
			return;
		}
		var regex = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
		if (!regex.test(mobile)) {
			layer.msg('手机号不符合规则', {
				icon: 5,
				time: 1000
			});
			return;
		}
		if (id != null && id != "") {
			$.ajax({
				url: url + 'basZoneCustomInfoController/upBasZoneCustomInfoById',
				type: 'post',
				async: false,
				data: {
					"customCode": id,
					"customName": cusName,
					"customName1": name11,
					"mobileNo": mobile,
					"cstomAddress": address
				},
				success: function(data) {
					if (data == 0) {
						layer.msg('客户姓名已存在', {
							icon: 5,
							time: 1000
						});
						return;
					}
					if (data == 1) {
						var index = parent.layer.getFrameIndex(window.name);
						parent.layer.close(index);
					}


				}
			});
		} else {
			$.ajax({
				url: url + 'basZoneCustomInfoController/saveBasZoneCustomInfo',
				type: 'post',
				async: false,
				data: {
					"customName": cusName,
					"mobileNo": mobile,
					"cstomAddress": address,
					"cityName": cityName,
					"zoneCode": zoneCode,
					"syUnits.id": da.map.syEmps.syUnits.id,
					"syEmp.id": da.map.syEmps.id
				},
				success: function(data) {
					if (data == 0) {
						layer.msg('客户姓名已存在', {
							icon: 5,
							time: 1000
						});
						return;
					}
					if (data == 1) {
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
layui.use('form', function() {})
