function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

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
			.data(config.data, d => `${d.count}|${d.lateMinutes}|${d.date}`);

		// UPDATE
		rects.transition()
			.duration(config.duration)
			.delay((d, i) => i * 50)
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
	config.scales.x = d3.scale.ordinal().rangeRoundBands([0, config.width], 0.1, 1);
	config.scales.y = d3.scale.ordinal().rangeRoundBands([config.height, 0], 0.1, 1);
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
	config.scene = config.svg.select('g.scene.late-trips-histogram');
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
	data: _.take(require('./../datasets.js').lateTripsFirstDay, 7*7),
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
	'intro': function(opts) {

		config.duration = opts.duration;
		config.useCanvas = opts.useCanvas;
		config.dataContainer = opts.dataContainer;

		// What do I want to do here?
		// I want to make a square. So, I want to layout all these blocks
		// in a square grid. In order to do that, take the upper square.
		// So if 648, square root, go one up, square, use that as the size
		// of the square.

		// BUT: still set the domain to x: count, y: minutes
		var xExtent = d3.extent(config.data, d => d.count);
		config.scales.x.domain(d3.range(xExtent[0], xExtent[1] + 1));

		var yExtent = d3.extent(config.data, d => d.lateMinutes);
		config.scales.y.domain(d3.range(yExtent[0], yExtent[1] + 1));

		log(config.scales.x.domain())
		log(config.scales.x.range())
		log(config.scales.y.domain())
		log(config.scales.y.range())

		// Now we need to place all those squares in the right place.
		// Figure out the dimension first.
		var cardinality = Math.ceil(Math.sqrt(config.data.length));
		var dimension = (Math.min(config.scales.x.rangeExtent()[1], config.scales.y.rangeExtent()[1]) / cardinality) * 0.5;

		config.attributes = {
			x: (d, i) => (i % cardinality) * dimension,
			width: dimension,
			y: (d, i) => (Math.floor(i/cardinality)) * dimension,
			height: dimension
		};

		config.style = {
			stroke: 'black',
			fill: 'grey'
		};



		// SO: 





		// config.scales.x.domain(d3.extent(config.data, d => d.count));
		// config.scales.y.domain(d3.extent(config.data, d => d.lateMinutes));



		// log(config.data.length);


		// log(config.height);
		// log(config.width);

		// var areaOfRectangle = config.width*config.height;
		// var areaOfSquare = areaOfRectangle/config.data.length;
		// var dimensionOfSquare = Math.sqrt(areaOfSquare);

		// config.attributes = {
		// 	width: dimensionOfSquare,
		// 	height: dimensionOfSquare,
		// 	x: function(d, i) {
		// 		return 0;
		// 	},
		// 	y: function(d, i) {
		// 		return 0;
		// 	},
		// }

		// var W = config.width;
		// var N = config.data.length;
		// var H = config.height;
		// var C0 = Math.sqrt((W * N)/H);
		// var R0 = Math.sqrt((H * N)/W);

		// var solution1 = {d1: C0, d2: N/C0};
		// var solution2 = {d1: N/R0, d2: R0};

		// log(solution1);
		// log(solution2);

















		// log(`Area of rectangle is ${config.width} X ${config.height} = ${areaOfRectangle}`);
		// log(`Area of square is ${areaOfRectangle}/${config.data.length} = ${areaOfSquare}`);
		// log(`Dimension of square is ${dimensionOfSquare}`);

		// config.attributes = {
		// 	x: 0,

		// };

// 		// var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
// 		// scales.x.range([0, 0]).domain([0, d3.max(firstDay, d => d.count)]);
// 		// scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

// 		var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
// 		scales.x.range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
// 		scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

// 		var attributes = {
// 			x: 0,
// 			width: d => scales.x(d.count),
// 			y: d => scales.y(d.lateMinutes),
// 			height: scales.y.range()[0]/scales.y.domain()[1]
// 		};

		// config.scales.x.domain(d3.extent(_.take(config.data, 4), d => d.date));
		// config.scales.y.domain([0, 0]);
		// config.scales.color.range([MAGIC.dark, MAGIC.dark]);

		// config.style = {
		// 	fill: d => config.scales.color(d.name)
		// };

		// config.displayAxes = { x: false, y: false };
	},

	'first-day-setup': function(opts) {

		configuration['intro'](opts);

		var cardinality = Math.ceil(Math.sqrt(config.data.length));
		var dimension = (Math.min(config.scales.x.rangeExtent()[1], config.scales.y.rangeExtent()[1]) / cardinality) * 0.5;

		config.attributes.x = function(d, i) {

			// If we're on the first minute, use regular scales
			if (d.lateMinutes === 1) {
				return config.scales.x(d.count);
			} else {
				return (i % cardinality) * dimension;
			}

		};

		config.attributes.width = function(d, i) {

			// If we're on the first minute, use regular scales
			if (d.lateMinutes === 1) {
				return config.scales.x.rangeBand();
			} else {
				return dimension;
			}

		};

		config.attributes.y = function(d, i) {

			// If we're on the first minute, use regular scales
			if (d.lateMinutes === 1) {
				return config.scales.y(d.lateMinutes);
			} else {
				return (Math.floor(i/cardinality)) * dimension;
			}

		};

		config.attributes.height = function(d, i) {

			// If we're on the first minute, use regular scales
			if (d.lateMinutes === 1) {
				return config.scales.y.rangeBand();
			} else {
				return dimension;
			}

		};






		// config.attributes = {
		// 	x: function(d, i) {

		// 		// If we're on the first minute, use regular scales
		// 		if (d.lateMinutes === 1) {
		// 			return config.scales.x(d.count);
		// 		} else {
		// 			return (i % cardinality) * dimension;
		// 		}
		// 	},
		// 	width: function(d, i) {

		// 		// If we're on the first minute, use regular scales
		// 		if (d.lateMinutes === 1) {
		// 			return config.scales.x.range()[1]/config.scales.x.domain()[1];
		// 		} else {
		// 			return dimension;
		// 		}
		// 	},
		// 	y: function(d, i) {

		// 		// If we're on the first minute, use regular scales
		// 		if (d.lateMinutes === 1) {
		// 			return config.scales.y(d.lateMinutes);
		// 		} else {
		// 			return (Math.floor(i/cardinality)) * dimension;
		// 		}
		// 	},
		// 	// y: (d, i) => (Math.floor(i/cardinality)) * dimension,
		// 	height: dimension
		// };

		// // BUT: still set the domain to x: count, y: minutes
		// config.scales.x.domain(d3.extent(config.data, d => d.count));
		// config.scales.y.domain(d3.extent(config.data, d => d.lateMinutes));

		// // Now we need to place all those squares in the right place.
		// // Figure out the dimension first.
		// var cardinality = Math.ceil(Math.sqrt(config.data.length));
		// var dimension = (Math.min(config.scales.x.range()[1], config.scales.y.range()[0]) / cardinality) * 0.5;

		// config.attributes = {
		// 	x: (d, i) => (i % cardinality) * dimension,
		// 	width: dimension,
		// 	y: (d, i) => (Math.floor(i/cardinality)) * dimension,
		// 	height: dimension
		// };

		// config.style = {
		// 	stroke: 'black',
		// 	fill: 'grey'
		// };


	},

	'first-day-first-minute': function(opts) {

		configuration['first-day-setup'](opts);

	},

	'exit': function(opts) {

		configuration['intro'](opts);

	}
};

