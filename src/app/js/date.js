function currentTime(d) {
				str = '';
				str += d.getFullYear() + '年';
				str += d.getMonth() + 1 + '月';
				str += d.getDate() + '日';
				return str;
			}

			function getWeek(dateObj) {
				var week;
				switch(dateObj.getDay()) {
					case 1:
						week = "星期一";
						break;
					case 2:
						week = "星期二";
						break;
					case 3:
						week = "星期三";
						break;
					case 4:
						week = "星期四";
						break;
					case 5:
						week = "星期五";
						break;
					case 6:
						week = "星期六";
						break;
					default:
						week = "星期天";
				}
				return week;
			}
