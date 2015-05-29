
























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

// Declare axes variables.
var xAxis;
var yAxis;

var widthOfFirstBar = 100;

// This runs once.
function init(opts) {

	// On init, create 'g.trips-daily', the chart container.
	var tripsDaily = opts.g.append('g')
		.attr('class', 'trips-daily');

	// Also create the axes groups.
	tripsDaily.append('g')
		.attr({
			'class': 'x axis',
			'transform': `translate(0,${opts.dimensions.height})`
		});
	tripsDaily.append('g')
		.attr({
			'class': 'y axis'
		});

	// Also create the global 'data' variable which will hold this
	// chart's data.
	var prepareData = function(datum) {
		return {
			date: parseDate(datum.date),
			trips: +datum.n
		};
	};
	data = opts.data.map(prepareData);
}

function chooseData(opts) {

	var sceneData;

	// Clone the original data so we can modify elements
	// without modifying original data elements.	
	sceneData = data.map(function(datum) {
		return {
			date: datum.date,
			trips: datum.trips
		};
	});

	switch(opts.scene) {
		case 'intro':
			sceneData[0].trips = 0;
		break;
		case 'backToFirstDay':
			sceneData = data.map(function(datum, index) {
				return {
					date: datum.date,
					trips: index > 0 ? 0 : datum.trips
				};
			});
		break;
	}

	return sceneData;
}

function setScalesAndAxes(sceneData, opts) {

	// Set scales.
	x = d3.time.scale()
		.range([0, opts.dimensions.width]);

	y = d3.scale.linear()
		.range([opts.dimensions.height, 0])
		.domain([0, d3.max(sceneData, d => d.trips)]);

	// Custom x scales
	switch(opts.scene) {
		case 'intro':
		case 'firstDay':
		case 'backToFirstDay':
			x.domain(d3.extent(_.take(sceneData, 2), d => d.date));
		break;
		case 'allDays':
			x.domain(d3.extent(sceneData, d => d.date));
		break;
	}

	// Custom y scales
	switch(opts.scene) {
		case 'backToFirstDay':
			// y.domain([0, d3.max(_.take(sceneData, 1), d => d.trips)]);
		break;
	}

	// Set axes.
	xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom');

	yAxis = d3.svg.axis()
		.scale(y)
		.orient('left');
}

function draw(sceneData, opts) {

	var sceneData;

	var g = d3.select('g.trips-daily');

	// DATA JOIN
	// Join new data with old elements, if any.
	var rect = g.selectAll('rect')
		.data(sceneData, d => d.date);

	var barWidth;

	// Choose width of first bar
	switch(opts.scene) {
		case 'intro':
		case 'firstDay':
		case 'backToFirstDay':
			barWidth = widthOfFirstBar;
		break;
		case 'allDays':
			barWidth = x.range()[1] / sceneData.length;
		break;
	}

	// UPDATE
	// Update old elements as needed.
	switch(opts.scene) {
		case 'backToFirstDay':
			rect.attr('class', 'update')
				.transition()
				.duration(1500)
				.attr({
					height: d => opts.dimensions.height - y(d.trips),
					y: d => y(d.trips)
				})
				.transition()
				.duration(1500)
				.attr({
					x: d => x(d.date),
					width: barWidth
				});
		break;
		default:
			rect.attr('class', 'update')
				.transition()
				.duration(1500)
				.attr({
					x: d => x(d.date),
					height: d => opts.dimensions.height - y(d.trips),
					width: barWidth,
					y: d => y(d.trips)
				});
		break;
	}

	// ENTER
	// Create new elements as needed.
	rect.enter().append('rect')
		.attr({
			'class': 'enter',
			x: d => x(d.date),
			width: barWidth,
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

	var xAxisG = g.select('.x.axis');
	var yAxisG = g.select('.y.axis');

	xAxisG
		.transition()
		.duration(1500)
		.call(xAxis);

	yAxisG.call(yAxis);

}

// This runs when the user clicks a 'previous'/'next' button.
// It will do a couple of things and then will call draw().
function prepareToDraw(opts) {

	var sceneData = chooseData(opts);

	// Set scales.
	setScalesAndAxes(sceneData, opts);

	// Draw!
	draw(sceneData, opts);
}

module.exports = {
	draw: prepareToDraw,
	init: init
};