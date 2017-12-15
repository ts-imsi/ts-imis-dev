angular.module('app').directive('loading', function() {
    return {
        replace: true,
        restrict: 'AE',
        template:'<div class="back-layer"><div class="loading">'
        +'<img src="/img/loading.gif">'
        +'</div></div>',
        link: function($scope, $element, attrs) {
            var top = $(window).height()/2 - 25;
            var left = $(window).width()/2 - 25;
            $('.loading').css({
                left: left,
                top:top,
                background:'white'
            });
            //$(tpl).appendTo('body');
        }
    };
});
