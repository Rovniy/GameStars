(function () {
    'use strict';

    angular
        .module('gamestar.base')
        .controller('IssueModalController', IssueModalController);

    IssueModalController.$inject = ['$scope', '$q', 'FileUploader', '$http', 'modalData'];

    /* @ngInject */
    /**
     * @param $scope
     * @param {angular.IQService} $q
     * @param FileUploader
     * @param $http
     * @param {{ playerId: number, userName: string }} modalData
     * @constructor
     */
    function IssueModalController($scope, $q, FileUploader, $http, modalData) {
        console.log(modalData);
        
        var vm = this;
        /** @type {angular.IDeferred} */
        var uploadDeferred;

        vm.uploader = new FileUploader({
            url: '/api/match/report/upload'
        });

        vm.loading = false;
        vm.issueSendFail = false;
        vm.issueSendSuccess = false;
        vm.issueCause = 'AFK';

        vm.remove = remove;
        vm.issueSubmit = issueSubmit;

        activate();

        console.info('uploader', vm.uploader);

        ////////////////

        function activate() {
            vm.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            
            vm.uploader.onAfterAddingFile = function(fileItem) {
                console.info('onAfterAddingFile', fileItem);
                $scope.fileUploaded = true;

            };
            
            vm.uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll: ', addedFileItems);//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                $scope.fileItems = addedFileItems;

            };
            
            vm.uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            
            vm.uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            
            vm.uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            
            vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
                //$scope.uploadData = response.data;

                $scope.fileNames = response.data.value.map(function(item){return item.value});
                console.log('fileNames: ', $scope.fileNames);


                $scope.realFileNames = response.data.value.map(function(item){return item.key});
                console.log('realFileNames: ', $scope.realFileNames);

                uploadDeferred && uploadDeferred.resolve();
            };
            
            vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.error('onErrorItem', fileItem, response, status, headers);
            };
            
            vm.uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            
            vm.uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            
            vm.uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };
        }

        function post() {
            console.log('post');
            console.log('$scope.items: ', $scope.items);
            console.log('modalData: ', modalData);
            
            var postData = {
                fileNames: $scope.fileNames || null,
                description: $scope.description, //не более 255
                matchId : localStorage.getItem('roomId'),
                target: modalData.playerId,
                //message: 'message',
                type: vm.issueCause
            };

            vm.loading = true;
            vm.issueSendFail = false;
            vm.issueSendSuccess = false;
            
            $http
                .post('/api/match/report/create', postData)
                .then(function(response){
                    console.log('report response: ', response);
                    vm.issueSendSuccess = true;
                })
                .catch(function(response){
                    console.error('report error: ', response);
                    vm.issueSendFail = true;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        function remove(key){
            console.log('remove file with key: ', key);
            $scope.fileItems.splice(key, 1);
            if ($scope.fileUploaded) $scope.fileUploaded = false;
            console.log('$scope.fileItems: ', $scope.fileItems);
        }

        function issueSubmit(){
            console.log('issueSubmit $scope items: ', $scope.items);

            if ($scope.fileItems && $scope.fileItems.length) {
                return uploadAll().then(post);
            }
            else{
                post();
            }
        }

        /**
         * @returns {angular.IPromise<void>}
         */
        function uploadAll() {
            uploadDeferred = $q.defer();
            vm.uploader.uploadAll();

            return uploadDeferred.promise;
        }
    }

})();