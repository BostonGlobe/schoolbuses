// Draw the first day of daily trips.
// The start state is the bar at zero height.
// Transition it to the bar at full height.

// Require various libraries.
var d3 = require('d3');

module.exports = function(data, direction) {

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var g = svg.select('g.scene');

	var data = _.take(data, 1);

	// Setup scales.
	var x = d3.time.scale()
		.range([0, width])
		.domain(d3.extent(data, d => d.date));

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(data, d => d.trips)]);

	var transitionDuration = 1500;

	var attributes = {
		start: {
			x: d => x(d.date),
			width: 100,
			y: y.range()[0],
			height: 0
		},
		end: {
			x: d => x(d.date),
			width: 100,
			y: d => y(d.trips),
			height: d => height - y(d.trips)
		}
	};

	function current() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr(attributes.end);
	}

	function previousToCurrent() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr(attributes.start)
			.transition()
			.duration(transitionDuration)
			.attr(attributes.end);
	}

	function currentToPrevious() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr(attributes.end)
			.transition()
			.duration(transitionDuration)
			.attr(attributes.start);
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