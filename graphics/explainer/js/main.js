'use strict';

var d3 = require('d3');
var scenes = require('./scenes.js');

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;
var $steps = $(`${masterSelector} .steps`);

// Wire up prev/next buttons
$(`${masterSelector} .buttons button`).click(function() {

	var currentStep;
	var forwards = $(this).text() === 'Next';

	// If user clicked 'Next' move to the next step.
	if (forwards) {
		currentStep = $('.step.active', $steps).next();
	} else {
		// If user clicked 'Previous' move to the previous step.
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

	// Get the right scene for this direction.
	var sceneToDraw = forwards ? currentStep.data('scene') : currentStep.next().data('scene');

	drawScene(sceneToDraw, forwards ? 'forwards' : 'backwards');
});



// Take a scene's html name, e.g. daily-trips-first-day,
// and call the actual function, e.g. dailyTripsFirstDay
function drawScene(sceneName, direction) {

	// Clear out first g.
	d3.select(chartSelector)
		.select('svg.scenes g.scene')
		.selectAll('*')
		.remove();

	console.log(sceneName);
	console.log(direction);

	// If we're on scene A, and we click 'Next',
	// we'll jump to scene B, which will transition from 'previous' to 'current'.
	// If we then click 'Previous', scene B will transition from 'current' to 'previous'.

	// De-slugify scene names, e.g. daily-trips-first-day -> dailyTripsFirstDay
	var functionName = sceneName.replace(/-(.{1})/g, (match, $1) => $1.toUpperCase());

	// Call function by name
	var func = scenes[functionName];
	typeof func === 'function' && func(direction);
}



// When viewport changes, destroy the existing svg, create a new one, and call the
// current chart with no direction.
function resize() {

	// Empty the chart container.
	$(chartSelector).empty();

	// Get the chart container width and height.	
	var margin = {top: 0, right: 0, bottom: 0, left: 0};
	var svgWidth = $(chartSelector).outerWidth();
	var svgHeight = $(chartSelector).outerHeight();
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	// Make svg fit its container.
	var svg = d3.select(chartSelector).append('svg')
		.attr({
			'class': 'scenes',
			width: svgWidth,
			height: svgHeight
		});

	// Add g to svg.
	var g = svg.append('g')
		.attr({
			'class': 'scene',
			transform: `translate(${margin.left}, ${margin.top})`
		});

	// Get current step.
	var currentStep = $('.step.active', $steps);

	// Call scene for current step.
	drawScene(currentStep.data('scene'));

}
$(window).resize(resize);

// Draw the first scene.
resize();