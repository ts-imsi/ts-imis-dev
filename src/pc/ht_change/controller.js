app.controller('htChangeCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;
    selt.showht=false;
    selt.submitted=false;
    selt.submitApply=true;

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

    this.showContractNo=function(){
        selt.showht=true;
        selt.customerName=selt.ht.customerName;
        selt.htName=selt.ht.contractName;
        selt.signDate=$filter("date")(selt.ht.signDate, "yyyy-MM-dd");
    }

    this.applySubmit=function(valid,invalid){
        if (valid) {
            if (!invalid) {
                var param={
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
                    created:selt.created
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


    this.handoverView = function (htNo) {
        selt.showbutton=false;
        selt.submitted=false;
        $http.post("/ts-project/htChange/getContractByHtNo/"+htNo).success(function (result) {
            if(result.success){
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

    //划出层
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
