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

    //划出层
    this.opvPanelClass = "person panel panel-default";

    this.openOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default active";
    };
    this.closeOPVPanel = function () {
        selt.opvPanelClass = "person panel panel-default";
    };
}]);
