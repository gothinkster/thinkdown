'use strict';

angular.module('thinkster', [
  'thinkster.checkbox'
])
.controller('TutorialCtrl', function($scope) {
  $scope.tutorialName = 'thinkdown-test';
  $scope.$watchCollection('checkboxes[tutorialName]', function(newVal, oldVal) {
    if(newVal === oldVal) { return; }

    console.log(newVal);
  });
});
