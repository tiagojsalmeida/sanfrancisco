/*
 * MAPS
 */

var width = windowSize().width,
    height = windowSize().height;

var zoom = d3.behavior.zoom()
	.scaleExtent([-.15, 7]);

projection = d3.geo.mercator();
projection
	.scale(308100)
	.center([-122 - map_center(windowSize().width), 37.78]);

path = d3.geo.path()
    .projection(projection);

svg = d3.select(".page-content.inset").append("svg")
	.attr("width", '100%')
	.attr("height", '100%')
	.call(zoom.on("zoom", redraw));

function redraw() {
	trans = d3.event.translate;
	scale = d3.event.scale;
	d3.selectAll('path, circle').attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
}

d3.json("maps/streets.json", function(error, json) {
	svg.drawMap(json, 'streets');

	d3.json("maps/arteries.json", function(error, json) {
		svg.drawMap(json, 'arteries');

		d3.json("maps/freeways.json", function(error, json) {
			svg.drawMap(json, 'freeways');

			d3.json("maps/neighborhoods.json", function(error, json) {
				svg.drawMap(json, 'neighborhoods');

				mapsLoaded();
			});
		});
	});
});


function mapsLoaded(){
	var showOnly = false;
	route.update( showOnly );
	vehicle.updateLocation( showOnly );
	setInterval(
		function(){
			vehicle.updateLocation( showOnly )
		},
		15000
	);
}

/*
 * MAP TOOLS
 */

d3.selection.prototype.drawMap = function(json, className) {
	return this
		.append("path")
		.datum(json)
		.attr("class", 'map ' + className)
		.style("fill", "none")
		.attr("d", path);
};

function map_center(value) {
	var low = [320,40],
		high = [1440,46];
	return (low[1] + (high[1] - low[1]) * (value - low[0]) / (high[0] - low[0])) / 100;
}