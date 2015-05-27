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

// Declare list of scenes.
var scenes = ['intro', 'firstDay', 'allDays'];

function setScales(opts) {

	// Set scales.
	x = d3.time.scale()
		.range([0, opts.dimensions.width]);

	y = d3.scale.linear()
		.range([opts.dimensions.height, 0]);

	//switch(opts.scene) {
		//case 'intro':
	x.domain(d3.extent(data, d => d.date));
	y.domain([0, d3.max(data, d => d.trips)]);
			//break;
	//}
}

function prepareToDraw(opts) {

	// Set scales.
	setScales(opts);

	// Draw!
	//draw(opts);


	var onePoint = [data[0]];
	//var shuffledTrips = _.chain(data)
		//.shuffle()
		//.take(5)
		//.sortBy('date')
		//.value();

	//draw(onePoint, opts);
	//setInterval(function() {
		var shufflePoint = _.chain(data)
			.shuffle()
			.value()
			[0];

		onePoint[0].trips = shufflePoint.trips;
		
		console.log(onePoint[0].trips);
		draw(onePoint, opts);
	//}, 4000);
}

/*
function draw(opts) {

	console.log(opts);
	debugger;
	// This is the drawing function. This is where we draw.
	// If we're on the first scene, 'intro',
	// set the x-axis to ... the first 10.
	// Set the y-axis to the height of the first one.
	// And draw the first element.

	var sceneData;

	switch(opts.scene) {
		case 'intro':
			sceneData = _.take(data, 3);
			sceneData[0].trips = 100;
			break;
		case 'firstDay':
			sceneData = _.take(data, 3);
			sceneData[0].trips = data[0].trips;
			break;
	}
	console.log(data);
	console.log(sceneData);

	debugger;
	var rect = opts.g.select('g.trips-daily')
		.selectAll('rect')
		.data(sceneData, d => d);

	// UPDATE
	// Update old elements as needed.
	rect
		.transition().duration(5000)
		.attr({
			y: d => y(d.trips),
			height: d => opts.dimensions.height - y(d.trips)
		});

	// ENTER
	// Create new elements as needed.
	switch(opts.scene) {
		case 'intro':
			rect.enter().append('rect')
				.attr({
					x: x.range()[1]/3,
					width: 50,
					y: d => y(d.trips),
					height: d => opts.dimensions.height - y(d.trips)
				});
			break;
		case 'firstDay':
			rect.enter().append('rect')
				.attr({
					x: x.range()[1]/3,
					width: 50
				});
			break;
	}

	//rect.attr({
		//y: d => y(d.trips),
		//height: d => opts.dimensions.height - y(d.trips)
	//});
	//// EXIT
	//// Remove old elements as needed.
	//rect.exit().remove();
}*/

function init(opts) {

	// on init, create 'g.trips-daily', the chart container
	opts.g.append('g')
		.attr('class', 'trips-daily');

	// also create the global 'data' variable which will hold this
	// chart's data.
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

function draw(_data, opts) {
	var g = d3.select('g.trips-daily');

	// DATA JOIN
	// Join new data with old elements, if any.
	var rect = g.selectAll('rect')
		.data(_data, d => d.date);

	// UPDATE
	// Update old elements as needed.
	rect.attr('class', 'update')
		.transition()
		.duration(1500)
		.attr({
			x: d => x(d.date),
			height: d => opts.dimensions.height - y(d.trips),
			y: d => y(d.trips)
		});

	// ENTER
	// Create new elements as needed.
	rect.enter().append('rect')
		.attr({
			'class': 'enter',
			x: d => x(d.date),
			y: 0,
			width: x.range()[1] / data.length,
			height: d => opts.dimensions.height - y(d.trips)
		})
		.transition()
		.duration(1500)
		.attr({
			y: d => y(d.trips)
		});
			
	// EXIT
	// Remove old elements as needed.
	rect.exit()
		.attr('class', 'exit')
		.transition()
		.duration(1500)
		.attr({
			y: 300
		})
		.style('fill-opacity', 1e-6)
		.remove();
}
//function updateAlphabet(data, svg) 

//var svg = d3.select('g.trips-daily');
//console.log(data);
  //// DATA JOIN
  //// Join new data with old elements, if any.
  //var text = svg.selectAll("text")
      //.data(data, function(d) { return d; });

  //// UPDATE
  //// Update old elements as needed.
  //text.attr("class", "updatet")
    //.transition()
      //.duration(1500)
      //.attr("x", function(d, i) { return i * 32; });

  //// ENTER
  //// Create new elements as needed.
  //text.enter().append("text")
      //.attr("class", "enter")
      //.attr("dy", "2em")
      //.attr("y", -60)
      //.attr("x", function(d, i) { return i * 32; })
      //.style("fill-opacity", 1e-6)
      //.text(function(d) { return d; })
    //.transition()
      //.duration(1500)
      //.attr("y", 0)
      //.style("fill-opacity", 1);

  //// EXIT
  //// Remove old elements as needed.
  //text.exit()
      //.attr("class", "exit")
    //.transition()
      //.duration(1500)
      //.attr("y", 60)
      //.style("fill-opacity", 1e-6)
      //.remove();
//}

//// The initial display.
//updateAlphabet(alphabet);

//// Grab a random sample of letters from the alphabet, in alphabetical order.
//setInterval(function() {
  //updateAlphabet(shuffle(alphabet)
      //.slice(0, Math.floor(Math.random() * 26))
      //.sort()
	//);
//}, 4000);

//// Shuffles the input array.
//function shuffle(array) {
  //var m = array.length, t, i;
  //while (m) {
    //i = Math.floor(Math.random() * m--);
    //t = array[m], array[m] = array[i], array[i] = t;
  //}
  //return array;
//}

//var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
