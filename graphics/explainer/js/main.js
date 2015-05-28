'use strict';

var d3 = require('d3');
var tripsDaily = require('./tripsDaily.js');

// We're going to ignore transitions for now.
// SO: first things first. Wire up the buttons/steps interaction.

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;

// wire up prev/next buttons
$(`${masterSelector} .buttons button`).click(function() {

	var $steps = $(`${masterSelector} .steps`);

	// Deactivate all steps
	var currentStep;

	// If user clicked 'Next' move to the next step.
	if ($(this).text() === 'Next') {
		currentStep = $('.step.active', $steps).next();
	}

	// If user clicked 'Previous' move to the previous step.
	if ($(this).text() === 'Previous') {
		currentStep = $('.step.active', $steps).prev();
	}

	$('.step', $steps).removeClass('active');
	currentStep.addClass('active');

	// Enable/disable Previous/Next buttons
	var buttons = $(this).parent();
	$('.previous', buttons).prop('disabled', currentStep.is(':first-child'));
	$('.next', buttons).prop('disabled', currentStep.is(':last-child'));
});



// Each scene is going to transition from start to end.
// In other words, each scene should have all the information it needs to go from start to end.
// That way, when the viewport changes, all we have to do is redraw the entire chart,
// and draw the particular scene. It will know what to do.
// So, in conclusion, we're not really transition between scenes. We're moving to different
// scenes, and transition between start and end.

function resize() {

	// Empty the chart container.
	$(chartSelector).empty();

	// Get the chart container width and height.	
	var margin = {top: 0, right: 0, bottom: 30, left: 100};
	var svgWidth = $(chartSelector).outerWidth();
	var svgHeight = $(chartSelector).outerHeight();
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	// Make svg fit its container.
	var svg = d3.select(`${chartSelector} svg`)
		.attr({
			width: svgWidth,
			height: svgHeight
		});

	// add g to svg
	var g = svg.append('g')
		.attr({
			'class': 'transition-stepper',
			transform: `translate(${margin.left}, ${margin.top})`
		});

}
$(window).resize(resize);
resize();



// function drawChart()





























// // Next: initialize charts with their various datasets.
// tripsDaily.init({
// 	dimensions: {height, width},
// 	g,
// 	data: require('../../../data/output/trips-daily.csv')});

// // This function takes care of calling the right chart.
// function drawChart(_stepIndex) {

// 	var dimensions = {
// 		width,
// 		height
// 	};

// 	var steps = {
// 		0: function() {
// 			tripsDaily.draw({dimensions, g, scene: 'intro'});
// 		},
// 		1: function() {
// 			tripsDaily.draw({dimensions, g, scene: 'firstDay'});
// 		},
// 		2: function() {
// 			tripsDaily.draw({dimensions, g, scene: 'allDays'});
// 		},
// 		3: function() {
// 			tripsDaily.draw({dimensions, g, scene: 'backToFirstDay'});
// 		}
// 	}
// 	steps[_stepIndex]();
// }



// // start the whole thing!
// $(`${masterSelector} .buttons .previous`).click();