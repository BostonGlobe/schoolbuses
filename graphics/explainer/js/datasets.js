// Require various libraries.
var d3 = require('d3');

// Use d3's built-in string-to-date parser.
var parseDate = d3.time.format('%Y-%m-%d').parse;

// Declare data keys we're interested in.
var dataKeys = ['earlyTrips', 'lateTrips'];

module.exports = {
	tripsPerDay: _.chain(require('../../../data/output/tripsPerDay.csv'))
		.map(function(d) {
			return {
				date: parseDate(d.date),
				earlyTrips: +d['early.trips'],
				lateTrips: +d['late.trips'],
				totalTrips: +d['total.trips'],
			};
		})
		.map(function(d) {
			var y0 = 0; // Set it to 0. This will keep incrementing in the loop below.
			return dataKeys.map(function(name) { // Iterate over every property, e.g. 'early trips'
				return {
					name: name, // e.g. 'early trips'
					y0: y0, // low range.
					y1: y0 += +d[name],
					date: d.date.getTime()
				};
			});
		})
		.flatten()
		.value(),
	lateTrips: require('../../../data/output/lateTrips.csv')
		.map(function(d) {
			return {
				date: parseDate(d.date),
				lateMinutes: +d['late.minutes'],
				count: +d.count
			};
		})
	// lateTripsFirstDay: _.chain(require('../../../data/output/lateTrips.csv'))
	// 	.filter({date: '2013-09-04'})
	// 	// .map(function(datum) {
	// 	// 	return d3.range(0, +datum.count).map(function(d, index) {
	// 	// 		return {
	// 	// 			index,
	// 	// 			date: parseDate(datum.date).getTime(),
	// 	// 			lateMinutes: +datum['late.minutes']
	// 	// 		};
	// 	// 	});
	// 	// })
	// 	// .flatten()
	// 	.value()
	// lateTrips: require('../../../data/output/lateTrips.csv')
	// 	.map(function(d) {
	// 		return {
	// 			date: parseDate(d.date),
	// 			lateMinutes: +d['late.minutes'],
	// 			count: +d.count
	// 		};
	// 	}),
	// allLateTrips: _.chain(require('../../../data/output/lateTrips.csv'))
	// 	.map(function(datum) {
	// 		return d3.range(0, +datum.count).map(function(d, index) {
	// 			return {
	// 				index,
	// 				date: parseDate(datum.date).getTime(),
	// 				lateMinutes: +datum['late.minutes']
	// 			};
	// 		});
	// 	})
	// 	.flatten()
	// 	.value()
};










