const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({

        accId : { type : String, default : null},
        name : { type : String, default : null},
        email : { 
            type : String,
            required : true,
            match : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            },
        customizedProps : { type : mongoose.Schema.Types.Mixed, default  : null},
        likedPosts : { type : Array, default : null},
        dislikedPosts : { type: Array, default : null}
},
{
         timestamps: true 
});

module.exports = mongoose.model('Customer', customerSchema);


// customerDetails : [{
//     name : String,
//     email : String,
//     subscription : String
// }]
// customerDetails : Array

// have to send both key and value to filter customer as we dont have
//a fixed key to save the customer

// accId should get associated to each customer to 
// get customers for specific accpunt

  // var filter = {
	// 	"$and" : [
	// 		{
	// 		"$or" : [{"name" : { "$eq" : "ram"}},{"name" : { "$eq" : "prag"}}]
	// 		},
	// 		{
	// 		"$or" : [{ "email": {"$eq" : "prag@gmail.com" }}, { "email": {"$eq" :"ram@gmail.com"}}]
	// 		}
			
	// 	]
    // };



    /*const renameKeys = (obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ ["$"+key]: obj[key] }
      }),
      {}
    );
   var arr = [
              {
              "or" : [{"customizedProps.plan" : { "$eq" : "starter"}},{"customizedProps.plan" : { "$eq" : "prime"}}]
              },
              {
              "or" : [{ "customizedProps.rental": {"$eq" : "monthly" }}, { "customizedProps.rental": {"$eq" :"yearly"}}]
              }
              
          ];
          
      var finalval =	arr.map((item)  => {
              return renameKeys(item);
          });
  
  var queryObj = {};
  queryObj["$and"] = finalval;
  
  console.log(queryObj);
  
  
  var innerarr = [{"customizedProps.plan" : { "eq" : "starter"}},{"customizedProps.plan" : { "eq" : "prime"}}];
  
  
  innerarr.map((item) =>{
  
      const keys = Object.keys(item);
      var val1 = renameKeys(item[keys[0]]);
      item[keys[0]] = val1;
      
      console.log(item);
  })*/


 /*const renameKeys = (obj) =>
    Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ ["$"+key]: obj[key] }
      }),
      {}
    );
   var arr = [
              {
              "or" : [{"customizedProps.plan" : { "$eq" : "starter"}},{"customizedProps.plan" : { "$eq" : "prime"}}]
              },
              {
              "or" : [{ "customizedProps.rental": {"$eq" : "monthly" }}, { "customizedProps.rental": {"$eq" :"yearly"}}]
              }
            ];
          
      var finalval =	arr.map((item)  => {
              return renameKeys(item);
          });
  
  var queryObj = {};
  queryObj["$and"] = finalval;
  
  
  var innerarr = [{"customizedProps.plan" : { "eq" : "starter"}},{"customizedProps.plan" : { "eq" : "prime"}}];
  
  
  innerarr.map((item) =>{
  
      const keys = Object.keys(item);
      var val1 = renameKeys(item[keys[0]]);
      item[keys[0]] = val1;
     
  })
  
  
  function keyChange(condition) {
      
      Object.keys(condition).map((item) => {
          
          if(item == "and" || item == "or") {
              var outerCondition = renameKeys(condition);

              Object.keys(outerCondition).map((item) => {
                  var innerCondition = outerCondition[item].map((item) => {
                      var result = renameKeys(item);
                      console.log(result);
                  });
                  
              });
          } else {
               const keys = Object.keys(condition);
                var val1 = renameKeys(condition[keys[0]]);
                console.log(val1);
          }
         
      })
  }
  
  var condition = {
       "and" : [
              {
              "or" : [{"customizedProps.plan" : { "$eq" : "starter"}},{"customizedProps.plan" : { "$eq" : "prime"}}]
              },
              {
              "or" : [{ "customizedProps.rental": {"$eq" : "monthly" }}, { "customizedProps.rental": {"$eq" :"yearly"}}]
              }
            ]  
   };
  
  
 keyChange(condition);*/
  
  
  
  







  



