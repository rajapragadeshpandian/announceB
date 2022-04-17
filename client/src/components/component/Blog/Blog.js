import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import * as actions from '../../../state/actions';
import { fetchBlog } from '../../../state/actions';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import '../../css/accordion.css';

function Blog(props) {

    const [value, setValue] = useState({});
    const state = useSelector((state) => state.changeLogs.blog);
    const { blog = [] } = state;
    console.log(blog);
    console.log(fetchBlog);

    const dispatch = useDispatch();
    //const { fetchBlog } = bindActionCreators(actions, dispatch);

    useEffect(() => {
        console.log("api call");
        // bindActionCreators({ fetchBlog }, dispatch);
        dispatch(fetchBlog());
    }, []);
    console.log(value);

    const getPost = (e) => {
        console.log(e.target);
        console.log(e.target.getAttribute('id'));
        console.log("post clicked");
    }

    return (
        <div>
            <p>blog page...</p>
            {
                (blog.length > 0) && (
                    blog.map((item, index) => (
                        <ul className="blogPosts" onClick={(e) => getPost(e)} key={index}>
                            <li id={item._id}>{item.content}</li>
                        </ul>
                    ))
                )
            }

        </div>
    )
}

export default Blog;