app.controller('ReProductCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    selt.my_tree = {};
    selt.success=false;
    $http.post("/ts-release/product/selectProList").success(function(data){
        selt.success=data.success;
        selt.my_data =data.object;
    });

    this.my_tree_handler = function(branch) {
        deptname={level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label,parent:branch.data.parent};
    };

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName
        };
        console.log(parm);
        $http.post("/ts-project/product/queryProductModelList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.productModelList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.productModelList=[];
            }

        });
    };

    this.selectProductModel=function(){
        if(selt.selectName==''){
            selt.selectName=null;
        }
        this.setPage(1);
    }

    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectName:selt.selectName
        };
        $http.post("/ts-project/product/queryProductModelList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.productModelList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.productModelList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);


}]);