module.exports = function(opts) {
	setup();
	configuration[opts.scene](opts);
	draw();
};





















































// var d3 = require('d3');


// var data = require('./../datasets.js').lateTrips;

// var dataContainer;
// var svg;
// var width;
// var height;
// var scene;
// var chart;
// var rects;

// var scales = {
// 	x: d3.scale.linear(),
// 	y: d3.scale.linear(),
// 	color: d3.scale.ordinal()
// };

// function log(s) {
// 	console.log(JSON.stringify(s, null, 4));
// }

// var axes = {
// 	x: d3.svg.axis(),
// 	y: d3.svg.axis()
// };

// var red = '#ea212d';

// module.exports = {
// 	'intro': function(opts) {
// 		dataContainer = opts.dataContainer;
// 		var duration = opts.duration;
// 		var useCanvas = opts.useCanvas;

// 		svg = d3.select('svg.scenes');
// 		width = +svg.attr('_innerWidth');
// 		height = +svg.attr('_innerHeight');
// 		scene = svg.select('g.scene.late-trips-histogram');
// 		chart = scene.select('g.chart');

// 		// Setup scales
// 		// Get the first day
// 		// var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
// 		// scales.x.range([0, 0]).domain([0, d3.max(firstDay, d => d.count)]);
// 		// scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

// 		var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
// 		scales.x.range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
// 		scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

// 		var attributes = {
// 			x: 0,
// 			width: d => scales.x(d.count),
// 			y: d => scales.y(d.lateMinutes),
// 			height: scales.y.range()[0]/scales.y.domain()[1]
// 		};

