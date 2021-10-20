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




