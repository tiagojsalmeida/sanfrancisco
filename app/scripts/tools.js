/*
 * TOOLS
 */

function windowSize(){
	var size = {};
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		size.width = window.innerWidth;
		size.height = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		size.width = document.documentElement.clientWidth;
		size.height = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		size.width = document.body.clientWidth;
		size.height = document.body.clientHeight;
	}
	return size;
}

d3.selection.prototype.hide = function() {
	return this.style("visibility", "hidden");
};

d3.selection.prototype.show = function() {
	return this.style("visibility", "visible");
};