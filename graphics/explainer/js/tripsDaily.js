'use strict';

// Require various libraries.
var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

// Store chart data here.
var data = null;

var x;
var y;

// Declare list of scenes.
var scenes = ['intro', 'firstDay', 'allDays'];

function setScales(opts) {

	// Set scales.
	x = d3.time.scale()
		.range([0, opts.dimensions.width]);

	y = d3.scale.linear()
		.range([opts.dimensions.height, 0]);

	switch(opts.scene) {
		case 'intro':
			x.domain(d3.extent(_.take(data, 1), d => d.date));
			y.domain([0, d3.max(_.take(data, 1), d => d.trips)]);
			break;
	}
}

function prepareToDraw(opts) {

	// Set scales.
	setScales(opts);

	// Draw!
	draw(opts);
}

function draw(opts) {

	// This is the drawing function. This is where we draw.
	// If we're on the first scene, 'intro',
	// set the x-axis to ... the first 10.
	// Set the y-axis to the height of the first one.
	// And draw the first element.

	var sceneData;

	switch(opts.scene) {
		case 'intro':
			sceneData = _.take(data, 1);
			break;
	}

	var rect = opts.g.append('g')
		.selectAll('rect')
		.data(sceneData, d => d.date);

	// UPDATE
	// Update old elements as needed.

	// ENTER
	// Create new elements as needed.
	switch(opts.scene) {
		case 'intro':
			sceneData = _.take(data, 1);
			rect.enter().append('rect')
				.attr({
					x: d => x(d.date),
					y: d => y(d.trips),
					width: x.range()[1] / sceneData.length,
					height: d => opts.dimensions.height - y(d.trips)
				});
			break;
	}

	// EXIT
	// Remove old elements as needed.
	rect.exit().remove();
}

function init(opts) {
	data = opts.data.map(function(datum) {
		return {
			date: parseDate(datum.date),
			trips: +datum.n
		};
	});
}

module.exports = {
	draw: prepareToDraw,
	init: init
};
