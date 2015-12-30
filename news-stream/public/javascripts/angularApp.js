// include ui.router as a dependency
var app = angular.module('newsStream', ['ui.router']);

app.factory('posts', ['$http', function($http) {
  // creating a new object that has an array property called posts, and then exporting that
  // exporting an object intead of an array means we can modify it further
    var o = {
    posts: []
  };
    // Get all posts
    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.posts);
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };

    o.upvote = function(post) {
  return $http.put('/posts/' + post._id + '/upvote').success(function(data){
      post.upvotes += 1;
    });
  };

  o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data;
  });
};


  o.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };

  o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
    .success(function(data){
      comment.upvotes += 1;
    });
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
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          // Returns all posts
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
  		url: '/posts/{id}',
  		templateUrl: '/posts.html',
  		controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
          return posts.get($stateParams.id);
    }]
  }
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
    if(!$scope.title || $scope.title === '') { return; }
      posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };
  $scope.incrementUpvotes = function(post) {
    posts.upvote(post);
  };

}]);

//Creating a new controller and injecting the posts service
app.controller('PostsCtrl', [
'$scope',
'posts',
'post',
function($scope, posts, post){

	$scope.post = post;
	
	$scope.addComment = function(){
  if($scope.body === '') { return; }
  posts.addComment(post._id, {
    body: $scope.body,
    author: 'user',
  }).success(function(comment) {
    $scope.post.comments.push(comment);
  });

  $scope.incrementUpvotes = function(comment){
  posts.upvoteComment(post, comment);
};
  $scope.body = '';
};
}]);