// Require various libraries.
var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

module.exports = {
	tripsPerDay: require('../../../data/output/tripsPerDay.csv')
		.map(function(d) {
			return {
				date: parseDate(d.date),
				earlyTrips: +d['early.trips'],
				lateTrips: +d['late.trips'],
				totalTrips: +d['total.trips'],
			};
		}),
	lateTrips: require('../../../data/output/lateTrips.csv')
		.map(function(d) {
			return {
				date: parseDate(d.date),
				lateMinutes: +d['late.minutes'],
				count: +d.count
			};
		})
};