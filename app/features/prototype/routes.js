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
          var interval,
              gradient = makeColorGradient(.1,.2,.3,0,0,0,40),
              activeIndex = 0;

          $scope.gradient = gradient;
          $scope.activeIndex = activeIndex;

          $scope.setActive = function (i) {
            if(i>=gradient.length) {
              i = 0;
            }
            else if(i<0) {
              i = gradient.length-1;
            }
            $scope.activeIndex = i;
            angular.forEach(['r','g','b'], function (v) {
              $scope.color[v] = gradient[i][v];
            });
          };

          cordovaReady(function(){
            interval = navigator.accelerometer.watchAcceleration(
              function (accel) {
                $scope.$apply(function () {
                  $scope.accel = accel;
                  if(1>Math.abs(accel.x)) {
                    return;
                  }
                  $scope.setActive($scope.activeIndex + (accel.x > 0 ? 1 : -1));
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



  function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, len, center, width) {
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    var out = [];
    for (var i = 0; i < len; ++i) {
      out.push({
        r: Math.floor(Math.sin(frequency1*i + phase1) * width + center),
        g: Math.floor(Math.sin(frequency2*i + phase2) * width + center),
        b: Math.floor(Math.sin(frequency3*i + phase3) * width + center)
      });
    }
    return out;
  }