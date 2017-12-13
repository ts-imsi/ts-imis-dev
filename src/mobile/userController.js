(function() {
    angular
        .module('MOBILEAPP.USER.CONTROLLER', ['ui.bootstrap','ngCookies'])
        .controller('userCtrl', ['$http','$uibModal','$log','$document','utils','$cookies','$cookieStore',function($http,$uibModal, $log, $document,utils,$cookies, $cookieStore) {
            var selt = this;
            $cookies.put("userSign",sessionStorage.getItem("X-TOKEN"),{'path':'/'});
            $http.post("/ts-project/mobileUser/selectTbPersonnel").success(function (result) {
                if(result.success){
                    selt.person=result.object;
                }else{
                    alert(result.message);
                }
            });

        }]);
})();
