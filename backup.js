router.get('/',(req, res) => {
    console.log("$$$", "getchange");
    changeLog.find()
    .sort({ createdAt : -1 })
    .limit(2)
    .exec((err, changes) => {
        if(err) {
            res.status(500).json({
                error : err
            });
        } 
        else {
                if(changes.length > 0) {

                    const response = changes.map((item) => {
                            return {
                                id : item._id,
                                title : item.title,
                                category : item.category,
                                body : item.body
                            }
                    });
                    res.status(200).json({
                        changeList : response,
                        count : changes.length
                    });

                     } else {
                        res.status(404).json({
                            message : "changeLog not found"
                        });
                     }          
            }
    });

});

// segment code for customers

// var firstCondition = req.body.data[0].filter((item) => {
//     return item.condition;
// })

// var firstConditionValues = req.body.data[0].filter((item) => {
//     return !item.condition;
// })


// var firstQueryValue = (firstConditionValues.length >  0) &&
// ( firstConditionValues.map((item) => {
//       var innerobj = {};
//       var outerObj = {};
//     innerobj[item.operator] = item.propValue;
//     outerObj[item.propName] = innerobj;
//     return outerObj;
// })
// );
// console.log("$", firstQueryValue);

// var secondCondition = req.body.data[1].filter((item) => {
//     return item.condition;
// })

// var secondConditionValues = req.body.data[1].filter((item) => {
//     return !item.condition;
// });

// var secondQueryValue = (secondConditionValues.length >  0) &&
// ( secondConditionValues.map((item) => {
//       var innerobj = {};
//       var outerObj = {}
//     innerobj[item.operator] = item.propValue;
//     outerObj[item.propName] = innerobj;
//     return outerObj;
// })
// );
// console.log("$$", secondQueryValue);


// var queryObj = {};
// var resultObj = {};
// if(firstCondition.length > 0) {
//     queryObj[firstCondition[0].condition] = firstQueryValue
//     if(secondCondition.length > 0) {
//         resultObj[secondCondition[0].condition] = secondQueryValue;
//         resultObj[secondCondition[0].condition].push(queryObj);
//     } 
// } 

// var result = resultObj;

// console.log(result);
//     var obj = {};
//     var objWrap = {};
//     obj[operator] = propValue;
//     objWrap[propName] = obj;

//    var  output = [[
//         { name : { $eq :"ram"}},
//         {condition : "$or"},
//         {name : { $eq :"prag"}}
//    ]
//     ];

    // var filteredData = req.body.data((item) => {
    //     console.log("$$$$", item);
    // });


    function fetchCustomers(segment) {

        
        const renameKeys = (obj) =>
        Object.keys(obj).reduce(
          (acc, key) => ({
            ...acc,
            ...{ ["$"+key]: obj[key] }
          }),
          {}
        );


        function keyChange(condition) {
      
            let queryObj =  Object.keys(condition).map((item) => {
    
                 
            if(item == "and" || item == "or") {
                 let outerCondition = renameKeys(condition);
       
                    var innerQuery =  Object.keys(outerCondition).map((item) => {
                         
                         var innerCondition = outerCondition[item].map((item) => {
                             
                             let innerProp = Object.keys(item).map((data) => {
                                 console.log("$$",item);
                                 console.log("$$$",data);
                                 if(data == "and" || data == "or") {
                                    var properties = renameKeys(item);
                               
                                        let innerProperties = Object.keys(properties).map((item) => {
                                       
                            
                                               var props = properties[item].map((item) => {
                                                   let keys = Object.keys(item);
                                                   let val = renameKeys(item[keys[0]]);
                                                   item[keys[0]] = val;
                                                   return item;
                                                   
                                               });
                                               properties[item] = props;
                                               //console.log(props);
                                               //console.log("$$$",properties);
                                               return properties;
                                               
                                           
                                        });
                                        
                                            return innerProperties[0];
                                 } else {
                        
                                    const keys = Object.keys(item);
                                     var val = renameKeys(item[keys[0]]);
                                     item[keys[0]] = val; 
                                     return item;

                                 }

                             });
                              
                        console.log(innerProp[0]);
                         return innerProp[0];
                             
                         });
                         console.log("####",innerCondition);
                        
                     return innerCondition;
                         
                     });
                     outerCondition["$"+item] = innerQuery[0];
                     console.log(outerCondition);
        
                     return outerCondition;
                 } else {
                     console.log("else part");
                      const keys = Object.keys(condition);
                       var val = renameKeys(condition[keys[0]]);
                       condition[keys[0]] = val; 
                       return condition;
                 }
                
             });
            console.log("###",queryObj);
           return queryObj[0];
             
         }
        }



        /*const renameKeys = (obj) =>
        Object.keys(obj).reduce(
          (acc, key) => ({
            ...acc,
            ...{ ["$"+key]: obj[key] }
          }),
          {}
        );


        function keyChange(condition) {

            if(condition == null) {
                return {};
            }
      
            let queryObj =  Object.keys(condition).map((item) => {
    
                 
            if(item == "and" || item == "or") {
                 let outerCondition = renameKeys(condition);
       
                    var innerQuery =  Object.keys(outerCondition).map((item) => {
                         
                         var innerCondition = outerCondition[item].map((item) => {
                             
                             let innerProp = Object.keys(item).map((data) => {
                                 console.log("$$",item);
                                 console.log("$$$",data);
                                 if(data == "and" || data == "or") {
                                    var properties = renameKeys(item);
                               
                                        let innerProperties = Object.keys(properties).map((item) => {
                                       
                            
                                               var props = properties[item].map((item) => {
                                                   let keys = Object.keys(item);
                                                   let val = renameKeys(item[keys[0]]);
                                                   item[keys[0]] = val;
                                                   return item;
                                                   
                                               });
                                               properties[item] = props;
                                               //console.log(props);
                                               //console.log("$$$",properties);
                                               return properties;
                                               
                                           
                                        });
                                        
                                            return innerProperties[0];
                                 } else {
                        
                                    const keys = Object.keys(item);
                                     var val = renameKeys(item[keys[0]]);
                                     item[keys[0]] = val; 
                                     return item;

                                 }

                             });
                              
                        console.log(innerProp[0]);
                         return innerProp[0];
                             
                         });
                         console.log("####",innerCondition);
                        
                     return innerCondition;
                         
                     });
                     outerCondition["$"+item] = innerQuery[0];
                     console.log(outerCondition);
        
                     return outerCondition;
                 } else {
                     console.log("else part");
                      const keys = Object.keys(condition);
                       var val = renameKeys(condition[keys[0]]);
                       condition[keys[0]] = val; 
                       return condition;
                 }
                
             });
            console.log("###",queryObj);
           return queryObj[0];
             
         }*/

