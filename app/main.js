angular
  .module(PKG.name, [

    angular.module(PKG.name+'.features', [
      PKG.name+'.feature.home',
      PKG.name+'.feature.foo',
      PKG.name+'.feature.prototype'
    ]).name,

    angular.module(PKG.name+'.commons', [

      angular.module(PKG.name+'.services', [
        'ngTouch',
        'ngSanitize',
        'ngAnimate',
        'ngResource',
        'ngStorage',
        'ui.router'
      ]).name,

      angular.module(PKG.name+'.filters', [
        PKG.name+'.services'
      ]).name,

      'mgcrea.ngStrap.alert',
      // 'mgcrea.ngStrap.tooltip',
      // 'mgcrea.ngStrap.dropdown',
      // 'mgcrea.ngStrap.popover',
      // 'mgcrea.ngStrap.typeahead',
      // 'mgcrea.ngStrap.select',
      // 'mgcrea.ngStrap.collapse',
      // 'mgcrea.ngStrap.button',
      // 'mgcrea.ngStrap.tab',
      'mgcrea.ngStrap.modal'

    ]).name

  ])

  .run(function ($rootScope, $state, $stateParams) {
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // for debugging... or to trigger easter eggs?
    window.$go = $state.go;
  })


  .config(function ($locationProvider) {
    $locationProvider.html5Mode(false);
  })

  .config(function ($alertProvider) {
    angular.extend($alertProvider.defaults, {
      animation: 'am-fade-and-scale',
      container: '#alerts > .container',
      duration: 3
    });
  })

  .config(function (myThemeProvider) {
    myThemeProvider.setThemes([
      // 'default',
      'commando'
    ]);
  })

  /**
   * BodyCtrl
   * attached to the <body> tag, mostly responsible for
   *  setting the className based events from $state and myTheme
   */
  .controller('BodyCtrl', function ($scope, myTheme, $log, $stateParams) {

    var activeThemeClass = myTheme.getClassName();


    $scope.$on(myTheme.event.changed, function (event, newClassName) {
      if(!event.defaultPrevented) {
        $scope.bodyClass = $scope.bodyClass.replace(activeThemeClass, newClassName);
        activeThemeClass = newClassName;
      }
    });


    $scope.$on('$stateChangeSuccess', function (event, state) {

      var classes = [];

      if(state.data && state.data.bodyClass) {
        classes = [state.data.bodyClass];
      }
      else {
        var parts = state.name.split('.'),
            count = parts.length + 1;
        while (1<count--) {
          classes.push('state-' + parts.slice(0,count).join('-'));
        }
      }

      classes.push(activeThemeClass);

      $scope.bodyClass = classes.join(' ');

      $log.info(state.name+' '+angular.toJson($stateParams));
    });


  });
