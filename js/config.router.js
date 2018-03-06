'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider','$httpProvider',
      function ($stateProvider,   $urlRouterProvider,$httpProvider) {
          $httpProvider.interceptors.push('loadingInterceptor');
          $httpProvider.defaults.headers.common = { 'X-TOKEN' : sessionStorage.getItem("X-TOKEN") }
          
          $urlRouterProvider
              .otherwise('/app/dashboard-v1');

          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'tpl/app.html'
              })
              .state('app.dashboard-v1', {
                  url: '/dashboard-v1',
                  templateUrl: 'tpl/app_dashboard_v1.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.dashboard-v2', {
                  url: '/dashboard-v2',
                  templateUrl: 'tpl/app_dashboard_v2.html',
                  resolve: {
                    deps: ['$ocLazyLoad',
                      function( $ocLazyLoad ){
                        return $ocLazyLoad.load(['js/controllers/chart.js']);
                    }]
                  }
              })
              .state('app.ui', {
                  url: '/ui',
                  template: '<div ui-view class="fade-in-up"></div>'
              })
              .state('app.ui.buttons', {
                  url: '/buttons',
                  templateUrl: 'tpl/ui_buttons.html'
              })
              .state('app.ui.icons', {
                  url: '/icons',
                  templateUrl: 'tpl/ui_icons.html'
              })
              .state('app.ui.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/ui_grid.html'
              })
              .state('app.ui.widgets', {
                  url: '/widgets',
                  templateUrl: 'tpl/ui_widgets.html'
              })          
              .state('app.ui.bootstrap', {
                  url: '/bootstrap',
                  templateUrl: 'tpl/ui_bootstrap.html'
              })
              .state('app.ui.sortable', {
                  url: '/sortable',
                  templateUrl: 'tpl/ui_sortable.html'
              })
              .state('app.ui.portlet', {
                  url: '/portlet',
                  templateUrl: 'tpl/ui_portlet.html'
              })
              .state('app.ui.timeline', {
                  url: '/timeline',
                  templateUrl: 'tpl/ui_timeline.html'
              })
              .state('app.ui.tree', {
                  url: '/tree',
                  templateUrl: 'tpl/ui_tree.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/tree.js');
                              }
                          );
                        }
                      ]
                  }
              })
              .state('app.ui.toaster', {
                  url: '/toaster',
                  templateUrl: 'tpl/ui_toaster.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('toaster').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/toaster.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.ui.jvectormap', {
                  url: '/jvectormap',
                  templateUrl: 'tpl/ui_jvectormap.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('js/controllers/vectormap.js');
                      }]
                  }
              })
              .state('app.ui.googlemap', {
                  url: '/googlemap',
                  templateUrl: 'tpl/ui_googlemap.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( [
                            'js/app/map/load-google-maps.js',
                            'js/app/map/ui-map.js',
                            'js/app/map/map.js'] ).then(
                              function(){
                                return loadGoogleMaps(); 
                              }
                            );
                      }]
                  }
              })
              .state('app.chart', {
                  url: '/chart',
                  templateUrl: 'tpl/ui_chart.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/chart.js');
                      }]
                  }
              })
              // table
              .state('app.table', {
                  url: '/table',
                  template: '<div ui-view></div>'
              })
              .state('app.table.static', {
                  url: '/static',
                  templateUrl: 'tpl/table_static.html'
              })
              .state('app.table.static02', {
                  url: '/static',
                  templateUrl: 'tpl/table_static02.html'
              })
              .state('app.table.static03', {
                  url: '/static',
                  templateUrl: 'tpl/table_static03.html'
              })
              .state('app.table.datatable', {
                  url: '/datatable',
                  templateUrl: 'tpl/table_datatable.html'
              })
              .state('app.table.footable', {
                  url: '/footable',
                  templateUrl: 'tpl/table_footable.html'
              })
              .state('app.table.grid', {
                  url: '/grid',
                  templateUrl: 'tpl/table_grid.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ngGrid').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/grid.js');
                              }
                          );
                      }]
                  }
              })
              // form
              .state('app.form', {
                  url: '/form',
                  template: '<div ui-view class="fade-in"></div>',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad){
                          return uiLoad.load('js/controllers/form.js');
                      }]
                  }
              })
              .state('app.form.elements', {
                  url: '/elements',
                  templateUrl: 'tpl/form_elements.html'
              })
              .state('app.form.validation', {
                  url: '/validation',
                  templateUrl: 'tpl/form_validation.html'
              })
              .state('app.form.wizard', {
                  url: '/wizard',
                  templateUrl: 'tpl/form_wizard.html'
              })
              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'tpl/form_fileupload.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('angularFileUpload').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/file-upload.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.imagecrop', {
                  url: '/imagecrop',
                  templateUrl: 'tpl/form_imagecrop.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad){
                          return $ocLazyLoad.load('ngImgCrop').then(
                              function(){
                                 return $ocLazyLoad.load('js/controllers/imgcrop.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.select', {
                  url: '/select',
                  templateUrl: 'tpl/form_select.html',
                  controller: 'SelectCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('ui.select').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/select.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.slider', {
                  url: '/slider',
                  templateUrl: 'tpl/form_slider.html',
                  controller: 'SliderCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('vr.directives.slider').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/slider.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.form.editor', {
                  url: '/editor',
                  templateUrl: 'tpl/form_editor.html',
                  controller: 'EditorCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('textAngular').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/editor.js');
                              }
                          );
                      }]
                  }
              })
              // pages
              .state('app.page', {
                  url: '/page',
                  template: '<div ui-view class="fade-in-down"></div>'
              })
              .state('app.page.profile', {
                  url: '/profile',
                  templateUrl: 'tpl/page_profile.html'
              })
              .state('app.page.post', {
                  url: '/post',
                  templateUrl: 'tpl/page_post.html'
              })
              .state('app.page.search', {
                  url: '/search',
                  templateUrl: 'tpl/page_search.html'
              })
              .state('app.page.invoice', {
                  url: '/invoice',
                  templateUrl: 'tpl/page_invoice.html'
              })
              .state('app.page.price', {
                  url: '/price',
                  templateUrl: 'tpl/page_price.html'
              })
              .state('app.docs', {
                  url: '/docs',
                  templateUrl: 'tpl/docs.html'
              })
              // others
              .state('lockme', {
                  url: '/lockme',
                  templateUrl: 'tpl/page_lockme.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth" auto-height></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.signup', {
                  url: '/signup',
                  templateUrl: 'tpl/page_signup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.forgotpwd', {
                  url: '/forgotpwd',
                  templateUrl: 'tpl/page_forgotpwd.html'
              })
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: 'tpl/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['$ocLazyLoad', 'uiLoad',
                        function( $ocLazyLoad, uiLoad ){
                          return uiLoad.load(
                            ['vendor/jquery/fullcalendar/fullcalendar.css',
                              'vendor/jquery/fullcalendar/theme.css',
                              'vendor/jquery/jquery-ui-1.10.3.custom.min.js',
                              'vendor/libs/moment.min.js',
                              'vendor/jquery/fullcalendar/fullcalendar.min.js',
                              'js/app/calendar/calendar.js']
                          ).then(
                            function(){
                              return $ocLazyLoad.load('ui.calendar');
                            }
                          )
                      }]
                  }
              })

              // mail
              .state('app.mail', {
                  abstract: true,
                  url: '/mail',
                  templateUrl: 'tpl/mail.html',
                  // use resolve to load other dependences
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/mail/mail.js',
                                               'js/app/mail/mail-service.js',
                                               'vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('app.mail.list', {
                  url: '/inbox/{fold}',
                  templateUrl: 'tpl/mail.list.html'
              })
              .state('app.mail.detail', {
                  url: '/{mailId:[0-9]{1,4}}',
                  templateUrl: 'tpl/mail.detail.html'
              })
              .state('app.mail.compose', {
                  url: '/compose',
                  templateUrl: 'tpl/mail.new.html'
              })

              .state('layout', {
                  abstract: true,
                  url: '/layout',
                  templateUrl: 'tpl/layout.html'
              })
              .state('layout.fullwidth', {
                  url: '/fullwidth',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_fullwidth.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/vectormap.js'] );
                      }]
                  }
              })
              .state('layout.mobile', {
                  url: '/mobile',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_mobile.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_mobile.html'
                      }
                  }
              })
              .state('layout.app', {
                  url: '/app',
                  views: {
                      '': {
                          templateUrl: 'tpl/layout_app.html'
                      },
                      'footer': {
                          templateUrl: 'tpl/layout_footer_fullwidth.html'
                      }
                  },
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/tab.js'] );
                      }]
                  }
              })
              .state('apps', {
                  abstract: true,
                  url: '/apps',
                  templateUrl: 'tpl/layout.html'
              })
              .state('apps.note', {
                  url: '/note',
                  templateUrl: 'tpl/apps_note.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/note/note.js',
                                               'vendor/libs/moment.min.js'] );
                      }]
                  }
              })
              .state('apps.contact', {
                  url: '/contact',
                  templateUrl: 'tpl/apps_contact.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/app/contact/contact.js'] );
                      }]
                  }
              })
              .state('app.weather', {
                  url: '/weather',
                  templateUrl: 'tpl/apps_weather.html',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load(
                              {
                                  name: 'angular-skycons',
                                  files: ['js/app/weather/skycons.js',
                                          'vendor/libs/moment.min.js', 
                                          'js/app/weather/angular-skycons.js',
                                          'js/app/weather/ctrl.js' ] 
                              }
                          );
                      }]
                  }
              })
              .state('music', {
                  url: '/music',
                  templateUrl: 'tpl/music.html',
                  controller: 'MusicCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load([
                            'com.2fdevs.videogular', 
                            'com.2fdevs.videogular.plugins.controls', 
                            'com.2fdevs.videogular.plugins.overlayplay',
                            'com.2fdevs.videogular.plugins.poster',
                            'com.2fdevs.videogular.plugins.buffering',
                            'js/app/music/ctrl.js', 
                            'js/app/music/theme.css'
                          ]);
                      }]
                  }
              })
                .state('music.home', {
                    url: '/home',
                    templateUrl: 'tpl/music.home.html'
                })
                .state('music.genres', {
                    url: '/genres',
                    templateUrl: 'tpl/music.genres.html'
                })
                .state('music.detail', {
                    url: '/detail',
                    templateUrl: 'tpl/music.detail.html'
                })
                .state('music.mtv', {
                    url: '/mtv',
                    templateUrl: 'tpl/music.mtv.html'
                })
                .state('music.mtvdetail', {
                    url: '/mtvdetail',
                    templateUrl: 'tpl/music.mtv.detail.html'
                })
                .state('music.playlist', {
                    url: '/playlist/{fold}',
                    templateUrl: 'tpl/music.playlist.html'
                })
              .state('app.about', {
                  url: '/about',
                  templateUrl: 'src/app/about/index.tpl.html',
                  controller: 'AboutCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/app/about/controller.js'
                          ]);
                      }]
                  }
              })
              .state('app.attenceList', {
              url: '/attenceList',
              templateUrl: 'src/pc/attenceList/index.tpl.html',
              controller: 'AttenceList as ctrl',
              resolve: {
                  load:['$ocLazyLoad',function($ocLazyLoad){
                      return $ocLazyLoad.load([
                          'src/pc/attenceList/controller.js'
                      ]);
                  }]
              }
          })
           .state('app.note', {
                  url: '/note',
                  templateUrl: 'src/pc/note/index.tpl.html',
                  controller: 'Note as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                          function(){
                              return $ocLazyLoad.load('src/pc/note/controller.js');
                          }
                          );
                      }]
                  }
              })
              .state('app.contact', {
                  url: '/contact',
                  templateUrl: 'src/pc/contact/index.tpl.html',
                  controller: 'Contact as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/pc/contact/controller.js'
                          ]);
                      }]
                  }
              })
              .state('app.organization', {
                  url: '/organization',
                  templateUrl: 'src/pc/organization/organization.tpl.html',
                  controller: 'Organization as ctrl',
                  resolve: {
                      deptree: ['$ocLazyLoad',
                          function( $ocLazyLoad ){
                              return $ocLazyLoad.load('angularBootstrapNavTree').then(
                                  function(){
                                      return $ocLazyLoad.load('src/pc/organization/controller.js');
                                  }
                              );
                          }
                      ]
                  }
              })
              .state('app.organization.dept', {
                  url: '/dept/:level/:type/:id/:label',
                  templateUrl: 'src/pc/organization/dept.html',
                  controller:'DeptControllser as deptctrl'
              })
              .state('app.organization.person', {
                  url: '/person/:level/:type/:id/:label',
                  templateUrl: 'src/pc/organization/deptperson.html',
                  controller:'personController as personctrl'
              })
              .state('app.personnelFile', {
                  url: '/personnelFile',
                  templateUrl: 'src/pc/personnelFile/index.tpl.html',
                  controller: 'PersonnelFile as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'angularBootstrapNavTree',
                              'angularFileUpload',
                              'ngImgCrop'
                          ]).then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/personnelFile/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.talentPool', {
                  url: '/talentPool',
                  templateUrl: 'src/pc/talentPool/index.tpl.html',
                  controller: 'talentPool as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'angularBootstrapNavTree',
                              'angularFileUpload',
                              'ngImgCrop'
                          ]).then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/talentPool/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.contract', {
                  url: '/contract',
                  templateUrl: 'src/pc/contract/index.tpl.html',
                  controller: 'Contract as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/contract/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.quit', {
                  url: '/quit',
                  templateUrl: 'src/pc/quit/index.tpl.html',
                  controller: 'QuitPersonnelFile as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/quit/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.recordLevel', {
                  url: '/recordlevel',
                  templateUrl: 'src/pc/recordLevel/index.tpl.html',
                  controller: 'recordLevelCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/pc/recordLevel/controller.js'
                          ]);
                      }]
                  }
              })
              .state('app.promotionApp', {
                  url: '/promotionApp',
                  templateUrl: 'src/pc/promotionApp/index.tpl.html',
                  controller: 'promotionAppCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/pc/promotionApp/controller.js'
                          ]);
                      }]
                  }
              })
              .state('app.jfLevel', {
                  url: '/jfLevel',
                  templateUrl: 'src/pc/jfLevel/index.tpl.html',
                  controller: 'JfLevelCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/pc/jfLevel/controller.js'
                          ]);
                      }]
                  }
              })
              .state('app.recordApproval', {
                  url: '/recordApproval',
                  templateUrl: 'src/pc/recordApproval/index.tpl.html',
                  controller: 'recordApprovalCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load([
                              'src/pc/recordApproval/controller.js'
                          ]);
                      }]
                  }
              })

              .state('apps.template', {
                  url: '/template',
                  templateUrl: 'src/pc/template/index.tpl.html',
                  controller: 'TemplateCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/template/controller.js',
                                  'vendor/libs/moment.min.js'] );
                          }]
                  }
              })

              .state('app.ht_product', {
                  url: '/ht_product',
                  templateUrl: 'src/pc/ht_product/index.tpl.html',
                  controller: 'htProductCtrl as ctrl',
                  resolve: {
                      load: ['$ocLazyLoad', function ($ocLazyLoad) {
                          return $ocLazyLoad.load([
                              'angularBootstrapNavTree',
                              'angularFileUpload',
                              'ngImgCrop'
                          ]).then(
                              function () {
                                  return $ocLazyLoad.load('src/pc/ht_product/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.templateList', {
                  url: '/templateList',
                  templateUrl: 'src/pc/templateList/index.tpl.html',
                  controller: 'TemplateListCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/templateList/controller.js'] );
                          }]
                  }
              })
              .state('app.handOverList', {
                  url: '/handOverList',
                  templateUrl: 'src/pc/handOver/index.tpl.html',
                  controller: 'handOverCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/handOver/controller.js'] );
                          }]
                  }
              })
              .state('access.handover', {
                  url: '/handover',
                  templateUrl: 'src/pc/handOver/handoverPre.html',
                  controller: 'HandoverPreCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/handOver/handoverPre.js'] );
                          }]
                  }
              })
              .state('access.proModule', {
                  url: '/proModule',
                  templateUrl: 'src/pc/handOver/proModule.html',
                  controller: 'ProModuleCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/handOver/proModule.js'] );
                          }]
                  }
              })
              .state('app.htChange', {
                  url: '/htChange',
                  templateUrl: 'src/pc/ht_change/index.tpl.html',
                  controller: 'htChangeCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/ht_change/controller.js'] );
                          }]
                  }
              })
              .state('app.message', {
                  url: '/message',
                  templateUrl: 'src/pc/message/index.tpl.html',
                  controller: 'messageCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/message/controller.js'] );
                          }]
                  }
              })
              .state('app.message.list', {
                  url: '/messageList/{type}/{status}',
                  templateUrl: 'src/pc/message/message.list.html',
                  controller:'messageListCtrl as msgListctrl'
              })
              .state('app.message.detail', {
                  url: '/messageDetail/{pkid}',
                  templateUrl: 'src/pc/message/message.detail.html',
                  controller:'messageDetailCtrl as detailCtrl'
              })
              .state('app.projectArrange', {
                  url: '/arrange',
                  templateUrl: 'src/pc/project_arrange/index.tpl.html',
                  controller: 'projectArrangeCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/project_arrange/controller.js'] );
                          }]
                  }
              })
              .state('app.projectActualizeArrange', {
                  url: '/actualize',
                  templateUrl: 'src/pc/project_actualize_arrange/index.tpl.html',
                  controller: 'projectActualizeArrangeCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/project_actualize_arrange/controller.js'] );
                          }]
                  }
              })
              .state('app.planTemplate', {
                  url: '/planTemplate',
                  templateUrl: 'src/pc/plan_template/index.tpl.html',
                  controller: 'planTempCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/plan_template/controller.js'] );
                          }]
                  }
              })
              .state('app.createPlanTemp', {
                  url: '/createPlanTemp',
                  templateUrl: 'src/pc/plan_template/createPlanTemp.html',
                  controller: 'createPlanTempCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/plan_template/createPlanTemp.js'] );
                          }]
                  }
              })

              .state('app.planDetail', {
                  url: '/planDetail',
                  templateUrl: 'src/pc/planDetail/index.tpl.html',
                  controller: 'planDetailCtrl as ctrl',
                  resolve: {
                      load: ['$ocLazyLoad', function ($ocLazyLoad) {
                          return $ocLazyLoad.load([
                              'angularBootstrapNavTree',
                              'angularFileUpload',
                              'ngImgCrop'
                          ]).then(
                              function () {
                                  return $ocLazyLoad.load('src/pc/planDetail/controller.js');
                              }
                          );
                      }]
                  }
              })





              .state('app.excePlan', {
                  url: '/excePlan',
                  templateUrl: 'src/pc/exceptionPlan/index.tpl.html',
                  controller: 'ExceptionPlanCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/exceptionPlan/controller.js'] );
                          }]
                  }
              })

              .state('app.outputValue', {
                  url: '/outputValue',
                  templateUrl: 'src/pc/outputValue/index.tpl.html',
                  controller: 'OutputValueCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/outputValue/controller.js'] );
                          }]
                  }
              })
              .state('app.productModel', {
                  url: '/productModel',
                  templateUrl: 'src/pc/productModel/index.tpl.html',
                  controller: 'productModelCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/productModel/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.todoMessage', {
                  url: '/todoMessage',
                  templateUrl: 'src/pc/todoMessage/index.tpl.html',
                  controller: 'todoMessageCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/todoMessage/controller.js'] );
                          }]
                  }
              })
              .state('app.todoMegContent', {
                  url: '/todoMegContent',
                  templateUrl: 'src/pc/todoMessage/todoMessage.html',
                  controller: 'todoMegContentCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/todoMessage/todoMessage.js'] );
                          }]
                  }
              })
              .state('app.projectManager', {
                  url: '/projectManager',
                  templateUrl: 'src/pc/projectManager/index.tpl.html',
                  controller: 'projectManagerCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/pc/projectManager/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.weixinCustormer', {
                  url: '/weixinCustormer',
                  templateUrl: 'src/pc/weixinCustormer/index.tpl.html',
                  controller: 'weixinCustormerCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/weixinCustormer/controller.js'] );
                          }]
                  }
              })
              .state('app.countReport', {
                  url: '/countReport',
                  templateUrl: 'src/pc/countReport/index.tpl.html',
                  controller: 'CountReport as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/countReport/controller.js'] );
                          }]
                  }
              })
              .state('app.quarters', {
                  url: '/quarters',
                  templateUrl: 'src/pc/quarters/index.tpl.html',
                  controller: 'quartersCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/pc/quarters/controller.js'] );
                          }]
                  }
              })
              .state('app.reProduct', {
                  url: '/reProduct',
                  templateUrl: 'src/release/product/index.tpl.html',
                  controller: 'ReProductCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/release/product/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.reIndividuality', {
                  url: '/reIndividuality',
                  templateUrl: 'src/release/individuality/index.tpl.html',
                  controller: 'ReIndividualityCtrl as ctrl',
                  resolve: {
                      load:['$ocLazyLoad',function($ocLazyLoad){
                          return $ocLazyLoad.load('angularBootstrapNavTree').then(
                              function(){
                                  return $ocLazyLoad.load('src/release/individuality/controller.js');
                              }
                          );
                      }]
                  }
              })
              .state('app.publicFile', {
                  url: '/publicFile',
                  templateUrl: 'src/release/publicFile/index.tpl.html',
                  controller: 'publicFileCtrl as ctrl',
                  resolve: {
                      deps: ['uiLoad',
                          function( uiLoad ){
                              return uiLoad.load( ['src/release/publicFile/controller.js'] );
                          }]
                  }
              })
      }
    ]
  );



