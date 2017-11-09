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
        if(status==2){
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
        selt.createUser=htChange.createUser;
        selt.applicationDept=htChange.applicationDept;
        selt.created=$filter("date")(htChange.created, "yyyy-MM-dd");
        selt.showfj=false;
        if(selt.type=="BG"){
            selt.showOldModule=true;
            selt.showNewModule=true;
        }else{
            selt.showOldModule=false;
            selt.showNewModule=true;
        }

        $http.post("/ts-project/htChange/getHtChangeView/"+htChange.type+"-"+htChange.pkid).success(function (result) {
            if(result.success){
                selt.oldModuleList = result.oldModule;
                selt.newModuleList=result.newModule;
            }else{
                selt.oldModuleList=[];
                selt.newModuleList=[];
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
    }
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

    //申请
    this.opAppyPanelClass = "person panel panel-default";

    this.openAppyPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default active";
    };
    this.closeAppyVPanel = function () {
        selt.opAppyPanelClass = "person panel panel-default";
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
