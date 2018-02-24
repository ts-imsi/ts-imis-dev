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
            rows: 1,
            selectName:selt.selectName,
            type:'mod'
        };
        console.log(parm);
        $http.post("/ts-release/product/selectModList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.modList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.modList=[];
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
            rows: 1,
            name:selt.selectname,
            type:'mod'
        };
        $http.post("/ts-release/product/selectModList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.modList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.modList=[];
            }
        });

    };

    this.delete = function(pkid){
        var r=confirm("是否删除模块设置");
        if(r==true) {
            if (pkid == null) {
                window.alert("请选择表格数据");
            }else{
                var parm={
                    pkid:selt.pkid,

                };
                $http.post("/ts-release/product/deletePro",angular.toJson(parm) ).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }

                    selt.setPage(1);
                });
            }
        }
    };

    this.search = function(){
       var parm={
            page: 1,
            rows: 1,
            name:selt.selectname
        };
        console.log(parm);
        $http.post("/ts-release/product/selectModList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.modList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.modList=[];
            }

        });
    };

    this.maxSize = 5;
    this.setPage(1);


}]);




