// adapted from https://github.com/matmar10/angular-cordova-ready

angular.module(PKG.name+'.services')
  .factory('cordovaReady', function ($q, $window, $log) {

    var cordovaReady = $q.defer(),
        cordovaReadyPromise = cordovaReady.promise;

    if (!$window.cordova) {
      $log.warn('rejecting cordovaReadyPromise');
      cordovaReady.reject();
    }
    else {
      $window.document.addEventListener('deviceready', cordovaReady.resolve);
    }

    /**
     * Wraps a Cordova service call to ensure Cordova has loaded and is ready
     *
     * @param {Function} [callbackFunction] - The method to invoke when Cordova is ready; invoked immediately if Cordova is already loaded
     * @param {Array} [callbackArguments] - The arguments to pass to the callbackFunction
     * @return {Object<Promise>} A promise object for chaining
     */
    return function (callbackFunction, callbackArguments) {
      cordovaReadyPromise.then(function() {
        if ('function' === typeof callbackFunction) {
          callbackFunction.apply(callbackFunction, callbackArguments);
        }
      });
      return cordovaReadyPromise;
    };
  })

  .factory('cordovaPrompt', function ($rootScope, cordovaReady) {
    return function (msg, callback, prefill) {
      var doIt = function (newVal) {
        $rootScope.$applyAsync(function () {
          callback(newVal);
        });
      };
      cordovaReady().then(
        function () {
          navigator.notification.prompt(msg, function (results) {
            if(results.buttonIndex === 1) {
              doIt(results.input1)
            }
          }, 'Edit', ['OK', 'Cancel'], prefill);
        },
        function () {
          var d = prompt(msg, prefill);
          if(!angular.isUndefined(d)) {
            doIt(d);
          }
        }
      );
    };
  })

  .factory('cordovaConfirm', function ($rootScope, cordovaReady) {
    return function (msg, callback) {
      msg = msg || 'Are you sure?';
      var doIt = function () {
        $rootScope.$applyAsync(callback);
      };
      cordovaReady().then(
        function () {
          navigator.notification.confirm(msg, function (results) {
            if(results === 1) {
              doIt();
            }
          }, 'Confirm', ['OK', 'Cancel']);
        },
        function () {
          confirm(msg) && doIt();
        }
      );
    };
  })

  .directive('cordovaConfirmable', function cordovaConfirmableDirective (cordovaConfirm) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.doConfirm = function (msg) {
          cordovaConfirm(msg || attrs.cordovaConfirmable, function () {
            scope.$eval(attrs.cordovaConfirmable);
          });
        };
      }
    };
  })

  ;