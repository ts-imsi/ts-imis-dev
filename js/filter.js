app.filter('LeaveType',function(){
    return function(type){
        var name = "";
        switch(type)
        {
            case 1:
                name = "事假";
                break;
            case 3:
                name = "病假";
                break;
            case 4:
                name = "年假";
                break;
            case 5:
                name = "产假";
                break;
            case 6:
                name = "陪产假";
                break;
            case 7:
                name = "婚假";
                break;
            case 8:
                name = "丧假";
                break;
            case 9:
                name = "2小时假";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('sexType',function(){
    return function(sex){
        var name = "";
        switch(sex)
        {
            case 1:
                name = "男";
                break;
            case 2:
                name = "女";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('statusType',function(){
    return function(status){
        var name = "";
        switch(status)
        {
            case 1:
                name = "已签";
                break;
            case 0:
                name = "未签";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('contractType',function(){
    return function(type){
        var name = "";
        switch(type)
        {
            case 1:
                name = "劳动合同";
                break;
            case 2:
                name = "保密协议";
                break;
            case 3:
                name = "竞业协议";
                break;
            case 4:
                name = "培训协议";
                break;
            case 5:
                name = "劳动合同,保密协议";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('talentmsType',function(){
    return function(result){
        var name = "";
        switch(result)
        {
            case "1":
                name = "暂未面试";
                break;
            case "2":
                name = "已面试-部门经理暂定";
                break;
            case "3":
                name = "已面试-人事部暂定";
                break;
            case "4":
                name = "已通过-人事部待通知";
                break;
            case "5":
                name = "已通过-人事部已通知";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('signinType',function(){
    return function(type){
        //signIn:正常签到,signOut正常签退:,sing:外出打卡,inEx:迟到.outEx:早退
        var name = "";
        switch(type)
        {
            case "signIn":
                name = "公司签到";
                break;
            case "signOut":
                name = "公司签退";
                break;
            case "sign":
                name = "外出考勤";
                break;
            case "inEx":
                name = "公司迟到";
                break;
            case "outEx":
                name = "公司早退";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('workDateType',function(){
    return function(workDate){
        var year;
        if(workDate==null||workDate==undefined||workDate=="") {
            year=0;
        }else{
            var date2 = new Date();    //结束时间
            var date3 = date2.getTime() - new Date(workDate).getTime();
            var days = Math.floor(date3 / (24 * 3600 * 1000));
            year = Math.floor(days / 365);
        }
        return year;
    }
});

app.filter('incumbency',['$filter',function($filter){
    return function(entryDate){
        var incumbencyDay;
        if(entryDate==null||entryDate==undefined||entryDate=="") {
            incumbencyDay=0;
        }else{
            /*var date2 = new Date();    //结束时间
            var date3 = date2.getTime() - new Date(entryDate).getTime();
            var days = Math.floor(date3 / (24 * 3600 * 1000));
            var year = Math.floor(days / 365);
            var months=days%365;
            var month = Math.floor(months/30);
            if(year==0){
                if(month==0){
                    incumbencyDay=months%30+"天";
                }else{
                    incumbencyDay=month+"月"+months%30+"天";
                }
            }else{
                if(month==0){
                    incumbencyDay=year+"年"+ months%30+"天";
                }else{
                    incumbencyDay=year+"年"+ month+"月"+ months%30+"天";
                }
            }*/
            var year,month,day;
            var entryDates= new Array(); //定义一数组
            var dateArray= new Array(); //定义一数组
            var entryDate = $filter("date")(entryDate, "yyyy-MM-dd");
            var date2 = $filter("date")(new Date(), "yyyy-MM-dd");
             entryDates=entryDate.split("-");
            dateArray=date2.split("-");

            if(parseInt(dateArray[2])<parseInt(entryDates[2])){
                var d ;
                if(parseInt(dateArray[1])-1==0){
                    d=new Date(parseInt(dateArray[0])-1,12, 0);
                    year=parseInt(dateArray[0])-1-parseInt(entryDates[0]);
                    month=12-parseInt(entryDates[1]);
                    day=parseInt(dateArray[2])+d.getDate()-parseInt(entryDates[2]);
                }else{
                    d = new Date(dateArray[0], parseInt(dateArray[1]), 0);
                    if(parseInt(dateArray[1])<=parseInt(entryDates[1])){
                        year=parseInt(dateArray[0])-1-parseInt(entryDates[0]);
                        month=parseInt(dateArray[1])+11-parseInt(entryDates[1]);
                        day=parseInt(dateArray[2])+d.getDate()-parseInt(entryDates[2]);
                    }else{
                        year=parseInt(dateArray[0])-parseInt(entryDates[0]);
                        month=parseInt(dateArray[1])-1-parseInt(entryDates[1]);
                        day=parseInt(dateArray[2])+d.getDate()-parseInt(entryDates[2]);
                    }
                }
            }else{
                if(parseInt(dateArray[1])<parseInt(entryDates[1])){
                    year=parseInt(dateArray[0])-1-parseInt(entryDates[0]);
                    month=parseInt(dateArray[1])+12-parseInt(entryDates[1]);
                    day=parseInt(dateArray[2])-parseInt(entryDates[2]);
                }else{
                    year=parseInt(dateArray[0])-parseInt(entryDates[0]);
                    month=parseInt(dateArray[1])-parseInt(entryDates[1]);
                    day=parseInt(dateArray[2])-parseInt(entryDates[2]);
                }
            }
            if(day==31){
                day=0;
                month=month+1;
            }
            if(year==0){
                if(month==0){
                    incumbencyDay=day+"天";
                }else{
                    incumbencyDay=month+"月"+day+"天";
                }
            }else{
                if(month==0){
                    incumbencyDay=year+"年"+ day+"天";
                }else{
                    incumbencyDay=year+"年"+ month+"月"+ day+"天";
                }
            }
        }
        return incumbencyDay;
    }
}]);

app.filter('dateTOsun',['$filter',function($filter){
    return function(week){
        var parent=/^[A-Za-z]+$/;
        var weekName;
        if(parent.test(week)){
            if(week=="Monday"){
                weekName="周一";
            }else if(week=="Tuesday"){
                weekName="周二";
            }else if(week=="Wednesday"){
                weekName="周三";
            }else if(week=="Thursday"){
                weekName="周四";
            }else if(week=="Friday"){
                weekName="周五";
            }else if(week=="Saturday"){
                weekName="周六";
            }else if(week=="Sunday"){
                weekName="周日";
            }
        return weekName;
        }else{
          return week;
        }
    }
}]);

app.filter('resordStatus',function(){
    return function(result){
        var name = "";
        switch(result)
        {
            case 0:
                name = "未审批";
                break;
            case 1:
                name = "已审批";
                break;
            default:
                name = "";
        };
        return name;
    }
});

app.filter('TemplateColor',function(){
    //colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];
    return function(result){
        var color = "";
        switch(result)
        {
            case '客户信息':
                color = "danger";
                break;
            case '合同信息':
                color = "info";
                break;
            case '实施要求':
                color = "success";
                break;
            case '合同分解信息':
                color = "warning";
                break;
            case '待定':
                color = "dark";
                break;
            default:
                color = "primary";
        };
        return color;
    }
});

app.filter('handOverType',function(){
    return function(result){
        var resultType = "";
        switch(result)
        {
            case 'NEW':
                resultType = "交接单";
                break;
            case 'BG':
                resultType = "变更单";
                break;
            case 'ZB':
                resultType = "增补单";
                break;
            default:
                resultType = result;
        };
        return resultType;
    }
});


app.filter('flowStatus',function(){
    return function(status){
        var resultType = "";
        switch(status)
        {
            case 0:
                resultType = "审批中";
                break;
            case 1:
                resultType = "已完成";
                break;
            default:
                resultType = "";
        };
        return resultType;
    }
});

app.filter('changType',function(){
    return function(type){
        var resultType = "";
        switch(type)
        {
            case 'BG':
                resultType = "变更";
                break;
            case 'ZB':
                resultType = "增补";
                break;
            default:
                resultType = type;
        };
        return resultType;
    }
});

app.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});

app.directive('autoHeight',function ($window) {
    return {
        restrict : 'A',
        scope : {},
        link : function($scope, element, attrs) {
            var winowHeight = $window.innerHeight; //获取窗口高度
            var headerHeight = 80;
            var footerHeight = 20;
            element.css('min-height',
                (winowHeight - headerHeight - footerHeight) + 'px');
        }
    };
});

app.filter('templateType',function(){
    return function(type){
        var resultType = "";
        switch(type)
        {
            case 'actualize':
                resultType = "实施计划";
                break;
            default:
                resultType = type;
        };
        return resultType;
    }
});