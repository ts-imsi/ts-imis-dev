app.controller('htChangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.showht=false;
    selt.submitted=false;
    selt.submitApply=true;
    selt.showOldModule=false;
    selt.showNewModule=true;

    this.selectContract=function(){

        this.setPage(1);
    };
    this.selectChange=function(){
        this.setPage(1);
    };
    this.selectByStatus=function(status){
        /*switch (status){
            case '0':
                selt.status=status;
                break;
            case '1':
                selt.status=status;
                break;
        }*/
        if(status==0){
            selt.status='';
        }else{
            selt.status=status;
        }
        this.setPage(1);
    };
    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            selectType:selt.selectType,
            selectName:selt.selectName,
            status:selt.status
        };
        console.log(parm);
        $http.post("/ts-project/htChange/getHtChangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htChangeList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htChangeList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            selectType:selt.selectType,
            selectName:selt.selectName,
            status:selt.status
        };
        $http.post("/ts-project/htChange/getHtChangeList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.htChangeList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.htChangeList=[];
            }
        });

    };

    this.maxSize = 5;
    this.setPage(1);


    this.addHtChange=function(){
        console.log("===========ceshi");

        selt.submitApply=true;
        selt.submitted=false;
        selt.type="";
        selt.showht=false;
        selt.customerName="";
        selt.signDate="";
        selt.changeContent="";
        selt.remark="";
        selt.oldModuleList=[];
        selt.newModuleList=[];

        $http.post("/ts-project/htChange/selectTbPersonnel").success(function (result) {
            if(result.success){
                selt.personnel = result.object;
                selt.createUser=selt.personnel.name;
                selt.applicationDept=selt.personnel.depName;
                selt.created=$filter("date")(new Date(), "yyyy-MM-dd")
            }else{
                selt.personnel=[];
                alert(result.message);
            }
        });

        $http.post("/ts-project/htChange/getOaContractListByOwner").success(function (result) {
            if(result.success){
                selt.htlist = result.object;
            }else{
                selt.htlist=[];
                alert(result.message);
            }
        });

    }

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

    this.applySubmit=function(valid,invalid){
        if (valid) {
            if (!invalid) {
                var tbHtChange={
                    htNo:selt.ht.contractNo,
                    htName:selt.ht.contractName,
                    customerName:selt.ht.customerName,
                    type:selt.type,
                    status:1,
                    htOwner:selt.ht.contractOwner,
                    signDate:$filter("date")(selt.ht.signDate, "yyyy-MM-dd"),
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
                    hosLevel:selt.ht.hospitalGrade,
                    price:(parseInt(selt.ht.contractPrice)*0.0001).toFixed(4)

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
    }

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


    this.handoverView = function (htChange) {
        selt.showbutton=false;
        selt.submitted=false;
        selt.htChange=htChange;
        $http.post("/ts-project/htChange/getContractByHtNo/"+htChange.htNo).success(function (result) {
            if(result.success){
                result.object.changeNo=selt.htChange.type+"-"+selt.htChange.pkid;
                result.object.type=selt.htChange.type;
                $http.post("/ts-project/handover/getHandover",angular.toJson(result.object)).success(function (result) {
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


    this.addNewModule=function(){
        var proModuleInstance = $modal.open({
            templateUrl: 'pro_module.html',
            controller: 'proModuleCtrl as ctrl',
            resolve: {
                data: function () {
                    return selt.newModuleList;
                }
            }
        });

        proModuleInstance.result.then(function (module) {
            selt.newModuleList=module;
            selt.newModule="";
            angular.forEach(selt.newModuleList,function(item){
                selt.newModule=selt.newModule+item+";";
            });
            if(selt.type=="BG"){
                selt.newModule_name="合同"+selt.ht.contractNo+"由"+selt.oldModule+"模块变更为"+selt.newModule+"模块";
                selt.remark=selt.newModule_name;
            }
            if(selt.type=="ZB"){
                selt.newModule_name="合同"+selt.ht.contractNo+"新增模块"+selt.newModule;
                selt.remark=selt.newModule_name;
            }

        });
    }

    this.addoldModule=function(){
        var proModuleInstance = $modal.open({
            templateUrl: 'pro_module.html',
            controller: 'proModuleCtrl as ctrl',
            resolve: {
                data: function () {
                    return selt.oldModuleList;
                }
            }
        });

        proModuleInstance.result.then(function (module) {
            selt.oldModuleList=module;
            selt.oldModule="";
            angular.forEach(selt.oldModuleList,function(item){
                  selt.oldModule=selt.oldModule+item+";";
            });

        });
    }

    this.showModule=function(){
        if(selt.type=="BG"){
            selt.showOldModule=true;
            selt.showNewModule=true;
        }else{
            selt.showOldModule=false;
        }
    };

    this.queryHtResolve = function (htChange) {

        $http.post("/ts-project/htChange/getContractByHtNo/"+htChange.htNo).success(function (result) {
            if(result.success){

                var parm={
                    contractNo:htChange.type+"-"+htChange.pkid,
                    hospitalLevel:result.object.hospitalLevel,
                    contractPrice:(parseInt(result.object.contractPrice)*0.0001).toFixed(4)
                }
                selt.conPrice=(parseInt(result.object.contractPrice)*0.0001).toFixed(4);
                $http.post("/ts-project/con_product/queryHtResolve",angular.toJson(parm)).success(function (result) {
                    if(result.success){
                        selt.HtResolveList = result.object;
                    }else{
                        selt.HtResolveList=[];
                    }
                });
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

    this.htChangeView=function(htChange){
        selt.submitApply=false;
        selt.showOldModule=false;
        selt.type=htChange.type;
        selt.showht=true;
        selt.htName=htChange.htName;
        selt.customerName=htChange.customerName;
        selt.signDate=htChange.signDate;
        selt.changeContent=htChange.changeContent;
        selt.remark=htChange.remark;
        selt.showNewModule=false;
        $http.post("/ts-project/htChange/getHtChangeView/"+htChange.type+"/"+htChange.pkid).success(function (result) {
            if(result.success){
                selt.oldModuleList = result.oldModule;
                selt.newModuleList=result.newModule;
            }else{
                selt.oldModuleList=[];
                selt.newModuleList=[];
            }
        });

        $http.post("/ts-project/htChange/getOaContractListByOwner").success(function (result) {
            if(result.success){
                selt.htlist = result.object;
                angular.forEach(selt.htlist,function(item){
                    if(item.contractNo==htChange.htNo){
                        selt.ht=item;
                    }
                });
            }else{
                selt.htlist=[];
                alert(result.message);
            }
        });

        $http.post("/ts-project/htChange/selectTbPersonnel").success(function (result) {
            if(result.success){
                selt.personnel = result.object;
                selt.createUser=selt.personnel.name;
                selt.applicationDept=selt.personnel.depName;
                selt.created=$filter("date")(new Date(), "yyyy-MM-dd")
            }else{
                selt.personnel=[];
                alert(result.message);
            }
        });


    }


    //申请
    this.opAppyPanelClass = "person panel panel-default";

    this.openAppyPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default active";
    };
    this.closeAppyVPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default";
    };

    //产值分解划出层
    this.opvPanelClass = "person panel panel-default";

    this.openOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default active";
    };
    this.closeOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default";
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
    $http.post("/ts-project/product/getNewTbProductList").success(function (result) {
        if(result.success){
            product.proModuleList = result.object;
            if(data=='undefined'||data==null){
                product.selected=[];
            }else{
                product.selected=data;
            }

        }else{
            product.proModuleList=[];
            alert(result.message);
        }
    });

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    var updateSelected = function (action, name) {
        if (action == 'add' && product.selected.indexOf(name) == -1) {
            product.selected.push(name);
        }
        if (action == 'remove' && product.selected.indexOf(name) != -1) {
            var idx = product.selected.indexOf(name);
            product.selected.splice(idx, 1);
        }
    }

    this.updateSelection = function ($event, item) {
        var name=item.modId+":"+item.modName;
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        updateSelected(action, name);
    }

    this.isSelected = function (item) {
        var name=item.modId+":"+item.modName;
        return product.selected.indexOf(name) != -1;
    }

    this.addModule=function() {
        $modalInstance.close(product.selected);
    }
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


}])