angular.module(PKG.name+'.services')

  .constant('MY_THEME_EVENT', {
    changed: 'my-theme-changed'
  })

  .provider('myTheme', function MyThemeProvider () {

    var THEME_LIST = ['default'];

    this.setThemes = function (t) {
      if(angular.isArray(t) && t.length) {
        THEME_LIST = t;
      }
    };

    this.$get = function ($localStorage, $rootScope, MY_THEME_EVENT) {

      function Factory () {

        this.current = $localStorage.theme || THEME_LIST[0];

        this.event = MY_THEME_EVENT;

        this.set = function (theme) {
          if (THEME_LIST.indexOf(theme)!==-1) {
            this.current = theme;
            $localStorage.theme = theme;
            $rootScope.$broadcast(MY_THEME_EVENT.changed, this.getClassName());
          }
        };

        this.list = function () {
          return THEME_LIST;
        };

        this.getClassName = function () {
          return 'theme-' + this.current;
        };

      }

      return new Factory();
    };

  });