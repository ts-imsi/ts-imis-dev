(function() {
	angular
		.module('WEBAPP.ATTLIST.CONTROLLER', ['ui.bootstrap'])
		.controller('AttListCtrl', ['$http','$scope','utils','$filter',function($http,$scope,utils,$filter) {
			var selt = this;
			//----用户授权,需要跳两次页面-----
			var code =  utils.getUrlVar('code');
			var subOpenId =  utils.getUrlVar('subOpenId');
			var myOpenId =  utils.getUrlVar('myOpenId');
			var myName =  utils.getUrlVar('myName');
			console.log("=====code:"+code);
			console.log("=====subOpenId:"+subOpenId);
			console.log("=====myOpenId:"+myOpenId);
			console.log("=====myName:"+myName);
			this.checkUser = false;


			if(subOpenId&&myOpenId){
				selt.checkUser = true;
				selt.openid = subOpenId;
				if(myName){
					selt.myname = decodeURI(myName);
				}else{
					selt.myname = "下属考勤";
				}
				var paramsAtt = {
					"openId":subOpenId,
					"attDate":$filter("date")(new Date(), "yyyy-MM-dd")
				};
				$http.post("/mobileAttence/queryAttLogList",angular.toJson(paramsAtt)).success(function (result) {
					if(result.statusCode==1){
						selt.attLogList = result.object;
					}else{
						selt.attLogList = [];
					}

				});
			}else{
				if(!code){
					var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
						'appid=wx5788f1ce93ff3255' +
						'&redirect_uri=' + encodeURIComponent(window.location.href) +
						'&response_type=code&scope=snsapi_base&state=TS-IMIS' +
						'#wechat_redirect';
					window.location.href = url;
				}else{
					//获取用户信息授权
					$http.get("/authorize/oauth2?code="+code,null).success(function (result) {
						if(result.status==1){
							selt.openid=result.openid;
							if(result.check>0){
								selt.checkUser = true;
							}
							selt.myname = "我的考勤";
							console.log("===="+selt.openid);
							var paramsAtt = {
								"openId":selt.openid,
								"attDate":$filter("date")(new Date(), "yyyy-MM-dd")
							};
							$http.post("/mobileAttence/queryAttLogList",angular.toJson(paramsAtt)).success(function (result) {
								if(result.statusCode==1){
									selt.attLogList = result.object;
								}else{
									selt.attLogList = [];
								}

							});
						}else{
							alert("授权失败!");
						}

					});
				};
			};









			this.today = function() {
				selt.dt = new Date();
			};
			this.today();

			this.clear = function() {
				selt.dt = null;
			};

			$scope.options = {
				customClass: getDayClass,
				minDate: new Date(),
				showWeeks: false
			};

			// Disable weekend selection
			function disabled(data) {
				var date = data.date,
					mode = data.mode;
				return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			}

			this.toggleMin = function() {
				$scope.options.minDate = $scope.options.minDate ? null : new Date();
			};

			this.toggleMin();

			this.setDate = function(year, month, day) {
				selt.dt = new Date(year, month, day);
			};

			/*var tomorrow = new Date();
			 tomorrow.setDate(tomorrow.getDate() + 1);
			 var afterTomorrow = new Date(tomorrow);
			 afterTomorrow.setDate(tomorrow.getDate() + 1);*/
			this.events = [
				/*{
				 date: tomorrow,
				 status: 'full'
				 },
				 {
				 date: afterTomorrow,
				 status: 'partially'
				 }*/
			];

			function getDayClass(data) {
				var date = data.date,
					mode = data.mode;
				if (mode === 'day') {
					var dayToCheck = new Date(date).setHours(0,0,0,0);

					for (var i = 0; i < selt.events.length; i++) {
						var currentDay = new Date(selt.events[i].date).setHours(0,0,0,0);

						if (dayToCheck === currentDay) {
							return selt.events[i].status;
						}
					}
				}

				return '';
			};
			this.selectDate = function () {
				var paramsAtt = {
					"openId":selt.openid,
					"attDate":$filter("date")(selt.dt, "yyyy-MM-dd")
				};
				$http.post("/mobileAttence/queryAttLogList",angular.toJson(paramsAtt)).success(function (result) {
					if(result.statusCode==1){
						selt.attLogList = result.object;
					}else{
						selt.attLogList = [];
					}

				});
			};


			this.sheet = false;
			this.addclass = "";
			this.showhidediv = function (sheet) {
				selt.sheet = !sheet;
				if(selt.sheet){
					selt.addclass = "addclass";
				}else{
					selt.addclass = "";
				};
			};

			this.tagclass01 = "thisnav";
			this.tagclass02 = "";
			this.clickSubAtt = function () {
				selt.tagclass01 = "";
				selt.tagclass02 = "thisnav";
				selt.showhidediv(true);
				if(!myOpenId){
					myOpenId = selt.openid;
				};
				window.location.href="/src/index.html#/subatt?openid="+myOpenId;

			};

			this.clickMyAtt = function () {
				selt.tagclass01 = "thisnav";
				selt.tagclass02 = "";
				selt.showhidediv(true);
			};


		}]).filter('signinType',function(){
		return function(type){
			//signIn:正常签到,signOut正常签退:,sing:外出打卡,inEx:迟到.outEx:早退
			var name = "";
			switch(type)
			{
				case "signIn":
					name = "公司签到";
					break;
				case "signOut":
					name = "公司签退";
					break;
				case "sign":
					name = "外出考勤";
					break;
				case "inEx":
					name = "公司迟到";
					break;
				case "outEx":
					name = "公司早退";
					break;
				default:
					name = "";
			};
			return name;
		}
	});
})();
