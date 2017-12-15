angular.module('app').directive('loading', function() {
    return {
        replace: true,
        restrict: 'AE',
        template:'<div class="back-layer"><div class="mask"></div><div class="loading">'
        +'<img src="/img/loading.gif">'
        +'</div></div>',
        link: function($scope, $element, attrs) {
            var top = $(window).height()/2 - 25;
            var left = $(window).width()/2 - 25;
/*            $('.mask').css({
                top: 0,
                left: 100,
                position: 'fixed',
                width: '100%',
                height: '100%',
                opacity: '0.5',
                background: 'black'
            });*/
            $('.loading').css({
                left: left,
                top:top,
                background:'white'
            });
            //$(tpl).appendTo('body');
        }
    };
});
