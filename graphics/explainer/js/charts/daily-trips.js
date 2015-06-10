var d3 = require('d3');

var MAGIC = {
	dark: '#d1d1c7',
	red: '#ea212d',
	singleBarWidth: 50
};

function databind() {

	var rects;

	if (!config.useCanvas) {

		// DATA JOINS
		rects = config.chart.selectAll('rect')
			.data(config.data, d => `${d.name}${d.date}`);

		// UPDATE
		rects.transition()
			.duration(config.duration)
			.attr(config.attributes)
			.style(config.style);

		// ENTER
		rects.enter().append('rect')
			.attr(config.attributes)
			.style(config.style);

	} else {

		// rects = opts.dataContainer.selectAll('custom.rect.daily-trips')
		// 	.data(data, d => `${d.name}${d.date}`);

		// // UPDATE
		// rects.transition()
		// 	.duration(opts.duration)
		// 	.attr(opts.attributes)
		// 	.attr({fillStyle: d => scales.color(d.name)});

		// // ENTER
		// rects.enter().append('custom')
		// 	.attr('class', 'rect daily-trips')
		// 	.attr(opts.attributes)
		// 	.attr({fillStyle: d => scales.color(d.name)});

	}

}

function setupScales() {
	config.scales.x = d3.time.scale().range([0, config.width]);
	config.scales.y = d3.scale.linear().range([config.height, 0]);
	config.scales.color = d3.scale.ordinal();
}

function setupAxes() {

	config.axes.x = d3.svg.axis()
		.scale(config.scales.x)
		.orient('bottom');

	config.axes.y = d3.svg.axis()
		.scale(config.scales.y)
		.orient('left');
}

function displayAxes() {

	// X X X X X X X X X X X X X X X X X X X X X X 
	var xAxisSelection = config.scene.select('g.x.axis')
		.transition()
		.duration(config.duration)
		.call(config.axes.x);

	// Fade it out
	xAxisSelection.attr({opacity: config.displayAxes.x ? 1 : 0});

	// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
	var yAxisSelection = config.scene.select('g.y.axis')
		.transition()
		.duration(config.duration)
		.call(config.axes.y);

	// Fade it out
	yAxisSelection.attr({opacity: config.displayAxes.y ? 1 : 0});
}

function draw() {
	databind();
	displayAxes();
}

function setup() {

	// Set various utility variables.
	config.svg = d3.select('svg.scenes');
	config.width = +config.svg.attr('_innerWidth');
	config.height = +config.svg.attr('_innerHeight');
	config.scene = config.svg.select('g.scene.daily-trips');
	config.chart = config.scene.select('g.chart');

	setupScales();
	setupAxes();

	// Get data keys to use in creating the color scale.
	var dataKeys = _.chain(config.data)
		.pluck('name')
		.uniq()
		.value();

	config.scales.color.domain(dataKeys);
}

var config = {
	svg: null,
	width: null,
	height: null,
	scene: null,
	chart: null,
	useCanvas: false,
	data: require('./../datasets.js').tripsPerDay,
	scales: { x: null, y: null },
	axes: { x: null, y: null },
	displayAxes: {
		x: true,
		y: true
	},
	attributes: {
		x: 0,
		width: 0,
		y: 0,
		height: 0
	},
	style: {
		fill: 'purple'
	},

};

var configuration = {
	'setup': function(opts) {

		config.duration = opts.duration;
		config.useCanvas = opts.useCanvas;
		config.dataContainer = opts.dataContainer;

		config.scales.x.domain(d3.extent(_.take(config.data, 4), d => d.date));
		config.scales.y.domain([0, 0]);
		config.scales.color.range([MAGIC.dark, MAGIC.dark]);

		config.attributes = {
			x: d => config.scales.x(d.date),
			width: MAGIC.singleBarWidth,
			y: d => config.scales.y(d.y1),
			height: d => config.scales.y(d.y0) - config.scales.y(d.y1)
		};

		config.style = {
			fill: d => config.scales.color(d.name)
		};

		config.displayAxes = { x: false, y: false };

		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 0});
	},
	'first-day': function(opts) {

		configuration['setup'](opts);

		config.displayAxes = { x: false, y: true };
		config.scales.y.domain([0, d3.max(_.take(config.data, 2), d => d.y1)]);
		config.axes.x
			.tickSize(0)
			.tickPadding(6);

		config.axes.y
			.tickValues([config.scales.y.domain()[1]])
			.tickSize(-config.width);

		config.axes.x.ticks(d3.time.months, 3).tickFormat(null);

		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 1});
		$('.x-axis-label span', '.daily-trips-labels').text('Bus trips');
	},
	'all-days': function(opts) {

		configuration['first-day'](opts);

		config.scales.x.domain(d3.extent(config.data, d => d.date));
		config.scales.y.domain([0, d3.max(config.data, d => d.y1)]);

		config.attributes.width = config.scales.x.range()[1] / (config.data.length/2);

		config.axes.y.tickValues([0, 500, 1000, config.scales.y.domain()[1]]);
		config.displayAxes.x = true;
	},
	'early-and-late': function(opts) {

		configuration['all-days'](opts);

		config.scales.color.range([MAGIC.dark, MAGIC.red]);
	},
	'late': function(opts) {

		configuration['early-and-late'](opts);

		// Get the highest number of late trips
		var maxLateTrips = _.chain(config.data)
			.filter({name: 'lateTrips'})
			.map(d => d.y1 - d.y0)
			.sortBy(d => d)
			.last()
			.value();
		config.scales.y.domain([0, maxLateTrips]);

		config.attributes.y = d => d.name === 'lateTrips' ?
			config.height - (config.scales.y(d.y0) - config.scales.y(d.y1)) :
			config.scales.y.range()[0];

		config.attributes.height = d => d.name === 'lateTrips' ?
			config.scales.y(d.y0) - config.scales.y(d.y1) :
			0;

		config.axes.y.tickValues([0, 200, 400, config.scales.y.domain()[1]]);

		$('.x-axis-label span', '.daily-trips-labels').text('Late bus trips');
	},
	'exit': function(opts) {

		configuration['setup'](opts);

		config.displayAxes.x = false;
		config.displayAxes.y = false;

		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 0});
	}
};

module.exports = {
	'type': 'svg',
	'draw': function(opts) {
		setTimeout(function() {
			setup();
			configuration[opts.scene](opts);
			draw();
		}, opts.delay);
	}
};