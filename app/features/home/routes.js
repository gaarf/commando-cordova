angular.module(PKG.name+'.feature.home')
  .config(function ($stateProvider, $urlRouterProvider) {

    /**
     * Redirects and Otherwise
     */
    $urlRouterProvider
      .otherwise(function($injector, $location){
        $injector.get('$state').go($location.path() ? '404' : 'home');
      });


    /**
     * State Configurations
     */
    $stateProvider

      .state('home', {
        url: '/',
        templateUrl: 'assets/features/home/home.html',
        controller: function (cordovaReady, $scope, $localStorage) {

          cordovaReady().then(function () {
            $scope.device = window.device;
            navigator.splashscreen.hide();
          });

          $scope.version = PKG.v;

          $scope.$storage = $localStorage;
        }
      })

      .state('404', {
        templateUrl: 'assets/features/home/404.html'
      })

      ;


  });
