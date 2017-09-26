app.controller('AboutCtrl', [function() {

	this.title = 'About Title';
	this.content = 'This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.';

	this.alert = function() {
		window.alert('我只是一个弹出框');
	}
}])
