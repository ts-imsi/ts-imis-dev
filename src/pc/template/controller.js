app.controller('TemplateCtrl', ['$http','$scope','dragulaService', function($http,$scope,dragulaService) {
    var selt = this;

    $http.get('js/app/note/notes.json').then(function (resp) {
        selt.notes = resp.data.notes;
        // set default note
        selt.note = selt.notes[0];
        selt.notes[0].selected = true;
    });

    this.colors = ['primary', 'info', 'success', 'warning', 'danger', 'dark'];

    this.createNote = function(){
        var note = {
            content: 'New note',
            color: selt.colors[Math.floor((Math.random()*3))],
            date: Date.now()
        };
        selt.zxh.push(note);
        selt.selectNote(note);
    }

    this.deleteNote = function(note){
        selt.notes.splice(selt.notes.indexOf(note), 1);
        if(note.selected){
            selt.note = selt.notes[0];
            selt.notes.length && (selt.notes[0].selected = true);
        }
    }

    this.deletezxh = function(note){
        selt.zxh.splice(selt.zxh.indexOf(note), 1);
        if(note.selected){
            selt.note = selt.zxh[0];
            selt.zxh.length && (selt.zxh[0].selected = true);
        }
    }

    this.deletezxh2 = function(note){
        selt.zxh2.splice(selt.zxh2.indexOf(note), 1);
        if(note.selected){
            selt.note = selt.zxh2[0];
            selt.zxh2.length && (selt.zxh2[0].selected = true);
        }
    }

    this.selectNote = function(note){
        angular.forEach(selt.notes, function(note) {
            note.selected = false;
        });
        selt.note = note;
        selt.note.selected = true;
    }




    this.zxh = [
        {
            "content": "医院名称",
            "color": "warning",
            "length":40,
            "type":1
        },
        {
            "content": "地址",
            "color": "warning",
            "length":70,
            "type":1
        },
        {
            "content": "联系人",
            "color": "warning",
            "length":50,
            "type":1
        },
        {
            "content": "联系电话",
            "color": "warning",
            "length":50,
            "type":1
        },
        {
            "content": "是否签订合同",
            "color": "success",
            "length":40,
            "type":2
        },
        {
            "content": "合同号",
            "color": "success",
            "length":40,
            "type":1
        },
        {
            "content": "委托方(甲方)",
            "color": "success",
            "length":50,
            "type":1
        },
        {
            "content": "委托方(乙方)",
            "color": "success",
            "length":50,
            "type":1
        },
        {
            "content": "付款方式",
            "color": "success",
            "length":40,
            "type":1
        },
        {
            "content": "验收标准",
            "color": "success",
            "length":70,
            "type":3
        }
    ];


    this.zxh2 = [
        {
            "content": "初始字段1",
            "color": "warning",
            "length":40,
            "type":1
        },
        {
            "content": "初始字段2",
            "color": "primary",
            "length":40,
            "type":1
        },
        {
            "content": "初始字段3",
            "color": "success",
            "length":50,
            "type":1
        }
    ];

    dragulaService.options($scope, 'fifth-bag', {
        copy: true
    });



}]);