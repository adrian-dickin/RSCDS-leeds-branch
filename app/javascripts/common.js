function headerScroll() {
	var handler = function() {
		var banner = $('#banner').height();
		var st = $(this).scrollTop();
		var win = $(window).height();
		var doc = $(document).height();
		if (st > 128) {
		   $('#banner').css({top: '-128px'});
		   $('#banner').addClass('shadow_under');
		} else {
		   $('#banner').css({top: -st + 'px'});
		   $('#banner').removeClass('shadow_under');
		}
	};
	$(window).scroll(handler);
	

	
	/*function changePage(newPage) {
		var parts = window.location.pathname.split('/');
		parts[parts.length - 1] = newPage;
		var newPathname = parts.join('/');
		console.log(window.location.pathname);
		console.log(newPathname);
		window.location.pathname = newPathname;
	}
	
	$('#menu-home').click(function() {
		changePage('index.html');
	});*/
};
