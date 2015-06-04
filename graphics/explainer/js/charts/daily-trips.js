var d3 = require('d3');

var data = require('./../datasets.js').tripsPerDay;

var dataContainer;
var svg;
var width;
var height;
var scene;
var chart;
var rects;

var scales = {
	x: d3.time.scale(),
	y: d3.scale.linear(),
	color: d3.scale.ordinal()
};

var axes = {
	x: d3.svg.axis(),
	y: d3.svg.axis()
};

var dark = '#d1d1c7';
var red = '#ea212d';

var singleBarWidth = 50;

module.exports = {
	'intro': function(duration = 500, _dataContainer, useCanvas) {

		dataContainer = _dataContainer;

		svg = d3.select('svg.scenes');
		width = +svg.attr('_innerWidth');
		height = +svg.attr('_innerHeight');
		scene = svg.select('g.scene.daily-trips');
		chart = scene.select('g.chart');

		// Get data keys
		var dataKeys = _.chain(data)
			.pluck('name')
			.uniq()
			.value();

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(_.take(data, 4), d => d.date));
		scales.y.range([height, 0]).domain([0, 0]);
		scales.color.range([dark, dark]).domain(dataKeys);

		// Setup axes
		axes.x.scale(scales.x)
			.orient('bottom')
			.ticks(d3.time.days, 1)
			.tickFormat(d3.time.format('%A, %B %e'))
			.tickSize(0)
			.tickPadding(6);
		axes.y.scale(scales.y)
			.orient('left')
			.tickSize(-width);

		var attributes = {
			x: d => scales.x(d.date),
			width: singleBarWidth,
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		if (!useCanvas) {

			// DATA JOINS
			rects = chart.selectAll('rect')
				.data(data, d => `${d.name}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

			// ENTER
			rects.enter().append('rect')
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			rects = dataContainer.selectAll('custom.rect.dailyTrips')
				.data(data, d => `${d.name}${d.date}`);

			// UPDATE
			rects.transition()
				.duration(duration)
				.attr(attributes)
				.attr({fillStyle: d => scales.color(d.name)});

			// ENTER
			rects.enter().append('custom')
				.attr('class', 'rect dailyTrips')
				.attr(attributes)
				.attr({fillStyle: d => scales.color(d.name)});

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
		// Hide domain
		xAxisSelection.select('path.domain')
			.attr({
				opacity: 0
			});
		// Shift tick texts to bar center
		xAxisSelection.selectAll('.tick text')
			.attr({
				transform: `translate(${singleBarWidth/2}, 0)`
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

		// Set x-axis label title and hide it
		$('.x-axis-label span').text('Bus trips');
		$('.x-axis-label').removeClass('fadedIn');
	},

	'first-day': function(duration = 500, useCanvas) {

		// Show y-axis title
		$('.x-axis-label').addClass('fadedIn');

		// Setup scales
		scales.x.domain(d3.extent(_.take(data, 4), d => d.date));
		scales.y.domain([0, d3.max(_.take(data, 2), d => d.y1)]);
		scales.color.range([dark, dark]);

		// Setup axes
		axes.x.ticks(d3.time.months, 3)
			.tickFormat(null);
		axes.y.tickValues([scales.y.domain()[1]]);

		if (!useCanvas) {

			// UPDATE bars
			rects.transition()
				.duration(duration)
				.attr({
					x: d => scales.x(d.date),
					width: singleBarWidth,
					y: d => scales.y(d.y1),
					height: d => scales.y(d.y0) - scales.y(d.y1)
				})
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			// UPDATE bars
			rects.transition()
				.duration(duration)
				.attr({
					x: d => scales.x(d.date),
					width: singleBarWidth,
					y: d => scales.y(d.y1),
					height: d => scales.y(d.y0) - scales.y(d.y1),
					fillStyle: d => scales.color(d.name)
				});

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
		// Fade it in
		yAxisSelection.attr({
				opacity: 1
			});
	}
};