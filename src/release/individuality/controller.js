app.controller('ReIndividualityCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    selt.my_tree = {};
    selt.success=false;
    $http.post("/ts-release/jiarHos/selectHospitalTreeList").success(function(data){
        selt.success=data.success;
        selt.my_data =data.object;
    });
    var hospitalName;
    this.my_tree_handler = function(branch) {
        hospitalName=branch.data.customValue;
        this.setPage(1);
    };

    this.setPage = function (pageNo) {
        var parm={
            page:pageNo,
            rows:10,
            hospitalName:hospitalName
        };
        $http.post("/ts-release/individuality/getIndividualityList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.individualityList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.individualityList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm={
            page:this.pageNo,
            rows:10,
            hospitalName:hospitalName
        };
        $http.post("/ts-release/individuality/getIndividualityList",angular.toJson(parm)).success(function (result) {
            if(result.success){
                selt.individualityList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.individualityList=[];
            }
        });

    };

    this.maxSize = 5;

    this.individualUpload=function(size){
        var individualityInstance = $modal.open({
            templateUrl: 'individuality.html',
            controller: 'individualityCtrl as ctrl',
            size: size,
            resolve: {
                data: function () {
                    return selt.my_data;
                }
            }
        });

        individualityInstance.result.then(function () {
        });
    };

    this.deleteFile=function(individuality){
        $http.post("/ts-release/individuality/deleteFile/"+individuality.pkid+"/private-file").success(function (result) {
            if(result.success){
                alert("数据删除成功");
            }else{
                alert("数据删除失败");
            }
        });
    }

}]);

app.controller('individualityCtrl', ['$scope', '$modalInstance','$http','data', function($scope,$modalInstance,$http,data) {
    var selt=this;

    $http.post("/ts-release/product/getProModuleList").success(function (result) {
        if(result.success){
            selt.proModule = result.object;
        }else{
            selt.proModule=[];
        }
    });
    if(data[0].children!=null){
        selt.hospitalList=data[0].children;
        var hospi=[];
        angular.forEach(selt.hospitalList,function(item){
            var selectJosn={
                id:item.data.id,
                text:item.data.customValue
            }
            hospi.push(selectJosn);
        })
        selt.hosList={data:hospi};
    }
    selt.submitted=false;
    this.saveIndividuality=function(valid,invalid){
        if (valid) {
            if (!invalid) {
                var fd = new FormData();
                var files = document.querySelector('input[name="files"]').files;
                for (var i=0; i<files.length; i++) {
                    fd.append("files", files[i]);
                }
                fd.append("remark",selt.remark);
                fd.append("name",selt.name);
                if(selt.pModule!=null){
                    fd.append("modId",selt.pModule.modId);
                    fd.append("modName",selt.pModule.modName);
                }
                var hospitalName="";
                if(selt.selectHos!=null&&selt.selectHos.length>0){

                    angular.forEach(selt.selectHos,function(item){
                        hospitalName=hospitalName+item.text+",";
                    })
                    fd.append("hospital",hospitalName);
                    fd.append("fileType","private-file");
                }
                $http({
                    method:'POST',
                    url  : '/ts-release/individuality/IndividualityUpload',
                    data: fd,
                    headers: {'Content-Type':undefined},
                    transformRequest: angular.identity
                }).success(function (result) {
                    if(result.success){
                        alert(result.message);
                        $modalInstance.close();
                    }else{
                        alert(result.message);
                    }
                });
            }
        }else{
            selt.submitted=true;
        }

    }

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}])




