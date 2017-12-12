(function() {
    angular
        .module('MOBILEAPP.PROJECTMENT.CONTROLLER', ['ui.bootstrap'])
        .controller('projectMentCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var param={
                isArrange:1
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
        .module('MOBILEAPP.PROJECTDETAILS.CONTROLLER', ['ui.bootstrap'])
        .controller('projectDetailsCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            var planId=utils.getUrlVar("planId");
            selt.objTypeDetail=[];

            this.queryItem=function(){
                $http.post("/ts-project/mobileProject/selectMobilePlanItems/"+planId).success(function (result) {
                    if (result.success) {

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

                var  permission = "";
                var show;
                angular.forEach(planCheck,function(item){
                    if(item.checkTag == role){
                        permission = item.permission;
                    }
                    if(item.checkTag==role&&item.status==1){
                        show=true;
                    }
                });
                    if(permission.indexOf(perm) >= 0){
                        if(show){
                            return false;
                        }else{
                            return true;
                        }
                    }else{
                        return false;
                    }

            }

        }]);
})();
