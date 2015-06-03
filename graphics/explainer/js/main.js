'use strict';

var d3 = require('d3');
var scenes = require('./scenes.js');

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;
var $steps = $(`${masterSelector} .steps`);



// Add the longest title to each of them, as placeholder.
var longestTitle = _.chain($('.title', $steps).map(function() {
		return $(this).text();
	}).get())
	.sortBy(function(d) {
		return -d.length;
	})
	.first()
	.value();
$('.step', $steps).each(function() {
	$(this).append(`<div class='placeholder'>${longestTitle}</div>`);
});



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
});



function drawScene(sceneToDraw, duration) {
	scenes[sceneToDraw](duration);
}



// On viewport resize, clear out the svg and call all scenes up to the current one,
// but with all durations set to 0.
function resize() {

	// Empty the chart container.
	$(chartSelector).empty();

	// Get the chart container width and height.	
	var margin = {top: 30, right: 0, bottom: 30, left: 40};
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
			'class': 'y axis'
		});
	g.append('g')
		.attr({
			'class': 'x axis',
			transform: `translate(0, ${height})`
		});

	$(chartSelector).append('<div class="x-axis-label fadedOut"><span></span></div>');

	// // Draw current scene with no transition duration.
	var currentStep = $('.step.active', $steps);
	drawScene('intro', 0);
	drawScene(currentStep.data('scene'), 0);

}
$(window).resize(resize);
resize();

drawScene('intro', 0);
// drawScene('trips-per-day-late', 0);
