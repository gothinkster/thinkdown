
angular.module('thinkster.checkbox', [])

.directive('checkbox', function() {
  return {
    restrict: 'AE',
    templateUrl: '/scripts/checkbox/checkbox.html',
    transclude: true,
    scope: {
      ngModel: '='
    },
    controller: function($scope) {

    }
  };
});

