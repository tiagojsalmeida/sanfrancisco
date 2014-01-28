/*
 * VEHICLE
 */

var vehicle = {
	className: 'vehicle',
	updateLocation: function( routeTag ){
		var vehicles = webservice.vehicleLocationsAjax( routeTag ),
			vehiclesSelector = '.' + this.className;
		if( routeTag )
			vehiclesSelector += '[data-route-tag="' + routeTag + '"]';
		svg.selectAll( vehiclesSelector ).drawVehicle( vehicles );
	}
};

/*
 * VEHICLE TOOLS
 */

d3.selection.prototype.drawVehicle = function( json ) {
	var draw = this
		.data(json);

	/*
	 dirTag: "N__OB1"
	 heading: "266"
	 id: "1406"
	 lat: "37.76115"
	 leadingVehicleId: "1420"
	 lon: "-122.48921"
	 predictable: "true"
	 routeTag: "N"
	 secsSinceReport: "1"
	 speedKmHr: "7"
	 */
	draw.enter()
		.append( 'circle' )
		.attr("r", "4px")
		.attr("fill", "black");


	draw.attr("class", vehicle.className )
		.attr("data-route-tag", function (d) { return d.$.routeTag; } )
		.attr("data-dir-tag", function (d) { return d.$.dirTag; } )
		.attr("data-heading", function (d) { return d.$.heading; } )
		.attr("data-id", function (d) { return d.$.id; } )
		.each(function(d,i){
			$(this).popover({
				'title': d.$.routeTag,
				'content': 'For the '+ d.$.heading+'th circle',
				'placement': 'top'
			});

		})
		.on('mouseenter', function(d){
			route.select(d.$.routeTag)
		})
		.on('mouseleave', route.deselect )
		.transition()
		.attr("cx", function (d) { return projection([d.$.lon,d.$.lat])[0]; })
		.attr("cy", function (d) { return projection([d.$.lon,d.$.lat])[1]; });

	draw.exit()
		.remove();

	return draw;
};