// Require various libraries.
var d3 = require('d3');

var datasets = require('../datasets.js');

module.exports = function(direction) {

	// Get relevant dataset.
	var data = datasets.tripsPerDay;

	// Declare data keys we're interested in.
	var dataKeys = ['earlyTrips', 'lateTrips'];

	// Setup the color scale.
	var color = d3.scale.ordinal()
		.domain(dataKeys);

	// Calculate ymin and ymax for every trip in every datum.
	// This will come in handy when we make the stacked bars.
	data.forEach(function(d) {
		var y0 = 0; // Set it to 0. This will keep incrementing in the loop below.
		d.trips = color.domain().map(function(name) { // Iterate over every property, e.g. 'early trips'
			return {
				name: name, // e.g. 'early trips'
				y0: y0, // low range.
				y1: y0 += +d[name]	
			};
		});
	});

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var g = svg.select('g.scene');

	var transitionDuration = 1500;

	var domain = {
		start: {
			x: d3.extent(_.take(data, 2), d => d.date),
			y: [0, d3.max(_.take(data, 1), d => d.totalTrips)]
		},
		end: {
			x: d3.extent(data, d => d.date),
			y: [0, d3.max(data, d => d.totalTrips)]
		}
	};

	var x = d3.time.scale().range([0, width])
		.domain(domain.end.x);
	var y = d3.scale.linear().range([height, 0])
		.domain(domain.end.y);

	var rect;
	function databind() {

		// DATA JOIN - days
		var days = g.selectAll('.days')
			.data(data, d => d.date);

		// ENTER - days
		days.enter().append('g')
			.attr({
				'class': 'day',
				transform: d => `translate(${x(d.date)}, 0)`
			});

		// DATA JOIN - trips
		rect = days.selectAll('rect')
			.data(d => d.trips);

		// ENTER - trips
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr({
				x: 0,
				width: x.range()[1] / data.length,
				y: d => y(d.y1),
				height: d => y(d.y0) - y(d.y1)
			})
			.style({
				fill: d => color(d.name)
			});
	}

	function current() {
		color.range(['rgb(200, 200, 200)', 'rgb(255, 0, 0)']);
		databind();
	}

	function previousToCurrent() {
		color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)'])
		databind();
		color.range(['rgb(200, 200, 200)', 'rgb(255, 0, 0)']);

		rect.transition()
			.duration(transitionDuration)
			.style({
				fill: d => color(d.name)
			});
	}

	function currentToPrevious() {
		color.range(['rgb(200, 200, 200)', 'rgb(255, 0, 0)']);
		databind();
		color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)'])

		rect.transition()
			.duration(transitionDuration)
			.style({
				fill: d => color(d.name)
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