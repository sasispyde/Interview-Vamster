var express = require('express');
var app = express();

/* Enviornment variables */
require('dotenv').config();

/* Controllers */
const USER_CONTROLLER = require('./controller/users.js');

/* PORT */
const PORT = process.env.PORT || 3000;

/* For parsing the JSON */
app.use(express.json());

/* Make folder as static public folder */
app.use('/assets',express.static('public/images'));
app.use('/styles',express.static('public/stylesheet'));
app.use('/js',express.static('public/javascript'));

/* Using the controller */
app.use('/users', USER_CONTROLLER);


/* View engine so we no need to add .ejs */
app.set('view engine', 'ejs');
		
app.get('/', (req,res) => {
	let searchConfig = [
		{
			key : "underweight",
			label : "Underweight"
		},
		{
			key : "normal",
			label : "Normal weight"
		},
		{
			key : "overweight",
			label : "Over weight"
		},
		{
			key : "moderately_obese",
			label : "Moderately obese"
		},
		{
			key : "severely_obese",
			label : "Severely obese"
		},
		{
			key : "very_severely_obese",
			label : "Vary severely obese"
		}
	]
	res.render('index', {searchConfig});
})

app.listen(PORT,() => {
	console.log("Server listening...");
})