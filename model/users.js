const { MongoClient } = require('mongodb');

const getUsers = async(requestData) => {
	const CLIENT = new MongoClient(process.env.DATABASE_URL);
	try {
		await CLIENT.connect();
		let userInfo = await CLIENT.db(process.env.DATABASE_NAME).collection('users').find({}).toArray();
		return userInfo;
	} catch(error) {
		console.log(error);
		return [];
	} finally {
		CLIENT.close();
	}
}

const getAllPatientsCount = async() => {
   const CLIENT = new MongoClient(process.env.DATABASE_URL);
   try {
      await CLIENT.connect();
      let query = [
         {
            "$sort":{
               "name":1
         }
         },
         {
            "$addFields":{
               "heightInMeter":{
                  "$divide":[
                     "$height",
                     100
                  ]
               }
            }
         },
         {
            "$addFields":{
               "BMI":{
                  "$round":[
                     {
                        "$divide":[
                           "$weight",
                           {
                              "$multiply":[
                                 "$heightInMeter",
                                 "$heightInMeter"
                              ]
                           }
                        ]
                     },
                     1
                  ]
               }
            }
         },
         {
            "$facet":{
               "users":[
                  {
                     "$count":"total_users"
                  }
               ],
               "underweight":[
                  {
                     $match : {
                        "BMI" : { $lte : 18.4 }
                     }
                  },
                  {
                     $count : "underweight"
                  }
               ],
               "normal_weight":[
                  {
                     $match : {
                        "BMI" : { $gte : 18.5, $lte : 24.9 }
                     }
                  },
                  {
                     $count : "normal_weight"
                  }
               ],
               "overweight":[
                  {
                     $match : {
                        "BMI" : { $gte : 25, $lte : 29.9 }
                     }
                  },
                  {
                     $count : "overweight"
                  }
               ],
               "moderate_obese":[
                  {
                     $match : {
                        "BMI" : { $gte : 30, $lte : 34.9 }
                     }
                  },
                  {
                     $count : "moderate_obese"
                  }
               ],
               "severe_obese":[
                  {
                     $match : {
                        "BMI" : { $gte : 35, $lte : 39.9 }
                     }
                  },
                  {
                     $count : "severe_obese"
                  }
               ],
               "very_severe_obese":[
                  {
                     $match : {
                        "BMI" : { $gte : 40}
                     }
                  },
                  {
                     $count : "very_severe_obese"
                  }
               ],
            }
         },
         {
            "$project":{
               "_id":0,
               "total_users":{
                  "$arrayElemAt":[
                     "$users.total_users",
                     0
                  ]
               },
               "underweight":{
                  "$arrayElemAt":[
                     "$underweight.underweight",
                     0
                  ]
               },
               "normal_weight":{
                  "$arrayElemAt":[
                     "$normal_weight.normal_weight",
                     0
                  ]
               },
               "overweight": {
                   $ifNull: [{
                      "$arrayElemAt":[
                         "$overweight.overweight",
                         0
                      ]
                   },0]
               },
               "moderate_obese":{
                  $ifNull : [
                      {
                          "$arrayElemAt":[
                             "$moderate_obese.moderate_obese",
                             0
                          ]
                      },
                      0
                  ]
               },
               "severe_obese":{
                  $ifNull : [
                      {
                         "$arrayElemAt":[
                             "$severe_obese.severe_obese",
                             0
                          ]
                      },
                      0
                  ]
               },
               "very_severe_obese":{
                  $ifNull : [
                      {
                          "$arrayElemAt":[
                             "$very_severe_obese.very_severe_obese",
                             0
                          ]
                      },
                      0
                  ]
               }
            }
         }
      ];
      let response = await CLIENT.db(process.env.DATABASE_NAME).collection('users').aggregate(query).toArray();
      return response;
   } catch(error) {
      console.log(error);
      return [];
   } finally {
      CLIENT.close();
   }  
}

const getAllPatientsBMIInformation = async() => {
   const CLIENT = new MongoClient(process.env.DATABASE_URL);
   try {
      await CLIENT.connect();
      let query = [
          {
              $sort : {
                  name : 1
              }
          },
          {
              $addFields : { "height_in_meter" : { $divide : [ "$height" , 100 ] } }
          },
          {
              $addFields : {
                  "BMI" : { 
                  $round : [ 
                      { 
                          $divide : [ 
                              "$weight" ,{ 
                                  $multiply: [ 
                                      "$height_in_meter", 
                                      "$height_in_meter" 
                                  ] 
                              } 
                          ]
                      }, 1]
                   }
              }
          },
          {
            $limit : 20
          },
          {
              $project : {
                  "_id" : 1,
                  "name" : 1,
                  "age" : 1,
                  "gender" : 1,
                  "BMI" : 1,
                  "height_in_meter" : 1,
                  "weight" : 1,
                  "BMI_category" : { 
                      $switch : {
                          branches : [
                              {
                                  case : {  $lte : [ "$BMI", 18.4 ] }, 
                                  then : "Underweight"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 18.5 ] },
                                      { $lte : [ "$BMI", 24.9 ] }
                                  ]},
                                  then : "Normal weight"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 25 ] },
                                      { $lte : [ "$BMI", 29.9 ] }
                                  ]},
                                  then : "Overweight"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 30 ] },
                                      { $lte : [ "$BMI", 34.9 ] }
                                  ]},
                                  then : "Moderately obese"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 35 ] },
                                      { $lte : [ "$BMI", 39.9 ] }
                                  ]},
                                  then : "Severely obese"
                              }
                          ],
                          default: "Very severely obese"
                      }
                  },
                  "health_risk" : { 
                      $switch : {
                          branches : [
                              {
                                  case : {  $lt : [ "$BMI", 18.4 ] }, 
                                  then : "Malnutrition risk"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 18.5 ] },
                                      { $lte : [ "$BMI", 24.9 ] }
                                  ]},
                                  then : "Low risk"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 25 ] },
                                      { $lte : [ "$BMI", 29.9 ] }
                                  ]},
                                  then : "Enhanced risk"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 30 ] },
                                      { $lte : [ "$BMI", 34.9 ] }
                                  ]},
                                  then : "Medium risk"
                              },
                              {
                                  case : { $and : [ 
                                      { $gte : [ "$BMI", 35 ] },
                                      { $lte : [ "$BMI", 39.9 ] }
                                  ]},
                                  then : "High risk"
                              }
                          ],
                          default: "Very high risk"
                      }
                  }
              }
          }
      ];
      let response = await CLIENT.db(process.env.DATABASE_NAME).collection('users').aggregate(query).toArray();
      return response;
   } catch(error) {
      console.log(error);
      return [];
   } finally {
      CLIENT.close();
   }
}

module.exports = {
	getUsers,
   getAllPatientsCount,
   getAllPatientsBMIInformation
}