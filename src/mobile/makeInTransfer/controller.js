(function() {
    angular
        .module('MOBILEAPP.MAKEINTRANSFER.CONTROLLER', ['ui.bootstrap'])
        .controller('makeInCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;

            selt.outputValueM=false;
            selt.confirValueM=false;
            selt.transactM=false;
            selt.handoverM=false;
            selt.projectMentM=false;
            $http.get("/ts-authorize/ts-mobile/menus").success(function(result){
                if(result.success){
                    if(result.object[0].length!=0) {
                        selt.munuList = result.object[0].childrens;
                        angular.forEach(selt.munuList, function (item) {
                            if (item.translate == 'outputValue') {
                                selt.outputValueM = true;
                            } else if (item.translate == 'confirValue') {
                                selt.confirValueM = true;
                            } else if (item.translate == 'transact') {
                                selt.transactM = true;
                            } else if (item.translate == 'handover') {
                                selt.handoverM = true;
                            } else if (item.translate == 'projectMent') {
                                selt.projectMentM = true;
                            }

                        });
                    }else{
                        selt.munuList = [];
                    }

                }else{
                    selt.munuList = [];
                }
            });

            this.queryOaContractListByOwner=function(){
                var param={
                    showAll:selt.showAll
                }
                $http.post("/ts-project/mobileMakeIn/getOaContractListByOwner",angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        selt.contractInfosD=result.contractInfosD;
                        selt.contractInfosM=result.contractInfosM;
                    } else {
                        selt.contractInfosD=[];
                        selt.contractInfosM=[];
                    }
                });
            }

            this.test=function(){
                selt.showAll="";
                selt.queryOaContractListByOwner();
            };
            //this.test();

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
            $http.get("/ts-authorize/ts-mobile/operList/makeInTransfer").success(function (result) {
                if (result.success) {
                    selt.opCodes = result.object;
                    if(selt.isShowOpe("all")){
                        selt.showAll = "all";
                    }
                    selt.queryOaContractListByOwner();
                } else {
                    alert(result.message);
                }
            });

            //-------------------end---

        }]);

    angular
        .module('MOBILEAPP.MAKEINCHEDULE.CONTROLLER', ['ui.bootstrap'])
        .controller('makeInCheduleCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var htNo=utils.getUrlVar("htNo");
            this.getMobileHandover=function(){
                $http.post("/ts-project/mobileMakeIn/getMobileHandover/"+htNo).success(function (result) {
                    if (result.success) {
                        selt.handover=result.object;
                    } else {
                        alert(result.message);
                    }
                });
            }

            this.getMobileHandover();

            this.saveHandover=function(){
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
                    if(selt.handover.status&&selt.handover.status!=0
                        &&selt.handover.nowStep
                        &&(selt.handover.nowStep!='待内控审批'&&selt.handover.nowStep!='待销售提交交接单')){
                        alert("该交接单已经提交,不能修改!");
                        return;
                    }

                    //保存交接单
                    $http.post("/ts-project/mobileMakeIn/saveMobileHandover",angular.toJson(selt.handover)).success(function (result) {
                        if(result.success){
                            selt.handover = result.object;
                            console.log("交接单保存成功!");
                        }else{
                            console.log("交接单保存失败!");
                        }
                    });
                }
            }

            this.handoverSubmit = function () {
                if(selt.handover.status&&selt.handover.status==1){
                    alert("该交接单已经提交,不能重复提交!");
                    return;
                }
                $http.post("/ts-project/handover/submitHandover",angular.toJson(selt.handover)).success(function (result) {
                    if(result.success){
                        selt.handover = result.object;
                        console.log("交接单提交成功!");
                    }else{
                        console.log("交接单提交失败!");
                    }
                });
            };

        }]);
})();
