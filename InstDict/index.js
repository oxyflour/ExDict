var app = angular.module('app', [])
app.factory('youdao', function ($http) {
	function queryText(content, callback) {
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
	return queryText
})
app.factory('baidu', function($http) {
	function queryText(content, callback) {
		$http({
			url: content.search(/\s/) >= 0 ?
				'http://openapi.baidu.com/public/2.0/bmt/translate' :
				'http://openapi.baidu.com/public/2.0/translate/dict/simple',
			method: 'GET',
			params: {
				from: 'en',
				to: 'zh',
				client_id: 'iMYR92MYOqSqxgcHW5jUsjq1',
				q: content
			}
		}).success(function(data, status) {
			callback(data)
		}).error(function(data, status) {
			callback({ httpError: status })
		})
	}
	return queryText
})
app.factory('bing', function ($http) {
	function getToken(callback) {
		$http({
			url: 'https://datamarket.accesscontrol.windows.net/v2/OAuth2-13/',
			method: 'POST',
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			data: [
				'client_id=exDict',
				'client_secret='+encodeURIComponent('KXATs9H+8z789JiFNcYwniXLSWHqXQr4oDH8IfRo634='),
				'scope='+encodeURIComponent('http://api.microsofttranslator.com'),
				'grant_type=client_credentials',
			].join('&'),
		}).success(function(data, status) {
			localStorage.setItem('bing_access_token', data.access_token)
			callback(data)
		}).error(function(data, status) {
			callback({ httpError: status })
		})
	}
	function queryText(content, callback) {
		$http({
			url: 'http://api.microsofttranslator.com/V2/Ajax.svc/Translate',
			method: 'GET',
			params: {
				appId: 'Bearer ' + localStorage.getItem('bing_access_token'),
				from: '',
				to: 'zh',
				text: content,
			}
		}).success(function(data, status) {
			if (data.search('"ArgumentException:') !== 0) {
				callback({ text: data })
			}
			else getToken(function(data) {
				data.access_token ?
					queryText(content, callback) :
					callback({ loginError: data })
			})
		}).error(function(data, status) {
			callback({ httpError: status })
		})
	}
	return queryText
})
app.directive('localStorage', function() {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            key: '@localStore',
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch('model', function(v, v0) {
                var k = scope.key || attrs.ngModel;
                if (v == v0)
                    scope.model = localStorage.getItem(k);
                else
                    v ? localStorage.setItem(k, v) : localStorage.removeItem(k);
            });
        },
    };
})
app.controller('main', function ($scope, $timeout, youdao, bing, baidu) {
	var waitingResult;
	$scope.$watch('query+source', function(v, v0) {
		if (!$scope.query) {
			return $scope.result = undefined
		}
		waitingResult = $timeout(function() {
			$scope.result = undefined
		}, 300)

		var srv = ({
			youdao: youdao,
			bing: bing,
			baidu: baidu
		})[$scope.source]

		if (!srv) {
			$scope.source = 'youdao'
			$timeout.cancel(waitingResult)
		}
		else srv($scope.query, function(data) {
			$timeout.cancel(waitingResult)
			$scope.result = data
			$scope.result.source = $scope.source
		})
	})
	$scope.pasteQuery = function() {
		var elem = $('input[ng-model=query]')
		elem.focus().select()
		document.execCommand("paste")
		elem.focus().select()
		$scope.queryForm.queryText.$commitViewValue()
	}
	$timeout($scope.pasteQuery, 100)
})
