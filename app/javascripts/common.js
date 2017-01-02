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
