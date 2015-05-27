'use strict';

// Require various libraries.
var d3 = require('d3');
var util = require('../../../common/js/util.js');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

// Store chart data here.
var data = null;

// Declare scale variables.
var x;
var y;

// Declare list of scenes.
var scenes = ['intro', 'firstDay', 'allDays'];

// This runs once.
function init(opts) {

	// On init, create 'g.trips-daily', the chart container.
	opts.g.append('g')
		.attr('class', 'trips-daily');

	// Also create the global 'data' variable which will hold this
	// chart's data.
	data = opts.data.map(function(datum) {
		return {
			date: parseDate(datum.date),
			trips: +datum.n
		};
	});
}

// This runs when the user clicks a 'previous'/'next' button.
// It will do a couple of things and then will call draw().
function prepareToDraw(opts) {

	// Set scales.
	setScales(opts);

	// Draw!
	draw(opts);
}

function setScales(opts) {

	// Set scales.
	x = d3.time.scale()
		.range([0, opts.dimensions.width]);

	y = d3.scale.linear()
		.range([opts.dimensions.height, 0]);

		//case 'intro':
	x.domain(d3.extent(data, d => d.date));
	y.domain([0, d3.max(data, d => d.trips)]);
			//break;
	//}
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


module.exports = {
	draw: prepareToDraw,
	init: init
};

function draw(opts) {

	var _data;

	// Choose datapoints based on the scene.
	switch(opts.scene) {
		case 'intro':
			
			// If we're on the intro scene, only display first element.
			// Set the first trip to 0, so we can animate to full height
			// on the next slide.
			_data = [
				{
					date: data[0].date,
					trips: 0
				}
			];

			break;
		case 'firstDay':

			// If we're on the firstDay scene, only display first element.
			_data = [
				{
					date: data[0].date,
					trips: data[0].trips
				}
			];

			break;
		case 'allDays':

			// If we're on the allDays scene, display all trips.
			_data = data;

			break;
	}
	
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
			width: x.range()[1] / data.length,
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
