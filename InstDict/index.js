var app = angular.module('app', [])
app.factory('youdao', function ($http) {
	return {
		query: function(content, callback) {
			$http({
				url: 'http://fanyi.youdao.com/openapi.do',
				method: 'GET',
				params: {
					keyfrom: "exDict",
					key: 1290470647,
					type: "data",
					doctype: "json",
					version: 1.1,
					q: content
				}
			}).success(function(data, status) {
				callback(data)
			}).error(function(data, status) {
				callback({ httpError: status })
			})
		}
	}
})
app.controller('main', function ($scope, $timeout, youdao) {
	$scope.$watch('query', function(v, v0) {
		$scope.result = undefined
		if (v) youdao.query(v, function(data) {
			$scope.result = data
		})
	})
	$scope.pasteQuery = function() {
		var elem = $('input[ng-model=query]')
		elem.focus().select()
		document.execCommand("paste")
		elem.focus().select()
		$scope.queryForm.queryText.$commitViewValue()
	}
	$timeout($scope.pasteQuery, 200)
})
