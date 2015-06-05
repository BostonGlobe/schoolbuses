var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

var data = require('./../datasets.js').lateTrips;

var dataContainer;
var svg;
var width;
var height;
var scene;
var chart;
var rects;

var scales = {
	x: d3.scale.linear(),
	y: d3.scale.linear(),
	color: d3.scale.ordinal()
};

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

var axes = {
	x: d3.svg.axis(),
	y: d3.svg.axis()
};

var red = '#ea212d';

module.exports = {
	'intro': function(opts) {
		dataContainer = opts.dataContainer;
		var duration = opts.duration;
		var useCanvas = opts.useCanvas;

		svg = d3.select('svg.scenes');
		width = +svg.attr('_innerWidth');
		height = +svg.attr('_innerHeight');
		scene = svg.select('g.scene.late-trips-histogram');
		chart = scene.select('g.chart');

		// Setup scales
		// Get the first day
		// var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
		// scales.x.range([0, 0]).domain([0, d3.max(firstDay, d => d.count)]);
		// scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

		var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
		scales.x.range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
		scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

		var attributes = {
			x: 0,
			width: d => scales.x(d.count),
			y: d => scales.y(d.lateMinutes),
			height: scales.y.range()[0]/scales.y.domain()[1]
		};

		// Setup axes
		axes.x.scale(scales.x)
			.orient('bottom');
		// axes.x.scale(scales.x)
		// 	.orient('bottom')
		// 	.tickSize(-height);
		axes.y.scale(scales.y)
			.orient('left')
			.tickPadding(-2);

		if (!useCanvas) {

			// DATA JOINS
			rects = chart.selectAll('rect')
				.data(firstDay, d => `${d.lateMinutes}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: red
				});

			// ENTER
			rects.enter().append('rect')
				.attr(attributes)
				.style({
					fill: red
				});

		} else {

			rects = dataContainer.selectAll('custom.rect.late-trips-histogram')
				.data(data, d => `${d.name}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.attr({fillStyle: 'red'});

			// ENTER
			rects.enter().append('custom')
				.attr('class', 'rect late-trips-histogram')
				.attr(attributes)
				.attr({fillStyle: 'red'});

		}

		// X X X X X X X X X X X X X X X X X X X X X X 
		var xAxisSelection = scene.select('g.x.axis')
			.transition()
			.duration(duration)
			.call(axes.x);
		// Fade it out
		xAxisSelection.attr({
				opacity: 1
			});

		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
		var yAxisSelection = scene.select('g.y.axis')
			.transition()
			.duration(duration)
			.call(axes.y);
		// Fade it out
		yAxisSelection.attr({
				opacity: 1
			});


	},
	'first-day': function(opts) {

		// Set x-axis label title and hide it
		$('.x-axis-label span').text('Minutes late');

		dataContainer = opts.dataContainer;
		var duration = opts.duration;
		var useCanvas = opts.useCanvas;

		// Setup scales
		var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
		scales.x.range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
		scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

		var attributes = {
			x: 0,
			width: d => scales.x(d.count),
			y: d => scales.y(d.lateMinutes),
			height: scales.y.range()[0]/scales.y.domain()[1]
		};

		if (!useCanvas) {

			// DATA JOINS
			rects = chart.selectAll('rect')
				.data(firstDay, d => `${d.lateMinutes}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: red
				});

			// ENTER
			rects.enter().append('rect')
				.attr(attributes)
				.style({
					fill: red
				});

		} else {

			rects = dataContainer.selectAll('custom.rect.late-trips-histogram')
				.data(data, d => `${d.name}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.attr({fillStyle: 'red'});

			// ENTER
			rects.enter().append('custom')
				.attr('class', 'rect late-trips-histogram')
				.attr(attributes)
				.attr({fillStyle: 'red'});

		}		

		// X X X X X X X X X X X X X X X X X X X X X X 
		var xAxisSelection = scene.select('g.x.axis')
			.transition()
			.duration(duration)
			.call(axes.x);
		// Fade it out
		xAxisSelection.attr({
				opacity: 1
			});

		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
		var yAxisSelection = scene.select('g.y.axis')
			.transition()
			.duration(duration)
			.call(axes.y);
		// Fade it in
		yAxisSelection.attr({
				opacity: 1
			});

	},
	'exit': function(opts) {
		dataContainer = opts.dataContainer;
		var duration = opts.duration;
		var useCanvas = opts.useCanvas;

		var attributes = {
			width: 0
		};

		if (!useCanvas) {

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: red
				});

		} else {

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.attr({fillStyle: 'red'});

		}		

		// X X X X X X X X X X X X X X X X X X X X X X 
		var xAxisSelection = scene.select('g.x.axis')
			.transition()
			.duration(duration)
			.call(axes.x);
		// Fade it out
		xAxisSelection.attr({
				opacity: 0
			});

		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
		var yAxisSelection = scene.select('g.y.axis')
			.transition()
			.duration(duration)
			.call(axes.y);
		// Fade it out
		yAxisSelection.attr({
				opacity: 0
			});
	
	}
};