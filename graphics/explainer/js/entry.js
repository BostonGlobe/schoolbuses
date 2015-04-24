(function() { globe.onDefine('window.jQuery && $(".article-graphic.explainer").length', function() {

	require('./templates/templates.js');

	var masterSelector = '.article-graphic.explainer';
	var master = $(masterSelector);


	require('./main.js');

}); }());