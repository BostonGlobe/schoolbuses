// Draw all days of daily trips.
// The start state is the first bar.
// Transition it to all bars.

// Require various libraries.
var d3 = require('d3');

module.exports = function(data) {

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');

	var g = svg.select('g.scene');

	// Setup scales.
	var x = d3.time.scale()
		.range([0, width])
		.domain(d3.extent(_.take(data, 2), d => d.date));

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(data, d => d.trips)]);

	function dataJoinUpdateEnterExit() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// UPDATE
		// Update old elements as needed.
		rect.attr('class', 'update')
			.transition()
			.duration(1500)
			.attr({
				x: d => x(d.date),
				width: x.range()[1] / data.length,
				y: d => y(d.trips),
				height: d => height - y(d.trips)
			});

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr({
				'class': 'enter',
				x: d => x(d.date),
				width: x.range()[1] / data.length,
				y: d => y(d.trips),
				height: d => height - y(d.trips)
			});
	}

	dataJoinUpdateEnterExit();
	x.domain(d3.extent(data, d => d.date));
	dataJoinUpdateEnterExit();

};





