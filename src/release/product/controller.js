app.controller('ReProductCtrl', ['$scope', '$modal', '$http', '$filter', '$log', function ($scope, $modal, $http, $filter, $log) {
    var selt = this;
    selt.i = 1;
    selt.my_tree = {};
    selt.success = false;
    $http.post("/ts-release/product/selectProList").success(function (data) {
        selt.success = data.success;
        selt.my_data = data.object;
    });

    this.setproTree = function () {
        $http.post("/ts-release/product/selectProList").success(function (data) {
            selt.success = data.success;
            selt.my_data = data.object;
        });
    };
    this.my_tree_handler = function (branch) {
        selt.productinfo = branch.data;
        selt.setPage(1);
    };

    this.setPage = function (pageNo) {
        var proid = null;
        if (selt.productinfo != undefined) {
            proid = selt.productinfo.pkid;
            if (proid == 1) {
                proid = null;
            }
        }

        var parm = {
            page: pageNo,
            rows: 1,
            modName: selt.modName,
            proid: proid
        };
        console.log(parm);
        $http.post("/ts-release/proModule/proModuleList", angular.toJson(parm)).success(function (result) {
            if (result.success) {
                selt.modList = result.list;
                selt.totalCount = result.totalCount;
                selt.pageSize = result.pageSize;
                selt.pageNo = result.pageNo;
            } else {
                selt.modList = [];
            }

        });
    };

    this.selectProductModel = function () {
        if (selt.selectName == '') {
            selt.selectName = null;
        }
        this.setPage(1);
    }

    this.pageChanged = function () {
        selt.setPage(selt.pageNo);
        /*$log.log('Page changed to: ' + this.pageNo);
         var proid = null;
         if(selt.productinfo != undefined){
         proid = selt.productinfo.pkid;
         }
         var parm = {
         page: selt.pageNo,
         rows: 6,
         modName: selt.modName,
         proid: proid
         };
         $http.post("/ts-release/product/selectModList", angular.toJson(parm)).success(function (result) {
         if (result.success) {
         selt.modList = result.list;
         selt.totalCount = result.totalCount;
         selt.pageSize = result.pageSize;
         selt.pageNo = result.pageNo;
         } else {
         selt.modList = [];
         }
         });*/

    };

    this.delete = function (pkid) {
        var r = confirm("是否删除模块设置");
        if (r == true) {
            if (pkid == null) {
                window.alert("请选择表格数据");
            } else {
                var parm = {
                    pkid: selt.pkid,

                };
                $http.post("/ts-release/product/deletePro", angular.toJson(parm)).success(function (result) {
                    if (result.success) {
                        window.alert(result.message);
                    } else {
                        window.alert(result.message);
                    }

                    selt.setPage(1);
                });
            }
        }
    };

    this.search = function () {
        selt.setPage(1);
    };

    // 操作产品
    this.addPro = function () {
        var pro = {
            showAdd: true
        }
        var outputValueInstance = $modal.open({
            templateUrl: 'product.html',
            controller: 'productCtrl as ctrl',
            resolve: {
                data: function () {
                    return pro;
                }
            }
        });
        outputValueInstance.result.then(function () {
            selt.setproTree();
        });
    };

    this.updatePro = function () {
        var product = selt.productinfo;
        var pro = {
            showAdd: false,
            product: product
        }
        if (product != undefined) {
            var outputValueInstance = $modal.open({
                templateUrl: 'product.html',
                controller: 'productCtrl as ctrl',
                resolve: {
                    data: function () {
                        return pro;
                    }
                }
            });
            outputValueInstance.result.then(function () {
                selt.setproTree();
            });
        } else {
            alert("编辑产品前，请先选中产品");
        }
    };

    this.deletePro = function () {
        var product = selt.productinfo;
        if (product != undefined) {
            var flag = confirm("是否删除产品");
            if (flag == true) {
                $http.post("/ts-release/product/deletePro", angular.toJson(product)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.setproTree();
                    } else {
                        alert(result.message);
                    }
                });
            }
        } else {
            alert("删除产品前，请先选中产品");
        }
        ;
    };
    // 操作模块
    this.addModule = function () {
        var product = selt.productinfo;
        if (product != undefined) {
            var info = {
                depId: product.depId,
                depName: product.depName,
                parent: product.pkid
            }
            var outputValueInstance = $modal.open({
                templateUrl: 'module.html',
                controller: 'moduleCtrl as ctrl',
                resolve: {
                    data: function () {
                        return info;
                    }
                }
            });
            outputValueInstance.result.then(function () {
                selt.setPage(1);
            });
        } else {
            alert("添加模块前，请先选中产品");
        }
    };

    this.updateModule = function (Module) {
        var info = {
            parent: Module.proId,
            module: Module
        }
        if (Module != undefined) {
            var outputValueInstance = $modal.open({
                templateUrl: 'module.html',
                controller: 'moduleCtrl as ctrl',
                resolve: {
                    data: function () {
                        return info;
                    }
                }
            });
            outputValueInstance.result.then(function () {
                selt.setPage(1);
            });
        } else {
            alert("添加模块前，请先选中产品");
        }
    }

    this.deleteModule = function (Module) {
        if (Module != undefined) {
            var flag = confirm("是否删除模块");
            if (flag == true) {
                $http.post("/ts-release/proModule/delteModule", angular.toJson(Module)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        selt.setPage(1);
                    } else {
                        alert(result.message);
                    }
                });
            }
        } else {
            alert("删除模块，但未选中");
        }
        ;
    };
    this.maxSize = 5;
    this.setPage(1);


}]);


app.controller('productCtrl', ['$scope', '$modalInstance', '$http', 'data', function ($scope, $modalInstance, $http, data) {
    var selt = this;
    selt.showAdd = data.showAdd;
    selt.product = data.product;
    console.log(data);

    // 查询产品信息并且根据产品id选中产品

    // 新增 更新产品
    this.updateProduct = function () {
        var product = selt.product;
        var param = {
            pkid: product.pkid,
            name: selt.product.name,
            parent: 1,
            type: "pro",
            level: 1,
            depId: "dep_16",
            depName: selt.product.depName,
            created: selt.product.created,
            updated: selt.product.updated,
            operator: "操作人",
            isVaild: 1
        }
        $http.post("/ts-release/product/updateProduct", angular.toJson(param)).success(function (result) {
            if (result.success) {
                alert(result.message);
                $modalInstance.close();
            } else {
                alert(result.message);
            }
        });

    };
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('moduleCtrl', ['$scope', '$modalInstance', '$http', 'data', function ($scope, $modalInstance, $http, data) {
    var selt = this;
    selt.module = data.module;
    var info = data;
    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    // 保存模块信息
    this.saveModule = function (valid, invalid) {
        if (valid) {
            if (!invalid) {
                var param = {
                    modId: selt.module.modId,
                    modName: selt.module.modName,
                    code: selt.module.code,
                    versionFix: selt.module.versionFix,
                    releasePx: selt.module.releasePx,
                    showPx: selt.module.showPx,
                    type: "mod",
                    proId: info.parent,
                    created: selt.module.created,
                    operator: "operator"
                };
                $http.post("/ts-release/proModule/saveProModule", angular.toJson(param)).success(function (result) {
                    if (result.success) {
                        alert(result.message);
                        $modalInstance.close();
                    } else {
                        alert(result.message);
                    }
                });
            }
        } else {
            selt.submitted = true;
        }

    }
}]);


