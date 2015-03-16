angular.module(PKG.name+'.services')
  .factory('myPlampHost', function ($localStorage) {

    return {
      url: 'http://192.168.1.10'
    };

  })
  .service('myPlampApi', function (myPlampHost, $http, $log) {

    this.colorArray = function (pixels) {
      return $http.post(myPlampHost.url+'/color_array', pixels).then(function (response) {
        $log.log(response);
      });
    };


    this.singleColor = function (color) {
      var a = [];

      for (var i = 0; i < 64; i++) {
        a.push([i, parseInt(color.r, 10), parseInt(color.g, 10), parseInt(color.b, 10)]);
      };

      return this.colorArray(a);
    };

  });