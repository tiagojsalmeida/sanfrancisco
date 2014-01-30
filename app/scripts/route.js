/*
 * ROUTE
 */

var route = {
	update: function( routeTag ){
		var routeList = webservice.routeConfigAjax( routeTag );
		route.renderAll( routeList );
	},
	renderAll: function ( routeList ){
		var $sidebarRouteList =  d3.select('.sidebar-route-list'),
			$sidebarRouteLists = $sidebarRouteList.selectAll("li").data( d3.entries( routeList ) );

		$sidebarRouteLists.enter()
			.append('li')
			.attr('data-tag', function (d) { return  d.value.$.tag; })
			.text( function (d) { return  d.value.$.tag; })
			.each( function(d){
				$(this).tooltip({
					'title': d.value.$.title,
					'placement': 'right'
				});
			})
			.append('span')
//			.style('color',  function (d) { return '#' + d.$.oppositeColor; } )
			.style('background',  function (d) { return '#' + d.value.$.color; } );

		$sidebarRouteLists.exit()
			.remove();

		$.each(routeList,function(k,v){
			route.render( v );
		});
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
						'title': r.$.title,
						'space': 40
					});
				})
				.on('mouseenter', function(){
					route.select(r.$.tag)
				})
				.on('mouseleave', route.deselect );

		});
		/*
			TODO: IMPROVE BUS STOPS
		 */
//		svg.selectAll( '.route-stop').data(r.stop)
//			.enter()
//			.append('circle')
//			.attr("r", "2px")
//			.attr("fill", "white")
//			.attr("cx", function (d) { console.log(d); return projection([d.$.lon,d.$.lat])[0]; })
//			.attr("cy", function (d) { return projection([d.$.lon,d.$.lat])[1]; })
//			.each( function(d){
//				$(this).tooltip({
//					'title': d.$.title,
//					'space': 40
//				});
//			});
	},
	select: function(routeTag){
		if(!routeTag)
			return;
		var routeClass = '.route[data-tag="' + routeTag + '"]',
			vehicleClass = '.' + vehicle.className + '[data-route-tag="' + routeTag + '"]';

		d3.selectAll('.map').hideMap();
		d3.selectAll('.route:not(.active)').routeHide();
		d3.selectAll('.' + vehicle.className + ':not(.active)').vehicleHide();
		d3.selectAll( routeClass ).routeShow();
		d3.selectAll( vehicleClass ).vehicleShow();
	},
	deselect: function(){
		if(d3.selectAll('.route.active').empty()){
			d3.selectAll('.map').showMap();
			d3.selectAll('.route:not(.active)').routeNormal();
			d3.selectAll('.' + vehicle.className + ':not(.active)').vehicleShow();

		} else {
			d3.selectAll('.route:not(.active)').routeHide();
			d3.selectAll('.' + vehicle.className + ':not(.active)').vehicleHide();
			d3.selectAll('.route.active').routeShow();
			d3.selectAll('.' + vehicle.className + '.active').vehicleShow();
		}
	}
},
routeLineFunction = d3.svg.line()
		.x(function(d) { return projection([d.$.lon,d.$.lat])[0]; })
		.y(function(d) { return projection([d.$.lon,d.$.lat])[1]; })
		.interpolate("linear");


/*
 * ROUTE TOOLS
 */

d3.selection.prototype.vehicleShow = function() {
	return this.style("opacity", 1);
};

d3.selection.prototype.vehicleHide = function() {
	return this.style("opacity", 0.3);
};

d3.selection.prototype.routeHide = function() {
	return this.style("stroke-opacity", 0.05).attr("stroke-width", 2);
};

d3.selection.prototype.routeNormal = function() {
	return this.style("stroke-opacity", 0.3).attr("stroke-width", 2);
};

d3.selection.prototype.routeShow = function() {
	return this.style("stroke-opacity", 1).attr("stroke-width", 3);
};

d3.selection.prototype.hideMap = function() {
	return this.style("stroke-opacity", 0.5);
};

d3.selection.prototype.showMap = function() {
	return this.style("stroke-opacity", 0.7);
};