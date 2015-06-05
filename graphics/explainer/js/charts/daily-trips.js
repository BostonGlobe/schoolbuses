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

function setupScales() {

	scales.x.range([0, width]);
	scales.y.range([height, 0]);

}

function setupAxes() {

	axes.x.scale(scales.x)
		.orient('bottom')
		.ticks(d3.time.days, 1)
		.tickFormat(d3.time.format('%A, %B %e'))
		.tickSize(0)
		.tickPadding(6);

	axes.y.scale(scales.y)
		.orient('left')
		.tickSize(-width);
}

function databind(opts) {

	if (!opts.useCanvas) {

		// DATA JOINS
		rects = chart.selectAll('rect')
			.data(data, d => `${d.name}${d.date}`);

		// UPDATE
		rects.transition()
			.duration(opts.duration)
			.attr(opts.attributes)
			.style({
				fill: d => scales.color(d.name)
			});

		// ENTER
		rects.enter().append('rect')
			.attr(opts.attributes)
			.style({
				fill: d => scales.color(d.name)
			});

	} else {

		rects = opts.dataContainer.selectAll('custom.rect.daily-trips')
			.data(data, d => `${d.name}${d.date}`);

		// UPDATE
		rects.transition()
			.duration(opts.duration)
			.attr(opts.attributes)
			.attr({fillStyle: d => scales.color(d.name)});

		// ENTER
		rects.enter().append('custom')
			.attr('class', 'rect daily-trips')
			.attr(opts.attributes)
			.attr({fillStyle: d => scales.color(d.name)});

	}

}

function displayAxes(opts) {

	// X X X X X X X X X X X X X X X X X X X X X X 
	var xAxisSelection = scene.select('g.x.axis')
		.transition()
		.duration(opts.duration)
		.call(axes.x);

	// Fade it out
	xAxisSelection.attr({opacity: opts.x.display ? 1 : 0});

	// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
	var yAxisSelection = scene.select('g.y.axis')
		.transition()
		.duration(opts.duration)
		.call(axes.y);

	// Fade it out
	yAxisSelection.attr({opacity: opts.y.display ? 1 : 0});

}

module.exports = {
	'intro': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

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

		setupScales();
		scales.x.domain(d3.extent(_.take(data, 4), d => d.date));
		scales.y.domain([0, 0]);
		scales.color.range([dark, dark]).domain(dataKeys);

		setupAxes();

		var attributes = {
			x: d => scales.x(d.date),
			width: singleBarWidth,
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

		displayAxes({
			duration,
			x: { display: false },
			y: { display: false }
		});

		// Set x-axis label title and hide it
		$('.x-axis-label span').text('Bus trips');
		$('.x-axis-label').removeClass('fadedIn');
	},

	'first-day': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

		setupScales();
		scales.x.domain(d3.extent(_.take(data, 4), d => d.date));
		scales.y.domain([0, d3.max(_.take(data, 2), d => d.y1)]);
		scales.color.range([dark, dark]);

		setupAxes();
		axes.x.ticks(d3.time.months, 3).tickFormat(null);
		axes.y.tickValues([scales.y.domain()[1]]);

		var attributes = {
			x: d => scales.x(d.date),
			width: singleBarWidth,
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

		displayAxes({
			duration,
			x: { display: false },
			y: { display: true }
		});

		// Show y-axis title
		$('.x-axis-label').addClass('fadedIn');
	},

	'all-days': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

		setupScales();
		scales.x.domain(d3.extent(data, d => d.date));
		scales.y.domain([0, d3.max(data, d => d.y1)]);
		scales.color.range([dark, dark]);

		setupAxes();
		axes.x.ticks(d3.time.months, 3).tickFormat(null);
		axes.y.tickValues([0, 500, 1000, scales.y.domain()[1]]);

		var attributes = {
			x: d => scales.x(d.date),
			width: scales.x.range()[1] / (data.length/2),
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

		displayAxes({
			duration,
			x: { display: true },
			y: { display: true }
		});

	},

	'early-and-late': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

		setupScales();
		scales.x.domain(d3.extent(data, d => d.date));
		scales.y.domain([0, d3.max(data, d => d.y1)]);
		scales.color.range([dark, red]);

		setupAxes();
		axes.x.ticks(d3.time.months, 3).tickFormat(null);
		axes.y.tickValues([0, 500, 1000, scales.y.domain()[1]]);

		var attributes = {
			x: d => scales.x(d.date),
			width: scales.x.range()[1] / (data.length/2),
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

		$('.x-axis-label span').text('Bus trips');

		displayAxes({
			duration,
			x: { display: true },
			y: { display: true }
		});
	},

	'late': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

		// Set the y-axis title
		$('.x-axis-label span').text('Late bus trips');

		// Get the highest number of late trips
		var maxLateTrips = _.chain(data)
			.filter({name: 'lateTrips'})
			.map(d => d.y1 - d.y0)
			.sortBy(d => d)
			.last()
			.value();

		setupScales();
		scales.x.domain(d3.extent(data, d => d.date));
		scales.y.domain([0, maxLateTrips]);
		scales.color.range([dark, red]);

		// Setup axes
		setupAxes();
		axes.x.ticks(d3.time.months, 3).tickFormat(null);
		axes.y.tickValues([0, 200, 400, scales.y.domain()[1]]);

		var attributes = {
			x: d => scales.x(d.date),
			width: scales.x.range()[1] / (data.length/2),
			y: d => d.name === 'lateTrips' ?
				height - (scales.y(d.y0) - scales.y(d.y1)) :
				scales.y.range()[0],
			height: d => d.name === 'lateTrips' ?
				scales.y(d.y0) - scales.y(d.y1) :
				0
			};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

		displayAxes({
			duration,
			x: { display: true },
			y: { display: true }
		});

	},

	'exit': function(opts) {

		dataContainer = opts.dataContainer;
		var duration = opts.duration || 500;
		var useCanvas = opts.useCanvas;

		// Setup scales
		// scales.x.domain(d3.extent(data, d => d.date));
		setupScales();
		scales.y.domain([0, 0]);
		// scales.color.range([dark, red]);

		// // Setup axes
		// axes.x.ticks(d3.time.months, 3)
		// 	.tickFormat(null);
		// axes.y.tickValues([0, 200, 400, scales.y.domain()[1]]);

		var attributes = {
			// x: d => scales.x(d.date),
			// width: scales.x.range()[1] / (data.length/2),
			y: d => d.name === 'lateTrips' ?
				height - (scales.y(d.y0) - scales.y(d.y1)) :
				scales.y.range()[0],
			height: d => d.name === 'lateTrips' ?
				scales.y(d.y0) - scales.y(d.y1) :
				0
			};

		databind({
			dataContainer,
			duration,
			useCanvas,
			attributes
		});

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