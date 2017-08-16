//

// Frontend script for rendering mongoose model concert events in fullcalendar


var colors = {
    /*Edgar:"#4286f4",
    Strossa:"#f4e542",
    Storsalen:"#f44242",
    Klubben:"#42f445",
    Knaus:"#42f4e8",*/
    Annen:"#8342f4"
}

// Start script when the DOM is ready
$(document).ready(function(){

	// The site has en exposed REST-like API for getting the concert events
	// This seems to be the best way to cleanly get the information from the database and to frontend scripts
	// This method uses jQuerys HTTP(S) GET request method to get and parse the concert information from the API
    var concerts = $.get("/api/concerts")
    	// Each event needs to be parsed to the right format for the calendar

    var bookings = $.get("/api/bookings")

    var stages = $.get("/api/stages")

    /*$.when(concerts).done(function(){
        concerts = concerts.responseText
    })
    $.when(bookings).done(function(){
        bookings = bookings.responseText
    })
    $.when(stages).done(function(){
        stages = stages.responseText
    })*/

    $.when(concerts,bookings,stages).done(function(){

        //console.log('concerts: '+JSON.stringify(concerts))

        // When the objects are returned from the Async GET request, they come with more of the HTTP response than we need, we only use the resposeText
        // We cant get the response in the variable declaration because the request is asyncronous, so we get it after the requests are done
        // Since the response is stored as text (string) we need to parse it back into JSON to use it
        concerts = JSON.parse(concerts.responseText)
        bookings = JSON.parse(bookings.responseText)
        stages = JSON.parse(stages.responseText)

        var stage_colors = {}
        for (var i = 0; i<stages.length; i++) {
            stage_colors[stages[i].name] = stages[i].color
        }

        var events = []

        for(var i = 0; i<concerts.length; i++){
            var color = stage_colors[concerts[i].stage]
            if (color == undefined){
                color = colors.Annen
            }

            // Stored dates are in YY-MM-DD format, but the calendar takes it in YY-DD-MM format
            // Therefore we must split the date and puzzle it back together later
            var date = concerts[i].date.split('-')


            // Create the JSON-object for the calendar event
            var color = "#8342f4"
            var name = "Ukjent"

            if (concerts[i].stage && concerts[i].stage.color) {
                color = concerts[i].stage.color
            }
            if (concerts[i].stage && concerts[i].stage.name) {
                name = concerts[i].stage.name
            }
            var d = {
                color:color,
                // To keep concistency, the event uses the same id as the database object
                id:concerts[i]._id,
                // Show each stage and the name of the concert in the calendar
                // We should maybe give each stage its own dedicated color to keep the calendar both interesting and easier to read
                title:name + ' : ' + concerts[i].name,
                // We put the date back together in the YY-DD-MM format and add the time of day for event-start with added second precision
                start:date[0] + date[1] + date[2] + 'T' + concerts[i].time + ':00',
                // The URL represents what page you get pushed to when you click the event in the calendar, redirects to event page
                url: '/concert/' + concerts[i].name
            }
            // For each event, push to events array which is piped into the calendar
            events.push(d)
        }

        for(var i = 0; i<bookings.length; i++){

            // Create the JSON-object for the calendar event
            var approval = ""

            if (bookings[i].sent){
                approval = "sendt"
            } else if (bookings[i].approval) {
                approval = "godkjent"
            } else {
                approval = "foreslått"
            }

            var d = {
                color:"gray",
                // To keep concistency, the event uses the same id as the database object
                id:bookings[i]._id,
                // Show each stage and the name of the concert in the calendar
                // We should maybe give each stage its own dedicated color to keep the calendar both interesting and easier to read
                title:bookings[i].band.name + ' : ' + approval,
                start:bookings[i].date + 'T' +'00:00:00',
                // The URL represents what page you get pushed to when you click the event in the calendar, redirects to event page
                url: '/booking/' + bookings[i].url
            }
            // For each event, push to events array which is piped into the calendar
            if (!bookings[i].concert_created) {
                events.push(d)
            }
        }
        


        //console.log(JSON.stringify(events))

        // Render fullcalendar
        $('#calendar').fullCalendar({

            // Add parsed events to the calendar
            events:events,
            weekNumberCalculation:"ISO",
            timeFormat: 'H:mm'
        })
    })
})

