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

function showToday() {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth() + 1;
	var id = "#day-" + day + "-" + month;
	$(id).addClass('today');
}

function calendarPopovers() {
	$(function () {
		console.log('calendarPopovers');
		console.log($('[data-toggle="popover"]').length);
	  $('[data-toggle="popover"]').popover({
			trigger: "focus",
			title: "Events",
			placement: "auto",
			html: true,
			viewport: '.calendar',
			content: function() {
				console.log('content');
				var id = $(this).attr('data-id');
				var eventData = events[id];
				var html = '';
				eventData.forEach(function(event) {
					html += `<div>${event.name}<div>`;
				});
				console.log(eventData);
				return html;
				//events
			}
		})
	});
}
