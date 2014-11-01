
angular.module('thinkster.checkbox', [])

.directive('checkbox', function() {
  return {
    restrict: 'AE',
    templateUrl: '/scripts/checkbox/checkbox.html',
    transclude: true,
    scope: {
      array: '=',
      tutorial: '@',
      id: '@',
    },
    controller: function($scope) {

    }
  };
});

