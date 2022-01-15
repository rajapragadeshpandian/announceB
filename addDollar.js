const renameKeys = (obj) =>
    Object.keys(obj).reduce(
        (acc, key) => {
            return {
                ...acc,
                ...{ ["$" + key]: obj[key] }
            }
        },
        {}
    );

const keys = (obj) => {
    return Object.keys(obj);
}

const appendDollarObj = (condition) => {
    let keys = Object.keys(condition);
    var val = renameKeys(condition[keys[0]]);
    condition[keys[0]] = val;
    return condition;
}
//const che

function addDollar(condition1) {
    const keys1 = keys(condition1);

    const queryObj = keys1.reduce((acc, item) => {

        if (item == "and" || item == "or") {

            const condition2 = condition1[item].map((data) => {
                const keys2 = keys(data);

                const queryObj2 = keys2.reduce((acc, item) => {
                    if (item == "and" || item == "or") {

                        console.log(data[item]);
                        const condition3 = data[item].map((data) => {
                            const keys3 = keys(data);

                            const queryObj3 = keys3.reduce((acc, item) => {
                                if (item == "and" || item == "or") {
                                    //console.log(data[item]);

                                    let condition4 = data[item].map((data) => {
                                        return appendDollarObj(data);
                                    })
                                    console.log(condition4);
                                    data[item] = condition4;
                                    return renameKeys(data);

                                } else {
                                    return appendDollarObj(data);
                                }
                            }, {})
                            console.log(queryObj3);
                            return queryObj3;
                        })//condition 3 end
                        console.log(condition3);
                        data[item] = condition3;
                        return renameKeys(data);
                    } else {
                        return appendDollarObj(data);
                    }
                }, {});// queryObj2 end

                console.log("queryobj2", queryObj2);
                return queryObj2;

            })//condition2 end
            console.log(condition2);
            condition1[item] = condition2;
            return renameKeys(condition1);

        } else {
            return appendDollarObj(condition1);
        }

    }, {})//queryObj end
    console.log(queryObj);
    return queryObj;

}


var filter = {
    "condition": {
        "and": [
            {
                "or": [{ "email": { "eq": "rp@gmail.com" } }, { "plan": { "eq": "starter" } }]
            },
            {
                "or": [{ "email": { "eq": "ram@gmail.com" } }, { "plan": { "eq": "agency" } }]
            }

        ]
    }
};

// console.log(addDollar(filter.condition));
addDollar(filter.condition);





//	"condition" : {"email" : { "eq" : "ram@gmail.com"}} ==> working fine

// 	"condition" : {
// 			"or" : [{"email" : { "eq" : "ram@gmail.com"}},{"plan" : { "eq" : "agency"}}]
// 	} ==> working fine

// "condition" : {
// 		"and" : [
// 			{"email" : { "eq" : "ram@gmail.com"}},
// 			{
// 			"or" : [{"email" : { "eq" : "ram@gmail.com"}},{"plan" : { "eq" : "agency"}}]
// 			}

// 		]
// 	} ==> workinh fine

// "condition" : {
// 		"and" : [
// 			{"email" : { "eq" : "ram@gmail.com"}},
// 			{"plan" : { "eq" : "agency"}}
// 		]
// 	} ==> workinh fine



// "condition" : {
// 		"and" : [
// 			{
// 			"or" : [{"email" : { "eq" : "ram@gmail.com"}},{"plan" : { "eq" : "agency"}}]
// 			},
// 			{
// 			"or" : [{"email" : { "eq" : "ram@gmail.com"}},{"plan" : { "eq" : "agency"}}]
// 			}

// 		]
// 	}


// "condition" : {
// 		"and" : [
// 			{"name" : {"eq" : "raj"}},
// 			{
// 			"or" : [
// 				{"or : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]}
// 				{"or : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				]
// 			}


// 		]
// 	}

// "condition" : {
// 		"and" : [

// 			{
// 			"or" : [
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				{"or" : [{"sex" : {"eq" : "male"}},{"id" : {"eq" : "2"}} ]}	
// 				]
// 			},
// 			{"sex" : {"eq" : "male"}}	


// 		]
// 	}


// "condition" : {
// 		"and" : [
// 			{
// 			"or" : [
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				{"or" : [{"sex" : {"eq" : "male"}},{"id" : {"eq" : "2"}} ]}	
// 				]
// 			},
// 			{
// 			"or" : [
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				{"sex" : {"eq" : "male"}}	
// 				]
// 			}


// 		]
// 	}


// "condition" : {
// 		"and" : [
// 			{
// 			"or" : [
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				{"or" : [{"sex" : {"eq" : "male"}},{"id" : {"eq" : "2"}} ]}	
// 				]
// 			},
// 			{
// 			"or" : [
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]},
// 				{"or" : [{"name" : {"eq" : "raj"}},{"age" : {"eq" : "6"}} ]}
// 				]
// 			}


// 		]
// 	}






