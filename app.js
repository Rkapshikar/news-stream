// include ui.router as a dependency
var app = angular.module('newsStream', ['ui.router']);

app.factory('posts', [function() {
  // creating a new object that has an array property called posts, and then exporting that
  // exporting an object intead of an array means we can modify it further
    var o = {
    posts: []
  };
  return o;
}]);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {


  $urlRouterProvider.otherwise('home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('posts', {
  		url: '/posts/{id}',
  		templateUrl: '/posts.html',
  		controller: 'PostsCtrl'
	});

}]);


app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
	// Bind the $scope.posts variable in our controller to the posts array in our service in order to still have two-way data binding
  $scope.posts = posts.posts;
  $scope.message = 'Hello World!';

  $scope.addPost = function(){
  	if(!$scope.title || $scope.title === '') { 
  		return; 
  	}
  	$scope.posts.push({
  		title: $scope.title, 
  		link: $scope.link, 
  		upvotes: 0,
  	  	comments: [
    		{author: 'Joe', body: 'Cool post!', upvotes: 0},
    		{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
  ]});
  	$scope.title = '';
  	$scope.link = '';
};
  $scope.incrementUpvotes = function(post) {
	post.upvotes = post.upvotes + 1;
	};

}]);

//Creating a new controller and injecting the posts service
app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts){

	$scope.post = posts.posts[$stateParams.id];
	
	$scope.addComment = function(){
  		if($scope.body === '') { return; }
  			$scope.post.comments.push({
    		body: $scope.body,
    		author: 'user',
    		upvotes: 0
  			});
  		$scope.body = '';
	};
}]);