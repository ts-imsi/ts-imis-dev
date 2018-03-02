app.controller('ModVersionCtrl', ['$scope', '$modal', '$http', '$filter', '$log', function ($scope, $modal, $http, $filter, $log) {
    var selt = this;

    $http.post("/ts-release/modVersion/modVersionList").success(function (data) {
        selt.success = data.success;
        selt.my_data = data.object;
    });

    this.setPage = function (pageNo, modId) {
        var parm = {
            page: pageNo,
            rows: 6,
            selectName: selt.selectName,
            modId: selt.modid
        };
        console.log(parm);
        $http.post("/ts-release/modVersion/modVersionList", angular.toJson(parm)).success(function (result) {
            if (result.success) {
                selt.modVersionList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            } else {
                selt.modList = [];
            }

        });

    };

    this.pageChanged = function () {
        $log.log('Page changed to: ' + this.pageNo);
        var parm = {
            page: this.pageNo,
            rows: 6,
            name: selt.selectname,
            modId: selt.modid
        };
        $http.post("/ts-release/modVersion/modVersionList", angular.toJson(parm)).success(function (result) {
            if (result.success) {
                selt.modVersionList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            } else {
                selt.modList = [];
            }
        });

    };


    var parm2 = {
        type: "pro"
    };
    $http.post("/ts-release/product/selectProMod", angular.toJson(parm2)).success(function (result) {
        if (result.success) {
            selt.productList = result.proModList;
            selt.totalCount = result.totalCount;
            selt.pageSize = result.pageSize;
            selt.pageNo = result.pageNo;
        } else {
            selt.productList = [];
        }

    });

    this.proModChanged = function () {
        var parm2 = {
            type: "mod",
            parent: selt.proid
        };
        console.log(parm2);
        $http.post("/ts-release/product/selectProMod", angular.toJson(parm2)).success(function (result) {
            if (result.success) {
                selt.modList = result.proModList;
            } else {
                selt.productList = [];
            }

        });
    }

    this.selectproMod = function () {
        var modId = selt.modid;
        this.setPage(1, modId);
    };

    this.setPage(1);
    // this.proModChanged('pro');
}]);




