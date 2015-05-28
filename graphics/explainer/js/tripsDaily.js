'use strict';

// Require various libraries.
var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

// Store chart data here.
var data = null;

// Declare scale variables.
var x;
var y;

// This runs once.
function init(opts) {

	// On init, create 'g.trips-daily', the chart container.
	opts.g.append('g')
		.attr('class', 'trips-daily');

	// Also create the global 'data' variable which will hold this
	// chart's data.
	data = opts.data.map(function(datum) {
		return {
			date: parseDate(datum.date),
			trips: +datum.n
		};
	});
}

function setScales(opts) {

	// Set scales.
	x = d3.time.scale()
		.range([0, opts.dimensions.width]);

	y = d3.scale.linear()
		.range([opts.dimensions.height, 0]);

	x.domain(d3.extent(data, d => d.date));
	y.domain([0, d3.max(data, d => d.trips)]);
}

function draw(opts) {

	var thisData;

	// Choose datapoints based on the scene.
	switch(opts.scene) {
		case 'intro':

			// If we're on the intro scene, only display first element.
			// Set the first trip to 0, so we can animate to full height
			// on the next slide.
			thisData = [
				{
					date: data[0].date,
					trips: 0
				}
			];

			break;
		case 'firstDay':

			// If we're on the firstDay scene, only display first element.
			thisData = [
				{
					date: data[0].date,
					trips: data[0].trips
				}
			];

			break;
		case 'allDays':

			// If we're on the allDays scene, display all trips.
			thisData = data;

			break;
	}

	var g = d3.select('g.trips-daily');

	// DATA JOIN
	// Join new data with old elements, if any.
	var rect = g.selectAll('rect')
		.data(thisData, d => d.date);

	// UPDATE
	// Update old elements as needed.
	rect.attr('class', 'update')
		.transition()
		.duration(1500)
		.attr({
			x: d => x(d.date),
			height: d => opts.dimensions.height - y(d.trips),
			y: d => y(d.trips)
		});

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
			height: d => opts.dimensions.height - y(d.trips)
		});


	// EXIT
	// Remove old elements as needed.
	rect.exit()
		.attr('class', 'exit')
		.transition()
		.duration(1500)
		.attr({
			y: y.range()[0],
			height: 0
		})
		.style('fill-opacity', 1e-6)
		.remove();
}

// This runs when the user clicks a 'previous'/'next' button.
// It will do a couple of things and then will call draw().
function prepareToDraw(opts) {

	// Set scales.
	setScales(opts);

	// Draw!
	draw(opts);
}

module.exports = {
	draw: prepareToDraw,
	init: init
};
