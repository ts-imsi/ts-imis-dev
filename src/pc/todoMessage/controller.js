app.controller('todoMessageCtrl',['$scope', '$modal', '$http', '$log','$stateParams', function ($scope, $modal, $http, $log,$stateParams){
    var selt=this;

    selt.status=0;
    this.selectByType=function(status){
        selt.status=status;
        selt.setPage(1);
    }

    this.setPage = function (pageNo) {
        var param={
            page:pageNo,
            rows:10,
            type:"todo",
            status:selt.status,
            selectName:selt.selectName
        }
        $http.post("/ts-project/tb_message/selectTbMsg",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.messageList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.messageList=[];
                alert(result.message);
            }
        });
    };

    this.pageChanged = function () {
        var param={
            page:this.pageNo,
            rows:10,
            type:"todo",
            status:selt.status,
            selectName:selt.selectName
        }
        $http.post("/ts-project/tb_message/selectTbMsg",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.messageList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.messageList=[];
                alert(result.message);
            }
        });
    }

    this.maxSize = 5;
    this.setPage(1);
}]);