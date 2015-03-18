angular.module(PKG.name+'.services')
  .factory('myPlampHost', function ($localStorage) {

    var storage = $localStorage.$default({
        host: '192.168.1.10'
    });

    return {
      url: function (path) {
        return 'http://' + storage.host + path;
      }
    };

  })
  .service('myPlampApi', function (myPlampHost, $http, $log) {

    this.colorArray = function (pixels) {
      return $http.post(myPlampHost.url('/color_array'), pixels)
        .then(function (response) {
          $log.log(response);
        });
    };

    this.colorWipe = function (color, wait) {
      return $http.post(myPlampHost.url('/color_wipe'), [
          parseInt(color.r, 10),
          parseInt(color.g, 10),
          parseInt(color.b, 10),
          wait||0
        ])
        .then(function (response) {
          $log.log(response);
        });
    };

    this.singleColor = function (color) {
      return this.colorWipe(color, 0);
    };

  });