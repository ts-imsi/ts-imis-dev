app.controller('HandoverPreCtrl', ['$scope', '$http','utils', function($scope, $http,utils) {
    var selt = this;
    var id =  utils.getUrlVar('id');

    $http.get("/ts-project/handover/getHandover/"+id).success(function (result) {
        if (result.success ) {
            console.log(result.object);
            selt.voList = result.object;
        }

    });
}]);