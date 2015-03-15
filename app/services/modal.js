/**
 * a helper to trigger modals onEnter
 */

angular.module(PKG.name+'.services')
  .factory('myModal', function ($state, $modal, $rootScope) {

    return function (tpl, toState) {

      var scope = $rootScope.$new();

      scope.$on('modal.hide', function () {
        $state.go(toState || '^');
      });

      return $modal({
        template: tpl,
        scope: scope
      });
    };

  });