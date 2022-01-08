import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from '../state/actions';
import {bindActionCreators} from 'redux';

const HookEffect = () => {
    const [type, setType] = useState('posts');
    const [data, setData] = useState([]);
const state = useSelector((state) => state.changeLogs);

const dispatch = useDispatch();

const {fetchChanges} = bindActionCreators(actions, dispatch);

console.log(state);
console.log(fetchChanges);
    // const logName = () => {
    //     console.log("rajapragadesh");
    // }
    
    useEffect(() => {
        fetchChanges()
        // fetch('https://jsonplaceholder.typicode.com/users')
        // .then((res) => res.json())
        // .then(data => setData(data))
        // return ()  => {
        //     console.log("resource changes");
        //}
    },[])

    return (
        <div>
            
        <button onClick={() => setType('posts')}>Posts</button>
        <button onClick={() => setType('users')}>Users</button>
        {(state &&  state.changes) && (
                <div>{state.changes.title}</div>
    )}
        {/* <button onClick={() => fetchChanges()}>FetchUsers</button> */}
        {/* <button onClick={() => fetchChanges()}>Deposit</button> */}
        {/* <p>{type}</p>
        
            {data.map(item => (
                <li key={item.id}>{item.name}</li>
            ))} */}
        
        </div>
    )
}

export default HookEffect;