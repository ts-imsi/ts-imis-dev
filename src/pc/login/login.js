'use strict';

/* Controllers */
// signin controller
app.controller('LoginController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    var selt = this;

    this.user = {};
    this.authError = null;
    this.login = function() {
        selt.authError = null;
        // Try to login
        /*$http.post('api/login', {email: selt.user.email, password: selt.user.password})
            .then(function(response) {
                if ( !response.success ) {
                    selt.authError = 'Email or Password not right';
                }else{
                    $state.go('app.dashboard-v1');
                }
            }, function(x) {
                $scope.authError = 'Server Error';
            });*/
        sessionStorage.setItem("X-TOKEN", "123456789");
        $state.go('app.attenceList');
    };
}])
;