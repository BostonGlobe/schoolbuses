// Draw the first day of daily trips.
// The start state is the bar at zero height.
// Transition it to the bar at full height.

// Require various libraries.
var d3 = require('d3');

module.exports = function(data) {

	var data = _.take(data, 1);

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');

	var g = svg.select('g.scene');

	// Setup scales.
	var x = d3.time.scale()
		.range([0, width])
		.domain(d3.extent(data, d => d.date));

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(data, d => d.trips)]);

	// DATA JOIN
	// Join new data with old elements, if any.
	var rect = g.selectAll('rect')
		.data(data, d => d.date);

	// ENTER
	// Create new elements as needed.
	rect.enter().append('rect')
		.attr({
			'class': 'enter',
			x: d => x(d.date),
			width: x.range()[1] / data.length,
			y: y.range()[0],
			height: 0
		})
		.transition()
		.duration(1500)
		.attr({
			y: d => y(d.trips),
			height: d => height - y(d.trips)
		});

};