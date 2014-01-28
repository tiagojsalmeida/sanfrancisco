/*
 * UI
 */

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("active");
});

$(document).on('mouseover hover click touch tap', '.sidebar-route-list li', function(){
	route.select( $(this).attr('data-tag') );
}).on('mouseleave', function(){
		route.deselect();
});