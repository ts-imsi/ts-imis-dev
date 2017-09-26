(function() {
	angular
		.module('WEBAPP.SUBATT.CONTROLLER', ['ui.bootstrap'])
		.controller('SubAttCtrl', ['$http','$scope','utils','$filter',function($http,$scope,utils,$filter) {
			var selt = this;
			//----用户授权,需要跳两次页面-----
			var openid =  utils.getUrlVar('openid');
			console.log("=====openid:"+openid);
			if(!openid){
				alert("未获取用户授权");
			}else{
				this.openId = openid;
				var paramsAtt = {
					"openId":openid
				};
				$http.post("/mobileAttence/getSubPerson",angular.toJson(paramsAtt)).success(function (result) {
					if(result.statusCode==1){
						selt.subList = result.object;
					}else{
						selt.subList = [];
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

			this.tagclass01 = "";
			this.tagclass02 = "thisnav";
			this.clickSubAtt = function () {
				selt.tagclass01 = "";
				selt.tagclass02 = "thisnav";
				selt.showhidediv(true);

			};

			this.clickMyAtt = function () {
				selt.tagclass01 = "thisnav";
				selt.tagclass02 = "";
				selt.showhidediv(true);
				window.location.href="/src/index.html#/attList?subOpenId="+selt.openId
					+"&myOpenId="+selt.openId
					+"&myName=我的考勤";
			};


			this.clickOpenId = function (openId,name) {
				window.location.href="/src/index.html#/attList?subOpenId="+openId
					+"&myOpenId="+selt.openId
					+"&myName="+name+"的考勤";
			};




		}]);
})();
