var url = 'http://localhost:8089/';
// $(function(){
// 	$.ajaxSetup({
// 		dataType: "json",
// 		cache: false,
// 	    headers: {
// 	        "Authorization": 'bos'+$.cookie('user')
// 	    },
// 	    xhrFields: {
// 		    withCredentials: true
// 	    } /* ,
// 	    complete: function(xhr) {
// 	        //token过期，则跳转到登录页面
// 	        if(xhr.responseJSON.code == 401){
// 	            parent.location.href = baseURL + 'login.html';
// 	        }
// 	    } */
// 	}); 
// })


//判断是否在前面加0
function getNow(s) {
	return s < 10 ? '0' + s : s;
}
//获取系统当前时间
function getingDate() {
	var myDate = new Date();

	var year = myDate.getFullYear(); //获取当前年
	var month = myDate.getMonth() + 1; //获取当前月
	var date = myDate.getDate(); //获取当前日


	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();

	var now = year  + getNow(month) + getNow(date) + getNow(h) + getNow(m) + getNow(s);
	return now;
}
//获取系统当前时间
function getingDatea() {
	var myDate = new Date();

	var year = myDate.getFullYear(); //获取当前年
	var month = myDate.getMonth() + 1; //获取当前月
	var date = myDate.getDate(); //获取当前日


	var h = myDate.getHours(); //获取当前小时数(0-23)
	var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	var s = myDate.getSeconds();

	var now = year  +'-'+ getNow(month)+'-' + getNow(date)+' ' + getNow(h)+':' + getNow(m)+':' + getNow(s);
	return now;
}
