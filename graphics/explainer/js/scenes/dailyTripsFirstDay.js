// Each scene should know how to go from 'previous' to 'current',
// and from 'current' to 'previous'.
// In other words: if we're on scene A, and we click 'Next',
// we'll jump to scene B, which will transition from 'previous' to 'current'.
// If we then click 'Previous', scene B will transition from 'current' to 'previous',
// and then we'll jump to scene A, which will draw 'current'.









// Draw the first day of daily trips.
// The start state is the bar at zero height.
// Transition it to the bar at full height.

// Require various libraries.
var d3 = require('d3');

module.exports = function(DATA, direction) {

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var g = svg.select('g.scene');

	var x = d3.time.scale();
	var y = d3.scale.linear();

	function current() {

		var data = _.take(DATA, 1);

		// Setup scales.
		x.range([0, width])
			.domain(d3.extent(data, d => d.date));

		y.range([height, 0])
			.domain([0, d3.max(data, d => d.trips)]);

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr({
				x: d => x(d.date),
				width: 100,
				y: d => y(d.trips),
				height: d => height - y(d.trips)
			});
	}

	function previousToCurrent() {

		var data = _.take(DATA, 1);

		// Setup scales.
		x.range([0, width])
			.domain(d3.extent(data, d => d.date));

		y.range([height, 0])
			.domain([0, d3.max(data, d => d.trips)]);

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr({
				x: d => x(d.date),
				width: 100,
				y: y.range()[0],
				height: 0
			})
			.transition()
			.duration(1500)
			.attr({
				y: d => y(d.trips),
				height: d => height - y(d.trips)
			});
	}

	function currentToPrevious() {

		var data = _.take(DATA, 1);

		// Setup scales.
		x.range([0, width])
			.domain(d3.extent(data, d => d.date));

		y.range([height, 0])
			.domain([0, d3.max(data, d => d.trips)]);

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr({
				x: d => x(d.date),
				width: 100,
				y: d => y(d.trips),
				height: d => height - y(d.trips)
			})
			.transition()
			.duration(1500)
			.attr({
				y: y.range()[0],
				height: 0
			});
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