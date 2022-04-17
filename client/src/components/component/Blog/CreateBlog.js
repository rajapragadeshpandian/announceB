import React, { useState, useEffect } from 'react';
import QuillEditor from '../editor/QuillEditor';
import { Typography, Button, Form, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../state/actions';
import { useNavigate } from 'react-router-dom';


function CreateBlog(props) {

    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const state = useSelector((state) => console.log(state));
    const dispatch = useDispatch();
    const { createBlog } = bindActionCreators(actions, dispatch);

    const onEditorChange = (value) => {
        setContent(value)
        console.log(content)
    }

    const onFilesChange = (files) => {
        setFiles(files);
    }

    // useEffect(() => {
    //     navigate('/blog');
    // }, [])


    const onSubmit = () => {
        console.log("submitted");

        setContent("");
        //console.log(props.history);
        createBlog({ content: "rajapragadesh pandian" });
        navigate('/blog');

    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <QuillEditor
                placeholder={"Start Posting Something"}
                onEditorChange={onEditorChange}
                onFilesChange={onFilesChange}
            />
            <button onClick={onSubmit}>submit</button>
        </div>
    )
}

export default CreateBlog;