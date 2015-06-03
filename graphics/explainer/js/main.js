'use strict';

var d3 = require('d3');
var scenes = require('./scenes.js');

var masterSelector = '.article-graphic.explainer';
var chartSelector = `${masterSelector} .explainer-chart`;
var chartWrapperSelector = `${masterSelector} .explainer-chart-wrapper`;
var $steps = $(`${masterSelector} .steps`);

var canvas = d3.select(chartWrapperSelector).insert('canvas', ':first-child');
var context = canvas.node().getContext('2d');

// Create an in-memory-only elment of type 'custom'.
// We'll reference this when creating the canvas layer.
var detachedContainer = document.createElement('custom');

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer);

$('.buttons .begin', masterSelector).click(function(e) {

	$(this).addClass('displayNone');
	$('.next, .previous', $(this).parents('.buttons')).addClass('displayBlock');
	$('.next', $(this).parents('.buttons')).click();
});


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
$(`${masterSelector} .buttons button.navibutton`).click(function() {

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
	scenes[sceneToDraw](duration, dataContainer);
}



// On viewport resize, clear out the svg and call all scenes up to the current one,
// but with all durations set to 0.
function resize() {

	// Empty the chart container.
	$(chartSelector).empty();

	// Get the chart container width and height.	
	var margin = {top: 30, right: 0, bottom: 30, left: 40};
	var svgWidth = $(chartWrapperSelector).outerWidth();
	var svgHeight = $(chartWrapperSelector).outerHeight();
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

	// Change canvas dimensions.
	canvas.attr({width: svgWidth, height: svgHeight});
	context.translate(margin.left, margin.top);
	// canvas.node().style.top = `${margin.top}px`;
	// canvas.node().style.left = `${margin.left}px`;

	$(chartSelector).append('<div class="x-axis-label fadedOut"><span></span></div>');

	// // Draw current scene with no transition duration.
	var currentStep = $('.step.active', $steps);
	drawScene('intro', 0);
	drawScene(currentStep.data('scene'), 0);

}
$(window).resize(resize);
resize();



// copy-pasted from http://bocoup.com/weblog/d3js-and-canvas/
function setupCanvas() {

	// // Function to create our custom data containers
	// function drawCustom(data) {

	//   var scale = d3.scale.linear()
	//     .range([10, 390])
	//     .domain(d3.extent(data));
	  
	//   var dataBinding = dataContainer.selectAll("custom.rect")
	//     .data(data, function(d) { return d; });
	  
	//   dataBinding
	//     .attr("size", 8)
	//     .transition()
	//     .duration(2000)
	//     .attr("size", 60)
	//     .attr("fillStyle", "green");
	  
	//   dataBinding.enter()
	//       .append("custom")
	//       .classed("rect", true)
	//       .attr("x", scale)
	//       .attr("y", 100)
	//       .attr("size", 8)
	//       .attr("fillStyle", "red");
	  
	//   dataBinding.exit()
	//     .attr("size", 8)
	//     .transition()
	//     .duration(1000)
	//     .attr("size", 5)
	//     .attr("fillStyle", "lightgrey");
	// }

	// drawCustom([1,2,13,20,23]);
	// drawCustom([1,2,12,16,20]);

	function drawCanvas() {

		// clear canvas
		context.fillStyle = '#FFF';
		context.rect(0, 0, canvas.attr('width'), canvas.attr('height'));
		context.fill();

		// select our dummy nodes and draw the data to canvas.
		var elements = dataContainer.selectAll('custom.rect');
		elements.each(function(d) {
			var node = d3.select(this);

			context.beginPath();
			context.fillStyle = node.attr('fillStyle');
			context.rect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
			context.fill();
			context.closePath();

		});
	}

	d3.timer(drawCanvas);
}

setupCanvas();





// drawScene('trips-per-day-late', 0);
