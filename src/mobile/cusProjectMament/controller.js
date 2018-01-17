(function() {
    angular
        .module('MOBILEAPP.CUSPROJECTMAMENT.CONTROLLER', ['ui.bootstrap'])
        .controller('cusProjectMamentCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var customerName=utils.getUrlVar("cusName");
            selt.customerName=decodeURI(customerName);
            selt.outputValueM=false;
            selt.confirValueM=false;
            selt.transactM=false;
            selt.handoverM=false;
            selt.projectMentM=false;

            this.queryProjectArrange=function(){
                var param={
                    isArrange:1,
                    customerName:selt.customerName,
                    showAll:'all'
                };
                selt.objtype=[];
                $http.post("/ts-project/mobileProject/selectMobileProjectArrangeList",angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        selt.handOverList=result.object;
                        angular.forEach(selt.handOverList,function(item){
                            selt.objtype.push(false);
                            angular.forEach(item.planList,function(pl){
                                if(pl.poit==null){
                                    pl.poit=0;
                                }
                                pl.planStyle={"width":pl.poit*100+'%'};
                                pl.planStyleN=pl.poit*100+'%';
                            })
                        })

                    } else {
                        selt.handOverList=[];
                        alert(result.message);
                    }
                });
            }
            this.queryProjectArrange();
            this.chickClassMui=function(index){
                console.log(selt.objtype[index]);
                if(selt.objtype[index]){
                    selt.objtype.splice(index,1,false);
                }else{
                    selt.objtype.splice(index,1,true);
                }

            }
        }]);

    angular
        .module('MOBILEAPP.CUSPROJECTDETAILS.CONTROLLER', ['ui.bootstrap'])
        .controller('cusProjectDetailsCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var planId=utils.getUrlVar("planId");
            selt.objTypeDetail=[];

            this.queryItem=function(){
                $http.post("/ts-project/mobileProject/selectMobilePlanItems/"+planId).success(function (result) {
                    if (result.success) {
                        selt.projectPlan=result.tbProjectPlan;
                        selt.handover=result.handover;
                        selt.planDetail=result.planDetail;
                        angular.forEach(selt.planDetail.tbPlanStages,function(item){
                            selt.objTypeDetail.push(true);
                        })
                    } else {
                        selt.handover='';
                        selt.planDetail='';
                        alert(result.message);
                    }
                });
            };
            this.queryItem();


            this.chickClassMui=function(index){
                console.log(selt.objTypeDetail[index]);
                if(selt.objTypeDetail[index]){
                    selt.objTypeDetail.splice(index,1,false);
                }else{
                    selt.objTypeDetail.splice(index,1,true);
                }

            }

            this.checkOk = function (item,userRole) {
                item.userRole = userRole;
                $http.post("/ts-project/planDetail/check/ok",angular.toJson(item)).success(function (result) {
                    alert(result.message);
                    if(result.success){
                        selt.queryItem();
                    }
                });
            };

            this.checkBack = function (item,userRole) {
                item.userRole = userRole;
                $http.post("/ts-project/planDetail/check/back",angular.toJson(item)).success(function (result) {
                    alert(result.message);
                    if(result.success){
                        selt.queryItem();
                    }
                });
            };

            this.showButton = function (planCheck,role,perm) {
                var show =0 ;
                angular.forEach(planCheck,function(item){
                    if(item.checkTag == role){
                        show = 1;
                    }
                    if(item.checkTag==role&&item.status==1){
                        show = 2;
                    }
                });
                return show;


            }

        }]);
})();
