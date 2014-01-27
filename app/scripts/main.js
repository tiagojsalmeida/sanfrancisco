var width = 1440,
    height = 960,
	isMoving = false;


function redraw() {
//	if(isMoving)
//		return false;
	console.log('test');
//	isMoving = true;
	trans = d3.event.translate;
	scale = d3.event.scale;
	d3.selectAll('path, circle').attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
//	setTimeout( function(){
//		isMoving = false;
//	},200);
}

var zoom = d3.behavior.zoom()
	.scaleExtent([-.15, 7]);


// set projection
projection = d3.geo.mercator();

// create path variable
path = d3.geo.path()
    .projection(projection);

//X = d3.scale.linear()
//	.domain([0, 6])
//	.range([0, width]);
//Y = d3.scale.linear()
//	.domain([0, 12])
//	.range([0, height]);
//
//transform = function(d) {
//	return "translate(" + (X(d.cx)) + ", " + (Y(d.cy)) + ")";
//};
//
//zoom = d3.behavior.zoom()
//	.x(X)
//	.y(Y)
//	.on("zoom", function() {
//		ortho(d3.event.scale);
////		svg.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")");
////		svg.selectAll(".map")
////			.attr("r",6/d3.event.scale)
////			.attr("stroke-width",1/d3.event.scale);
////		console.log(this);
////		console.log(svg);
////		d3.selectAll('.map')[0].transition().style("stroke", 'grey');
////
////		return d3.selectAll('.map')[0].transition().attr("transform", transform);
//
//	});



svg = d3.select("body").append("svg")
                .attr("width", width)
                .attr("height", height)
				.call(zoom.on("zoom", redraw))

projection
  .scale(308500)
  .center([-122.48, 37.80]);

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
	var routeList = webservice.routeConfigAjax( );
	route.renderAll( routeList );
	vehicle.updateLocation( 'N' );
}


var webservice = {
	basePath: 'http://webservices.nextbus.com/service/publicXMLFeed?',
	agency: 'sf-muni',
	formatUrl: function( data ){
		return this.basePath + $.param(data);
	},
	serviceAjax: function ( url, storage, objectName, formatData ){
		var self = this;
		$.ajax({
			url: url,
			dataType: 'xml',
			async: false
		}).done( function( response ){
			if(response){
				var json = $.xml2json(response.documentElement);
				if( json.body ){
					if( typeof formatData === "function" )
						json.body = formatData( json.body );
					if(storage){
						if( objectName ){
							self[storage][objectName] = json.body;
						} else {
							self[storage] = json.body;
						}
					}

				}

			}
		});
	},
	routeListStorage: {},
	routeListUrl: function(){
		var routeListData = {
			command: 'routeList',
			a: this.agency
		};
		return this.formatUrl(routeListData);
	},
	routeListAjax: function(){
		this.serviceAjax( this.routeListUrl(), 'routeListStorage' );
		return this.routeListStorage;
	},
	routeConfigStorage: {},
	routeConfigUrl: function( routeTag ){
		var routeConfigData = {
			command: 'routeConfig',
			a: this.agency
		};
		if( routeTag ){
			routeConfigData['r'] = routeTag;
		}
		return this.formatUrl(routeConfigData);
	},
	routeConfigAjax: function( routeTag ){
		this.serviceAjax( this.routeConfigUrl( routeTag ), 'routeConfigStorage', routeTag, this.routeConfigAjaxFormat );
		return this.routeConfigStorage;

	},
	routeConfigAjaxFormat: function(data){
		if( data.route ){
			var auxData = {};
			$.each( data.route, function(k,v){
				auxData[ v.$.tag ] = v;
			});
			return auxData;
		}
		return data;
	},
	vehicleLocationsStorage: [],
	vehicleLocationsStorageToUpdate: [],
	vehicleLocationsLastTime: new Date().valueOf() - 45000,
//	vehicleLocationsLastTime: 0,
	vehicleLocationsUrl: function( routeTag, time ){
		var vehicleLocationslData = {
			command: 'vehicleLocations',
			a: this.agency,
			t: time
		};
		if( routeTag ){
			vehicleLocationslData['r'] = routeTag;
		}
		return this.formatUrl(vehicleLocationslData);
	},
	vehicleLocationsAjax: function( routeTag ){
		this.serviceAjax( this.vehicleLocationsUrl( routeTag, this.vehicleLocationsLastTime ), 'vehicleLocationsStorageToUpdate', null, this.vehicleLocationsAjaxFormat );
		this.vehicleLocationsLastTime = new Date().valueOf();
//		if(routeTag){
//			return this.vehicleLocationsStorage[ routeTag ];
//		}
		return this.vehicleLocationsStorage;
	},
	vehicleLocationsAjaxFormat: function( data ){
		if( data.vehicle ){
			$.each( data.vehicle, function(k,v){
				var storageKey = false;
				if( !v || !v.$ )
					return false;
				$.grep(webservice.vehicleLocationsStorage, function(storage, key){
					if( !storage || !storage.$ )
						return false;
					var equal = storage.$.id == v.$.id;
					if(equal)
						storageKey = key;
					return equal;
				});
				if( storageKey !== false ){
					webservice.vehicleLocationsStorage[storageKey] = v;
				} else {
					webservice.vehicleLocationsStorage.push( v );
				}
			});
		}
		return webservice.vehicleLocationsStorage;
	}

};

