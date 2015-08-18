function expandPanel() {
	$('.details').click(function(event) {
		event.stopPropagation();
		$('.eventDetails:visible').slideUp();

		var row = $(this).closest('.heading-panel_row');
		$('.eventDetails', row).slideDown();
	});

	$('.heading-panel_row').click(function() {
		$('.eventDetails:visible').slideUp();

		var row = $(this);
		$('.eventDetails', row).slideDown();
	});

};