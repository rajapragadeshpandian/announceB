import React, {useReducer} from 'react';

const initialState = {
    countOne : 0,
    countTwo : 10
}

const reducer = (state, action) => {
    console.log(state);
    switch(action.type) {
        case "inc" :
        return {... state, countOne : state.countOne +1}
        case "dec" :
        return {... state, countOne : state.countOne -1}
        case "reset" :
        return initialState;
        default :
        return state;
    }

}

const HookCounter = () => {
    const [count, dispatch] = useReducer(reducer, initialState);
    return (
        <div>
            <div>{count.countOne}</div>
            <div>{count.countTwo}</div>
            <button onClick={() => dispatch({type : "inc"})}>Increment</button>
            <button onClick={() => dispatch({type : "dec"})}>Decrement</button>
            <button onClick={() => dispatch({type : "reset"})}>Reset</button>
            </div>
    )
}

export default HookCounter;