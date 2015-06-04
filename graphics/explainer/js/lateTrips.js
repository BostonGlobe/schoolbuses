var d3 = require('d3');

var datasets = require('./datasets.js');

var svg;
var width;
var height;
var scene;
var chart;
var dailyTripsRectangles;
var dailyTripsRectanglesCanvas;
var lateTripsCircles;
var lateTripsRectangles;
var dataKeys;
var dataContainer;
var useCanvas = false;

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

var quickDuration = 500;

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

		// DATA JOINS
		if (!useCanvas) {

			dailyTripsRectangles = chart.selectAll('rect.dailyTrips')
				.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

			// UPDATE
			dailyTripsRectangles.transition()
				.duration(duration)
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

			// ENTER
			dailyTripsRectangles.enter().append('rect')
				.attr('class', 'dailyTrips')
				.attr(attributes)
				.style({
					fill: d => scales.color(d.name)
				});

			// LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE 
			lateTripsCircles = chart.selectAll('circle.lateTrips')
				.data(datasets.lateTrips, d => `${d.lateMinutes}${d.date}`);

			var lateAttributes = {
				cx: 0,
				cy: height,
				r: 0
			};

			// UPDATE
			lateTripsCircles.transition()
				.duration(duration)
				.attr({lateAttributes})
				.style('fill', 'white');

			// ENTER
			lateTripsCircles.enter().append('circle')
				.attr('class', 'lateTrips')
				.attr(lateAttributes)
				.style('fill', 'white');


			// LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE LATE 
			lateTripsRectangles = chart.selectAll('rect.lateTrips')
				.data(datasets.lateTrips, d => `${d.lateMinutes}${d.date}`);

			var lateAttributes = {
				cx: 0,
				cy: height,
				r: 0
			};

			// UPDATE
			lateTripsRectangles.transition()
				.duration(duration)
				.attr({lateAttributes})
				.style('fill', 'white');

			// ENTER
			lateTripsRectangles.enter().append('rect')
				.attr('class', 'lateTrips')
				.attr(lateAttributes)
				.style('fill', 'white');

		} else {

			dailyTripsRectanglesCanvas = dataContainer.selectAll('custom.rect.dailyTrips')
				.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

			// UPDATE
			dailyTripsRectanglesCanvas.transition()
				.duration(duration)
				.attr(attributes)
				.attr({fillStyle: d => scales.color(d.name)});

			// ENTER
			dailyTripsRectanglesCanvas.enter().append('custom')
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

		var scales = {
			x: d3.time.scale(),
			y: d3.scale.linear(),
			color: d3.scale.ordinal()
		};

		// set Y scale to 0, so the bars will shrink to 0
		scales.y.range([height, 0]).domain([0, 0]);

		var attributes = {
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		if (!useCanvas) {

			// make bars collapse
			dailyTripsRectangles.transition()
				.duration(quickDuration)
				.attr(attributes);

		} else {

		}

		// Now we can begin making the dots.
		// For now we'll place them all.

		var firstDay = _.chain(datasets.lateTrips)
			.filter({date: '2013-09-04'})
			.value();

		// First, set the scales correctly.
		scales.x = d3.scale.linear().range([0, width]).domain([0, d3.max(firstDay, d => d.count)]);
		scales.y = d3.scale.linear().range([height, 0]).domain([0, d3.max(firstDay, d => d.lateMinutes)]);

		attributes = {
			cx: d => scales.x(d.count),
			cy: d => scales.y(d.lateMinutes),
			r: 1
		};

			// x: d => scales.x(d.date),
			// width: singleBarWidth,
			// y: d => scales.y(d.y1),
			// height: d => scales.y(d.y0) - scales.y(d.y1)

		if (!useCanvas) {

			lateTripsCircles.transition().duration(duration)
				.attr(attributes)
				.style('fill', red);


		}






















	}
};