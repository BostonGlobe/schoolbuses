'use strict';

var d3 = require('d3');
var scenes = require('./scenes.js');

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;
var $steps = $(`${masterSelector} .steps`);

// Wire up prev/next buttons
$(`${masterSelector} .buttons button`).click(function() {

	var currentStep;

	// If user clicked 'Next' move to the next step.
	if ($(this).text() === 'Next') {
		currentStep = $('.step.active', $steps).next();
	}

	// If user clicked 'Previous' move to the previous step.
	if ($(this).text() === 'Previous') {
		currentStep = $('.step.active', $steps).prev();
	}

	// Deactivate all steps.
	$('.step', $steps).removeClass('active');

	// Activate the new step.
	currentStep.addClass('active');

	// Enable/disable Previous/Next buttons.
	var buttons = $(this).parent();
	$('.previous', buttons).prop('disabled', currentStep.is(':first-child'));
	$('.next', buttons).prop('disabled', currentStep.is(':last-child'));

	// Call the right scene.
	drawScene(currentStep.data('scene'))
});



// When viewport changes, destroy the existing svg, create a new one, and call the
// current chart again.
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

	// Add g to svg.
	var g = svg.append('g')
		.attr({
			'class': 'transition-stepper',
			transform: `translate(${margin.left}, ${margin.top})`
		});

	// Get current step.
	var currentStep = $('.step.active', $steps);

	// Call scene for current step.
	drawScene(currentStep.data('scene'));

}
$(window).resize(resize);
resize();



function drawScene(sceneName) {

	// Deslugify scene names, e.g. daily-trips-first-day -> dailyTripsFirstDay
	var functionName = sceneName.replace(/-(.{1})/g, (match, $1) => $1.toUpperCase());

	// Call function by name
	var func = scenes[functionName];
	typeof func === 'function' && func();
}





























// // Next: initialize charts with their various datasets.
// tripsDaily.init({
// 	dimensions: {height, width},
// 	g,
// 	data: require('../../../data/output/trips-daily.csv')});

// // This function takes care of calling the right chart.
// function drawScene(_stepIndex) {

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