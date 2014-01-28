/*
 * ROUTE
 */

var route = {
	renderAll: function ( routeList ){
		var $sidebarRouteList =  d3.select('.sidebar-route-list'),
			$sidebarRouteLists = $sidebarRouteList.selectAll("li").data( d3.entries( routeList ) );

		$sidebarRouteLists.enter()
			.append('li')
			.attr('data-tag', function (d) { return  d.value.$.tag; })
			.text( function (d) { return  d.value.$.tag; })
			.append('span')
//				.attr('class', 'fa fa-chevron-right')
			.style('background',  function (d) { return '#' + d.value.$.color; } );
//				.style('color',  function (d) { return '#' + d.$.oppositeColor; } );

		$sidebarRouteLists.exit()
			.remove();

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
