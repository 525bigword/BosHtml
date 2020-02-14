var id;
var data3 = [];
var da3;
var da4;
var data4 = [];
var da;
var d3 = [];
var d4 = [];
var d5 = [];
var d6 = [];

function child(d) {
	if (d != null && d != "") {
		id = d.zoneCode;
		console.log(d);
		$("#zoneCode").val(d.zoneCode);
		$("#name").val(d.zoneName);
		$("#tel").val(d.telPhone);
		layui.use('form', function() {
			var form = layui.form;
			$("#name").prop('readonly', 'readonly');
			$("#people").val(d.syEmp.id);
			$("#dw").val(d.syUnits.id);
			form.render();
		});
		$.ajax({
			url: url + 'basAssociateMemberController/findBasAssociateMemberByZoneCode',
			type: 'post',
			data: {
				"zoneCode": d.zoneCode
			},
			async: false,
			success: function(data) {
				da3 = data;
				console.log(data);
			}
		});
		$.ajax({
			url: url + 'basPartitionController/findBasPartitionByTerm',
			type: 'post',
			data: {
				"city": d.zoneName
			},
			async: false,
			success: function(data) {
				da4 = data;
				console.log(data);
			}
		});
		layui.use(['transfer', 'layer', 'util'], function() {
			var $ = layui.$,
				transfer = layui.transfer,
				layer = layui.layer,
				util = layui.util;
			//模拟数据

			for (var i = 0; i < da3.length; i++) {
				if (da3[i].zoneCode != null && da3[i].zoneCode != "") {
					d3.push(da3[i].id);
					d5.push(da3[i].id);
				}
				data3.push({
					"value": da3[i].id,
					"title": da3[i].empName
				});
			}
			for (var i = 0; i < da4.length; i++) {
				if (da4[i].zoneCode != null && da4[i].zoneCode != "") {
					d4.push(da4[i].id);
					d6.push(da4[i].id);
				}
				data4.push({
					"value": da4[i].id,
					"title": da4[i].county
				});
			}

			//初始右侧数据
			transfer.render({
				elem: '#test4',
				data: data4,
				height: 220,
				id: 'keyAddress',
				title: ['该定区未关联地址', '该定区已关联地址'],
				value: d4
			})
			transfer.render({
				elem: '#test3',
				data: data3,
				height: 220,
				id: 'yuan',
				title: ['该定区未小件员', '该定区已关联小件员'],
				value: d3
			})
		})
	} else {
		$.ajax({
			url: url + 'basAssociateMemberController/findBasAssociateMemberByZoneCode',
			type: 'post',
			async: false,
			success: function(data) {
				da3 = data;
				console.log(data);
			}
		});
		$.ajax({
			url: url + 'basPartitionController/findCode',
			type: 'post',
			async: false,
			success: function(data) {
				var gong = data;
				$("#zoneCode").val(gong);
			}
		});
		layui.use(['transfer', 'layer', 'util'], function() {
			var $ = layui.$,
				transfer = layui.transfer,
				layer = layui.layer,
				util = layui.util;
			//模拟数据

			for (var i = 0; i < da3.length; i++) {
				if (da3[i].zoneCode != null && da3[i].zoneCode != "") {
					d3.push(da3[i].id);
					d5.push(da3[i].id);
				}
				data3.push({
					"value": da3[i].id,
					"title": da3[i].empName
				});
			}
			transfer.render({
				elem: '#test3',
				data: data3,
				height: 220,
				id: 'yuan',
				title: ['该定区未小件员', '该定区已关联小件员']
			})
		})
	}
}
layui.use(['transfer', 'layer', 'util'], function() {
	var $ = layui.$,
		transfer = layui.transfer,
		layer = layui.layer,
		util = layui.util;
	util.event('lay-demoTransferActive', {
		getData: function(othis) {
			var zone = $("#zoneCode").val();
			var name = $("#name").val();
			var pname = $("#people").val();
			var telphone = $("#tel").val();
			var dw = $("#dw").val();
			if (zone == null || zone == "" || name == null || name == "" || pname == null || pname == "" || telphone ==
				null || telphone == "" || dw == null || dw == "") {
				layer.msg('请将定区信息补充完整', {
					icon: 5,
					time: 1000
				});
				return;
			}
			var regex = /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/;
			if (!regex.test(telphone)) {
				layer.msg('手机号不符合规则', {
					icon: 5,
					time: 1000
				});
				return;
			}
			var getData = transfer.getData('keyAddress'); //获取右侧数据
			var yuan = transfer.getData('yuan');
			var cc = [];
			var bb = [];
			var d7 = [];
			var d8 = [];
			for (var i = 0; i < d3.length; i++) {
				d7.push(d3[i]);
			}
			for (var i = 0; i < d4.length; i++) {
				d8.push(d4[i]);
			}
			for (var i = 0; i < eval(getData).length; i++) {
				cc.push(eval(getData)[i].value);
			}
			for (var i = 0; i < eval(yuan).length; i++) {
				bb.push(eval(yuan)[i].value);
			}

			if (id != null && id != "") {
				for (var i = 0; i < cc.length; i++) {
					for (var j = 0; j < d8.length; j++) {
						if (d8[j] == cc[i]) {
							d8.splice(j, 1);
						}
					}
				}
				for (var i = 0; i < bb.length; i++) {
					for (var j = 0; j < d7.length; j++) {
						if (d7[j] == bb[i]) {
							d7.splice(j, 1);
						}
					}
				}
				for (var i = 0; i < cc.length; i++) {
					for (var j = 0; j < d8.length; j++) {
						if (d8[j] == cc[i]) {
							cc.splice(i, 1);
						}
					}
				}
				for (var i = 0; i < bb.length; i++) {
					for (var j = 0; j < d7.length; j++) {
						if (d7[j] == bb[i]) {
							bb.splice(i, 1);
						}
					}
				}
				for (var i = 0; i < cc.length; i++) {
					for (var j = 0; j < d6.length; j++) {
						if (d6[j] == cc[i]) {
							cc.splice(i, 1);
						}
					}
				}
				for (var i = 0; i < bb.length; i++) {
					for (var j = 0; j < d5.length; j++) {
						if (d5[j] == bb[i]) {
							bb.splice(i, 1);
						}
					}
				}
				console.log(d7); //小件员本来有现已移除
				console.log(d8); //地址本来有现已移除
				console.log(bb); //小件员新增
				console.log(cc); //地址新增  console.log(zone+" "+dw+" "+name+" "+telphone+" "+pname+" "+d3+" "+d4+" "+" "+bb+" "+cc);
				$.ajax({
					url: url + 'basZoneInfoController/upBasZoneInfoByID',
					type: 'post',
					async: false,
					data: {
						"zoneCode": zone,
						"syUnits.id": dw,
						"zoneName": name,
						"telPhone": telphone,
						"syEmp.id": pname,
						"delxjy": turnStr(d7),
						"deldz": turnStr(d8),
						"addxjy": turnStr(bb),
						"adddz": turnStr(cc)
					},
					success: function(data) {
						var index = parent.layer.getFrameIndex(window.name);
						parent.layer.close(index);
					}
				});
			} else {
				console.log(bb); //小件员新增
				console.log(cc); //地址新增  console.log(zone+" "+dw+" "+name+" "+telphone+" "+pname+" "+d3+" "+d4+" "+" "+bb+" "+cc);

				$.ajax({
					url: url + 'basZoneInfoController/saveBasZoneInfo',
					type: 'post',
					async: false,
					data: {
						"zoneCode": zone,
						"syUnits.id": dw,
						"zoneName": name,
						"telPhone": telphone,
						"syEmp.id": pname,
						"addxjy": turnStr(bb),
						"adddz": turnStr(cc)
					},
					success: function(data) {
						if (data == 0) {
							layer.msg('该定区不在分区范围内', {
								icon: 5,
								time: 1000
							});
						}
						if (data == 2) {
							layer.msg('该定区名已存在', {
								icon: 5,
								time: 1000
							});
						}
						if (data == 1) {
							var index = parent.layer.getFrameIndex(window.name);
							parent.layer.close(index);
						}
					}
				});
			}
		}
	});
})
//加载'form'模块，使checkbox、select、radio初始化
layui.use('form', function() {

});
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
		url: url + 'syUnitsController/findSyUnits',
		type: 'post',
		async: false,
		success: function(data) {
			var gong = data.SyUnits[0];
			for (var i = 0; i < gong.length; i++) {
				$("#dw").append('<option value="' + gong[i].id + '">' + gong[i].name + '</option>');
			}
		}
	});
	$.ajax({
		url: url + 'jurisdiction/findSyEmp',
		type: 'post',
		async: false,
		success: function(data) {
			var gong = data;
			console.log(gong);
			for (var i = 0; i < gong.length; i++) {
				$("#people").append('<option value="' + gong[i].id + '">' + gong[i].empName + '</option>');
			}
		}
	});
	$("#name").blur(function() {
		$.ajax({
			url: url + 'basPartitionController/findBasPartitionByTerm',
			type: 'post',
			data: {
				"city": $("#name").val()
			},
			async: false,
			success: function(data) {
				da4 = data;
				console.log(data);
			}
		});
		layui.use(['transfer', 'layer', 'util'], function() {
			var $ = layui.$,
				transfer = layui.transfer,
				layer = layui.layer,
				util = layui.util;
			//模拟数据
			for (var i = 0; i < da4.length; i++) {
				if (da4[i].zoneCode != null && da4[i].zoneCode != "") {
					d4.push(da4[i].id);
					d6.push(da4[i].id);
				}
				data4.push({
					"value": da4[i].id,
					"title": da4[i].county
				});
			}

			//初始右侧数据
			transfer.render({
				elem: '#test4',
				data: data4,
				height: 220,
				id: 'keyAddress',
				title: ['该定区未关联地址', '该定区已关联地址']
			})
		})
	})
	$("#quxiao").click(function() {
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	})
})
//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use('element', function() {
	var element = layui.element;

	//…
});
var turnStr = function(str) {
	var tr = "";
	for (var i = 0; i < str.length; i++) {
		if (i != (str.length - 1)) {
			tr += str[i] + ",";
		} else {
			tr += str[i];
		}
	}
	return tr;
}
var turnNum = function(nums) {
	for (let i = 0; i < nums.length; i++) {
		nums[i] = parseInt(nums[i])
	}
	return nums;
}
