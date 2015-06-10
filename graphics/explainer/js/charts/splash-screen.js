// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var d3 = require('d3');

var BUS_DIMENSIONS = {
	width: 4*160,
	height: 0.5*60
};

function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

var masterSelector = '.article-graphic.explainer .explainer-chart-html';
var master = $(masterSelector);

var scenes = {

	'intro': function(opts) {

		master.empty();

		// find the container height, and make enough vertical strips
		var containerHeight = master.outerHeight();
		var containerWidth = master.outerWidth();
		var containers = Math.floor(containerHeight/BUS_DIMENSIONS.height);

		d3.range(containers).forEach(function(d, i, a) {

			var klass = getRandomInt(0, 2) === 1 ? 'flipped': '';

			var red = i === 2 ? 'red' : '';

			master.append(`<div class="strip ${klass} ${red}"></div>`);

		});

		$('.strip', master).each(function() {

			var self = $(this);

			var flipped = self.hasClass('flipped');

			TweenMax.fromTo(self, getRandomInt(12, 30), {
				x: !flipped ? -BUS_DIMENSIONS.width : containerWidth
			}, {
				x: flipped ? -BUS_DIMENSIONS.width : containerWidth,
				repeat: -1,
				ease: 'linear'
			});

		});

		TweenMax.to(master, opts.duration/1000, {opacity: 0});

	},

	'main': function(opts) {

		TweenMax.to(master, opts.duration/1000, {opacity: 1});

	},

	'exit': function(opts) {

		TweenMax.to(master, opts.duration/1000, {opacity: 0});

	}

};

module.exports = {
	'type': 'html',
	'draw': function(opts) {
		scenes[opts.scene](opts);
	}
};