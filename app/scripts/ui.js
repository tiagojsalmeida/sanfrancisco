/*
 * UI
 */

$('.nano').nanoScroller();

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("active");
});

$(document).on('mouseover hover', '.sidebar-route-list li', function(e){
	route.select( $(this).attr('data-tag') );
}).on('mouseleave mouseout', '.sidebar-route-list li', function(){
	route.deselect();
}).on('click touch tap', '.sidebar-route-list li', function(){
	var routeTag = $(this).attr('data-tag'),
		routeClass = '.route[data-tag="' + routeTag + '"]',
		vehicleClass = '.' + vehicle.className + '[data-route-tag="' + routeTag + '"]';

	d3.selectAll(routeClass).attr('class', 'route' + (!$(this).hasClass('active') ? ' active' : ''));
	d3.selectAll(vehicleClass).attr('class',  '.' + vehicle.className + (!$(this).hasClass('active') ? ' active' : ''));
	$(this).toggleClass('active').find('span').toggleClass('fa fa-check');
	route.select( routeTag );
});

