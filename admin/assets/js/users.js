angular.module('gsadmin').controller('users', function ($scope, $rootScope, $http) {
    $scope.displayTable = true;
    $scope.sortType     = 'date'; // значение сортировки по умолчанию
    $scope.sortReverse  = false;  // обратная сортривка
    $scope.searchUser   = '';     // значение поиска по умолчанию
    $scope.itemsPerPage = 10; // Запрос в базу за всеми пользователями
    $scope.count =0;
    $scope.users = [];
    $scope.paginationLength = 5000000;
    $scope.currentPage = 1;

    $scope.getPageData = getPageData;

    activate();

    function activate() {
        return getPageData();
    }

    function getPageData(){
        var page = $scope.currentPage - 1 || 0;
        var search = $scope.searchUser || '';
        $scope.users = [];

        $http
            .get('/api/adm/users?page='+page+'&perPage=10&searchString='+search)
            .then(function (response) {
                $scope.users = response.data.data.userInfos;
                $scope.count = response.data.data.count;
            });
    }

});