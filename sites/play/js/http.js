gamestar.service('http', function($http, $rootScope, $q){

	function asyncGET(url, data) {
		// perform some asynchronous operation, resolve or reject the promise when appropriate.
		return $q(function(resolve, reject) {
			$http.get(url, data).then(function(res){
				console.log('http success: ', res);
				resolve(res);
			}, function(err){
				if (err.status.toString()[0]==='5') $rootScope.showNotification($rootScope.dict['ALERT__SERVER_ERROR'], 'error');
				if (err.status =='HaveViolationException') $rootScope.showNotification($rootScope.dict['ALERT__SERVER_ERROR'], 'error');

				console.error('http error: ', err);
				reject(err);
			});
		});
	}

	this.get = function(url, data){
		var promise;
		promise = new asyncGET(url, data);
		return promise;
	};




	function asyncPOST(url, data) {
		// perform some asynchronous operation, resolve or reject the promise when appropriate.
		return $q(function(resolve, reject) {
			$http.post(url, data).then(function(res){
				console.log('http success: ', res);
				resolve(res);
			}, function(err){
				console.error('http error: ', err);
				reject(err);
			});
		});
	}


	this.post = function(url, data){
		console.log('post data: ', data);
		var promise;
		promise = new asyncPOST(url, data);
		return promise;
	};


	//var httpDecorator = function(method){
	//	return function(url, data, cb){
	//		console.log('http log method: ', method, 'url: ', url, 'data: ', data);
	//		//$http[method](url, data).then(function(res){
	//		//	console.log('http success: ', res);
	//		//	cb(null, res)
	//		//}, function(err){
	//		//	console.log('http error: ', err);
	//		//	cb(err)
	//		//});
	//		//$rootScope.$broadcast(method+':'+url, data);
	//		//cb();
	//	}
	//};


	//this.get = httpDecorator('get');
	//this.post = httpDecorator('post');

	//this.get = function(url, data, cb){
	//	$http.get(url, data, function(){
	//		cb();
	//	});
	//};
	//
	//
	//this.post = function(){
	//	$http.post(url, data, function(){
	//		$rootScope.$broadcast(url, data);
	//		cb();
	//	});
	//}


});