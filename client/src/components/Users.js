import React, {useReducer, useEffect} from 'react';


const initialState = {
    loading : true,
    posts : {},
    error : ''
};

const reducer = (state, action) => {

    switch(action.type) {
        case 'FETCH_SUCCESS' :
        return {...state, loading : false, posts : action.data, error : ''}
        case 'FETCH_FAILURE' :
        return {...state, loading : false, posts : {}, error : 'Something gone wrong'}
        default :
        return state;
    }

}
 const Users = () => {
//     const [type, setType] = useState('posts');
//     const [data, setData] = useState([]);

    // const logName = () => {
    //     console.log("rajapragadesh");
    // }
    const [state, dispatch] = useReducer(reducer, initialState);
    console.log(state);
    useEffect(() => {
        console.log("useeffect called");
        fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then((res) => res.json())
        .then(data => {
            console.log(data);
            dispatch({type : 'FETCH_SUCCESS', data : data })
        })
        .catch((error) => {
            dispatch({type : 'FETCH_FAILURE'})
        })
    },[])

    return (
        <div>
            <h2>DataFetching</h2>
        {state.loading ? "Loading" : state.posts.title}
        {state.error ? state.error : ''}
        </div>
    )
}

export default Users;