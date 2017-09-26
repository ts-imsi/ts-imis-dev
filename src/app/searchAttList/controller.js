(function() {
	angular
		.module('WEBAPP.SEARCHATTLIST.CONTROLLER', ['ui.bootstrap'])
		.controller('SearchAttListCtrl', ['$http','$uibModal','$log','$window','$scope','$filter',function($http,$uibModal, $log, $scope,$filter) {
			var selt = this;

			this.today = function() {
				selt.dt = new Date();
			};
			this.today();

			this.clear = function() {
				selt.dt = null;
			};

			$scope.inlineOptions = {
				customClass: getDayClass,
				minDate: new Date(),
				showWeeks: true
			};

			$scope.dateOptions = {
				dateDisabled: disabled,
				formatYear: 'yy',
				maxDate: new Date(2020, 5, 22),
				minDate: new Date(),
				startingDay: 1
			};

			// Disable weekend selection
			function disabled(data) {
				var date = data.date,
					mode = data.mode;
				return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
			}

			this.toggleMin = function() {
				$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
				$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
			};

			this.toggleMin();



			this.open2 = function() {
				selt.popup2.opened = true;
			};

			this.setDate = function(year, month, day) {
				selt.dt = new Date(year, month, day);
			};

			this.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
			this.format = this.formats[0];
			this.altInputFormats = ['M!/d!/yyyy'];


			this.popup2 = {
				opened: false
			};


			$scope.events = [
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

			this.tabs = [
				{ title:'考勤', content:'考勤列表' },
				{ title:'迟到', content:'迟到列表' },
				{ title:'早退', content:'早退列表' },
				{ title:'缺勤', content:'缺勤列表' }
			];

			var paramsPage = {
				pageNo:1,
				pageSize:5
			};


			this.setPage = function (pageNo,content) {
				if(content=='考勤列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":pageNo,
						"pageSize":5,
						"type":selt.type
					};
				}else if(content=='迟到列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":pageNo,
						"pageSize":5,
						"type":selt.type,
						"lateTime":1
					};
				}else if(content=='早退列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":pageNo,
						"pageSize":5,
						"type":selt.type,
						"backTime":1
					};
				}else if(content=='缺勤列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":pageNo,
						"pageSize":5,
						"lackAtt":"lack"
					};
				}

				$http.post("/attence/searchAttList",angular.toJson(paramsAtt)).success(function (result) {
					if(result.code==1){
						selt.attList = result.list;
						selt.totalCount = result.totalCount;
						selt.pageSize = result.pageSize;;
						selt.pageNo = result.pageNo;
					}else{
						selt.attList = [];
					}

				});
			};



			this.pageChanged = function(content) {
				$log.log('Page changed to: ' + this.pageNo);
				if(content=='考勤列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":this.pageNo,
						"pageSize":5,
						"type":selt.type
					};
				}else if(content=='迟到列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":this.pageNo,
						"pageSize":5,
						"type":selt.type,
						"lateTime":1
					};
				}else if(content=='早退列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":this.pageNo,
						"pageSize":5,
						"type":selt.type,
						"backTime":1
					};
				}else if(content=='缺勤列表'){
					var paramsAtt = {
						"tagName":selt.tagName,
						"name":selt.name,
						"attenceDate":selt.dt,
						"pageNo":this.pageNo,
						"pageSize":5,
						"lackAtt":"lack"
					};
				}

				$http.post("/attence/searchAttList",angular.toJson(paramsAtt)).success(function (result) {
					if(result.code==1){
						selt.attList = result.list;
						selt.totalCount = result.totalCount;
						selt.pageSize = result.pageSize;;
						selt.pageNo = result.pageNo;
					}else{
						selt.attList = [];
					}

				});
			};

			this.maxSize = 3;
			this.setPage(1,'考勤列表');
			this.alertMe = function(content) {
				selt.setPage(1,content);
			};



			this.animationsEnabled = true;

			this.updateLocationView = function (location,size, parentSelector) {
				var parentElem = parentSelector ?
					angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
				var showAttenceLogViewlInstance = $uibModal.open({
					animation: selt.animationsEnabled,
					ariaLabelledBy: 'show-title',
					ariaDescribedBy: 'show-body',
					templateUrl: 'showAttenceLogView.html',
					controller: 'showAttenceLogViewInstanceCtrl',
					controllerAs: '$ctrl',
					size: size,
					appendTo: parentElem,
					resolve: {
						worknum: function () {
							return worknum;
						}
					}
				});

			};

			this.toggleAnimation = function () {
				this.animationsEnabled = !this.animationsEnabled;
			};


		}]);




})();
