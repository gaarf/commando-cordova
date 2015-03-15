angular.module(PKG.name+'.services')

  .constant('MY_WM_EVENT', {
    resize: 'wm-resize',
    blur: 'wm-blur',
    focus: 'wm-focus'
  })

  .provider('myWindowManager', function (MY_WM_EVENT) {

    this.resizeDebounceMs = 500;

    this.pageViz = {
      hidden: 'visibilitychange',
      mozHidden: 'mozvisibilitychange',
      msHidden: 'msvisibilitychange',
      webkitHidden: 'webkitvisibilitychange'
    };

    this.$get = function ($rootScope, $window, $document, $log, $timeout) {

      // resize inspired by https://github.com/danmasta/ngResize
      var resizeDebounceMs = this.resizeDebounceMs,
          resizePromise = null;

      angular.element($window).on('resize', function (event) {
        if(resizePromise) {
          $timeout.cancel(resizePromise);
        }
        resizePromise = $timeout(function () {
          // $log.log('[windowManager]', 'resize');
          $rootScope.$broadcast(MY_WM_EVENT.resize, {
            width: $window.innerWidth,
            height: $window.innerHeight
          });
        }, resizeDebounceMs, false);
      });



      // pageviz inspired by https://github.com/mz026/angular_page_visibility
      var mkOnVizChange = function (q) {
        return function (e) {
          // $log.log('[windowManager]', e);
          $rootScope.$broadcast(
            MY_WM_EVENT[ $document.prop(q) ? 'blur' : 'focus' ]
          );
        };
      };

      var vizImp = Object.keys(this.pageViz);
      for (var i = 0; i < vizImp.length; i++) { // iterate through implementations
        var p = vizImp[i];
        if (typeof ($document.prop(p)) !== 'undefined') {
          // $log.info('[windowManager] page visibility API available!');
          $document.on(this.pageViz[p], mkOnVizChange(p));
          break;
        }
      }

      return {
        event: MY_WM_EVENT
      };

    };

  })


  /*
  * myOnWm Directive
  *
  * usage: my-on-wm="{resize:expression()}"
  * event data is available as $event
  */
  .directive('myOnWm', function ($parse, $timeout, myWindowManager) {
    return {
      compile: function ($element, attr) {
        var obj = $parse(attr.myOnWm);
        return function (scope, element, attr) {
          angular.forEach(obj, function (fn, key) {
            var eName = myWindowManager.event[key];
            if(eName) {
              scope.$on(eName, function (event, data) {
                $timeout(function () {
                  scope.$apply(function () {
                    fn(scope, { $event: data });
                  });
                });
              });
            }
          });
        };
      }
    };
  });