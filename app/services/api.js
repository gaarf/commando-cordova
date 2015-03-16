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
      return this.colorArray((new Array(64)).map(function (v, i) {
        return [i, color.r, color.g, color.b];
      }));
    };

  });