var route = {
	renderAll: function ( routeList ){
		$.each(routeList,function(k,v){
			route.render( v );
		})
	},
	render: function( r ){
		$.each(r.path,function(key,path){
			svg.append('path')
				.attr("d", routeLineFunction(path.point) )
				.attr("class", "route" )
				.attr("data-tag", r.$.tag )
				.attr("stroke", '#' + r.$.color )
				.attr("stroke-width", 2)
				.style("stroke-opacity", 0.3)
				.attr("fill", "none");

			svg.append("path")
				.attr("d", routeLineFunction(path.point) )
				.attr("data-tag", r.$.tag )
				.attr("stroke", 'transparent' )
				.attr("stroke-width", 10)
				.attr("fill", "none")
				.each( function(){
					$(this).tooltip({
						'title': r.$.tag,
						'space': 40
					});
				})
				.on('mouseenter', function(){
					route.select(r.$.tag)
				})
				.on('mouseleave', route.deselect );

		});
	},
	select: function(routeTag){
		if(!routeTag)
			return;
		var routeClass = '.route[data-tag="' + routeTag + '"]';
		d3.selectAll('.map').style("stroke-opacity", 0.5);
		d3.selectAll('.route').style("stroke-opacity", 0.05);
		d3.selectAll(routeClass).style("stroke-opacity", 1).attr("stroke-width", 3);
	},
	deselect: function(){
		d3.selectAll('.map').style("stroke-opacity",0.7);
		d3.selectAll('.route').style("stroke-opacity", 0.3).attr("stroke-width", 2);
	}
},
routeLineFunction = d3.svg.line()
		.x(function(d) { return projection([d.$.lon,d.$.lat])[0]; })
		.y(function(d) { return projection([d.$.lon,d.$.lat])[1]; })
		.interpolate("linear");


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
 * TOOLS
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

d3.selection.prototype.drawMap = function(json, className) {
	return this
		.append("path")
		.datum(json)
		.attr("class", 'map ' + className)
		.style("fill", "none")
//		.call(zoom.on("zoom", redraw))
		.attr("d", path);
};

d3.selection.prototype.hide = function() {
	return this.style("visibility", "hidden");
//
//	return this.each(function(){
//		this.style("visibility", "hidden");
//	});
};

d3.selection.prototype.show = function() {
	return this.style("visibility", "visible");

//	return this.each(function(){
//		this.style("visibility", "visible");
//	});
};


d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.moveToBack = function() {
	return this.each(function() {
		var firstChild = this.parentNode.firstChild;
		if (firstChild) {
			this.parentNode.insertBefore(this, firstChild);
		}
	});
};