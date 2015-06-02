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
		})
};








// // Each scene should know how to go from 'previous' to 'current',
// // and from 'current' to 'previous'.
// // In other words: if we're on scene A, and we click 'Next',
// // we'll jump to scene B, which will transition from 'previous' to 'current'.
// // If we then click 'Previous', scene B will transition from 'current' to 'previous',
// // and then we'll jump to scene A, which will draw 'current'.


// // Store all datasets here.
// var datasets = {
// 	tripsPerDay: require('../../../data/output/tripsPerDay.csv')
// 		.map(function(d) {
// 			return {
// 				date: parseDate(d.date),
// 				earlyTrips: +d['early.trips'],
// 				lateTrips: +d['late.trips'],
// 				totalTrips: +d['total.trips'],
// 			};
// 		})
// 	// 	,
// 	// lateArrivals: require('../../../data/output/all-late-arrivals.csv')
// 	// 	.map(function(d) {
// 	// 		return {
// 	// 			date: parseDate(d.date),
// 	// 			minutes: +d['late.minutes']
// 	// 		};
// 	// 	})
// };

// module.exports = {
// 	callScene: function(sceneName) {
		
// 	}
// }

// // module.exports = {
// // 	dailyTripsFirstDay: function(direction) {
// // 		require('./scenes/dailyTripsFirstDay.js')(datasets.tripsPerDay, direction);
// // 	},
// // 	dailyTripsAllDays: function(direction) {
// // 		require('./scenes/dailyTripsAllDays.js')(datasets.tripsPerDay, direction);
// // 	},
// // 	dailyTripsAllDays: function(direction) {
// // 		require('./scenes/dailyTripsAllDays.js')(datasets.tripsPerDay, direction);
// // 	}
// // 	// ,
// // 	// lateArrivalsFirstDay: function(direction) {
// // 	// 	// require('./scenes/lateArrivalsFirstDay.js')(datasets.lateArrivals, direction);
// // 	// }
// // };