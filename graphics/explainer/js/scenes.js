// Each scene should know how to go from 'previous' to 'current',
// and from 'current' to 'previous'.
// In other words: if we're on scene A, and we click 'Next',
// we'll jump to scene B, which will transition from 'previous' to 'current'.
// If we then click 'Previous', scene B will transition from 'current' to 'previous',
// and then we'll jump to scene A, which will draw 'current'.

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
	dailyTripsFirstDay: function(direction) {
		require('./scenes/dailyTripsFirstDay.js')(datasets.dailyTrips, direction);
	},
	dailyTripsAllDays: function(direction) {
		require('./scenes/dailyTripsAllDays.js')(datasets.dailyTrips, direction);
	}
};