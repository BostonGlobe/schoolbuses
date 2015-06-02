var d3 = require('d3');

var datasets = require('./datasets.js');

var svg;
var width;
var height;
var scene;
var rects;
var dataKeys;

var scales = {
	x: d3.time.scale(),
	y: d3.scale.linear(),
	color: d3.scale.ordinal()
}

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

module.exports = {

	'intro': function() {

		svg = d3.select('svg.scenes');
		width = +svg.attr('width');
		height = +svg.attr('height');
		scene = svg.select('g.scene');

		// Get data keys
		dataKeys = _.chain(datasets.tripsPerDay)
			.pluck('name')
			.uniq()
			.value();

		// Setup scales
		scales.x.range([0, width]).domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		scales.y.range([height, 0]).domain([0, 0]);
		scales.color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)']).domain(dataKeys);

		// DATA JOIN
		rects = scene.selectAll('rect')
			.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

		var attributes = {
			x: d => scales.x(d.date),
			width: 100,
			y: d => scales.y(d.y1),
			height: d => scales.y(d.y0) - scales.y(d.y1)
		};

		// UPDATE
		rects.transition()
			.duration(1500)
			.attr(attributes)
			.style({
				fill: d => scales.color(d.name)
			});

		// ENTER
		rects.enter().append('rect')
			.attr('class', 'enter')
			.attr(attributes)
			.style({
				fill: d => scales.color(d.name)
			});
	},

	'trips-per-day-first-day': function() {

		// Setup scales
		scales.x.domain(d3.extent(_.take(datasets.tripsPerDay, 4), d => d.date));
		scales.y.domain([0, d3.max(_.take(datasets.tripsPerDay, 2), d => d.y1)]);
		scales.color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)']);

		// UPDATE
		rects.transition()
			.duration(1500)
			.attr('class', 'update')
			.attr({
				x: d => scales.x(d.date),
				width: 100,
				y: d => scales.y(d.y1),
				height: d => scales.y(d.y0) - scales.y(d.y1)
			})
			.style({
				fill: d => scales.color(d.name)
			});
	},

	'trips-per-day-all-days': function() {

		// Setup scales
		scales.x.domain(d3.extent(datasets.tripsPerDay, d => d.date));
		scales.y.domain([0, d3.max(datasets.tripsPerDay, d => d.y1)]);
		scales.color.range(['rgb(0, 0, 0)', 'rgb(0, 0, 0)']);

		// UPDATE
		rects.transition()
			.duration(1500)
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
	},

	'trips-per-day-early-and-late': function() {

		// Setup scales
		scales.color.range(['rgb(200, 200, 200)', '#FF0000']);

		// UPDATE
		rects.transition()
			.duration(1500)
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

	},

	'trips-per-day-late': function() {

		// // Setup scales
		// scales.x.domain(d3.extent(datasets.tripsPerDay, d => d.date));
		// scales.y.domain([0, d3.max(datasets.tripsPerDay, d => d.y1)]);

		// UPDATE
		rects.transition()
			.duration(1500)
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
	},

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
	// 		.range(['#FF0000', '#0000FF'])
	// 		.domain(dataKeys);

	// 	// DATA JOIN
	// 	rects = scene.selectAll('rect')
	// 		.data(datasets.tripsPerDay, d => `${d.name}${d.date}`);

	// 	// UPDATE
	// 	rects.transition()
	// 		.duration(1500)
	// 		.attr({
	// 			x: d => scales.x(d.date),
	// 			width: 100,
	// 			y: function(d) {
	// 				return scales.y(d.y1);
	// 			},
	// 			height: d => scales.y(d.y0) - scales.y(d.y1)
	// 		});

	// 	// ENTER
	// 	rects.enter().append('rect')
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


