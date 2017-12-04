angular.module('gsadmin').directive('gsDateToTime', function () {
    var directive = {
        link: link,
        restrict: 'A',
        require: 'ngModel'
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
        ngModel.$formatters.push(function (value) {
            if (value) {
                return moment(value, 'HH:mm:ss').toDate();
            }
        });


        ngModel.$parsers.push(function (viewValue) {
            if (viewValue){
                return moment(viewValue).format('HH:mm:ss');
            }
        });
    }
});