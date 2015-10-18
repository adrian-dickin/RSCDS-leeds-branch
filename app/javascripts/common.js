function headerScroll() {
	var handler = function() {
		var banner = $('#banner').height();
		var st = $(this).scrollTop();
		var win = $(window).height();
		var doc = $(document).height();
		if (st > 128) {
		   $('#banner').css({top: '-128px'});
		   $('#banner').addClass('shadow_under');
		   $('.banner-logo').css({opacity: 0});
		} else {
		   $('#banner').css({top: -st + 'px'});
		   $('#banner').removeClass('shadow_under');
		   
		   $('.banner-logo').css({opacity: (1 - st/128)});
		}
	};
	$(window).scroll(handler);

	handler();
};
