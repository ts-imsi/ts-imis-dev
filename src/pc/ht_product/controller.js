app.controller('htProductCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    this.maxSize = 5;

    this.selectContract=function(){
        this.setPage(1);
    };
    this.selectByStatus=function(status){
        selt.status=status;
        this.setPage(1);
    };
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectName:selt.selectName,
            showAll:selt.showAll,
            status:selt.status
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
            selectName:selt.selectName,
            showAll:selt.showAll,
            status:selt.status
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
    };






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

    //申请
    this.opAppyPanelClass = "person panel panel-default";

    this.openAppyPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default active";
    };
    this.closeAppyVPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default";
    };



    this.addHtChange=function(htProduct){
        console.log("===========ceshi");
        selt.showLModule=false;
        selt.submitApply=true;
        selt.submitted=false;
        selt.type="";
        selt.customerName="";
        selt.signDate="";
        selt.changeContent="";
        selt.remark="";
        selt.oldWaitModuleList=[];
        selt.oldPModuleList=[];
        selt.proOldM=[];
        selt.oldModuleList=[];

        selt.newProModuleList=[];
        selt.newPModuleList=[];
        selt.proNewM=[];
        selt.newModuleList=[];

        selt.htNo=htProduct.contractNo;
        selt.htName=htProduct.contractName;
        selt.customerName=htProduct.customerName;
        selt.signDate=$filter("date")(htProduct.signDate, "yyyy-MM-dd");
        selt.hospitalGrade=htProduct.hospitalGrade;
        selt.contractPrice=htProduct.contractPrice;
        selt.contractOwner=htProduct.contractOwner;
        $http.post("/ts-project/htChange/selectTbPersonnel").success(function (result) {
            if(result.success){
                selt.personnel = result.object;
                selt.createUser=selt.personnel.name;
                selt.applicationDept=selt.personnel.depName;
                selt.created=$filter("date")(new Date(), "yyyy-MM-dd");
            }else{
                selt.personnel=[];
                alert(result.message);
            }
        });

        $http.post("/ts-project/product/queryTbProductList").success(function (result) {
            if(result.success){
                selt.proList = result.object;
            }else{
                selt.proList=[];
                alert(result.message);
            }
        });
    };

    //老模块合计

    this.updateSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.oldWaitModuleList.indexOf(item.proCode) == -1) {
            selt.oldWaitModuleList.push(item.proCode);
        }
        if (action == 'remove' && selt.oldWaitModuleList.indexOf(item.proCode) != -1) {
            var idx = selt.oldWaitModuleList.indexOf(item.proCode);
            selt.oldWaitModuleList.splice(idx, 1);

            var sta=[];
            var mo=[]
            angular.forEach(selt.proOldM,function(proM){
                sta.push(proM);
            });

            angular.forEach(selt.oldModuleList,function(mod){
                mo.push(mod);
            });

            angular.forEach(sta,function(proM){
                if(proM.split("|")[0]==item.proCode){
                    var idlx= selt.proOldM.indexOf(proM);
                    selt.proOldM.splice(idlx, 1);

                    angular.forEach(mo,function(mod){
                        if(proM.split("|")[1]==mod){
                            var idTag = selt.oldModuleList.indexOf(mod);
                            selt.oldModuleList.splice(idTag, 1);
                        }
                    })
                }
            })
        }
        $http.post("/ts-project/product/selectProModule/"+item.proCode).success(function (result) {
            if(result.success){
                selt.oldPModuleList = result.object;
            }else{
                selt.oldPModuleList=[];
                alert(result.message);
            }
        });
    };

    this.showSelect=function(pro){
        $http.post("/ts-project/product/selectProModule/"+pro.proCode).success(function (result) {
            if(result.success){
                selt.oldPModuleList = result.object;
            }else{
                selt.oldPModuleList=[];
                alert(result.message);
            }
        });
    };

    this.isSelected = function (item) {
        return selt.oldWaitModuleList.indexOf(item.proCode) != -1;
    };

    //老模块选中
    this.isOldSelected = function (item) {
        var name=item.modId+":"+item.modName;
        return selt.oldModuleList.indexOf(name) != -1;
    };

    this.updateOldSelection = function ($event, item) {
        var name=item.modId+":"+item.modName;
        var codeId=item.proCode+"|"+item.modId+":"+item.modName;
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.oldModuleList.indexOf(name) == -1) {
            selt.oldModuleList.push(name);
            selt.proOldM.push(codeId);
        }
        if (action == 'remove' && selt.oldModuleList.indexOf(name) != -1) {
            var idx = selt.oldModuleList.indexOf(name);
            var idc=selt.proOldM.indexOf(codeId);
            selt.oldModuleList.splice(idx, 1);
            selt.proOldM.splice(idc,1);
        }
    };



    //新模块合计

    this.updateNewProSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.newProModuleList.indexOf(item.proCode) == -1) {
            selt.newProModuleList.push(item.proCode);
        }
        if (action == 'remove' && selt.newProModuleList.indexOf(item.proCode) != -1) {
            var idx = selt.newProModuleList.indexOf(item.proCode);
            selt.newProModuleList.splice(idx, 1);

            var sta=[];
            var mo=[]
            angular.forEach(selt.proNewM,function(proM){
                sta.push(proM);
            });

            angular.forEach(selt.newModuleList,function(mod){
                mo.push(mod);
            });

            angular.forEach(sta,function(proM){
                if(proM.split("|")[0]==item.proCode){
                    var idlx= selt.proNewM.indexOf(proM);
                    selt.proNewM.splice(idlx, 1);

                    angular.forEach(mo,function(mod){
                        if(proM.split("|")[1]==mod){
                            var idTag = selt.newModuleList.indexOf(mod);
                            selt.newModuleList.splice(idTag, 1);
                        }
                    })
                }
            })
        }
        $http.post("/ts-project/product/selectProModule/"+item.proCode).success(function (result) {
            if(result.success){
                selt.newPModuleList = result.object;
            }else{
                selt.newPModuleList=[];
                alert(result.message);
            }
        });
    };

    this.isNewProSelected = function (item) {
        return selt.newProModuleList.indexOf(item.proCode) != -1;
    };


    //新模块选中
    this.isNewSelected = function (item) {
        var name=item.modId+":"+item.modName;
        return selt.newModuleList.indexOf(name) != -1;
    };

    this.showNewSelect=function(pro){
        $http.post("/ts-project/product/selectProModule/"+pro.proCode).success(function (result) {
            if(result.success){
                selt.newPModuleList = result.object;
            }else{
                selt.newPModuleList=[];
                alert(result.message);
            }
        });
    };

    this.updateNewSelection = function ($event, item) {
        var name=item.modId+":"+item.modName;
        var codeId=item.proCode+"|"+item.modId+":"+item.modName;
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && selt.newModuleList.indexOf(name) == -1) {
            selt.newModuleList.push(name);
            selt.proNewM.push(codeId);
        }
        if (action == 'remove' && selt.newModuleList.indexOf(name) != -1) {
            var idx = selt.newModuleList.indexOf(name);
            var idc=selt.proNewM.indexOf(codeId);
            selt.newModuleList.splice(idx, 1);
            selt.proNewM.splice(idc,1);
        }
        if(selt.type=="BG"){
            selt.newModule_name="合同"+selt.htNo+"由"+selt.oldModuleList+"模块变更为"+selt.newModuleList+"模块";
            selt.remark=selt.newModule_name;
        }
        if(selt.type=="ZB"){
            selt.newModule_name="合同"+selt.htNo+"新增模块"+selt.newModuleList;
            selt.remark=selt.newModule_name;
        }
    };




    this.showModule=function(){
        if(selt.type=="BG"){
            selt.showOldModule=true;
            selt.showNewModule=true;
        }else{
            selt.showOldModule=false;
            selt.showNewModule=true;
        }
    };


    this.applySubmit=function(valid,invalid){
        if (valid) {
            if (!invalid) {
                var tbHtChange={
                    htNo:selt.htNo,
                    htName:selt.htName,
                    customerName:selt.customerName,
                    type:selt.type,
                    status:0,
                    htOwner:selt.contractOwner,
                    signDate:$filter("date")(selt.signDate, "yyyy-MM-dd"),
                    changeContent:selt.changeContent,
                    workNum:selt.personnel.workNum,
                    applicationDept:selt.applicationDept,
                    createUser:selt.createUser,
                    created:selt.created,
                    remark:selt.remark
                }
                var param={
                    htchange:tbHtChange,
                    oldModuleList:selt.oldModuleList,
                    newModuleList:selt.newModuleList,
                    hosLevel:selt.hospitalGrade,
                    price:(parseInt(selt.contractPrice)*0.0001).toFixed(4)

                }
                $http.post("/ts-project/htChange/applySubmit",angular.toJson(param)).success(function (result) {
                    if(result.success){
                        alert(result.message);
                        selt.submitApply=false;
                        this.setPage(1);
                    }else{
                        alert(result.message);
                    }
                });

            }
        }else{
            selt.submitted=true;
        }
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
        htProduct.type='NEW';
        htProduct.changeNo = htProduct.contractNo;
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

    this.addProModule=function(){
        var pro={
            htNo:selt.htNo,
            htPrice:selt.htPrice,
            hosLevel:selt.hosLevel
        }
        var proModuleInstance = $modal.open({
            templateUrl: 'pro_module.html',
            controller: 'proModuleCtrl as ctrl',
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
    };





    //---页面按钮权限控制--start--
    this.opCodes = [];
    this.isShowOpe = function(value){
        for(var i = 0; i < selt.opCodes.length; i++){
            if(value === selt.opCodes[i]){
                return true;
            }
        }
        return false;
    };
    $http.get("/ts-project/ts-authorize/ts-imis/operList/app-ht_product").success(function (result) {
        if (result.success) {
            selt.opCodes = result.object;
            if(selt.isShowOpe("all")){
                selt.showAll = "all";
            }
            selt.setPage(1);
        } else {
            alert(result.message);
        }
    });

    //-------------------end---
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
    product.newProModuleList=[];
    product.newPModuleList=[];
    product.newModuleList=[];
    product.proM=[];

    $http.post("/ts-project/product/getAddModuleView/"+data.htNo).success(function (result) {
        if(result.success){
            product.proList = result.proList;
            product.newProModuleList=result.newProModuleList;
            product.proM = result.proM;
            product.newModuleList = result.newModuleList;
        }else{
            product.proList=[];
        }
    });

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    this.showProMSelect=function(pro){
        $http.post("/ts-project/product/selectProModule/"+pro.proCode).success(function (result) {
            if(result.success){
                product.newPModuleList = result.object;
            }else{
                product.newPModuleList=[];
                alert(result.message);
            }
        });
    }

    //新模块合计
    this.updateNewProSelection = function ($event, item) {
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && product.newProModuleList.indexOf(item.proCode) == -1) {
            product.newProModuleList.push(item.proCode);
        }
        if (action == 'remove' && product.newProModuleList.indexOf(item.proCode) != -1) {
            var idx = product.newProModuleList.indexOf(item.proCode);
            product.newProModuleList.splice(idx, 1);
            var sta=[];
            var mo=[]
            angular.forEach(product.proM,function(proM){
                sta.push(proM);
            });

            angular.forEach(product.newModuleList,function(mod){
                mo.push(mod);
            });

            angular.forEach(sta,function(proM){
                if(proM.split("|")[0]==item.proCode){
                    var idlx= product.proM.indexOf(proM);
                    product.proM.splice(idlx, 1);

                    angular.forEach(mo,function(mod){
                        if(proM.split("|")[1]==mod){
                            var idTag = product.newModuleList.indexOf(mod);
                            product.newModuleList.splice(idTag, 1);
                        }
                    })
                }
            })
        }
        $http.post("/ts-project/product/selectProModule/"+item.proCode).success(function (result) {
            if(result.success){
                product.newPModuleList = result.object;
            }else{
                product.newPModuleList=[];
                alert(result.message);
            }
        });
    }

    this.isNewProSelected = function (item) {
        return product.newProModuleList.indexOf(item.proCode) != -1;
    }


    //新模块选中

    this.isNewSelected = function (item) {
        var name=item.modId+":"+item.modName;
        return product.newModuleList.indexOf(name) != -1;
    }

    this.updateNewSelection = function ($event, item) {
        var name=item.modId+":"+item.modName;
        var codeId=item.proCode+"|"+item.modId+":"+item.modName;
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');

        if (action == 'add' && product.newModuleList.indexOf(name) == -1) {
            product.newModuleList.push(name);
            product.proM.push(codeId)
        }
        if (action == 'remove' && product.newModuleList.indexOf(name) != -1) {
            var idx = product.newModuleList.indexOf(name);
            var idc=product.proM.indexOf(codeId);
            product.newModuleList.splice(idx, 1);
            product.proM.splice(idc,1);
        }
    }

    this.addModule=function() {
        var param_module = {
            htNo: data.htNo,
            htPrice: data.htPrice,
            hosLevel:data.hosLevel,
            moduleList: product.newModuleList
        };
        $http.post("/ts-project/product/saveTbProductModule",angular.toJson(param_module)).success(function (result) {
            if(result.success){
                alert(result.message);
                $modalInstance.close(param_module);
            }else{
                alert(result.message);
            }
        });

    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


}])
