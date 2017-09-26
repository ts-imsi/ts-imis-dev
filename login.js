'use strict';

var app = angular.module('myApp', []);
app.controller('LoginController', ['$scope', '$http', function($scope, $http) {

    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
        $http.post("/login/signIn",$scope.user).success(function (result) {
            if ( !result.success ) {
                alert(result.message);
                console.log($scope.authError);
            }else{
                sessionStorage.setItem("X-TOKEN", result.object.xtoken);
                window.location.href="/#/app/attenceList";
            }

        });
    };
}])
;