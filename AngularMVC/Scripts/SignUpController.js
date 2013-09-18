//    Website: http://techbrij.com
//    Program: AngularJS form validation

var app = angular.module('validation', []);
app.controller('SignUpController', function ($scope,$http) {
    $scope.person = {};
    $scope.sendForm = function () {
        $http({
            method: 'POST',
            url: '/Account/SignUp',
            data: $scope.person,
            headers: {
                'RequestVerificationToken':  $scope.antiForgeryToken 
            }           
        }).success(function (data, status, headers, config) {
            $scope.message = '';
            if (data.success == false) {
                var str = '';
                for (var error in data.errors) {
                   str += data.errors[error] + '\n';
                }
                $scope.message = str;
            }
            else {
                $scope.message = 'Saved Successfully';               
                $scope.person = {};
            }
        }).error(function (data, status, headers, config) {                      
            $scope.message = 'Unexpected Error';
        });
    };    
});
/* Directives */
app.directive('ngUnique', ['$http', function (async) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            elem.on('blur', function (evt) {
                scope.$apply(function () {                   
                    var val = elem.val();
                    var req = { "userName": val }
                    var ajaxConfiguration = { method: 'POST', url: '/Account/IsUserAvailable', data: req };
                    async(ajaxConfiguration)
                        .success(function(data, status, headers, config) {									
                            ctrl.$setValidity('unique', data.result);
                        });
                });
            });
        }
    }
}]);