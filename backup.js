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