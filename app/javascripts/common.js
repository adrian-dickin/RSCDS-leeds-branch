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

function handleEmailLinks() {
	$('a.emailLink').click(function() {
		var encodedEmail = $(this).attr('data-addr');
		var email = encodedEmail.replace('\xAA', 'e').replace('\xA9', 'a').replace('\xAB', '@').replace('\xAC', '.');
		$(this).attr('href', 'mailto:' + email);
	});
}
