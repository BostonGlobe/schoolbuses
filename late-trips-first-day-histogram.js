// Require various libraries.
var d3 = require('d3');

var datasets = require('../datasets.js');

module.exports = function(direction) {

	var data = datasets.lateTrips;

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var scene = svg.select('g.scene');

	var transitionDuration = 1500;

	var rect;
	function databind() {

		// DATA JOIN
		rect = scene.selectAll('rect')
			.data(d => d.)

	}

	function current() {

	}

	function previousToCurrent() {

	}

	function currentToPrevious() {
		
	}

	// If no direction, draw current.
	// If forwards, transition from previous to current.
	// If backwards, transition from current to previous.
	if (!direction) {
		current();
	} else if (direction === 'forwards') {
		previousToCurrent();
	} else if (direction === 'backwards') {
		currentToPrevious();
	}

};