app.controller('productModelCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.submitProduct=false;
    selt.updateProduct=false;
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

    //制定计划划出层样式
    this.panelClass = "person panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "person panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "person panel panel-default";
    }

    this.addProduct=function(){
        selt.submitProduct=true;
        selt.updateProduct=false;
        selt.product="";
    }

    this.updateProduct=function(product){
        selt.product=product;
        selt.submitProduct=false;
        selt.updateProduct=true;
    }

    this.productSubmit=function(valid,invalid,product){
        if (valid) {
            if (!invalid) {
                $http.post("/ts-project/product/saveTbProduct", product).success(function (result) {
                    if (result.success) {
                        selt.product=result.object;
                        selt.submitProduct=false;
                        selt.updateProduct=true;
                        alert(result.message);
                        selt.setPage(1);
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            selt.submitted=true;
        }
    }

    this.deleteTbProduct=function(pkid){
        $http.post("/ts-project/product/deleteTbProduct/"+pkid).success(function (result) {
            if (result.success) {
                alert(result.message);
                selt.setPage(1);
            } else {
                alert(result.message);
            }
        });
    }

    //获取部门
    this.findDeptperson = function (size) {
        var selectdeptInstance = $modal.open({
            templateUrl: 'selectdept.html',
            controller: 'selectdeptController as selectdeptctrl',
            size: size
        });

        selectdeptInstance.result.then(function (deptname) {
            selt.product.depName=deptname.label;
            selt.product.depId=deptname.id;
        });

    }

}]);

//组织结构添加修改
app.controller('selectdeptController', ['$scope', '$modalInstance','$http', function($scope,$modalInstance,$http) {
    var finddept=this;
    var deptname;
    finddept.my_tree = {};
    finddept.success=false;
    $http.post("/ts-project/product/getDeptOrganization").success(function(data){
        finddept.success=data.success;

        finddept.my_data =data.object;
    });
    finddept.my_tree_handler = function(branch) {
        deptname={level:branch.data.level,type:branch.data.type,id:branch.data.pkid,label:branch.label,parent:branch.data.parent};
    };
    finddept.selectdept=function(){
        $modalInstance.close(deptname);
    }
    finddept.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])