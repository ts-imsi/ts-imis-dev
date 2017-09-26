(function() {
    angular
        .module('WEBAPP.BAIDUMAP.CONTROLLER', ['ui.bootstrap'])
        .controller('BaiduMapCtrl', ['$http','$uibModal','$log','$document',function($http,$uibModal, $log, $document) {
            var selt = this;
            //selt.baidumapurl="/baidumap/getBaiduMapView";
            selt.baidumapduoge="/baidumap/getCoordinateBaiduMapView/?coordinate="+"116.288891,40.005261;116.286991,40.004824;116.288991,40.003824";
        this.getaddress=function(){
            $http.get("/baidumap/getAddressforCoordinate/?coordinate="+"116.288891,40.005261").success(function (result) {
                selt.address = result.address;
            });
        }
        }]);
})();
