app.controller('htProductCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.selectContract=function(){

        this.setPage(1);
    }
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName
        };
        console.log(parm);
        $http.post("/ts-project/con_product/getcontractTransenList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htProductList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htProductList=[];
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
        $http.post("/ts-project/con_product/getcontractTransenList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htProductList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htProductList=[];
            }
        });

    };


    this.showModuleList=function(item,htPrice,size){
        if(htPrice){
            item.htPrice = htPrice;
        };
        var outputValueInstance = $modal.open({
            templateUrl: 'htModuleList.html',
            controller: 'htModuleListCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return item;
                }
            }
        });

        outputValueInstance.result.then(function (score) {
            selt.HtResolveList = score;
        });
    }

    this.maxSize = 5;
    this.setPage(1);




    //交接单划出层样式
    this.panelClass = "contact panel panel-default";

    this.openPanel = function () {
        selt.panelClass = "contact panel panel-default active";
    };
    this.closePanel = function () {
        selt.panelClass = "contact panel panel-default";
        selt.selectTag('1');
    };

    //产值分解划出层
    this.opvPanelClass = "person panel panel-default";

    this.openOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default active";
    };
    this.closeOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default";
    };












    //--tag切换
    this.tagclass01 = "RuActive";
    this.tagclass02 = "";
    this.tagclass03 = "";
    this.tag = 1;
    this.selectTag = function (tag) {
        selt.tag = tag;
        if(tag==1){
            selt.tagclass01="RuActive";
            selt.tagclass02="";
            selt.tagclass03="";
            url = "/personnel/personnelSave";
        }else if(tag==2){
            selt.tagclass01="";
            selt.tagclass02="RuActive";
            selt.tagclass03="";
            url = "/personnel/personnelBasicSave";
        }else if(tag==3){
            selt.tagclass01="";
            selt.tagclass02="";
            selt.tagclass03="RuActive";
            url = "/personnel/personnelFileSave";
        };

    };

    //--时间控件
    this.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    this.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    this.format = this.formats[0];
    // this.entryDate = $filter("date")(new Date(), "yyyy-MM-dd");
    this.openEnterTime = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        selt.enterTime = true;
    };
    this.openFinishTime=function($event){
        $event.preventDefault();
        $event.stopPropagation();

        selt.finishTime = true;

    };

    this.handoverView = function (htProduct) {
        selt.showbutton=false;
        selt.submitted=false;
        $http.post("/ts-project/handover/getHandover",angular.toJson(htProduct)).success(function (result) {
            if(result.success){
                selt.handover = result.object;
                if(!selt.handover.contentJson){
                    selt.handover.contentJson = [];
                }
            }else{
                selt.handover = {
                    "contentJson":[]
                };
            }
        });
    };

    this.handoverSave = function () {
        //非空校验和时间格式化
        var keepGoing = true;
        angular.forEach(selt.handover.contentJson, function(note) {
            if(note.input=='date'&&note.value){
                note.value = $filter("date")(note.value, "yyyy-MM-dd");
            }
            if(keepGoing) {
                if(note.isRequired==1&&!note.value){
                    keepGoing = false;
                    alert(note.name+"不为空");
                }
            }
        });

        if(keepGoing){
            if(selt.handover.status&&selt.handover.status==1){
                alert("该交接单已经提交,不能修改!");
                return;
            }
            //保存交接单
            $http.post("/ts-project/handover/saveHandover",angular.toJson(selt.handover)).success(function (result) {
                if(result.success){
                    selt.handover = result.object;
                    alert("交接单保存成功!");
                }else{
                    alert("交接单保存失败!");
                }
            });
        }
    };

    this.handoverSubmit = function () {
        if(selt.handover.status&&selt.handover.status==1){
            alert("该交接单已经提交,不能重复提交!");
            return;
        }
        $http.post("/ts-project/handover/submitHandover",angular.toJson(selt.handover)).success(function (result) {
            if(result.success){
                selt.handover = result.object;
                alert("交接单提交成功!");
            }else{
                alert("交接单提交失败!");
            }
        });
    };

    this.queryHtResolve = function (htProduct) {
        var parm={
            contractNo:htProduct.contractNo,
            hospitalLevel:htProduct.hospitalLevel,
            contractPrice:(parseInt(htProduct.contractPrice)*0.0001).toFixed(4)
        }
        selt.htPrice=(parseInt(htProduct.contractPrice)*0.0001).toFixed(4);
        selt.htNo=htProduct.contractNo;
        selt.hosLevel=htProduct.hospitalLevel;
        $http.post("/ts-project/con_product/queryHtResolve",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.HtResolveList = result.object;
            }else{
                selt.HtResolveList=[];
            }
        });
    };

    this.updateResolveTotal = function () {
        var parm={
            htResolveList:selt.HtResolveList
        }
        $http.post("/ts-project/con_product/updateResolveTotal",angular.toJson(parm)).success(function (result) {
            if(result.success){
                alert("产值修改成功!");
            }else{
                alert("产值修改失败!");
            }
        });
    }

    this.addProModule=function(size){
        var pro={
            htNo:selt.htNo,
            htPrice:selt.htPrice,
            hosLevel:selt.hosLevel
        }
        var proModuleInstance = $modal.open({
            templateUrl: 'pro_module.html',
            controller: 'proModuleCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return pro;
                }
            }
        });

        proModuleInstance.result.then(function (module) {
            var parm={
                contractNo:module.htNo,
                hospitalLevel:module.hosLevel,
                contractPrice:module.htPrice
            }
            $http.post("/ts-project/con_product/queryHtResolve",angular.toJson(parm)).success(function (result) {
                if(result.success){
                    selt.HtResolveList = result.object;
                }else{
                    selt.HtResolveList=[];
                }
            });
        });
    }
}]);

