'use strict';

var d3 = require('d3');
var tripsDaily = require('./tripsDaily.js');

// We're going to ignore transitions for now.
// SO: first things first. Wire up the buttons/steps interaction.

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;

// initialize step index to 0, the first step
var stepIndex = 0;

// get the jQuery steps element
var $steps = $(`${masterSelector} .steps .step`);

// wire up prev/next buttons
$(`${masterSelector} .buttons button`).click(function() {

	// update the index
	if ($(this).text() === 'Previous') {
		if (stepIndex > 0) {
			stepIndex--;
		}
	} else {
		if (stepIndex < $steps.length - 1) {
			stepIndex++;
		}
	}

	// show the correct step
	$steps.hide();
	$steps.eq(stepIndex).show();

	// draw the correct chart for this step
	drawChart(stepIndex);

	// enable/disable buttons
	var parent = $(this).parent();
	$('.previous', parent).prop('disabled', stepIndex === 0);
	$('.next', parent).prop('disabled', stepIndex === $steps.length - 1);
});



// Next: time to make the chart. First we'll create a blank chart with margins.
// NOTE: this assumes the viewport will never change. Obviously this assumption
// is wrong. We'll revisit this at a later date.
var margin = {top: 0, right: 0, bottom: 30, left: 0};
var svgWidth = $(chartSelector).outerWidth();
var svgHeight = $(chartSelector).outerHeight();
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// make svg fit its container
var svg = d3.select(`${chartSelector} svg`)
	.attr({
		width: svgWidth,
		height: svgHeight
	});

// add g to svg
var g = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`);



// Next: initialize charts with their various datasets.
tripsDaily.init({g, data: require('../../../data/output/trips-daily.csv')});

// This function takes care of calling the right chart.
function drawChart(_stepIndex) {

	var dimensions = {
		width,
		height
	};

	var steps = {
		0: function() {
			tripsDaily.draw({dimensions, g, scene: 'intro'});
		},
		1: function() {
			tripsDaily.draw({dimensions, g, scene: 'firstDay'});
		},
		2: function() {
			tripsDaily.draw({dimensions, g, scene: 'allDays'});
		}
	}
	steps[_stepIndex]();
}



// start the whole thing!
$(`${masterSelector} .buttons .previous`).click();
// get the data

/*
// make bar chart
function update(data) {

	var rect = g.append('g')
	.selectAll('rect')
	.data(data, d => d.date);

	// UPDATE
	// Update old elements as needed.

	// ENTER
	// Create new elements as needed.
	rect.enter().append('rect')
	.attr({
		x: d => x(d.date),
			y: d => y(d.trips),
			width: x.range()[1] / data.length,
		height: d => height - y(d.trips)
	});

	// ENTER + UPDATE
	// Appending to the enter selection expands the update selection to include
	// entering elements; so, operations on the update selection after appending to
	// the enter selection will apply to both entering and updating nodes.

	// EXIT
	// Remove old elements as needed.
	rect.exit().remove();
}

update(_.take(data, 10));

setTimeout(function() {
	update(data);
}, 2000);
*/



/*

// utility variable for development purposes
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}



// use d3's utility datetime string parser
var parseDate = d3.time.format('%Y-%m-%d').parse;

// get data and prepare for d3
var data = require('../../../data/output/trips-daily.csv')
	.map(function(d) {
		return {
			date: parseDate(d.date),
			trips: +d.n
		};
	});


// log it to browser
//log(data);



// set up x-axis scale
var x = d3.time.scale()
	.range([0, width])
	.domain(d3.extent(data, d => d.date));

// set up y-axis scale
var y = d3.scale.linear()
	.range([height, 0])
	.domain([0, d3.max(data, d => d.trips)]);

g.append('g')
	.selectAll('rect')
	.data(data)
	.enter().append('rect')
	.attr({
		x: d => x(d.date),
		y: d => y(d.trips),
		width: x.range()[1] / data.length,
		height: d => height - y(d.trips)
	});
   */
