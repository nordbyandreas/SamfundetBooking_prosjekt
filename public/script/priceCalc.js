

//Function called by event listeners
function ticketCalc(bookings,stages){
	//These two are select-input fields
	let bandSelect = document.getElementById('bands')
	let stageSelect = document.getElementById('stages')
	//This is the target field when the price has been calculated
	let ticketPrice = document.getElementById('ticketPrice')
	//These two are number-input fields
	let expenses = document.getElementById('expenses')
	let extraExpenses = document.getElementById('extraExpenses')

	//Fetching values out of the select-inputs
	let chosenBands = getSelectValues(bandSelect)
	let stage = getSelectValues(stageSelect)

	//Setting temporary constants
	let capacity = 0
	//Amount of students in Trondheim. Target audience and the base of the calculation
	let studentMass = 36000
	//popularity-member in the band-model is a number between 0 and 100
	//This function treats it as a percentage. Setting it temporarily as 1/5 to keep expected audience realistic
	let popularity = 1/5
	//Followers-member is just a number of people following a certain band
	let followers = 0

	//Resetting the expenses-field, sp that it can be updated
	//automatically by adding all the booking expenses and stage expenses
	expenses.value = 0

	//Iterating through the bookings matching the selected ones, getting the expenses, popularity and followers
	for(let i = 0; i < bookings.length; i++){
		if(!bookings[i].concert_created){
			for(let j = 0; j < chosenBands.length; j++){
				let chosenBandID = chosenBands[j].split(',')[1]
				if(chosenBandID == bookings[i].band._id){
					let curExpense = Number(expenses.value)
					curExpense += Number(bookings[i].price)
					expenses.value = curExpense

					popularity *= (1/Number(bookings[i].band.spotify_popularity))
					followers += Number(bookings[i].band.spotify_followers)
				}
			}
		}
	}
	//Iterating through the stages matching the selected ones, getting the expenses and capacity
	for(let i = 0; i < stages.length; i++){
		for(let j = 0; j < stage.length; j++){
			if(stage[j] == stages[i]._id){
				let curExpense = Number(expenses.value)
				curExpense += Number(stages[i].price)
				expenses.value = curExpense
				capacity = stages[i].capacity
			}
		}
	}

	//Adding the extra expenses
	expenses.value = Number(extraExpenses.value) + Number(expenses.value)

	//Calculating expected audience
	let expectedSales = studentMass * popularity + followers/1000
	console.log("expectedSales =",studentMass,"*",popularity,"+",followers,"/ 1000 =",expectedSales)
	if (capacity < expectedSales){
		expectedSales = capacity
	}
	//Calculating the ticket price based on expected sales, aiming for 50% profit
	ticketPrice.value = Math.ceil((Number(expenses.value*1.5))/(expectedSales*10))*10

	console.log("ticketPrice.value =",expenses.value,"* 1.5 /",expectedSales)
}

//Function for fectching the band and stage IDs from the inputs
function getSelectValues(select) {
  let result = [];
  let options = select && select.options;
  let opt;

  for (let i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value /*|| opt.text*/);
    }
  }
  return result;
}

//Adding eventlisters for updating the ticket price automatically
document.addEventListener("DOMContentLoaded",function(e){
	let bookings = $.get('/api/bookings')
	let stages = $.get('/api/stages')
	$.when(bookings,stages).done(function(){
		bookings = JSON.parse(bookings.responseText)
		stages = JSON.parse(stages.responseText)

		$('#bands').on('change', function(e) {
			ticketCalc(bookings,stages)
 		 });

		$('#stages').on('change', function(e) {
			ticketCalc(bookings,stages)
 		 });

		$('#extraExpenses').on('keyup', function(e) {
			ticketCalc(bookings,stages)
 		 });

		
	})
})