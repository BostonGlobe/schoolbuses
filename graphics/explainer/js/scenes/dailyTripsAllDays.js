// Draw all days of daily trips.
// The start state is the first bar.
// Transition it to all bars.

// Require various libraries.
var d3 = require('d3');

module.exports = function(data, direction) {

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var g = svg.select('g.scene');

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var transitionDuration = 1500;

	var attributes = {
		start: {
			x: d => x(d.date),
			width: 100,
			y: d => y(d.trips),
			height: d => height - y(d.trips)
		},
		end: {
			x: d => x(d.date),
			width: x.range()[1] / data.length,
			y: d => y(d.trips),
			height: d => height - y(d.trips)
		}
	};

	var domain = {
		start: {
			x: d3.extent(_.take(data, 2), d => d.date),
			y: [0, d3.max(_.take(data, 1), d => d.trips)]
		},
		end: {
			x: d3.extent(data, d => d.date),
			y: [0, d3.max(data, d => d.trips)]
		}
	};

	function databind() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var rect = g.selectAll('rect')
			.data(data, d => d.date);

		// UPDATE
		// Update old elements as needed.
		rect.attr('class', 'update')
			.transition()
			.duration(transitionDuration)
			.attr(direction && direction === 'forwards' ? attributes.end : attributes.start);

		// ENTER
		// Create new elements as needed.
		rect.enter().append('rect')
			.attr('class', 'enter')
			.attr(direction && direction === 'forwards' ? attributes.start : attributes.end);
	}

	function current() {
		x.domain(domain.end.x);
		y.domain(domain.end.y);
		databind();
	}

	function previousToCurrent() {
		x.domain(domain.start.x);
		y.domain(domain.start.y);
		databind();

		x.domain(domain.end.x);
		y.domain(domain.end.y);
		databind();
	}

	function currentToPrevious() {
		x.domain(domain.end.x);
		y.domain(domain.end.y);
		databind();

		x.domain(domain.start.x);
		y.domain(domain.start.y);
		databind();
	}

	// If no direction, draw current.
	// If forwards, transition from previous to current.
	// If backwards, transition from current to previous.
	if (!direction) {
		current();
	} else if (direction === 'forwards') {
		previousToCurrent();
	} else if (direction === 'backwards') {
		currentToPrevious();
	}

};