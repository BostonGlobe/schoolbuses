'use strict';

var d3 = require('d3');

// We're going to ignore transitions for now.
//
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

	// enable/disable buttons
	var parent = $(this).parent();
	$('.previous', parent).prop('disabled', stepIndex === 0);
	$('.next', parent).prop('disabled', stepIndex === $steps.length - 1);
});

// click 'previous' once to setup the buttons correctly
$(`${masterSelector} .buttons .previous`).click();



// use d3 datetime parser utility
var parseDate = d3.time.format('%Y-%m-%d').parse;



// NEXT: we've setup the steps and clicked the first one.
// Time to make the chart. First we'll create a blank chart with margins.
var margin = {top: 0, right: 0, bottom: 30, left: 30};
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



// NEXT: we're going to make the first chart
// get the data
var data = require('../../../data/output/trips-daily.csv')
	.map(function(d) {
		return {
			date: parseDate(d.date),
			trips: +d.n
		};
	});

// set up x-axis scale
var x = d3.time.scale()
	.range([0, width])
	.domain(d3.extent(data, d => d.date));

// set up y-axis scale
var y = d3.scale.linear()
	.range([height, 0])
	.domain([0, d3.max(data, d => d.trips)]);

// make bar chart
var rect = g.append('g')
	.selectAll('rect')
	.data(data);

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
