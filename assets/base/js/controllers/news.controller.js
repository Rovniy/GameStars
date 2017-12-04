(function () {
	'use strict';

	angular
		.module('gamestar.base')
		.controller('NewsController', NewsController);

	NewsController.$inject = [];

	/* @ngInject */
	function NewsController() {
		var vm = this;

		vm.news = [
			{
				title: 'NEWS__NEW_YEAR_TOURNAMENT',
				date: 'NEWS__NEW_YEAR_TOURNAMENT__START_DATE',
				url: '/news'
			}
		];

		activate();

		////////////////

		function activate() {
			
		}
	}

})();



