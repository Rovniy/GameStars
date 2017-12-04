angular.module('gsadmin').filter('scReports', function(){
    return function(data){
        if (!data) {
            return '';
        }

        var temp = 0;

        data.forEach(function(f) {
            if (f.createdBy == 'STAR_CLIENT') {
                temp++;
            }
        });

        return temp;
    };
});