(function() {
    angular
        .module('MOBILEAPP.OUTPUTVALUE.CONTROLLER', ['ui.bootstrap'])
        .controller('outputValueCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            this.dw="万元";
            this.bfh="%";
            var param={
                type:"dept",
                status:1
            };
            selt.objtype=[];
            $http.post("/ts-project/mobileOutput/quereyArrangeList",angular.toJson(param)).success(function (result) {
                if (result.success) {
                    selt.outputValueVoList=result.list;
                    selt.total=result.total;
                    angular.forEach(selt.outputValueVoList,function(item,index){
                        if(index==0){
                            selt.objtype.push(true);
                        }else{
                            selt.objtype.push(false);
                        }

                    })
                } else {
                    selt.outputValueVoList=[];
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

            };
        }]);

    angular
        .module('MOBILEAPP.CONFIRVALUE.CONTROLLER', ['ui.bootstrap'])
        .controller('confirValueCtrl', ['$http','$uibModal','$log','$document','utils',function($http,$uibModal, $log, $document,utils) {
            var selt = this;
            this.dw="万元";
            this.bfh="%";
            var param={
                type:"dept",
                status:0
            };
            selt.objtype=[];
            this.quereyArrangeList=function(){
                $http.post("/ts-project/mobileOutput/quereyArrangeList",angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        selt.outputValueVoList=result.list;
                        selt.total=result.total;
                        angular.forEach(selt.outputValueVoList,function(item,index){
                            if(index==0){
                                selt.objtype.push(true);
                            }else{
                                selt.objtype.push(false);
                            }

                        })
                    } else {
                        selt.outputValueVoList=[];
                        alert(result.message);
                    }
                });
            }
            this.quereyArrangeList();

            this.chickClassMui=function(index){
                console.log(selt.objtype[index]);
                if(selt.objtype[index]){
                    selt.objtype.splice(index,1,false);
                }else{
                    selt.objtype.splice(index,1,true);
                }

            };

            this.isSelected = function (output) {
                var boo = output.checked;
                output.checked = !boo;
            };

            this.checkOutputValue = function (vo) {
                var outputList = [];
                angular.forEach(vo.outputValueList, function(output) {
                    if(output.checked){
                        outputList.push(output);
                    }
                });
                $http.post("/ts-project/mobileOutput/checkedOutput",angular.toJson(outputList)).success(function (result) {
                    if(result.success){
                        selt.quereyArrangeList();
                    }
                    alert(result.message);
                });
            };

        }]);
})();
