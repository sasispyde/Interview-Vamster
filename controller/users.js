const express = require('express');
const router = express.Router();

/* Model file */
const { getUsers, getAllPatientsCount, getAllPatientsBMIInformation } = require('../model/users.js');

router.get('/', async(req,res) => {
	let response = await getUsers({});
	res.send(response);
})

router.get('/count_each_users', async(req,res) => {
	let response = await getAllPatientsCount();
	res.send(response[0] ?? {});
})

router.get('/bmi_information', async(req,res) => {
	let response = await getAllPatientsBMIInformation();
	res.send(response ?? []);
})

module.exports = router;