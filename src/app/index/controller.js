(function() {
	angular
		.module('WEBAPP.INDEX.CONTROLLER', ['ui.bootstrap'])
		.controller('IndexCtrl', ['$http','$uibModal','$log','$document',function($http,$uibModal, $log, $document) {
			var selt = this;

			this.title = 'INDEX';
			this.content = 'This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.';

			this.alert = function() {
				//window.alert('我只是一个弹出框');
			};
			this.getTest = function (){
				$http.get("/test/2",angular.toJson(params)).success(function (result) {
					selt.content=result.msg;
				});

			};

			this.login = function (user) {

				if (!user.name && !user.password) {
					this.msg = "请输入用户名和密码";
				} else if (!user.name) {
					this.msg = "请输入用户名";
				} else if (!user.password) {
					this.msg = "请输入密码";
				} else {
					$http.post("/test/login", user).success(function (result) {
						if (result.success) {
							this.msg = "调用成功";
						} else {

						}
					});
				}
			};
			this.phones=[
				{"name":"zxh","phone":"133222233","age":0},
				{"name":"sss","phone":"2233","age":2},
				{"name":"huxiao","phone":"12345678","age":1},
			];
			this.orderPro="name";
			var params = {};
			$http.get("/test/4",angular.toJson(params)).success(function (result) {
				selt.content=result.data;
				//alert(result.msg);

			});


			var paramsPage = {
				pageNo:1,
				pageSize:5
			};

			this.setPage = function (pageNo) {
				$http.get("/test/list/?pageNo="+pageNo+"&pageSize=3",angular.toJson(paramsPage)).success(function (result) {
					selt.testList = result.list;
					selt.totalCount = result.totalCount;
					selt.pageSize = result.pageSize;;
					selt.pageNo = result.pageNo;
				});
			};

			this.pageChanged = function() {
				$log.log('Page changed to: ' + this.pageNo);
				$http.get("/test/list/?pageNo="+this.pageNo+"&pageSize=3",angular.toJson(paramsPage)).success(function (result) {
					selt.testList = result.list;
					selt.totalCount = result.totalCount;
					selt.pageSize = result.pageSize;;
					selt.pageNo = result.pageNo;
				});

			};

			this.maxSize = 3;
			this.setPage(1);

			//1----------------------------------------------
			this.items = ['item1', 'item2', 'item3'];

			this.animationsEnabled = true;

			this.open = function (size, parentSelector) {
				var parentElem = parentSelector ?
					angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
				var modalInstance = $uibModal.open({
					animation: selt.animationsEnabled,
					ariaLabelledBy: 'modal-title',
					ariaDescribedBy: 'modal-body',
					templateUrl: 'myModalContent.html',
					controller: 'ModalInstanceCtrl',
					controllerAs: '$ctrl',
					size: size,
					appendTo: parentElem,
					resolve: {
						items: function () {
							return selt.items;
						}
					}
				});

				modalInstance.result.then(function (selectedItem) {
					selt.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			};


			this.toggleAnimation = function () {
				this.animationsEnabled = !this.animationsEnabled;
			};




			//2------------------------
			this.alerts = [
				{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
				{ type: 'success', msg: 'Well done! You successfully read this important alert message.' }
			];

			this.addAlert = function() {
				selt.alerts.push({msg: 'Another alert!'});
			};

			this.closeAlert = function(index) {
				selt.alerts.splice(index, 1);
			};


			this.choices = [{id: 'choice1',type:1}, {id: 'choice2',type:2}];

			this.addNewChoice = function() {
				var newItemNo = selt.choices.length+1;
				selt.choices.push({'id':'choice'+newItemNo,type:2});
			};

			this.removeChoice = function() {
				var lastItem = selt.choices.length-1;
				selt.choices.splice(lastItem);
			};








		}]);

	angular.module('WEBAPP.INDEX.CONTROLLER').controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
		var $ctrl = this;
		$ctrl.items = items;
		$ctrl.selected = {
			item: $ctrl.items[0]
		};

		$ctrl.ok = function () {
			$uibModalInstance.close($ctrl.selected.item);
			window.location.reload();
		};

		$ctrl.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});

// Please note that the close and dismiss bindings are from $uibModalInstance.

	angular.module('WEBAPP.INDEX.CONTROLLER').component('modalComponent', {
		templateUrl: 'myModalContent.html',
		bindings: {
			resolve: '<',
			close: '&',
			dismiss: '&'
		},
		controller: function () {
			var $ctrl = this;

			$ctrl.$onInit = function () {
				$ctrl.items = $ctrl.resolve.items;
				$ctrl.selected = {
					item: $ctrl.items[0]
				};
			};

			$ctrl.ok = function () {
				$ctrl.close({$value: $ctrl.selected.item});
			};

			$ctrl.cancel = function () {
				$ctrl.dismiss({$value: 'cancel'});
			};
		}
	});


})();
