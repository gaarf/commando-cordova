angular.module(PKG.name+'.feature.prototype')
  .config(function ($stateProvider, $urlRouterProvider) {


    /**
     * State Configurations
     */
    $stateProvider

      .state('prototype', {
        abstract: true,
        url: '/prototype',
        template: '<ui-view />',
        controller: function ($scope, $timeout, myPlampApi) {

          $scope.color = {
            r: 126,
            g: 126,
            b: 126
          };

          $scope.css = {};

          var debounce;

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

            if(debounce) {
              $timeout.cancel(debounce);
            }
            debounce = $timeout(function() {
              myPlampApi.singleColor($scope.color);
            }, 500);
          });


        }
      })

      .state('prototype.color', {
        url: '/color',
        templateUrl: 'assets/features/prototype/color.html'
      })

      .state('prototype.accel', {
        url: '/accel',
        templateUrl: 'assets/features/prototype/accel.html',
        controller: function ($scope, $log, cordovaReady) {
          var interval;
          cordovaReady(function(){
            interval = navigator.accelerometer.watchAcceleration(
              function (accel) {
                $scope.$apply(function () {
                  $scope.accel = accel;

                  angular.forEach({r:'x', g:'y', b:'z'}, function(v,k) {
                    $scope.color[k] = Math.abs($scope.color[k] + Math.round(accel[v]))%255;
                  });

                });
              },
              function () {
                $log.error('accelerometer failure');
              },
              {
                frequency: 100
              }
            );
          });
          $scope.$on('$destroy', function () {
            if(interval) {
              navigator.accelerometer.clearWatch(interval);
            }
          });
        }
      })

      ;


  });
