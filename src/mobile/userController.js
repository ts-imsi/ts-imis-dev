(function() {
    angular
        .module('MOBILEAPP.USER.CONTROLLER', ['ui.bootstrap'])
        .controller('userCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            $http.post("/ts-project/mobileUser/selectTbPersonnel").success(function (result) {
                if(result.success){
                    selt.person=result.object;
                }else{
                    alert(result.message);
                }
            });

        }]);
})();
