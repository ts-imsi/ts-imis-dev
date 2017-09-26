'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.signup = function() {
        $http.post("/login/updatePassword",$scope.user).success(function (result) {
            alert(result.message);
        });
    };
}])
;