function headerScroll() {
	var handler = function() {
		var banner = $('#banner').height();
		var st = $(this).scrollTop();
		var win = $(window).height();
		var doc = $(document).height();
		if (st > 108) {
		   $('#banner').css({top: '-108px'});
		   $('#banner').addClass('shadow_under');
		   $('.banner-logo').css({opacity: 0});
		} else {
		   $('#banner').css({top: -st + 'px'});
		   $('#banner').removeClass('shadow_under');
		   
		   $('.banner-logo').css({opacity: (1 - st/108)});
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

function handleMaps() {
	$('.map-link').click(function() {
		var map = $(this).attr('data-link');
		window.open(map);
	});
}

function eventLinks() {
	$('#upcoming-events tr.row-link').click(function() {
		window.location = "events.html";
	});
}

function setupMenu() {
  $('#main-menu').smartmenus();
  	
  var $mainMenuState = $('#main-menu-state');
  if ($mainMenuState.length) {
    // animate mobile menu
    $mainMenuState.change(function(e) {
      var $menu = $('#main-menu');
      if (this.checked) {
        $menu.hide().slideDown(250, function() { $menu.css('display', ''); });
      } else {
        $menu.show().slideUp(250, function() { $menu.css('display', ''); });
      }
    });
    // hide mobile menu beforeunload
    $(window).bind('beforeunload unload', function() {
      if ($mainMenuState[0].checked) {
        $mainMenuState[0].click();
      }
    });
  }
}
