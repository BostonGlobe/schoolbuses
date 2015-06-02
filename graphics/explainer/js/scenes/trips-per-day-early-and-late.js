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
	var scene = svg.select('g.scene');

	var transitionDuration = 1500;

	var domain = {
		start: {
			x: d3.extent(data, d => d.date),
			y: [0, d3.max(data, d => d.totalTrips)]
		},
		end: {
			x: d3.extent(data, d => d.date),
			y: [0, d3.max(data, d => d.lateTrips)]
		}
	};

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	x.domain(direction && direction === 'forwards' ? domain.start.x : domain.end.x);
	y.domain(direction && direction === 'forwards' ? domain.start.y : domain.end.y);

	var attributes = {
		start: {
			x: 0,
			width: x.range()[1] / data.length,
			y: d => y(d.y1),
			height: d => y(d.y0) - y(d.y1)
		},
		end: {
			x: 0,
			width: x.range()[1] / data.length,
			y: d => d.name === 'lateTrips' ?
				height - (y(d.y0) - y(d.y1)) :
				y.range()[0],
			height: d => d.name === 'lateTrips' ?
				y(d.y0) - y(d.y1) :
				0
		}
	};

	var g;
	var rect;
	function databind() {

		// DATA JOIN - days
		g = scene.selectAll('.days')
			.data(data, d => d.date);

		// ENTER - days
		g.enter().append('g')
			.attr({
				'class': 'day',
				transform: d => `translate(${x(d.date)}, 0)`
			});

		// DATA JOIN - trips
		rect = g.selectAll('rect')
			.data(d => d.trips);

		// ENTER - trips
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr(direction && direction === 'forwards' ? attributes.start : attributes.end)
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
		x.domain(domain.end.x);
		y.domain(domain.end.y);

		rect.transition()
			.duration(transitionDuration)
			.style({
				fill: d => color(d.name)
			})
			.transition()
			.attr(attributes.end);

	}

	function currentToPrevious() {
		color.range(['rgb(200, 200, 200)', 'rgb(255, 0, 0)']);
		databind();

		color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)'])
		x.domain(domain.start.x);
		y.domain(domain.start.y);

		rect.transition()
			.duration(transitionDuration)
			.attr(attributes.start)
			.transition()
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