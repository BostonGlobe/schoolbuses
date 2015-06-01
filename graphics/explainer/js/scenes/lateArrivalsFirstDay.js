// Draw first day of all arrivals.

// Require various libraries.
var d3 = require('d3');

module.exports = function(data, direction) {

	direction = null;

	var svg = d3.select('svg.scenes');
	var width = +svg.attr('width');
	var height = +svg.attr('height');
	var g = svg.select('g.scene');

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Sort data by date.
	data = _.sortBy(data, 'date');

	// Get all the days.
	var days = _.chain(data)
		.pluck('date')
		.uniq()
		.value();

	// var match = _.filter(data, d => d.date.getTime() === days[0].getTime());

	// console.log(JSON.stringify(match, null, 4));
	// console.log(JSON.stringify(_.filter(data, {d.date.getTime(), null, 4));


	var transitionDuration = 1500;

	var attributes = {
		// start: {
		// 	cx: 0,
		// 	cy: 0,
		// 	r: 0
		// 	// width: 100,
		// 	// height: d => height - y(d.trips)
		// },
		end: {
			cx: d => x(d.date),
			cy: d => y(d.minutes),
			r: 1
			// x: d => x(d.date),
			// width: x.range()[1] / data.length,
			// y: d => y(d.trips),
			// height: d => height - y(d.trips)
		}
	};

	var domain = {
		// start: {
		// 	x: d3.extent(_.take(data, 2), d => d.date),
		// 	y: [0, d3.max(_.take(data, 1), d => d.minutes)]
		// },
		end: {
			x: d3.extent(data, d => d.date),
			y: [0, d3.max(_.filter(data, d => d.date.getTime() === days[0].getTime()), d => d.minutes)]
		}
	};

	function databind() {

		// DATA JOIN
		// Join new data with old elements, if any.
		var circles = g.selectAll('circle')
			.data(data);

		// // UPDATE
		// // Update old elements as needed.
		// circles.attr('class', 'update')
		// 	.transition()
		// 	.duration(transitionDuration)
		// 	.attr(direction && direction === 'forwards' ? attributes.end : attributes.start);

		// ENTER
		// Create new elements as needed.
		circles.enter().append('circle')
			.attr('class', 'enters')
			.attr(direction && direction === 'forwards' ? attributes.start : attributes.end);
	}

	function current() {
		x.domain(domain.end.x);
		y.domain(domain.end.y);
		databind();
	}

	function previousToCurrent() {
		// x.domain(domain.start.x);
		// y.domain(domain.start.y);
		// debugger;
		// databind();

		// x.domain(domain.end.x);
		// y.domain(domain.end.y);
		// debugger;
		// databind();
	}

	function currentToPrevious() {
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