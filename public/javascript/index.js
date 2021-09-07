let data = [
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
	{
		name : "sasi",
		age : 23,
		gender : "Male",
		BMI : 18.56,
		BMI_category : "Normal",
		height : 170,
		weight : 57,
		health_risk : "Low Risk"
	},
];

const addTableRow = (data) => {
	data.forEach((user, index) => {
		let tableRow 		= document.createElement('tr');

		let serialNumber 	= document.createElement('td');
		serialNumber.innerHTML = index + 1;

		let name 			= document.createElement('td');
		name.innerHTML = user.name;

		let age 			= document.createElement('td');
		age.innerHTML = user.age;

		let gender 			= document.createElement('td');
		gender.innerHTML = user.gender;

		let height 			= document.createElement('td');
		height.innerHTML = user.height_in_meter + " cm";

		let weight 			= document.createElement('td');
		weight.innerHTML = user.weight + " kg";

		let BMI 			= document.createElement('td');
		BMI.innerHTML = user.BMI;

		let BMI_category 	= document.createElement('td');
		BMI_category.innerHTML = user.BMI_category;

		let health_risk 	= document.createElement('td');
		health_risk.innerHTML = user.health_risk;

		tableRow.append(serialNumber);
		tableRow.append(name);
		tableRow.append(age);
		tableRow.append(gender);
		tableRow.append(height);
		tableRow.append(weight);
		tableRow.append(BMI);
		tableRow.append(BMI_category);
		tableRow.append(health_risk);

		let tableBody = document.getElementById('table-body');
		tableBody.append(tableRow);
	})
}

const getUsersCount = async() => {
	let response = await axios.get('/users/count_each_users');

	let countSpinners = document.getElementsByClassName('count-spinner');
	if(countSpinners) {
		for(let i = 0; i < countSpinners.length; i++) {
			countSpinners[i].style.display = "none";
			countSpinners[i].nextElementSibling.style.display = "block";
		}
	}

	document.getElementById('total_users').innerHTML = response?.data?.total_users ?? 0;
	document.getElementById('underweight_patient').innerHTML = response?.data?.underweight ?? 0;
	document.getElementById('normal_patient').innerHTML = response?.data?.normal_weight ?? 0;
	document.getElementById('overweight_patient').innerHTML = response?.data?.overweight ?? 0;
	document.getElementById('moderate_patient').innerHTML = response?.data?.moderate_obese ?? 0;
	document.getElementById('severely_patient').innerHTML = response?.data?.severely_obese ?? 0;
	document.getElementById('very_severely_patient').innerHTML = response?.data?.very_severe_obese ?? 0;
}

const getUserBMIInfo = async() => {
	let response = await axios.get('/users/bmi_information');

	/* Remove initial loader */
	let loader = document.getElementById('table-spinner-container');
	if(loader) loader.remove();

	addTableRow(response.data ?? []);
}

const multipleNetworkCall = async () => {
	try {
      await Promise.all([
 		getUsersCount(),
		getUserBMIInfo()
      ]);
    } catch(err) {
      alert(err.message ?? "Connection failed...");
    }
}

multipleNetworkCall();