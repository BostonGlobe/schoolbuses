var d3 = require('d3');

var datasets = require('./datasets.js');

var svg;
var width;
var height;
var scene;
var chart;
var dailyTripsRectangles;
var dailyTripsRectanglesCanvas;
var firstDayRectangles;
var dataKeys;
var dataContainer;
var useCanvas = true;

var axes = {
	x: d3.svg.axis(),
	y: d3.svg.axis()
};

var singleBarWidth = 50;

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

var dark = '#d1d1c7';
var red = '#ea212d';

module.exports = {

	'intro': function(duration = 1500, _dataContainer) {

		dataContainer = _dataContainer;

		svg = d3.select('svg.scenes');
		width = +svg.attr('_innerWidth');
		height = +svg.attr('_innerHeight');
		scene = svg.select('g.scene');
		chart = scene.select('g.chart');

		// Get data keys
		dataKeys = _.chain(datasets.tripsPerDay)
			.pluck('name')
			.uniq()
			.value();

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		scales.x.range([0, width]).domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		scales.y.range([height, 0]).domain([0, 0]);
		// scales.x.range([0, width]).domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		// scales.y.range([height, 0]).domain([0, d3.max(_.take(datasets.tripsPerDay, 2), d => d.y1)]);
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

		// DATA JOINS
		if (!useCanvas) {

			dailyTripsRectangles = chart.selectAll('rect')
				.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

			var attributes = {
				x: d => scales.x(d.date),
				width: singleBarWidth,
				y: d => scales.y(d.y1),
				height: d => scales.y(d.y0) - scales.y(d.y1)
			};

			// UPDATE
			dailyTripsRectangles.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

			// ENTER
			dailyTripsRectangles.enter().append('rect')
				.attr('class', 'enter')
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			dailyTripsRectanglesCanvas = dataContainer.selectAll('custom.rect')
				.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

			var attributesCanvas = {
				x: d => scales.x(d.date),
				width: singleBarWidth,
				y: d => scales.y(d.y1),
				height: d => scales.y(d.y0) - scales.y(d.y1),
				fillStyle: d => scales.color(d.name)
			};

			// UPDATE
			dailyTripsRectanglesCanvas.transition()
				.duration(duration)
				.attr(attributesCanvas);

			// ENTER
			dailyTripsRectanglesCanvas.enter().append('custom')
				.attr('class', 'rect')
				.attr(attributesCanvas);

		}

		// // TODO: don't use magic string here
		// firstDayRectangles = chart.selectAll('rect.firstDay')
		// 	.data(_.take(datasets.allLateTrips, 648), d => `${d.index}${d.date}`);

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

		// Hide x-axis label
		$('.x-axis-label').removeClass('fadedIn');
	},

	'trips-per-day-first-day': function(duration = 5000) {

		// Set the y-axis title
		$('.x-axis-label span').text('Bus trips');
		$('.x-axis-label').addClass('fadedIn');

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		scales.y.range([height, 0]).domain([0, d3.max(_.take(datasets.tripsPerDay, 2), d => d.y1)]);
		scales.color.range([dark, dark]).domain(dataKeys);

		// Setup axes
		axes.x.scale(scales.x)
			.ticks(d3.time.months, 3)
			.tickFormat(null);
		axes.y.scale(scales.y)
			.tickValues([scales.y.domain()[1]]);

		if (!useCanvas) {

			// UPDATE bars
			dailyTripsRectangles.transition()
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
			dailyTripsRectanglesCanvas.transition()
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
	},

	'trips-per-day-all-days': function(duration = 4500) {

		// Set the y-axis title
		$('.x-axis-label span').text('Bus trips');
		$('.x-axis-label').addClass('fadedIn');

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(datasets.tripsPerDay, d => d.date));
		scales.y.range([height, 0]).domain([0, d3.max(datasets.tripsPerDay, d => d.y1)]);
		scales.color.range([dark, dark]).domain(dataKeys);

		// Setup axes
		axes.x.scale(scales.x)
			.ticks(d3.time.months, 3)
			.tickFormat(null);
		axes.y.scale(scales.y)
			.tickValues([0, 500, 1000, scales.y.domain()[1]]);

		if (!useCanvas) {

			// UPDATE
			dailyTripsRectangles.transition()
				.duration(duration)
				.attr('class', 'update')
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
					y: d => scales.y(d.y1),
					height: d => scales.y(d.y0) - scales.y(d.y1)
				})
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			dailyTripsRectanglesCanvas.transition()
				.duration(duration)
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
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
		// Fade it in
		xAxisSelection.attr({
				opacity: 1
			});
		// Show domain
		xAxisSelection.select('path.domain')
			.attr({
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

	'trips-per-day-early-and-late': function(duration = 1000) {

		// Set the y-axis title
		$('.x-axis-label span').text('Bus trips');
		$('.x-axis-label').addClass('fadedIn');

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(datasets.tripsPerDay, d => d.date));
		scales.y.range([height, 0]).domain([0, d3.max(datasets.tripsPerDay, d => d.y1)]);
		scales.color.range([dark, red]).domain(dataKeys);

		// Setup axes
		axes.x.scale(scales.x)
			.ticks(d3.time.months, 3)
			.tickFormat(null);
		axes.y.scale(scales.y)
			.tickValues([0, 500, 1000, scales.y.domain()[1]]);

		if (!useCanvas) {

			// UPDATE
			dailyTripsRectangles.transition()
				.duration(duration)
				.attr('class', 'update')
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
					y: d => scales.y(d.y1),
					height: d => scales.y(d.y0) - scales.y(d.y1)
				})
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			// UPDATE
			dailyTripsRectanglesCanvas.transition()
				.duration(duration)
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
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
		// Fade it in
		xAxisSelection.attr({
				opacity: 1
			});
		// Show domain
		xAxisSelection.select('path.domain')
			.attr({
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

	'trips-per-day-late': function(duration = 3000) {

		// Set the y-axis title
		$('.x-axis-label span').text('Late bus trips');
		$('.x-axis-label').addClass('fadedIn');

		// Get the highest number of late trips
		var maxLateTrips = _.chain(datasets.tripsPerDay)
			.filter({name: 'lateTrips'})
			.map(d => d.y1 - d.y0)
			.sortBy(d => d)
			.last()
			.value();

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(datasets.tripsPerDay, d => d.date));
		scales.y.range([height, 0]).domain([0, maxLateTrips]);
		scales.color.range([dark, red]).domain(dataKeys);

		// Setup axes
		axes.x.scale(scales.x)
			.ticks(d3.time.months, 3)
			.tickFormat(null);
		axes.y.scale(scales.y)
			.tickValues([0, 200, 400, scales.y.domain()[1]]);

		if (!useCanvas) {

			// UPDATE
			dailyTripsRectangles.transition()
				.duration(duration)
				.attr('class', 'update')
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
					y: d => d.name === 'lateTrips' ?
						height - (scales.y(d.y0) - scales.y(d.y1)) :
						scales.y.range()[0],
					height: d => d.name === 'lateTrips' ?
						scales.y(d.y0) - scales.y(d.y1) :
						0
				})
				.style({
					fill: d => scales.color(d.name)
				});

		} else {

			// UPDATE
			dailyTripsRectanglesCanvas.transition()
				.duration(duration)
				.attr({
					x: d => scales.x(d.date),
					width: scales.x.range()[1] / (datasets.tripsPerDay.length/2),
					y: d => d.name === 'lateTrips' ?
						height - (scales.y(d.y0) - scales.y(d.y1)) :
						scales.y.range()[0],
					height: d => d.name === 'lateTrips' ?
						scales.y(d.y0) - scales.y(d.y1) :
						0,
					fillStyle: d => scales.color(d.name)
				});

		}

		// X X X X X X X X X X X X X X X X X X X X X X 
		var xAxisSelection = scene.select('g.x.axis')
			.transition()
			.duration(duration)
			.call(axes.x);
		// Fade it in
		xAxisSelection.attr({
				opacity: 1
			});
		// Show domain
		xAxisSelection.select('path.domain')
			.attr({
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

	'late-trips-first-day': function(duration = 1500) {

		// We need to arrange all these dots into a square.
		// But what shape? We can determine that by figuring out
		// what shape we'll be drawing to.

		// Get the first day of late trips (for now). TODO.
		var data = _.take(datasets.allLateTrips, 648);

		// Group trips by how late they were.
		var buckets = _.chain(data)
			.countBy('lateMinutes')
			.map(function(v, i) {
				return {
					length: v,
					lateMinutes: i
				}
			})
			// .sortBy('length')
			.value();

		// var maxBucket = _.last(buckets).length;

		// Setup scales
		var scales = {
			x: d3.scale.linear(),
			y: d3.scale.linear()
			// ,
			// color: d3.scale.ordinal()
		};

		scales.x.domain([0, d3.max(buckets, d => d.length)]);
		scales.y.domain([0, d3.max(data, d => d.lateMinutes)]);

		// Now we have the shape.
		// Next, we'll lay out all the squares on a column that's
		// 96 tall. We'll keep filling the 















		// debugger;
		// scales.color.range([dark, dark]).domain(dataKeys);

		// ENTER
		firstDayRectangles.enter().append('rect')
			.attr('class', 'enter');






		// UPDATE
		// firstDayRectangles.transition()
		// 	.duration(duration)
		// 	.attr(attributes)
		// 	.style({
		// 		fill: d => scales.color(d.name)
		// 	});




		// svg = d3.select('svg.scenes');
		// width = +svg.attr('_innerWidth');
		// height = +svg.attr('_innerHeight');
		// scene = svg.select('g.scene');
		// chart = scene.select('g.chart');

		// // Get data keys
		// dataKeys = _.chain(datasets.tripsPerDay)
		// 	.pluck('name')
		// 	.uniq()
		// 	.value();

		// // Setup scales
		// scales.x.range([0, width]).domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		// scales.y.range([height, 0]).domain([0, 0]);
		// scales.color.range([dark, dark]).domain(dataKeys);

		// // Setup axes
		// axes.x.scale(scales.x)
		// 	.orient('bottom')
		// 	.ticks(d3.time.days, 1)
		// 	.tickFormat(d3.time.format('%A, %B %e'))
		// 	.tickSize(0)
		// 	.tickPadding(6);
		// axes.y.scale(scales.y)
		// 	.orient('left')
		// 	.tickSize(-width);

		// // DATA JOIN
		// dailyTripsRectangles = chart.selectAll('rect')
		// 	.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

		// var attributes = {
		// 	x: d => scales.x(d.date),
		// 	width: singleBarWidth,
		// 	y: d => scales.y(d.y1),
		// 	height: d => scales.y(d.y0) - scales.y(d.y1)
		// };

		// // UPDATE
		// dailyTripsRectangles.transition()
		// 	.duration(duration)
		// 	.attr(attributes)
		// 	.style({
		// 		fill: d => scales.color(d.name)
		// 	});

		// // ENTER
		// dailyTripsRectangles.enter().append('rect')
		// 	.attr('class', 'enter')
		// 	.attr(attributes)
		// 	.style({
		// 		fill: d => scales.color(d.name)
		// 	});

		// // X X X X X X X X X X X X X X X X X X X X X X 
		// var xAxisSelection = scene.select('g.x.axis')
		// 	.transition()
		// 	.duration(duration)
		// 	.call(axes.x);
		// // Fade it out
		// xAxisSelection.attr({
		// 		opacity: 0
		// 	});
		// // Hide domain
		// xAxisSelection.select('path.domain')
		// 	.attr({
		// 		opacity: 0
		// 	});
		// // Shift tick texts to bar center
		// xAxisSelection.selectAll('.tick text')
		// 	.attr({
		// 		transform: `translate(${singleBarWidth/2}, 0)`
		// 	});

		// // Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
		// var yAxisSelection = scene.select('g.y.axis')
		// 	.transition()
		// 	.duration(duration)
		// 	.call(axes.y);
		// // Fade it out
		// yAxisSelection.attr({
		// 		opacity: 0
		// 	});

		// // Hide x-axis label
		// $('.x-axis-label').removeClass('fadedIn');		
	}

};
























































	// 'intros': function() {

	// 	svg = d3.select('svg.scenes');
	// 	width = +svg.attr('width');
	// 	height = +svg.attr('height');
	// 	scene = svg.select('g.scene');

	// 	// Get data keys
	// 	var dataKeys = _.chain(datasets.tripsPerDay)
	// 		.pluck('name')
	// 		.uniq()
	// 		.value();

	// 	// Setup scales
	// 	scales.x
	// 		.range([0, width])
	// 		.domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));

	// 	scales.y
	// 		.range([height, 0])
	// 		.domain([0, d3.max(datasets.tripsPerDay, d => d.y1)]);

	// 	scales.color
	// 		.range([red, '#0000FF'])
	// 		.domain(dataKeys);

	// 	// DATA JOIN
	// 	dailyTripsRectangles = scene.selectAll('rect')
	// 		.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

	// 	// UPDATE
	// 	dailyTripsRectangles.transition()
	// 		.duration(duration)
	// 		.attr({
	// 			x: d => scales.x(d.date),
	// 			width: singleBarWidth,
	// 			y: function(d) {
	// 				return scales.y(d.y1);
	// 			},
	// 			height: d => scales.y(d.y0) - scales.y(d.y1)
	// 		});

	// 	// ENTER
	// 	dailyTripsRectangles.enter().append('rect')
	// 		.attr('class', 'enter')
	// 		.attr({
	// 			x: d => scales.x(d.date),
	// 			width: 100,
	// 			y: function(d) {
	// 				return scales.y(d.y1);
	// 			},
	// 			height: d => scales.y(d.y0) - scales.y(d.y1)
	// 		})
	// 		.style({
	// 			fill: d => scales.color(d.name)
	// 		});
	// },

			// .style({
			// 	fill: d => scales.color(d.name)
			// });


