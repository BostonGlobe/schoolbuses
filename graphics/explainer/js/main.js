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
	$('.previous', buttons)
		.prop('disabled', currentStep.is(':first-child'))
		.toggleClass('btn--disabled', currentStep.is(':first-child'));
	$('.next', buttons)
		.prop('disabled', currentStep.is(':last-child'))
		.toggleClass('btn--disabled', currentStep.is(':last-child'));

	drawScene(currentStep.data('scene'));

	// // Get the right scene for this direction.
	// var sceneToDraw = forwards ? currentStep.data('scene') : currentStep.next().data('scene');

	// drawScene(sceneToDraw, forwards ? 'forwards' : 'backwards');
});



function drawScene(sceneToDraw, duration) {
	scenes[sceneToDraw]();
}



// On viewport resize, clear out the svg and call all scenes up to the current one,
// but with all durations set to 0.
function resize() {

	// Empty the chart container.
	$(chartSelector).empty();

	// Get the chart container width and height.	
	var margin = {top: 0, right: 0, bottom: 30, left: 0};
	var svgWidth = $(chartSelector).outerWidth();
	var svgHeight = $(chartSelector).outerHeight();
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;

	// Make svg fit its container.
	var svg = d3.select(chartSelector).append('svg')
		.attr({
			'class': 'scenes',
			width: svgWidth,
			height: svgHeight,
			_innerWidth: width,
			_innerHeight: height
		});

	// Add scene to svg.
	var g = svg.append('g')
		.attr({
			'class': 'scene',
			transform: `translate(${margin.left}, ${margin.top})`
		});

	// Add chart to scene
	g.append('g')
		.attr('class', 'chart');

	// Add axes to g
	g.append('g')
		.attr({
			'class': 'x axis',
			transform: `translate(0, ${height})`
		});

	// Draw current scene with no transition duration.
	var currentStep = $('.step.active', $steps);
	drawScene(currentStep.data('scene'), 0);

}
$(window).resize(resize);
resize();


// We need to create the chart at the beginning.


















// // Take a scene's html name, e.g. daily-trips-first-day,
// // and call the appropriate scene file.
// function drawScene(sceneName, direction) {

// 	// Clear out first g.
// 	d3.select(chartSelector)
// 		.select('svg.scenes g.scene')
// 		.selectAll('*')
// 		.remove();

// 	require(`./scenes/${sceneName}.js`)(direction);
// }



// // When viewport changes, destroy the existing svg, create a new one, and call the
// // current chart with no direction.
// function resize() {

// 	// Empty the chart container.
// 	$(chartSelector).empty();

// 	// Get the chart container width and height.	
// 	var margin = {top: 0, right: 0, bottom: 0, left: 0};
// 	var svgWidth = $(chartSelector).outerWidth();
// 	var svgHeight = $(chartSelector).outerHeight();
// 	var width = svgWidth - margin.left - margin.right;
// 	var height = svgHeight - margin.top - margin.bottom;

// 	// Make svg fit its container.
// 	var svg = d3.select(chartSelector).append('svg')
// 		.attr({
// 			'class': 'scenes',
// 			width: svgWidth,
// 			height: svgHeight
// 		});

// 	// Add g to svg.
// 	var g = svg.append('g')
// 		.attr({
// 			'class': 'scene',
// 			transform: `translate(${margin.left}, ${margin.top})`
// 		});

// 	// Get current step.
// 	var currentStep = $('.step.active', $steps);

// 	// Call scene for current step.
// 	drawScene(currentStep.data('scene'));

// }
// $(window).resize(resize);

// Draw the first scene.
// resize();