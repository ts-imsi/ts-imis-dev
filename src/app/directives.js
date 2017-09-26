(function() {
    angular.module("attence.directives", [])

        // 生成日历
        .directive("genrili", function () {
            return {
                restrict: 'E',
                scope: false,
                template: function () {
                    var cld = new Calendar({
                        el: '#box',
                        value: '', // 默认为new Date();
                        fn: function(obj) {
                            var dt = $filter("date")(obj.date, "yyyy-MM-dd") ;
                            console.log(dt);
                        }
                    });
                    return cld;
                }
            };
        })

})();