app.controller('htModuleListCtrl', ['$scope', '$modalInstance','$http', 'data', function($scope,$modalInstance,$http,data) {
    var selt=this;
    console.log(data);

    $http.post("/ts-project/con_product/queryHtModule",angular.toJson(data)).success(function (result) {
        if(result.success){
            selt.htModuleList = result.object;
        }else{
            selt.htModuleList=[];
        }
    });

    this.updateModulePrice = function () {
        var parm={
            htModuleList:selt.htModuleList,
            contractPrice:data.htPrice
        }
        $http.post("/ts-project/con_product/updateModulePrice",angular.toJson(parm)).success(function (result) {
            if(result.success){
                $modalInstance.close(result.object);
            }
        });
    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])

app.controller('proModuleCtrl', ['$scope', '$modalInstance','$http','data', function($scope,$modalInstance,$http,data) {
    var product=this;
    this.oneAtATime = true;
    $http.post("/ts-project/product/getTbProductList/"+data.htNo).success(function (result) {
        if(result.success){
            product.proModuleList = result.object;
            product.selected=result.checkList;
        }else{
            product.proModuleList=[];
            alert(result.message);
        }
    });

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    var updateSelected = function (action, modId) {
        if (action == 'add' && product.selected.indexOf(modId) == -1) {
            product.selected.push(modId);
        }
        if (action == 'remove' && product.selected.indexOf(modId) != -1) {
            var idx = product.selected.indexOf(modId);
            product.selected.splice(idx, 1);
        }
    }

    this.updateSelection = function ($event, modId) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, modId);
    }

    this.isSelected = function (modId) {
        return product.selected.indexOf(modId) != -1;
    }

    this.addModule=function() {
        var param_module = {
            htNo: data.htNo,
            htPrice: data.htPrice,
            hosLevel:data.hosLevel,
            moduleList: product.selected
        };
        $http.post("/ts-project/product/saveTbProductModule",angular.toJson(param_module)).success(function (result) {
            if(result.success){
                alert(result.message)
            }else{
                alert(result.message);
            }
        });
        $modalInstance.close(param_module);
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


}])
