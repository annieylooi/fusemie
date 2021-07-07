// =============================== Variables =====================================================
var w;
var windowSize = $(window).width();
var scrolling;
// ========================== end of variables ==================================================

$(document).ready(function(){

	w = $(window).width();


	// generate object
	var general_obj = {
		init : function() {
			general_obj.smoothScrolling($('body'), 100);
		},

		smoothScrolling : function(element, offset, duration) {
			var fromTop = offset || 0;
			var duration = duration || 500;

		    $('html, body').animate({scrollTop: element.offset().top - fromTop}, duration);
		}
	};

	general_obj.init();

})

