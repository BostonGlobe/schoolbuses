// Each scene is going to transition from start to end.
// In other words, each scene should have all the information it needs to go from start to end.
// That way, when the viewport changes, all we have to do is redraw the entire chart,
// and draw the particular scene. It will know what to do.
// So, in conclusion, we're not really transitioning between scenes. We're moving to different
// scenes, and transitioning between start and end.

// Require various libraries.
var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

// Store all datasets here.
var datasets = {
	dailyTrips: require('../../../data/output/trips-daily.csv')
		.map(function(d) {
			return {
				date: parseDate(d.date),
				trips: +d.n
			};
		})
};

module.exports = {
	dailyTripsFirstDay: function() {
		require('./scenes/dailyTripsFirstDay.js')(datasets.dailyTrips);
	},
	dailyTripsAllDays: function() {
		require('./scenes/dailyTripsAllDays.js')(datasets.dailyTrips);
	}
};