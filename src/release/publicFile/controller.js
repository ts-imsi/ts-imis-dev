app.controller('publicFileCtrl', ['$scope', '$modal', '$http', '$filter','$log', function ($scope, $modal, $http,$filter, $log) {
    var selt = this;

    this.selectByName=function(){
        selt.setPage(1);
    }

    this.setPage = function (pageNo) {
        var param={
            page:pageNo,
            rows:10,
            name:selt.name
        };
        $http.post("/ts-release/publicFile/selectPublicFileList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.publicFileList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.publicFileList=[];
            }

        });
    };


    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var param={
            page:this.pageNo,
            rows:10,
            name:selt.name
        };
        $http.post("/ts-release/publicFile/selectPublicFileList",angular.toJson(param)).success(function (result) {
            if(result.success){
                selt.publicFileList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            }else{
                selt.publicFileList=[];
            }
        });

    };

    this.maxSize = 5;

    this.publicFileUpload=function(size){
        var individualityInstance = $modal.open({
            templateUrl: 'publicFile.html',
            controller: 'publicFileUploadCtrl as ctrl',
            size: size
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

app.controller('publicFileUploadCtrl', ['$scope', '$modalInstance','$http',function($scope,$modalInstance,$http) {
    var selt=this;

    selt.submitted=false;
    this.savePublicFile=function(valid,invalid){
        if (valid) {
            if (!invalid) {
                var fd = new FormData();
                var files = document.querySelector('input[name="files"]').files;
                for (var i=0; i<files.length; i++) {
                    fd.append("files", files[i]);
                }
                fd.append("remark",selt.remark);
                fd.append("name",selt.name);
                fd.append("fileType","public-file");
                $http({
                    method:'POST',
                    url  : '/ts-release/publicFile/publicFileUpload',
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




