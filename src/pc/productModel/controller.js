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

    //制定计划划出层样式
    this.panelModelClass = "person panel panel-default";

    this.openModelPanel = function () {
        selt.panelModelClass = "person panel panel-default active";
    };
    this.closeModelPanel = function () {
        selt.panelModelClass = "person panel panel-default";
    }

    this.addProduct=function(){
        selt.submitProduct=true;
        selt.updateProduct=false;
        selt.product="";
    }

    this.updateProductSave=function(product){
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

    this.selectModel=function(proModel){
        selt.proCode=proModel.proCode;
        var parm={
            page:1,
            rows:10,
            proCode:selt.proCode
        };
        console.log(parm);
        $http.post("/ts-project/product/queryTbProModuleList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.modelList = result.list;
                selt.totalModelCount = result.totalCount;
                selt.pageModelSize = result.pageSize;
                selt.pageModelNo = result.pageNo;
            }else{
                selt.modelList=[];
            }

        });

    }
    selt.maxModelSize=5;
    this.pageModelChanged=function(){
        var parm={
            page:selt.pageModelNo,
            rows:10,
            proCode:selt.proCode
        };
        $http.post("/ts-project/product/queryTbProModuleList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.modelList = result.list;
                selt.totalModelCount = result.totalCount;
                selt.pageModelSize = result.pageSize;
                selt.pageModelNo = result.pageNo;
            }else{
                selt.modelList=[];
            }

        });
    }

    this.saveModel = function (proMel,size) {
        var param={
            proCode:selt.proCode,
            model:proMel,
            type:0
        }
        var proModelInstance = $modal.open({
            templateUrl: 'proModel.html',
            controller: 'ProModelController as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return param;
                }
            }
        });

        proModelInstance.result.then(function (proModel) {
            selt.selectModel(proModel);
        });
    }

    this.updateModel = function (proMel,size) {
        var param={
            proCode:selt.proCode,
            model:proMel,
            type:1
        }
        var proModelInstance = $modal.open({
            templateUrl: 'proModel.html',
            controller: 'ProModelController as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return param;
                }
            }
        });

        proModelInstance.result.then(function (proModel) {
            selt.selectModel(proModel);
        });
    };

    this.deleteProMedel=function(modId){
        $http.post("/ts-project/product/deleteProModel/"+modId).success(function (result) {
            if(result.success){
                alert(result.message);
            }else{
                alert(result.message);
            }

        });
    }

    this.openModelPrice=function(model,size){
        var modelPricelInstance = $modal.open({
            templateUrl: 'proModelPrice.html',
            controller: 'proModelPriceCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return model;
                }
            }
        });

        modelPricelInstance.result.then(function () {

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


app.controller('ProModelController', ['$scope', '$modalInstance','$http','data', function($scope,$modalInstance,$http,data) {
    var pro=this;
    if(data.type==1){
        pro.proModel=data.model;
    }
    this.saveOrUpdateModel=function(valid,invalid,proModel){
        if(data.type==0){
            proModel.proCode=data.proCode;
        }
        if (valid) {
            if (!invalid) {
                $http.post("/ts-project/product/saveOrUpdateProductModel", proModel).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close(proModel);
                    } else {
                        alert(result.message);
                    }
                });
            }
        }else{
            pro.submitMed=true;
        }
    }
    pro.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])

app.controller('proModelPriceCtrl', ['$scope', '$modalInstance','$http','data', function($scope,$modalInstance,$http,data) {
    var price=this;
    price.name=data.modName;
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:3,
            modId:data.modId
        };
        console.log(parm);
        $http.post("/ts-project/product/queryModelPriceList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                price.modelPriceList = result.list;
                price.totalPriceCount = result.totalCount;
                price.pagePriceSize = result.pageSize;
                price.pagePriceNo = result.pageNo;
            }else{
                price.modelPriceList=[];
            }

        });
    };

    this.pagePriceChanged = function () {
        var parm={
            page:this.pagePriceNo,
            rows:3,
            modId:data.modId
        };
        $http.post("/ts-project/product/queryModelPriceList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                price.modelPriceList = result.list;
                price.totalPriceCount = result.totalCount;
                price.pagePriceSize = result.pageSize;
                price.pagePriceNo = result.pageNo;
            }else{
                price.modelPriceList=[];
            }
        });

    };
    this.maxPriceSize = 2;
    this.setPage(1);

    $http.post("/ts-project/product/selectTwfDictByType/15").success(function (result) {
        if (result.success) {
            price.twfList=result.object;
        } else {
            alert(result.message);
        }
    });

    this.saveModelPrice=function(){
      if(price.proModelPrice.hospitalLevel==""||price.proModelPrice.hospitalLevel==undefined){
          alert("请填写医院等级");
          return;
      }
      if(price.proModelPrice.standardPrice==""||price.proModelPrice.standardPrice==undefined){
          alert("请填写标准价");
          return;
      }
        price.proModelPrice.modId=data.modId;
        $http.post("/ts-project/product/saveModelPrice",angular.toJson(price.proModelPrice)).success(function (result) {
            if(result.success){
                alert(result.message);
                price.proModelPrice='';
                price.setPage(1);
            }else{
                alert(result.message);
            }
        });
    };

    this.deleteModelPrice=function(pkid){
        $http.post("/ts-project/product/deleteModelPrice/"+pkid).success(function (result) {
            if(result.success){
                alert(result.message);
                price.setPage(1);
            }else{
                alert(result.message);
            }
        });
    }

    price.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])