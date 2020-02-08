function twoDigits(val) {
			if (val < 10) return "0" + val;
			return val;
		}
		
		function getDate() {
			var today = new Date();
			var date = today.getFullYear() + "-" + twoDigits(today.getMonth() + 1) + "-" + twoDigits(today.getDate()) + " ";
			var time = twoDigits(today.getHours()) + ": " + twoDigits(today.getMinutes()) + ": " + twoDigits(today.getSeconds());
			$("#time").text(date + " " + time);
		}