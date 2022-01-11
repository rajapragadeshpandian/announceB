import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../state/actions';
import { bindActionCreators } from 'redux';

const ChangeLogs = () => {

    const state = useSelector((state) => state.changeLogs);

    const dispatch = useDispatch();

    const { fetchChanges } = bindActionCreators(actions, dispatch);

    console.log(state);
    console.log(fetchChanges);
    // const logName = () => {
    //     console.log("rajapragadesh");
    // }
    const tick = () => {
        console.log("ticking");
    }
    useEffect(() => {
        fetchChanges()
        // setInterval(tick, 5000);
    }, [])



    return (
        <div>
            <h2>ChangeLogs</h2>
            <span><a href="/auth/logout">Logout</a></span>
            {/* {
                (state && state.changes) && (
                    <div>
                        <li>{state.changes.count}</li>
                    </div>

                )
            } */}
            {state && state.changes && state.changes.changeList &&
                state.changes.changeList.map(item => (
                    <div id={item._id} key={item._id}>
                        <div><p>{item.title}</p></div>

                        <div><p>{item._id}</p></div>
                        <div><p>{item.body}</p></div>
                        <div><p>{item.like}</p></div>
                    </div>


                ))}
        </div>

    )
};

export default ChangeLogs;