// 		// Setup axes
// 		axes.x.scale(scales.x)
// 			.orient('bottom');
// 		// axes.x.scale(scales.x)
// 		// 	.orient('bottom')
// 		// 	.tickSize(-height);
// 		axes.y.scale(scales.y)
// 			.orient('left')
// 			.tickPadding(-2);

// 		if (!useCanvas) {

// 			// DATA JOINS
// 			rects = chart.selectAll('rect')
// 				.data(firstDay, d => `${d.lateMinutes}${d.date}`);

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.style({
// 					fill: red
// 				});

// 			// ENTER
// 			rects.enter().append('rect')
// 				.attr(attributes)
// 				.style({
// 					fill: red
// 				});

// 		} else {

// 			rects = dataContainer.selectAll('custom.rect.late-trips-histogram')
// 				.data(data, d => `${d.name}${d.date}`);

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.attr({fillStyle: 'red'});

// 			// ENTER
// 			rects.enter().append('custom')
// 				.attr('class', 'rect late-trips-histogram')
// 				.attr(attributes)
// 				.attr({fillStyle: 'red'});

// 		}

// 		// X X X X X X X X X X X X X X X X X X X X X X 
// 		var xAxisSelection = scene.select('g.x.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.x);
// 		// Fade it out
// 		xAxisSelection.attr({
// 				opacity: 1
// 			});

// 		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
// 		var yAxisSelection = scene.select('g.y.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.y);
// 		// Fade it out
// 		yAxisSelection.attr({
// 				opacity: 1
// 			});


// 	},
// 	'first-day': function(opts) {

// 		// Set x-axis label title and hide it
// 		$('.x-axis-label span').text('Minutes late');

// 		dataContainer = opts.dataContainer;
// 		var duration = opts.duration;
// 		var useCanvas = opts.useCanvas;

// 		// Setup scales
// 		var firstDay = _.filter(data, {date: parseDate('2013-09-04').getTime()});
// 		scales.x.range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
// 		scales.y.range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

// 		var attributes = {
// 			x: 0,
// 			width: d => scales.x(d.count),
// 			y: d => scales.y(d.lateMinutes),
// 			height: scales.y.range()[0]/scales.y.domain()[1]
// 		};

// 		if (!useCanvas) {

// 			// DATA JOINS
// 			rects = chart.selectAll('rect')
// 				.data(firstDay, d => `${d.lateMinutes}${d.date}`);

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.style({
// 					fill: red
// 				});

// 			// ENTER
// 			rects.enter().append('rect')
// 				.attr(attributes)
// 				.style({
// 					fill: red
// 				});

// 		} else {

// 			rects = dataContainer.selectAll('custom.rect.late-trips-histogram')
// 				.data(data, d => `${d.name}${d.date}`);

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.attr({fillStyle: 'red'});

// 			// ENTER
// 			rects.enter().append('custom')
// 				.attr('class', 'rect late-trips-histogram')
// 				.attr(attributes)
// 				.attr({fillStyle: 'red'});

// 		}		

// 		// X X X X X X X X X X X X X X X X X X X X X X 
// 		var xAxisSelection = scene.select('g.x.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.x);
// 		// Fade it out
// 		xAxisSelection.attr({
// 				opacity: 1
// 			});

// 		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
// 		var yAxisSelection = scene.select('g.y.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.y);
// 		// Fade it in
// 		yAxisSelection.attr({
// 				opacity: 1
// 			});

// 	},
// 	'exit': function(opts) {
// 		dataContainer = opts.dataContainer;
// 		var duration = opts.duration;
// 		var useCanvas = opts.useCanvas;

// 		var attributes = {
// 			width: 0
// 		};

// 		if (!useCanvas) {

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.style({
// 					fill: red
// 				});

// 		} else {

// 			// UPDATE
// 			rects.transition()
// 				.duration(duration)
// 				.attr(attributes)
// 				.attr({fillStyle: 'red'});

// 		}		

// 		// X X X X X X X X X X X X X X X X X X X X X X 
// 		var xAxisSelection = scene.select('g.x.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.x);
// 		// Fade it out
// 		xAxisSelection.attr({
// 				opacity: 0
// 			});

// 		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
// 		var yAxisSelection = scene.select('g.y.axis')
// 			.transition()
// 			.duration(duration)
// 			.call(axes.y);
// 		// Fade it out
// 		yAxisSelection.attr({
// 				opacity: 0
// 			});
	
// 	}
// };