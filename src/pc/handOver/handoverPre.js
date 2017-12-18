app.controller('HandoverPreCtrl', ['$scope', '$http','utils', function($scope, $http,utils) {
    var selt = this;
    var id =  utils.getUrlVar('id');

    $http.get("/ts-project/handover/getHandover/"+id).success(function (result) {
        if (result.success ) {
            console.log(result.object);
            selt.voList = result.object.tempDataVoList;
            selt.total = result.object.total;
            selt.signList = result.object.signList;
            selt.handover=result.object.handover;

            angular.forEach(selt.voList,function(item){
                if(item.name=="合同信息"){
                    angular.forEach(item.voList,function(it){
                        if(it.name=="是否签订合同"){
                            if(it.value=="1"){
                                it.value="是";
                            }else{
                                it.value="否";
                            }
                        }
                    })
                }
            })
        }

    });
}]);