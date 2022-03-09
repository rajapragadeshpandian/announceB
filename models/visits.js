const mongoose = require('mongoose');

const visitSchema = mongoose.Schema(

    {
        __change: { type: Schema.Types.ObjectId, ref: 'change' },
        createdAt: Date //ISODate("2020-04-22T10:19:24.653Z"
    }

);

module.exports = mongoose.model('Visits', visitSchema);

// var todaysDate = new Date();

// function convertDate(date) {
//     var yyyy = date.getFullYear().toString();
//     var mm = (date.getMonth() + 1).toString();
//     var dd = date.getDate().toString();

//     var mmChars = mm.split('');
//     var ddChars = dd.split('');

//     return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
// }

// var date = convertDate(todaysDate);


// app.get('/dashboard', (req, res) => {

//     // {__user : req.user._id}
//     var userid  = req.user._id;
//     Changes.find({__user : userid})
//     .sort({"dateSent":-1})
//     .exec((err, item) => {
//         console.log("####", item);
//         if (err) {
//            return res.status(500).json(err);
//          } else if (!item) {
//          return res.status(404).json();     
//      }

//      res.render('dashboard', { changes : item, category : "new category" });
//     })

//   //  res.send("data sent back successfully");

// });

// //visit

// app.get('/visit',(req, res) => {

//              const visits = new Visits({
//                 name : "visit",
//                 createdAt : new Date(date)

//             }).save((err, visit) => {
//                 console.log("####", visit);
//                 if (err) {
//                     console.log("$$$$", "error");
//                          res.status(500).json(err);
//                       } else if (!visit) {
//                           console.log("$$$$", "visit not found");
//                       res.status(404).json();     
//                   }
//                  res.render('visits');
//                    // res.redirect('/count');
//                     //res.render('index', {data : "rajapragadesh", userid : "123456"
//             });


// })

// app.get('/count', (req, res) => {

//     console.log("count called");

//     Visits.find( { visited : {$eq : new Date(date) }})
//     .count()
//     .exec((err, count) => {

//         res.render('visits', { count : count });

//     })


