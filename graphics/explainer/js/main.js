'use strict';

// We're going to ignore transitions for now.
//
// SO: first things first. We'll set up the chart dimensions.

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;














/*

var d3 = require('d3');

// set various css selectors
var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;

// utility variable for development purposes
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

// create steps chatter
var steps = [
	{
		'title': 'Step 1',
		'text': 'This is a story about buses. Boston Public School buses.'
	},
	{
		'title': 'Step 2',
		'text': 'On any given day, hundreds of buses carry thousands of kids to school. Here’s September 4, the first day of classes. [Animate bar height and update bus trip count]'
	}
];

// initialize step index to 0, the first step
var stepIndex = 0;

// wire up prev/next buttons
$(`${masterSelector} .buttons button`).click(function(e) {

	// update the index
	if ($(this).text() === 'Previous') {
		if (stepIndex > 0) {
			stepIndex--;
		}
	} else {
		if (stepIndex < steps.length - 1) {
			stepIndex++;
		}
	}

	// set the chatter
	var currentStep = steps[stepIndex];
	$(`${masterSelector} .chatter .title`).html(currentStep.title);
	$(`${masterSelector} .chatter .text`).html(currentStep.text);

	// enable/disable buttons
	var parent = $(this).parent();
	$('.previous', parent).prop('disabled', stepIndex === 0);
	$('.next', parent).prop('disabled', stepIndex === steps.length - 1);
});

// click 'previous' once to setup the buttons correctly
$(`${masterSelector} .buttons .previous`).click();

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

// setup graph margins, according to convention
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var outerWidth = $(chartSelector).width();
var outerHeight = outerWidth * 9 / 16;
var width = outerWidth - margin.left - margin.right;
var height = outerHeight - margin.top - margin.bottom;

// make a graph container
var svg = d3.select(`${chartSelector} svg`)
	.attr({
		width: outerWidth,
		height: outerHeight
	});

// add g to svg
var g = svg.append('g')
	.attr('transform', `translate(${margin.left}, ${margin.top})`);

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
