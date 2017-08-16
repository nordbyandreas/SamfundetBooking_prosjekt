

//
// This script exists to create a finished database of object for the project to run from
// Since the project is under constant development, this makes it easier to rebuild the entire database from scratch
// THis again makes it easier when we make changes to the models, you just change the models here, and you don't have to manually crerate all the objects all over again
//

var express	  =	 require('express')
var mongoose  =	 require('mongoose')

var db		  =	 require('./config/database.js')

var Stage	  =	 require('./models/Stage.js')
var Concert	  =	 require('./models/Concert.js')
var Band	  =	 require('./models/Band.js')
var Booking	  =	 require('./models/Booking.js')
var User	  =  require('./models/user.js')

mongoose.connect(db.url)

//console.log(JSON.stringify(Band.schema))
User.find({}, function (err, users) {
	if (err) { console.log(err); }
	if (users == undefined || users.length == 0) {
		var user = new User();
		user.local.username = 'admin'
		user.local.password = user.generateHash('admin')
		user.fullname = 'System Administrator'
		user.role = 'admin'
		user.save()
		console.log('admin created');
	} else {
		console.log('admin allready created');
	}
})


Stage.find({}, function (err, stages) {
	if (err) {
		console.error(err)
	}
	if (stages === undefined || stages.length == 0) {
		Stage.create([
			{
				//_id:'H1KUmVAR',
				name:'Edgar',
				price:'2000',
				capacity:'100',
				concerts:[],
				color:'#4286f4',
                image: 'http://foto.samfundet.no/media/alle/web/DIGFK/digfk0699.jpg',
				concerts:[],
				bands:[],
			},
			{
				//_id:'SkgtUmVCA',
				name:'Strossa',
				price:'1690',
				capacity:'130',
				concerts:[],
				color:'#f4e542',
                image: 'https://www-rails.samfundet.no/upload/images/image_files/000/000/152/large/digfj0355.JPG?1414412169',
				concerts:[],
				bands:[],
			},
			{
				//_id:'Sy-Y8XV0R',
				name:'Storsalen',
				price:'5000',
				capacity:'500',
				concerts:[],
				color:'#f44242',
                image: 'http://www.universitetsavisa.no/incoming/article58038.ece/22r6en/ALTERNATES/w980-default/full-storsal-under-delillos-konsert-p-ntnu-festen-2016_26875301144_o.jpg',
				concerts:[],
				bands:[],
			},
			{
				//_id:'H1ftIQVCA',
				name:'Klubben',
				price:'2500',
				capacity:'175',
				concerts:[],
				color:'#42f445',
                image: 'https://www-rails.samfundet.no/upload/images/image_files/000/000/163/original/digff0114.jpg?1414427492',
				concerts:[],
				bands:[],
			},
			{
				//_id:'BkXK874RA',
				name:'Knaus',
				price:'3500',
				capacity:'250',
				concerts:[],
				color:'#42f4e8',
                image: 'https://www-rails.samfundet.no/upload/images/image_files/000/000/164/original/digfj0160.jpg?1414427713',
				concerts:[],
				bands:[],
			},
            {
				//ingen id//
				name:'Bodegaen',
				price:'2200',
				capacity:'200',
				concerts:[],
				color:'#4006f4',
                image: 'https://www.samfundet.no/upload/images/image_files/000/000/714/original/digfo0679.jpg?1460719783',
				concerts:[],
				bands:[],
			},
		])
		console.log('Created stages')
	} else {
		console.log('Stages already created')
	}
})

/*Concerts.find({}, function (err, concerts) {
	if (err) {
		console.error(err)
	}
	if (!concerts) {
		Concerts.create([
			{
				_id:"B1Uekw90",
				name:"Jay-Z, Finally in T-town",
				genre:"Hiphop",
				stage:"Storsalen",
				audSize:450,
				date:"2016-10-08",
				time:"22:00",
				bandIDs:[
					{
						name:"Jay Z",
						id:""
					}],
				bands:["JAY Z"]
			},
			{
				_id:"HyMG1P9C",
				name:"Highasakite",
				genre:"norwegian indie, norwegian pop",
				stage:"Storsalen",
				audSize:10000,
				date:"2016-10-14",
				time:"22:00",
				bandIDs:[
					{
						name:"Highasakite",
						id:"B1V_AU9C"
					}],
				bands:["Highasakite"]
			},
			{
				_id:"SkVVkv9R",
				name:"Highasakite Ekstrakonsert",
				genre:"norwegian indie, norwegian pop",
				stage:"Storsalen",
				audSize:10000,
				date:"2016-10-15",
				time:"22:00",		
				bandIDs:[
					{
						name:"Highasakite",
						id:"B1V_AU9C"
					}],
				bands:["Highasakite"]
			},
			{
				_id:"SkjV1w50",
				name:"Muse i Trondheim",
				genre:"Alternativ",
				stage:"Edgar",
				audSize:null,
				date:"2016-10-28",
				time:"21:00",		
				bandIDs:[
					{
						name:"Muse",
						id:""
					}],
				bands:["Muse"]
			},
			{
				_id:"SJTw1wqA",
				name:"Metallica",
				genre:"Heavy Metal",
				stage:"Strossa",
				audSize:,
				date:"2016-10-29",
				time:"22:00",
				bandIDs:[
					{
						name:"Metallica",
						id:""
					}],
				bands:["Metallica"]
			},
			{
				_id:"HkhdkPqR",
				name:"Drake",
				genre:"HipHop",
				stage:"Edgar",
				audSize:300,
				date:"2016-11-19",
				time:"23:00",
				bandIDs:[
					{
						name:"Drake",
						id:"HyROTLqA"
					}],
				bands:["Drake"]
			},
			{
				_id:"HkHblv9A",
				name:"Jaga i Trondheim",
				genre:"Elektronika",
				stage:"Storsalen",
				audSize:null,
				date:"2016-09-24",
				time:"22:00",
				bandIDs:[
					{
						name:"Jaga Jazzist",
						id:"ryX0pIqA"
					}],
				bands:["Jaga Jazzist"]
			},
			{
				_id:"ByDZlPcR",
				name:"The Big 4",
				genre:"Heavy Metal",
				stage:"Edgar",
				audSize:300000,
				date:"2016-11-12",
				time:"20:00",
				bandIDs:[
					{
						name:"Metallica",
						id:""
					},
					{
						name:" Slayer",
						id:""
					},
					{
						id:"",
						name:" Anthrax"
					},
					{
						id:"",
						name:" Megadeth"
					},
					{
						id:"",
						name:" Anthrax"
					},
					{
						id:"",
						name:" Megadeth"
					}],
				bands:["Metallica"," Slayer"," Anthrax"," Megadeth"]
			},
			{
				_id:"S1CJlvqC",
				name:"Bieber på Samfundet",
				genre:"Pop",
				stage:"Strossa",
				audSize:400,
				date:"2016-09-22",
				time:"20:00",
				bandIDs:[
					{
						name:"Justin Bieber",
						id:"rkyEpLcC"
					}],
				bands:["Justin Bieber"]
			},
			{
				_id:"H1PkydqA",
				name:"Drake",
				genre:"HipHop",
				stage:"Strossa",
				audSize:2000,
				date:"2016-12-10",
				time:"02:00",
				bandIDs:[
					{
						name:"Drake",
						id:"HyROTLqA"
					}],
				bands:["Drake"]
			}
		])
		console.log('Created concerts')
	} else {
		console.log('Concerts already created')
	}
})*/
