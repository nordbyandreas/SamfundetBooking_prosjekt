$(document).ready(function(){
	$(".chosen-select").chosen({
		disable_search_threshold: 10,
		no_results_text: "Booking ikke funnet: ",
		
	})
});

$('select').on('change', function () {
    var selectedGroup = $('option:selected', this).parent();
    $('optgroup', this).not(selectedGroup).prop('disabled', true);
});