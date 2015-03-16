angular.module(PKG.name+'.feature.prototype')
  .config(function ($stateProvider, $urlRouterProvider) {


    /**
     * State Configurations
     */
    $stateProvider

      .state('prototype', {
        url: '/prototype',
        templateUrl: 'assets/features/prototype/prototype.html',
        controller: function ($scope, myPlampApi) {


          $scope.color = {
            r: 0,
            g: 0,
            b: 0
          };

          $scope.css = {};

          $scope.$watchCollection('color', function(newVal) {
            angular.forEach(newVal, function (val, key) {
              var a = { r: 0, g: 0, b: 0 };
              a[key] = val;
              $scope.css[key] = {
                'background-color': 'rgb(' + [a.r, a.g, a.b].join(',') + ')'
              };
            });
            $scope.css.preview = {
              'background-color': 'rgb(' + [newVal.r, newVal.g, newVal.b].join(',') + ')'
            };
          });

          $scope.doSendColor = function () {
            myPlampApi.singleColor($scope.color);
          };


        }
      })

      ;


  });
