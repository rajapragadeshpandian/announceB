const mongoose = require('mongoose');


const blogSchema = mongoose.Schema({
    content: { type: String, default: null }
},
    {
        timestamps: true
    });

const Blog = mongoose.model('Blog', blogSchema);


function createBlog(content) {

    const blog = new Blog({
        content: content
    })
        .save()

    return blog;

}

function getBlogs() {
    const blog = Blog.find()
        .limit(10)
        .exec()

    return blog;
}


module.exports = {
    createBlog: createBlog,
    getBlogs: getBlogs
}