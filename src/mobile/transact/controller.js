(function() {
    angular
        .module('WEBAPP.TRANSACT.CONTROLLER', ['ui.bootstrap'])
        .controller('transactCtrl', ['$http','$uibModal','$log','$document',function($http,$uibModal, $log, $document) {
            var selt = this;

            this.selectTransactList=function(){
                //todo 测试openId
                var openId="o8qZCwdhpNkRkSwlNLC1WOwB37bE";
                var status;
                if(selt.tagS==1){
                    status=1;
                }else{
                    status=0;
                }
                $http.post("/ts-project/mobileTransact/queryMobileTransactList/"+openId+"/"+status).success(function (result) {
                    if (result.success) {
                        selt.transactMsgList=result.object;
                    } else {
                        selt.transactMsgList=[];
                        alert(result.message);
                    }
                });
            };
            this.selectTag=function(num){
                selt.tagS=num;
                if(num==1){
                    selt.treatedTagClass="mui-control-item mui-active";
                    selt.untreatedTagClass="mui-control-item";
                    selt.treatedClass="mui-control-content mui-active";
                    selt.untreatedClass="mui-control-content";
                }else{
                    selt.treatedTagClass="mui-control-item";
                    selt.untreatedTagClass="mui-control-item mui-active";
                    selt.treatedClass="mui-control-content";
                    selt.untreatedClass="mui-control-content mui-active";
                }
                this.selectTransactList();
            }
            this.selectTag(1);


        }]);
})();
