// Each scene is going to transition from start to end.
// In other words, each scene should have all the information it needs to go from start to end.
// That way, when the viewport changes, all we have to do is redraw the entire chart,
// and draw the particular scene. It will know what to do.
// So, in conclusion, we're not really transition between scenes. We're moving to different
// scenes, and transition between start and end.

module.exports = {
	dailyTripsFirstDay: function() {
		console.log('hey');
	}
}